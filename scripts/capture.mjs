import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import WebSocket from "ws";

const CHROME_PATH = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACT_DIR = "C:\\Users\\hanso\\.gemini\\antigravity\\brain\\ffd396fc-dab9-4a7f-afe3-b3843e9c4086\\screenshots";

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function capture(prefix = "before") {
  console.log(`Starting Chrome for ${prefix} captures...`);
  const chrome = spawn(
    CHROME_PATH,
    [
      "--headless=new",
      "--remote-debugging-port=9222",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-gpu",
      "--window-size=1920,1080",
    ],
    { stdio: "ignore" }
  );

  await sleep(2500);

  // Get debug target
  const versionRes = await fetch("http://127.0.0.1:9222/json/list");
  const targets = await versionRes.json();
  const pageTarget = targets.find((t) => t.type === "page") || targets[0];
  console.log("Found target:", pageTarget?.webSocketDebuggerUrl);

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let idCounter = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      pending.get(data.id)(data);
      pending.delete(data.id);
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve) => {
      const id = idCounter++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  await new Promise((resolve) => (ws.onopen = resolve));

  await send("Page.enable");
  await send("Runtime.enable");

  // Navigate to localhost:3002
  console.log("Navigating to http://localhost:3002...");
  await send("Page.navigate", { url: "http://localhost:3002" });

  // Wait for page to boot, preload, and dismiss loading screen
  console.log("Waiting for boot sequence & hero ready...");
  await sleep(4000);

  const viewports = [
    { width: 1920, height: 1080, name: "1920" },
    { width: 1366, height: 768, name: "1366" },
    { width: 390, height: 844, name: "390", isMobile: true },
  ];

  for (const vp of viewports) {
    console.log(`Capturing header overlap at ${vp.width}x${vp.height}...`);
    await send("Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: !!vp.isMobile,
    });
    // Scroll to top
    await send("Runtime.evaluate", { expression: `window.scrollTo(0, 0);` });
    await sleep(800);

    const shot = await send("Page.captureScreenshot", { format: "png" });
    const filePath = path.join(ARTIFACT_DIR, `${prefix}_header_${vp.name}px.png`);
    fs.writeFileSync(filePath, Buffer.from(shot.result.data, "base64"));
    console.log(`Saved: ${filePath}`);
  }

  // Also capture scroll gap after hero at 1920
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    mobile: false,
  });

  // Scroll to where hero pin ends and globe section begins
  console.log(`Capturing transition into globe section...`);
  await send("Runtime.evaluate", {
    expression: `window.scrollTo(0, window.innerHeight * 3.1);`,
  });
  await sleep(1200);
  const globeShot = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(
    path.join(ARTIFACT_DIR, `${prefix}_transition_globe_1920px.png`),
    Buffer.from(globeShot.result.data, "base64")
  );

  ws.close();
  chrome.kill();
  console.log("Done capture!");
}

const prefix = process.argv[2] || "before";
capture(prefix).catch((e) => {
  console.error("Capture error:", e);
  process.exit(1);
});

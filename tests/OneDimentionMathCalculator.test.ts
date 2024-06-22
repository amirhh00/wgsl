import { test, expect } from "@playwright/test";

// test("webgpu show be available", async ({ page }) => {
//   // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
//   await page.goto("http://localhost:3000/showcases/heavyMathCalculation");
//   // try to create adaptor with webgpu
//   const adapter = await page.evaluateHandle(() => {
//     return (navigator as any).gpu.requestAdapter();
//   });
//   expect(adapter).toBeDefined();
// });

test("should make a resport for heavyMathCalculation page", async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto("http://localhost:3000/showcases/heavyMathCalculation");
  // get the form element
  const form = await page.waitForSelector("form");
  if (!form) throw new Error("form element not found");
  // get the input element inside the form name attribute is digit
  const input = await form.$("input[name=digit]");
  if (!input) throw new Error("input element not found");
  // get the button element inside the form
  const button = await form.$("button");
  if (!button) throw new Error("button element not found");
  // set the value of the input element
  let i = 1;
  await input.fill(i.toString());
  // click the button
  await button.click();
  // wait for the pre element to be visible with data-length attribute value of i
  await page.waitForSelector(`pre[data-length="${i}"]`);

  // get the button element with name attribute run-js and click it
  const runJsButton = await page.waitForSelector(`button[name="run-js"]`);
  expect(runJsButton).toBeDefined();
  await runJsButton.click();
  // wait for the pre element to be visible with data-type attribute value of js with data-length attribute value of i
  await page.waitForSelector(`pre[data-type="js"][data-length="${i}"]`);

  // get the button element with name attribute run-wasm
  const runWasmButton = await page.waitForSelector(`button[name="run-wasm"]`);
  expect(runWasmButton).toBeDefined();
  // if (!runWasmButton) throw new Error("run-wasm button element not found");
  await runWasmButton.click();
  // wait for the pre element to be visible with data-type attribute value of wasm with data-length attribute value of i
  await page.waitForSelector(`pre[data-type="wasm"][data-length="${i}"]`);

  // get the button element with name attribute run-webgpu
  const runWebgpuButton = await page.waitForSelector(`button[name="run-wgsl"]`);
  expect(runWebgpuButton).toBeDefined();
  // if (!runWebgpuButton) throw new Error("run-webgpu button element not found");
  await runWebgpuButton.click();
  // wait for the pre element to be visible with data-type attribute value of webgpu with data-length attribute value of i
  await page.waitForSelector(`pre[data-type="wgsl"][data-length="${i}"]`);
  // click the runWebgpuButton
  await runWebgpuButton.click();

  // wait 10ms
  await page.waitForTimeout(10);

  // expoect window.durations to be defined
  expect(await page.evaluate(() => window.durations)).toBeDefined();
  console.log("durations: ", await page.evaluate(() => window.durations));
});

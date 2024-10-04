import { test, expect } from '@playwright/test';

test('should make a resport for heavyMathCalculation page', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('http://localhost:3000/showcases/heavyMathCalculation');
  // get the form element
  const form = await page.waitForSelector('form');
  if (!form) throw new Error('form element not found');
  // get the input element inside the form name attribute is digit
  const input = await form.$('input[name=digit]');
  if (!input) throw new Error('input element not found');
  // get the button element inside the form
  const button = await form.$('button');
  if (!button) throw new Error('button element not found');

  const durations: Durations = {
    js: {},
    wasm: {},
    webgpu: {},
  };
  const regexDurationExtractor = /Duration: (\d+(?:\.\d+)?)/;
  const timeout = 60000;

  // set the value of the input element
  for (let i = 1; i <= 50000000; i = i < 65535 ? i * Math.floor(Math.random() * 6) + 5 : i * 2) {
    await input.fill(i.toString());
    // click the button
    await button.click();
    await page.waitForSelector(`pre[data-length="${i}"]`);
    await page.waitForTimeout(300);
    // get the button element with name attribute run-js and click it
    const runJsButton = await page.waitForSelector(`button[name="run-js"]`);
    expect(runJsButton).toBeDefined();
    await runJsButton.click();
    // wait for the pre element to be visible with data-type attribute value of js with data-length attribute value of i
    const preJS = await page.waitForSelector(`pre[data-type="js"][data-length="${i}"]`, { timeout });
    expect(preJS).toBeDefined();
    const durationJs = (await preJS.innerText()).match(regexDurationExtractor)!;
    expect(durationJs).not.toBeNull();
    durations.js[i] = parseFloat(durationJs[1]);

    // get the button element with name attribute run-wasm
    const runWasmButton = await page.waitForSelector(`button[name="run-wasm"]`);
    expect(runWasmButton).toBeDefined();
    await runWasmButton.click();
    // wait for the pre element to be visible with data-type attribute value of wasm with data-length attribute value of i
    const preWasm = await page.waitForSelector(`pre[data-type="wasm"][data-length="${i}"]`, { timeout });
    expect(preWasm).toBeDefined();
    const durationWasm = (await preWasm.innerText()).match(regexDurationExtractor)!;
    expect(durationWasm).not.toBeNull();
    durations.wasm[i] = parseFloat(durationWasm[1]);

    // get the button element with name attribute run-webgpu
    const runWebgpuButton = await page.waitForSelector(`button[name="run-wgsl"]`);
    expect(runWebgpuButton).toBeDefined();
    await runWebgpuButton.click();
    // wait for the pre element to be visible with data-type attribute value of webgpu with data-length attribute value of i
    const preWgsl = await page.waitForSelector(`pre[data-type="wgsl"][data-length="${i}"]`, { timeout });
    expect(preWgsl).toBeDefined();
    const durationWgsl = (await preWgsl.innerText()).match(regexDurationExtractor)!;
    expect(durationWgsl).not.toBeNull();
    durations.webgpu[i] = parseFloat(durationWgsl[1]);

    // wait 10ms
    await page.waitForTimeout(10);

    // const durations = await page.evaluate(() => window.durations);
    // expoect window.durations to be defined
    // expect(durations).toBeDefined();

    const stringifiedDurations = JSON.stringify(durations);
    console.log(stringifiedDurations);
  }
});

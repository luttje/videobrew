import { test, expect } from '@playwright/test'
import { preview } from 'vite'
import type { PreviewServer } from 'vite'
import { chromium } from 'playwright'
import type { Browser, Page } from 'playwright'
import v8toIstanbul from 'v8-to-istanbul'
import * as fs from 'fs'

// normalize array keys like "0" to 0
function normalizeArray(arr: any[]) {
  const result: any[] = []
  for (const key of Object.keys(arr)) {
    result[parseInt(key)] = arr[key]
  }
  return result
}

test.describe('basic', async () => {
  const previewPort = 8087
  
  let server: PreviewServer
  let browser: Browser
  let page: Page

  test.beforeAll(async () => {
    // TODO: Start the video app at http://localhost:8088
    // exec(...)

    process.env.VIDEOBREW_VIDEO_APP_URL = 'http://localhost:8088'
    server = await preview({ preview: { port: previewPort }})
    browser = await chromium.launch()
    page = await browser.newPage()

    // TODO: Check for --coverage
    await page.coverage.startJSCoverage();
  })

  test.afterAll(async () => {
    const coverage = await page.coverage.stopJSCoverage();
    //const debug = fs.readFileSync('coverage/coverage.json', 'utf8'); // debugging
    //const istanbulCoverage = JSON.parse(debug);
    //const trimPath = 'C:\\Projects\\videobrew\\packages\\client\\';
    const prefix = '.svelte-kit/output/client/';
    const trimPath = '';
    let istanbulCoverage: object = {};

    for (const entry of coverage) {
      const path = entry.url.replace('http://localhost:8087/', prefix);

      if(!path || path == prefix || !fs.existsSync(path)) continue;

      const converter = v8toIstanbul(path);
      await converter.load();
      converter.applyCoverage(entry.functions);
      
      const istanbul = converter.toIstanbul();
      istanbulCoverage = { ...istanbulCoverage, ...istanbul};
    }

    if (!fs.existsSync('coverage'))
      fs.mkdirSync('coverage');
    
    fs.writeFileSync(
      'coverage/coverage.json',
      JSON.stringify(istanbulCoverage, null, 2)
    );

    fs.writeFileSync('coverage/lcov.info', '');

    // Convert coverage to lcov and save to LCOV file
    for (const key in istanbulCoverage) {
      const entry = istanbulCoverage[key];
      const file = entry.path.replace(trimPath, '');
      const lines = normalizeArray(entry.statementMap);
      const lineHits = normalizeArray(entry.s);
      const functions = normalizeArray(entry.fnMap);
      const functionHits = normalizeArray(entry.f);
      const branches = normalizeArray(entry.branchMap);
      const branchHits = normalizeArray(entry.b);

      const lcov = [
        `TN:`,
        `SF:${file}`,
        ...functions.map((fn: any) => `FN:${fn.line},${fn.name}`),
        `FNF:${functions.length}`,
        `FNH:${functionHits.filter((hit: any) => hit > 0).length}`,
        ...functions.map((fn: any, index: number) => `FNDA:${functionHits[index]},${fn.name}`),
        ...lines.map((line: any, index: number) => {
          return `DA:${line.start.line},${lineHits[index]}`;
        }),
        `LF:${lines.length}`,
        `LH:${lines.length}`,
        ...branches.map((branch: any, index: number) => {
          return `BRDA:${branch.line},${index},${0},${branchHits[index]}`;
        }),
        `BRF:${branches.length}`,
        `BRH:${branches.length}`,
        `end_of_record`,
      ].filter(Boolean).join('\n');
    
      fs.appendFileSync('coverage/lcov.info', lcov + '\n');
    }

    await browser.close()
    await new Promise<void>((resolve, reject) => {
      server.httpServer.close(error => error ? reject(error) : resolve())

      // Close video app
    })
  })

  test('should run test suite', async () => {
    await page.goto(`http://localhost:${previewPort}`)
    const h1 = await page.waitForSelector('h1')
    expect(await h1.innerText()).toBe('Loading...')
  })
})

import { test, expect } from '@playwright/test'
import { preview } from 'vite'
import type { PreviewServer } from 'vite'
import { chromium } from 'playwright'
import type { Browser, Page } from 'playwright'

test.describe('basic', async () => {
  let server: PreviewServer
  let browser: Browser
  let page: Page

  test.beforeAll(async () => {
    process.env.VIDEOBREW_VIDEO_APP_URL = 'http://localhost:8088'
    server = await preview()
    browser = await chromium.launch()
    page = await browser.newPage()
  })

  test.afterAll(async () => {
    await browser.close()
    await new Promise<void>((resolve, reject) => {
      server.httpServer.close(error => error ? reject(error) : resolve())
    })
  })

  test('should run test suite', async () => {
    await page.goto(`/`)
    const h1 = await page.waitForSelector('h1')
    expect(await h1.innerText()).toBe('Loading...')
  })
})

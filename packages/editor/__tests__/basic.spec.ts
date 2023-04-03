import { afterAll, beforeAll, describe, test } from 'vitest'
import { preview } from 'vite'
import type { PreviewServer } from 'vite'
import { chromium } from 'playwright'
import type { Browser, Page } from 'playwright'
import { expect } from '@playwright/test'

describe('basic', async () => {
  let server: PreviewServer
  let browser: Browser
  let page: Page

  beforeAll(async () => {
    // TODO: Start the video app at http://localhost:8088
    // exec(...)

    process.env.VIDEOBREW_VIDEO_APP_URL = 'http://localhost:8088'
    server = await preview()
    browser = await chromium.launch()
    page = await browser.newPage()
  })

  afterAll(async () => {
    await browser.close()
    await new Promise<void>((resolve, reject) => {
      server.httpServer.close(error => error ? reject(error) : resolve())

      // Close video app
    })
  })

  // test('should change count when button clicked', async () => {
  //   await page.goto('http://localhost:3000')
  //   const button = page.getByRole('button', { name: /Clicked/ })
  //   await expect(button).toBeVisible()

  //   await expect(button).toHaveText('Clicked 0 time(s)')

  //   await button.click()
  //   await expect(button).toHaveText('Clicked 1 time(s)')
  // }, 60_000)
})

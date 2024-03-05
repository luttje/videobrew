/// <reference types="vitest" />

import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globalSetup: '__tests__/globalSetup.ts',
    coverage: {
      reporter: ['text', 'clover'],
    },
  },
})
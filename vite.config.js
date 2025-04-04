import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['./**/*.integration.test.ts', './**/*.test.ts'],
  },
  types: ['vitest/globals'],
})

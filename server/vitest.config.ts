import { defineConfig } from 'vitest/config'

export const vitestConfig = defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./test/setup-env.ts'],
  },
})

export default vitestConfig

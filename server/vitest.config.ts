import { defineConfig } from 'vitest/config'

export const vitestConfig = defineConfig({
  test: {
    environment: 'node'
  }
})

export default vitestConfig

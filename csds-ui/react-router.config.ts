import type { Config } from '@react-router/dev/config'

// this project is using framework mode
export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false, // ssr: false is needed for HMR to work with tailwindcss
} satisfies Config

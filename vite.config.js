import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Permissions-Policy': 'accelerometer=(self "https://api.razorpay.com" "https://checkout.razorpay.com"), gyroscope=(self "https://api.razorpay.com" "https://checkout.razorpay.com")',
    },
  },
  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Permissions-Policy': 'accelerometer=(self "https://api.razorpay.com" "https://checkout.razorpay.com"), gyroscope=(self "https://api.razorpay.com" "https://checkout.razorpay.com")',
    },
  },
})

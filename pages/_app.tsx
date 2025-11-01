// pages/_app.tsx (Poora aur Sahi Code)

import '@/styles/globals.css'
import type { AppProps } from 'next/app' // Yeh line zaroori hai

// Yahaan par `: AppProps` hi asli fix hai
export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

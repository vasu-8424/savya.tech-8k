import type React from "react"
import "@/app/globals.css"
import { Toaster } from "../components/ui/toaster";

export const metadata = {
  title: "AlgoSensei - No-Code Trading Strategy Builder",
  description:
    "Build, backtest, and deploy algorithmic trading strategies with AI-powered simplicity. No coding required.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black dark">
        {children}
        <Toaster />
      </body>
    </html>
  )
}

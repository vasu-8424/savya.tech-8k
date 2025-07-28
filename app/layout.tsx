import type React from "react"
import "@/app/globals.css"
import { Toaster } from "../components/ui/toaster";

export const metadata = {
  title: "Savya Technologies -young minds launching epic digital solutions!",
  description:
    "Converting your ideas into amazing web and mobile applications.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

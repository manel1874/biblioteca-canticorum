import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Biblioteca do Canticorum",
  description: "Navega pela nossa colecção de partituras litúrgicas",
  keywords: "música litúrgica, partituras, missa, canto gregoriano, música sacra",
  authors: [{ name: "Manuel santos" }],
  openGraph: {
    title: "Biblioteca de Música Litúrgica",
    description: "Navega pela nossa colecção de partituras litúrgicas",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

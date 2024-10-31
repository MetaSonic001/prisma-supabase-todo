import { Analytics } from '@/components/Analytics'
import { Navbar } from '@/components/Navbar'
import { Providers } from '@/components/Providers'
import './globals.css'

export const metadata = {
  title: 'TaskMaster - Organize Your Life',
  description: 'A modern todo application to help you stay organized',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
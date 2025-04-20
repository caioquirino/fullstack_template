import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './global.css'
import Header from '@/components/Header'
import { APP_NAME } from '@/constants/app'
import { StytchProvider } from '@/components/auth/StytchProvider'
import { ClientSideGraphqlProvider } from '@/providers/ClientSideGraphqlProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: APP_NAME,
  description: 'Your centralized platform for managing technical terminology',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <StytchProvider>
      <ClientSideGraphqlProvider>
        <html lang="en" suppressHydrationWarning>
          <body className={inter.className}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Header />
              <main>{children}</main>
            </ThemeProvider>
          </body>
        </html>
      </ClientSideGraphqlProvider>
    </StytchProvider>
  )
}

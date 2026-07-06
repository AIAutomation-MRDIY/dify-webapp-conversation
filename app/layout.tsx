import type { Metadata } from 'next'
import { getLocaleOnServer } from '@/i18n/server'

import './styles/globals.css'
import './styles/markdown.scss'

export const metadata: Metadata = {
  icons: {
    // MR.DIY hammer badge
    icon: '/mrdiy-hammer.png',
  },
}

const LocaleLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = await getLocaleOnServer()
  return (
    <html lang={locale ?? 'en'} className="h-full" suppressHydrationWarning>
      <body className="h-full dark:bg-zinc-900">
        {/* apply the saved theme before first paint to avoid a light flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('pandai-theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`,
          }}
        />
        {/* below the minimum window size the app stops shrinking and scrolls instead */}
        <div className="h-full overflow-auto">
          <div className="h-full w-full min-w-[320px] min-h-[480px]">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}

export default LocaleLayout

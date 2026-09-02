/* eslint-disable */
import { Public_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import { headers } from 'next/headers';
import { ThemeProvider } from '@/components/app/theme-provider';
import { cn } from '@/lib/shadcn/utils';
import { getAppConfig, getStyles } from '@/lib/utils';
import '@/styles/globals.css';

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
});

const commitMono = localFont({
  display: 'swap',
  variable: '--font-commit-mono',
  src: [
    {
      path: '../fonts/CommitMono-400-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/CommitMono-700-Regular.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/CommitMono-400-Italic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../fonts/CommitMono-700-Italic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const hdrs = await headers();
  const appConfig = await getAppConfig(hdrs);
  const styles = getStyles(appConfig);
  const { pageTitle, pageDescription, companyName, logo, logoDark } = appConfig;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        'light',
        publicSans.variable,
        commitMono.variable,
        'scroll-smooth font-sans antialiased'
      )}
    >
      <head>
        {styles && <style>{styles}</style>}
        <title>Quarkgen Valmiki</title>
        <meta name="description" content={pageDescription} />
      </head>
      <body className="overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <header className="fixed top-0 left-0 z-40 w-full flex items-center justify-between px-4 sm:px-8 py-3 bg-background/80 backdrop-blur-md border-b border-border/40 transition-colors">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <a
                href="/"
                className="flex items-center gap-2 transition-transform duration-200 hover:scale-[1.02]"
              >
                <img
                  src="/quarkLogo.png"
                  alt="Quarkgen Logo"
                  className="h-6 sm:h-7 w-auto object-contain"
                />
              </a>
              <div className="h-4 w-px bg-border/60" />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-amber-700 border border-amber-500/20">
                <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                Valmiki AI
              </span>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <span className="font-medium text-foreground text-[11px]">Vedic Voice Active</span>
              </div>
            </div>
          </header>

          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

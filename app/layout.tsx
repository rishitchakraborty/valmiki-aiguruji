/* eslint-disable */
import { Public_Sans } from 'next/font/google';
import localFont from 'next/font/local';
import { headers } from 'next/headers';
import { ThemeProvider } from '@/components/app/theme-provider';
import { ThemeToggle } from '@/components/app/theme-toggle';
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
        publicSans.variable,
        commitMono.variable,
        'scroll-smooth font-sans antialiased'
      )}
    >
      <head>
        {styles && <style>{styles}</style>}
        <title>Quarkgen Real Estate</title>
        <meta name="description" content={pageDescription} />
      </head>
      <body className="overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="fixed top-0 left-0 z-50 hidden w-full flex-row justify-between p-6 md:flex">
            <a
              target="_blank"
              rel="noopener noreferrer"
              // href="https://livekit.io"
              className="scale-100 transition-transform duration-300 hover:scale-110"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* <img src={logo} alt={`${companyName} Logo`} className="block size-6 dark:hidden" /> */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* <img
                src={logoDark ?? logo}
                alt={`${companyName} Logo`}
                className="hidden size-6 dark:block"
              /> */}
              <img
                style={{ height: '2em', width: '6em', filter: "drop-shadow(0 0 2px white)" }}
                src="/quarkLogo.png"
                // src="data:image/png;base64,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"
                alt="Quarkgen Logo"
                className="block size-6"
              />
            </a>
            <span className="text-foreground font-mono text-xs font-bold tracking-wider uppercase">
              Built with{' '}
              {/* <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.livekit.io/agents"
                className="underline underline-offset-4"
              > */}
              Quarkgen
              {/* </a> */}
            </span>
          </header>

          {children}
          <div className="group fixed bottom-0 left-1/2 z-50 mb-2 -translate-x-1/2">
            <ThemeToggle className="translate-y-20 transition-transform delay-150 duration-300 group-hover:translate-y-0" />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

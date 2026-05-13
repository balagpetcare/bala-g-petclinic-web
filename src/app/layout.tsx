import type { Metadata, Viewport } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { defaultMetadata, viewport as viewportConfig } from '@/config/seo';
import { buildRootJsonLdGraph } from '@/lib/seo/schemas';
import { JsonLdScript } from '@/lib/seo/json-ld';
import { AppProviders } from '@/providers';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = viewportConfig;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${inter.variable} ${poppins.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('bala-g-theme');
                  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const isDark = theme === 'dark' || (theme === 'system' && systemDark) || (!theme && systemDark);
                  document.documentElement.classList.add(isDark ? 'dark' : 'light');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <JsonLdScript data={buildRootJsonLdGraph()} />
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}

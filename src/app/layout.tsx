import type { Metadata } from 'next';
import { Baloo_2, Nunito, Heebo, Varela_Round } from 'next/font/google';
import './globals.css';

// English fonts
// Fun layer - Logo, level titles, game modes, achievements, scores
const baloo2 = Baloo_2({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display-en',
  display: 'swap',
});

// Core UI + Reading - Body text, instructions, buttons, menus
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body-en',
  display: 'swap',
});

// Hebrew fonts
// Fun layer - Logo, level titles, game modes, achievements
const varelaRound = Varela_Round({
  subsets: ['hebrew', 'latin'],
  weight: '400',
  variable: '--font-display-he',
  display: 'swap',
});

// Core UI + Reading - Body text, instructions, buttons, menus
const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500'],
  variable: '--font-body-he',
  display: 'swap',
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://keyquest.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'KeyQuest - Learn Touch Typing the Fun Way',
    template: '%s | KeyQuest',
  },
  description: 'KeyQuest is a fun, game-driven way to learn touch typing from the ground up. Master typing through engaging lessons and games designed for all ages.',
  keywords: [
    'typing',
    'touch typing',
    'learn typing',
    'keyboard',
    'typing practice',
    'typing games',
    'keyquest',
    'typing tutor',
    'keyboard training',
    'WPM',
    'typing speed',
    'typing accuracy',
  ],
  authors: [{ name: 'KeyQuest Team' }],
  creator: 'KeyQuest',
  publisher: 'KeyQuest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/images/logo-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/logo-64.png', sizes: '64x64', type: 'image/png' },
    ],
    apple: [
      { url: '/images/logo-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'he_IL',
    url: BASE_URL,
    siteName: 'KeyQuest',
    title: 'KeyQuest - Learn Touch Typing the Fun Way',
    description: 'A fun, game-driven way to learn touch typing from the ground up. Master the keyboard through engaging lessons and games.',
    images: [
      {
        url: '/images/full-logo.png',
        width: 1200,
        height: 630,
        alt: 'KeyQuest - Touch Typing Learning Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KeyQuest - Learn Touch Typing the Fun Way',
    description: 'A fun, game-driven way to learn touch typing. Master the keyboard through engaging lessons and games.',
    images: ['/images/full-logo.png'],
  },
  verification: {
    // Add verification codes when available
    // google: 'google-verification-code',
    // yandex: 'yandex-verification-code',
  },
  category: 'education',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${baloo2.variable} ${nunito.variable} ${varelaRound.variable} ${heebo.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-50 font-body antialiased dark:bg-zinc-950">
        {children}
      </body>
    </html>
  );
}

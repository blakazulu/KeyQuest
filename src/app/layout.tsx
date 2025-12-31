import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'KeyQuest - Learn Touch Typing the Fun Way',
  description: 'KeyQuest is a fun, game-driven way to learn touch typing from the ground up. Master typing through engaging lessons and games.',
  keywords: ['typing', 'touch typing', 'learn typing', 'keyboard', 'typing practice', 'typing games', 'keyquest'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-50 font-sans antialiased dark:bg-zinc-950">
        {children}
      </body>
    </html>
  );
}

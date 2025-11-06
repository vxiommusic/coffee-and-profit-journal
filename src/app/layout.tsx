import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/app-shell';
import { Toaster } from '@/components/ui/toaster';
import { TradesProvider } from '@/context/trades-context';
import { NotesProvider } from '@/context/notes-context';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'Coffee and Profit',
  description: 'Футуристический торговый журнал для анализа и улучшения ваших результатов.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <TradesProvider>
            <NotesProvider>
              <AppShell>{children}</AppShell>
            </NotesProvider>
          </TradesProvider>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}

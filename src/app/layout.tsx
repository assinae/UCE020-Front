import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import ThemeRegistry from '@/providers/theme-provider';
import { AuthProvider } from '@/providers/auth-provider';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Assinaê - UEFS',
  description: 'Frontend organizado com Next.js, Tailwind e Material UI',
  icons: {
    icon: '/images/logos/logo1.png',
    apple: '/images/logos/logo1.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full" suppressHydrationWarning>
        <ThemeRegistry><AuthProvider>{children}</AuthProvider></ThemeRegistry>
      </body>
    </html>
  );
}

import { Inter } from 'next/font/google';
import { Metadata } from 'next';

import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: 'SaaS Account Management System',
    template: '%s | SaaS Account Management System',
  },
  description: 'Enterprise SaaS account provisioning and management platform',
  keywords: [
    'SaaS',
    'Account Management',
    'Enterprise',
    'OAuth2',
    'Provisioning',
    'Google Workspace',
    'Microsoft 365',
    'Slack',
  ],
  authors: [
    {
      name: 'Taiga Sorimachi',
      url: 'https://github.com/TaigaSorimachi',
    },
  ],
  creator: 'Taiga Sorimachi',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://progrit-saas.com',
    title: 'SaaS Account Management System',
    description: 'Enterprise SaaS account provisioning and management platform',
    siteName: 'SaaS Account Management System',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaaS Account Management System',
    description: 'Enterprise SaaS account provisioning and management platform',
    creator: '@TaigaSorimachi',
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}

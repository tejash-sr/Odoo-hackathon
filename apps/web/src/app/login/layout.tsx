import type { Metadata } from 'next';
import { Navigation } from '@/components/layout/Navigation';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your GlobeTrotter account',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}

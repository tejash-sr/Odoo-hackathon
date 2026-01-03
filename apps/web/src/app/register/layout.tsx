import type { Metadata } from 'next';
import { Navigation } from '@/components/layout/Navigation';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your GlobeTrotter account',
};

export default function RegisterLayout({
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

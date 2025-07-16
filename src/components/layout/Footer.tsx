'use client';

import { useProfile } from '@/hooks/useProfile';

export default function Footer() {
  const { profile, loading } = useProfile();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[var(--color-surface)] py-8 border-t border-[var(--color-border)] mt-auto">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row justify-between items-center gap-y-4">
          <div>
            <p className="text-accent dark:text-accent-dark font-medium">
              © {currentYear} {loading ? 'Portfolio' : profile?.basics.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

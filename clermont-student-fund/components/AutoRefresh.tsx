'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  intervalMs?: number; // default: 5 minutes
}

export default function AutoRefresh({ intervalMs = 90_000 }: Props) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(Math.floor(intervalMs / 1000));

  useEffect(() => {
    // Countdown timer
    const counterId = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) return Math.floor(intervalMs / 1000);
        return c - 1;
      });
    }, 1000);

    // Actual refresh
    const refreshId = setInterval(() => {
      router.refresh();
    }, intervalMs);

    return () => {
      clearInterval(counterId);
      clearInterval(refreshId);
    };
  }, [router, intervalMs]);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const label =
    minutes > 0
      ? `Actualisation dans ${minutes}m ${seconds.toString().padStart(2, '0')}s`
      : `Actualisation dans ${seconds}s`;

  return (
    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#8496B2' }}>
      <span className="live-dot" />
      {label}
    </div>
  );
}

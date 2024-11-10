'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isUserLoggedIn } from '@/utils/auth';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const loggedIn = isUserLoggedIn();

    if (loggedIn) {
      router.push('/dashboard');
    } else {
      router.push('/signup');
    }
  }, [router]);

  return null;
};

export default HomePage;

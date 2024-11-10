'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isUserLoggedIn } from '@/utils/auth';

const AuthGuard = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = isUserLoggedIn();

    if (!loggedIn) {
      router.push('/unauthorized');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return children;
};

export default AuthGuard;

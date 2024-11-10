'use client';

import { useRouter } from 'next/navigation';

const Unauthorized = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">401 - Unauthorized</h1>
        <p className="mt-4 text-gray-700">You do not have access to this page.</p>
        <button
          onClick={() => router.push('/signup')}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go to Signup
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;

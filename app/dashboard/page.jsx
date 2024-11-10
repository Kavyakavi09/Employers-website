'use client';
import { useState } from 'react';
import AddOpeningForm from '@/components/AddOpeningForm';
import AuthGuard from '@/components/AuthGuard';
import JobOpenings from '@/components/JobOpenings';
import { JobOpeningsProvider } from '@/context/JobContext';
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const router = useRouter()

  const handleAddOpeningClick = () => {
    setShowDrawer(true);
  };
  const signOut = () => {
    localStorage.removeItem("token");
    router.push("/signin")
  };

  const handleCloseDrawer = () => {
    setShowDrawer(false);
  };

  return (
    <JobOpeningsProvider>
    <AuthGuard>
      <div className="relative min-h-screen p-4">
      <button
        onClick={handleAddOpeningClick}
        className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
      >
        Add Opening
      </button>
      <button
        onClick={signOut}
        className="absolute top-4 right-40 bg-gray-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
      >
        Sign Out
      </button>

      {showDrawer && (
        <div className="fixed right-0 top-0 w-1/3 h-full bg-white shadow-lg p-4 overflow-y-auto">
          <AddOpeningForm onClose={handleCloseDrawer} onAddAnother={true} />
        </div>
      )}
      <JobOpenings />
    </div>
    </AuthGuard>
    </JobOpeningsProvider>
  );
};

export default Dashboard;

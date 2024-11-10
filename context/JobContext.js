import React, { createContext, useState, useContext } from 'react';

// Create Context
const JobOpeningsContext = createContext();

// Custom Hook to use JobOpeningsContext
export const useJobOpenings = () => {
  return useContext(JobOpeningsContext);
};

// Provider Component
export const JobOpeningsProvider = ({ children }) => {
  const [jobOpenings, setJobOpenings] = useState([]);

  return (
    <JobOpeningsContext.Provider value={{ jobOpenings,setJobOpenings }}>
      {children}
    </JobOpeningsContext.Provider>
  );
};

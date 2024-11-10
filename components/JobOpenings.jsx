// pages/job-openings.js

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useJobOpenings } from '@/context/JobContext';

const JobOpeningsDashboard = () => {
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    department: '',
    specialization: '',
    location: '',
    experienceLevel: '',
    isRemote: '',
    jobTitle: '',
  });
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const router = useRouter();
  const {setJobOpenings,jobOpenings} = useJobOpenings();

  // Fetch job openings with filters and pagination
  const fetchJobOpenings = async () => {
    const searchParams = new URLSearchParams(filters);
    searchParams.append('page', page);
    searchParams.append('perPage', perPage);

    const response = await fetch(`/api/job-openings?${searchParams.toString()}`);
    const data = await response.json();
    setJobOpenings(data.jobPostings);
    setTotalCount(data.totalCount); // Total count for pagination
  };

  useEffect(() => {
    fetchJobOpenings();
  }, [page, filters]); // Fetch when page or filters change

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleEdit = (id) => {
    router.push(`/edit-job-openings/${id}`);
  };

  const handleDelete = async (id) => {
    const response = await fetch(`/api/job-openings/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      fetchJobOpenings(); // Re-fetch after deletion
    }
  };

  const handleViewApplications = (id) => {
    router.push(`/view-job-openings/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-6">Job Openings Dashboard</h1>

      {/* Filters and Search */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          name="jobTitle"
          placeholder="Search by Job Title"
          value={filters.jobTitle}
          onChange={handleChange}
          className="p-3 border rounded-md w-72"
        />
        <select name="department" value={filters.department} onChange={handleChange} className="p-3 border rounded-md w-72">
          <option value="">Department</option>
          <option value="Engineering">Engineering</option>
          <option value="Human Resources">Human Resources</option>
          <option value="Marketing">Marketing</option>
        </select>
        <select name="specialization" value={filters.specialization} onChange={handleChange} className="p-3 border rounded-md w-72">
          <option value="">Specialization</option>
          {/* Add your specialization options */}
        </select>
        <select name="location" value={filters.location} onChange={handleChange} className="p-3 border rounded-md w-72">
          <option value="">Location</option>
          <option value="Chennai">Chennai</option>
          <option value="Coimbatore">Coimbatore</option>
        </select>
        <select name="experienceLevel" value={filters.experienceLevel} onChange={handleChange} className="p-3 border rounded-md w-72">
          <option value="">Experience Level</option>
          <option value="fresher">Fresher</option>
          <option value="< 1 year">&lt; 1 year</option>
          <option value="< 2 years">&lt; 2 years</option>
          {/* Add more experience levels */}
        </select>
        <div className="flex items-center space-x-4">
          <span className="text-lg">Remote</span>
          <label className="flex items-center">
            <input
              type="radio"
              name="isRemote"
              value="true"
              checked={filters.isRemote === 'true'}
              onChange={handleChange}
              className="mr-2"
            />
            Yes
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="isRemote"
              value="false"
              checked={filters.isRemote === 'false'}
              onChange={handleChange}
              className="mr-2"
            />
            No
          </label>
        </div>
      </div>

      {/* Job Openings Table */}
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left font-semibold">Job Title</th>
            <th className="py-3 px-4 text-left font-semibold">Department</th>
            <th className="py-3 px-4 text-left font-semibold">Location</th>
            <th className="py-3 px-4 text-left font-semibold">Experience Level</th>
            <th className="py-3 px-4 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobOpenings?.map((opening) => (
            <tr key={opening._id} className="border-t">
              <td className="py-3 px-4">{opening.jobTitle}</td>
              <td className="py-3 px-4">{opening.department}</td>
              <td className="py-3 px-4">{opening.location}</td>
              <td className="py-3 px-4">{opening.experienceLevel}</td>
              <td className="py-3 px-4 space-x-4">
                <button
                  onClick={() => handleEdit(opening._id)}
                  className="text-blue-500 hover:text-blue-700 font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(opening._id)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleViewApplications(opening._id)}
                  className="text-green-500 hover:text-green-700 font-semibold"
                >
                  View Applications
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-lg px-5">
          Page {page} of {Math.ceil(totalCount / perPage)}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page * perPage >= totalCount}
          className="px-7 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default JobOpeningsDashboard;

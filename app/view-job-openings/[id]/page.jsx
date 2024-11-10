"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const ViewJobOpening = () => {
  const [jobData, setJobData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchJobData = async () => {
        try {
          const response = await fetch(`/api/job-openings/${id}`);
          if (response.ok) {
            const data = await response.json();
            setJobData(data);
          } else {
            setErrorMessage("Failed to load job data.");
          }
        } catch (error) {
          setErrorMessage("An error occurred while fetching job data.");
        }
      };
      fetchJobData();
    }
  }, [id]);

  if (!jobData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen mb-8">
      <div className="w-full max-w-3xl p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold mb-5 text-center">View Job Opening</h1>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Job Title:</label>
            <p className="text-gray-900">{jobData.jobTitle}</p>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Department:</label>
            <p className="text-gray-900">{jobData.department}</p>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Specialization:</label>
            <p className="text-gray-900">{jobData.specialization}</p>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Location:</label>
            <p className="text-gray-900">{jobData.location}</p>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Is Remote:</label>
            <p className="text-gray-900">{jobData.isRemote ? "Yes" : "No"}</p>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Experience Level:</label>
            <p className="text-gray-900">{jobData.experienceLevel}</p>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Keywords:</label>
            <p className="text-gray-900">{jobData.keywords.join(", ")}</p>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Skills:</label>
            <p className="text-gray-900">{jobData.skills.join(", ")}</p>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Job Description:</label>
            <p className="text-gray-900 break-words overflow-hidden">{jobData.jobDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewJobOpening;

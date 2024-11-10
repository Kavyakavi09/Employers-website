"use client";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams,useRouter } from "next/navigation";

const departmentSpecializations = {
  Engineering: ["Development", "Quality Assurance", "Business Analysis"],
  "Human Resources": ["Recruitment", "Employee relations"],
  Marketing: ["Digital Marketing", "SEO"],
  "Accounting & Finance": ["Finance","Accounting"],
};

const EditJObOpenings = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const employer = JSON.parse(localStorage.getItem('employer'));
  const {id} = useParams();
  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      jobTitle: "",
      department: "",
      specialization: "",
      location: "",
      isRemote: "",
      experienceLevel: "",
      keywords: "",
      skills: "",
      jobDescription: "",
    },
    validationSchema: Yup.object({
      jobTitle: Yup.string()
        .min(6)
        .max(40)
        .matches(/^[\w.,'/& ]+$/, "Invalid characters")
        .required("Job title is required"),
      department: Yup.string()
        .oneOf(Object.keys(departmentSpecializations))
        .required("Department is required"),
      specialization: Yup.string().required("Specialization is required"),
      location: Yup.string()
        .oneOf(["Chennai", "Coimbatore", "Erode"])
        .required("Location is required"),
      isRemote: Yup.boolean(),
      experienceLevel: Yup.string()
        .oneOf([
          "fresher",
          "< 1 year",
          "< 2 years",
          "< 3 years",
          "< 4 years",
          "< 5 years",
          "> 5 years",
        ])
        .required("Experience is required"),
      jobDescription: Yup.string()
        .min(50)
        .max(2000)
        .required("Job description is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch(`/api/job-openings/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...values,
            keywords: values.keywords.split(","),
            skills: values.skills.split(","),
            employerId: employer._id,
          }),
        });

        const data = await response.json();
        if (response.ok) {
            router.push("/dashboard");
        } else {
          setErrorMessage(data.message);
        }
      } catch (error) {
        setErrorMessage("Failed to save job opening");
      }
    },
  });

  useEffect(() => {
    if (id) {
      const fetchJobData = async () => {
        try {
          const response = await fetch(`/api/job-openings/${id}`);
          if (response.ok) {
            const jobData = await response.json();
            formik.setValues({
              ...jobData,
              keywords: jobData.keywords.join(","),
              skills: jobData.skills.join(","),
            });
          } else {
            setErrorMessage("Failed to load job data.");
          }
        } catch (error) {
          setErrorMessage("An error occurred while fetching job data.");
        } finally {
          setLoading(false);
        }
      };
      fetchJobData();
    } else {
      setLoading(false);
    }
  }, [id]);

  // Update specialization options based on the department selected
  useEffect(() => {
    const department = formik.values.department;
    setSpecializations(department ? departmentSpecializations[department] : []);
    if (!specializations.includes(formik.values.specialization)) {
      formik.setFieldValue("specialization", "");
    }
  }, [formik.values.department]);

  return (
   <>
   <h1 className="text-2xl font-semibold m-5 text-center">Edit Openings</h1>
   <div className="flex justify-center items-center min-h-scree mb-8">
      <div className="w-full max-w-3xl p-6 bg-white shadow-md rounded-lg">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          <div>
            <label className="block text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              {...formik.getFieldProps("jobTitle")}
              className={`w-full px-3 py-2 border rounded ${
                formik.touched.jobTitle && formik.errors.jobTitle
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.jobTitle && formik.errors.jobTitle && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.jobTitle}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Department</label>
            <select
              {...formik.getFieldProps("department")}
              className={`w-full px-3 py-2 border rounded ${
                formik.touched.department && formik.errors.department
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="" label="Select department" />
              {Object.keys(departmentSpecializations).map(dept => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {formik.touched.department && formik.errors.department && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.department}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Specialization</label>
            <select
              {...formik.getFieldProps("specialization")}
              className={`w-full px-3 py-2 border rounded ${
                formik.touched.specialization && formik.errors.specialization
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              disabled={!formik.values.department}
            >
              <option value="" label="Select specialization" />
              {specializations.map(spec => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            {formik.touched.specialization && formik.errors.specialization && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.specialization}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Location</label>
            <select
              {...formik.getFieldProps("location")}
              className={`w-full px-3 py-2 border rounded ${
                formik.touched.location && formik.errors.location
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="" label="Select location" />
              <option value="Chennai" label="Chennai" />
              <option value="Coimbatore" label="Coimbatore" />
              <option value="Erode" label="Erode" />
            </select>
            {formik.touched.location && formik.errors.location && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.location}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Is Remote</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isRemote"
                  value="true"
                  checked={formik.values.isRemote === true}
                  onChange={() => formik.setFieldValue("isRemote", true)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isRemote"
                  value="false"
                  checked={formik.values.isRemote === false}
                  onChange={() => formik.setFieldValue("isRemote", false)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Experience Level</label>
            <select
              {...formik.getFieldProps("experienceLevel")}
              className={`w-full px-3 py-2 border rounded ${
                formik.touched.experienceLevel && formik.errors.experienceLevel
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="" label="Select experience level" />
              <option value="fresher" label="Fresher" />
              <option value="< 1 year" label="< 1 year" />
              <option value="< 2 years" label="< 2 years" />
              <option value="< 3 years" label="< 3 years" />
              <option value="< 4 years" label="< 4 years" />
              <option value="< 5 years" label="< 5 years" />
              <option value="> 5 years" label="> 5 years" />
            </select>
            {formik.touched.experienceLevel &&
              formik.errors.experienceLevel && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.experienceLevel}
                </p>
              )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              {...formik.getFieldProps("keywords")}
              className="w-full px-3 py-2 border rounded border-gray-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Skills</label>
            <input
              type="text"
              {...formik.getFieldProps("skills")}
              className="w-full px-3 py-2 border rounded border-gray-300"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Job Description</label>
            <textarea
              {...formik.getFieldProps("jobDescription")}
              className={`w-full px-3 py-2 border rounded ${
                formik.touched.jobDescription && formik.errors.jobDescription
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              rows="4"
            ></textarea>
            {formik.touched.jobDescription && formik.errors.jobDescription && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.jobDescription}
              </p>
            )}
          </div>

          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-8 py-2 rounded hover:bg-blue-600"
              onClick={e => {
                e.preventDefault();
                formik.handleSubmit();
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
   </> 
   
  );
};

export default EditJObOpenings;
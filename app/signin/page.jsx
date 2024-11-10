'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const SigninForm = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const validationSchema = Yup.object({
    businessEmail: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .max(20, 'Password cannot exceed 20 characters')
      .required('Password is required'),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('employer', JSON.stringify(data.employer));
        router.push('/dashboard');
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage('Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded shadow">
      <h1 className="text-2xl mb-5">Employer Sign In</h1>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <Formik
        initialValues={{
          businessEmail: '',
          password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="mb-4">
            <label htmlFor="businessEmail" className="block">Business Email</label>
            <Field
              type="email"
              id="businessEmail"
              name="businessEmail"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage name="businessEmail" component="div" className="text-red-500 text-sm" />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block">Password</label>
            <Field
              type="password"
              id="password"
              name="password"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Sign In
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default SigninForm;

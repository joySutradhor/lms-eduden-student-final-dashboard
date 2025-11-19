'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import "../root.css"

export default function Login () {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset
  } = useForm()

  const [serverError, setServerError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter();

  const onSubmit = async data => {


    setServerError('');
    setSuccessMessage('');

    try {


      const response = await axios.post(
        'https://lmsapi.eduden.io/api/login/',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );


      router.push("/dashboard")
      console.log("Login success:", response.data); 

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.id);
        setSuccessMessage('Login successful!');
      } else {
        setServerError('Invalid response from server.');
      }
    } catch (error) {
      console.error("Error from API:", error); 

      if (error.response && error.response.data && error.response.data.non_field_errors) {
        setServerError(error.response.data.non_field_errors.join(' '));
      } else if (error.message) {
        setServerError(error.message);
      } else {
        setServerError('Something went wrong. Please try again later.');
      }
    }

  }

  return (
    <div className='  border border-black/20 outline-none h-[100vh] flex justify-center items-center  rounded shadow'>
      <div className='border border-black/20 md:p-10 p-5 w-[80vw] lg:w-[30vw] '>
        <h2 className='text-2xl font-bold mb-4'> Student Login</h2>

        {serverError && <p className='text-red-500 mb-4'>{serverError}</p>}
        {successMessage && (
          <p className='text-green-500 mb-4'>{successMessage}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate >
          {/* username Field */}
          <div className='mb-4 '>
            <label className='block mb-1 font-medium'>User Name</label>
            <input
              type='username'
              className='w-full px-3 py-2  border border-black/20 outline-none rounded'
              {...register('username', {
                required: 'User Name is required',

              })}
            />
            {errors.username && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className='mb-4'>
            <label className='block mb-1 font-medium'>Password</label>
            <input
              type='text'
              className='w-full px-3 py-2  border border-black/20 outline-none rounded'
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
            {errors.password && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='px-10 bg-[#111] text-white py-2 rounded  transition cursor-pointer'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

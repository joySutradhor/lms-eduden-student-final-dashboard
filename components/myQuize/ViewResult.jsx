'use client'

import { useParams, usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useToken } from '../hooks/GetToken'
import axios from 'axios'
import Topbar from '../topbar/page'

export default function ViewResult () {
  const [token] = useToken()
  const [data, setData] = useState([])
  const pathname = usePathname()
  const params = useParams()
  const {id} = params;
  console.log(id)

  const formattedPath = pathname
    .replace(/^\/|\/$/g, '')
    .split('/')
    .map(segment =>
      segment.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
    )
    .join(' / ')

  useEffect(() => {
    if (!token) return

    // https://lmsapi.eduden.io/api/quiz-answers/?quiz={quiz_id}

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://lmsapi.eduden.io/api/quiz-answers/?quiz=${id}`,
          {
            headers: {
              Authorization: `Token ${token}`
            }
          }
        )
        setData(response?.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [token])

  console.log(data , "for single quiz" )

  return (
    <div className='edn__left__right__space'>
      <Topbar title={formattedPath} />
      <div >
        <h1 className='text-2xl  text-black/70 font-bold mb-8  py-3 px-5 bg-white rounded'>Quiz Results</h1>
        {data.length === 0 ? (
          <p className='text-center text-gray-500'>No results found.</p>
        ) : (
          <div className=''>
            {data.map((result, index) => (
              <div
                key={index}
                className='bg-gray-50 rounded  p-6 '
              >
                <div className='flex items-center justify-between mb-2'>
                  <h2 className='text-lg font-semibold'>{result.quiz_name}</h2>
                  <span className='  text-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700'>
                    Score: {result.score}
                  </span>
                </div>

                <p className='text-sm text-gray-600 mb-1'>
                  <strong>Batch:</strong> {result.student_batch_id}
                </p>
                <p className='text-sm text-gray-600 mb-4'>
                  <strong>Date:</strong> {result.created_at}
                </p>

                <div>
                  <h3 className='font-semibold mb-2'>Answers:</h3>
                  <ul className='space-y-3  pr-2'>
                    {result.answer &&
                      Object.entries(result.answer).map(
                        ([key, answer], idx) => (
                          <li
                            key={idx}
                            className='bg-gray-50 p-3 rounded-lg border border-gray-200'
                          >
                            <p className='text-sm font-medium'>
                              Q{idx+1}: {answer.question}
                            </p>
                            <p className='text-sm text-gray-700'>
                              Selected: {answer.selected_text}
                            </p>
                            <p
                              className={`text-sm font-semibold mt-1 ${
                                answer.is_correct
                                  ? 'text-green-600'
                                  : 'text-red-500'
                              }`}
                            >
                              {answer.is_correct ? '✔ Correct' : '✘ Incorrect'}
                            </p>
                          </li>
                        )
                      )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

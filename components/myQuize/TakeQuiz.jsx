'use client'
import { useParams, usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useToken } from '../hooks/GetToken'
import axios from 'axios'
import Topbar from '../topbar/page'
import Swal from 'sweetalert2'

export default function TakeQuiz () {
  const pathname = usePathname()
  const [token] = useToken()
  const [data, setData] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitStatus, setSubmitStatus] = useState('')
  const params = useParams()
  const id = params?.id

  const formattedPath = pathname
    .replace(/^\/|\/$/g, '')
    .split('/')
    .map(segment =>
      segment.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
    )
    .join(' / ')

  useEffect(() => {
    if (!token) return
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://lmsapi.eduden.io/api/quiz-list/${id}/`,
          {
            headers: {
              Authorization: `Token ${token}`
            }
          }
        )
        setData(response?.data || null)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [token])

  console.log(data , "check student it")

  const handleOptionChange = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    const totalQuestions = data?.questions?.length || 0
    const answeredQuestions = Object.keys(answers).length

    if (answeredQuestions < totalQuestions) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Quiz',
        text: `You have answered ${answeredQuestions} out of ${totalQuestions} questions.`,
        confirmButtonText: 'Okay'
      })
      return
    }

    const payload = {
      quiz: data?.id,
      answer: answers
    }
    
    console.log(payload , "payload data")

    try {
      await axios.post(
        'https://lmsapi.eduden.io/api/submit-quiz/',
        payload,
        {
          headers: {
            Authorization: `Token ${token}`
          }
        }
      )
      Swal.fire({
        icon: 'success',
        title: 'Quiz Submitted!',
        text: '✅ Your answers were submitted successfully!'
      })
      setSubmitStatus('')
    } catch (err) {
      console.error(err)
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: ' Something went wrong. Please try again.'
      })
    }
  }

  const totalQuestions = data?.questions?.length || 0
  const answeredCount = Object.keys(answers).length
  const progressPercent =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0

  // console.log('Progress:', progressPercent)
  // console.log('Answered:', answeredCount, '/', totalQuestions)
  // console.log('Answers object:', answers)

  return (
    <section className='edn__sideToLeftSpace'>
      <div className='edn__left__right__space'>
        <Topbar title={formattedPath} />

        {/* Progress Bar */}
        <div className='w-full bg-gray-200 rounded-full h-2.5 mb-5'>
          <div
            className='bg-[#FBBD08] h-2.5 rounded-full transition-all duration-300'
            style={{ width: `${Math.min(Math.round(progressPercent), 100)}%` }}
          ></div>
        </div>

        <div className='bg-white rounded-xl p-6 shadow'>
          <h3 className='text-2xl font-bold text-gray-800 mb-4'>
            {data?.quiz_name}
          </h3>
          <p className='text-gray-600 mb-6 text-sm'>
            Class: {data?.class_title} | Course: {data?.course_name}
          </p>

          <form onSubmit={handleSubmit} className='grid lg:grid-cols-2 gap-5'>
            {data?.questions?.map((q, index) => (
              <div key={q.id} className='p-4 rounded-lg'>
                <h4 className='text-lg font-semibold mb-3'>
                  {index + 1}. {q.questions}
                </h4>

                <div className='grid gap-2'>
                  {['option1', 'option2', 'option3', 'option4'].map(opt => (
                    <label
                      key={opt}
                      className={`flex items-center border border-black/10 p-2 rounded-md cursor-pointer transition ${
                        answers[q.id] === opt
                          ? 'accent-black bg-gray-100'
                          : 'hover:border-amber-300'
                      }`}
                    >
                      <input
                        type='radio'
                        name={`question-${q.id}`}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => handleOptionChange(q.id, opt)}
                        className='mr-3'
                      />
                      {q[opt]}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </form>

          <div className='pl-5 mt-10 mb-16'>
            <button
              onClick={handleSubmit}
              className='bg-[#FBBD08] text-black text-sm font-medium px-6 py-2 rounded transition cursor-pointer'
            >
              Submit Quiz
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

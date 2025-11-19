'use client'
import React, { useEffect, useState } from 'react'
import { useToken } from '../hooks/GetToken'
import axios from 'axios'
import Topbar from '../topbar/page'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function MyQuize () {
  const [token] = useToken()
  const [data, setData] = useState([])
  const pathname = usePathname()

  const formattedPath = pathname
    .replace(/^\/|\/$/g, '')
    .split('/')
    .map(segment =>
      segment.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
    )
    .join(' / ')

  // Format time to 12-hour AM/PM
  const formatTime12Hour = timeStr => {
    if (!timeStr) return ''
    const [hour, minute] = timeStr.split(':')
    const h = parseInt(hour)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour12 = h % 12 || 12
    return `${hour12}:${minute} ${ampm}`
  }

  // api call for dashboard
  useEffect(() => {
    if (!token) return

    const fetchData = async () => {
      try {
        console.log(token)
        const response = await axios.get(
          `https://lmsapi.eduden.io/api/quiz-list/`,
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

  console.log(data, 'for quiz ')

  return (
    <section className=''>
      <div className='edn__left__right__space'>
        <Topbar title={formattedPath} />

        {/* Main content */}
        <div>
          <div className='bg-white rounded-xl  p-5'>
            <h3 className='edn__section__title mb-5'>My Quiz</h3>

            {/* Responsive table */}
            <div className='overflow-x-auto'>
              <table className='min-w-full text-sm text-left'>
                <thead className='border-b-[1px] border-dashed border-black/10 text-black/65'>
                  <tr>
                    <th className='p-2'>#</th>
                    <th className='p-2'>Date</th>
                    <th className='p-2'>Batch Name</th>
                    <th className='p-2'>Class Name</th>
                    <th className='p-2'>Quiz Info</th>
                    <th className='p-2'>Score</th>
                    <th className='p-2'>Status</th>
                    <th className='p-2'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td
                        colSpan='10'
                        className='text-center p-4 text-gray-500'
                      >
                        No quiz list found.
                      </td>
                    </tr>
                  ) : (
                    data.map((item, index) => (
                      <tr key={item.id} className='border-b border-gray-100'>
                        <td className='p-2'>{index + 1}</td>
                        <td className='p-2 edn__small__text'>
                          {new Date(item?.created_at).toLocaleDateString()}
                        </td>
                        <td className='p-2 edn__small__text'>
                          {item.batch_name}
                        </td>
                        <td className='p-2 edn__title__heading'>
                          {item.class_title}
                         
                        </td>
                        <td className='p-2 edn__title__heading'>
                          {item.quiz_name}
                          <p className='edn__small__text'>
                            {formatTime12Hour(item.start_time)} - {formatTime12Hour(item.end_time)}
                          </p>
                        </td>
                        <td className='p-2 edn__title__heading'>
                          {item?.score }
                        </td>

                        <td
                          className={`p-2 capitalize font-medium text-sm rounded 
                             ${
                               item.is_submitted ? ' !text-green-500'
                                 : '!text-amber-500'
                             }
                             `}
                        >
                          {`${item.is_submitted  ? "Completed" :"Pending" }`}
                        </td>

                        <td className='p-2'>
                          {
                            item.is_submitted  ? <Link href={`/dashboard/my-quiz/view-result/${item.id}`} className='cursor-pointer'>
                            <button className='py-1 px-6 w-full 2xl:w-[7vw] bg-[#FBBD08] rounded cursor-pointer font-medium'> View Result</button>
                          </Link> : <Link href={`/dashboard/my-quiz/${item.id}`} className='cursor-pointer'>
                            <button className='py-1 px-6 bg-[#FBBD08] rounded cursor-pointer font-medium w-full 2xl:w-[7vw]'>Take Quiz</button>
                          </Link>
                          }
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* End table */}
          </div>
        </div>
      </div>
    </section>
  )
}

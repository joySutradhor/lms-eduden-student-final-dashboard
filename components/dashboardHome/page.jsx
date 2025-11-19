'use client'
import React, { useEffect, useState } from 'react'
import { useToken } from '../hooks/GetToken'
import { usePathname } from 'next/navigation'
import Topbar from '../topbar/page'
import axios from 'axios'
import Banner from '../common/page'
import { RiGraduationCapFill } from 'react-icons/ri'
import { IoBookSharp } from 'react-icons/io5'
import { BiSolidBadgeCheck } from 'react-icons/bi'
import Circle from '../common/circle'
import { MdOutlineChromeReaderMode } from 'react-icons/md'
import { FaChevronRight } from 'react-icons/fa'
import { LuBrain } from 'react-icons/lu'
import Link from 'next/link'

export default function DashboardHome () {
  const pathname = usePathname()
  const [token] = useToken()
  const [data, setData] = useState()

  const formattedPath = pathname
    .replace(/^\/|\/$/g, '')
    .split('/')
    .map(segment =>
      segment.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
    )
    .join(' / ')

  // api call for dashboard
  useEffect(() => {
    if (!token) return

    const fetchData = async () => {
      try {
        console.log(token)
        const response = await axios.get(
          'https://lmsapi.eduden.io/api/dashboard/',
          {
            headers: {
              Authorization: `Token ${token}`
            }
          }
        )
        setData(response?.data.user_data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [token])

  console.log(data)

  return (
    <section className='edn__sideToLeftSpace  '>
      <div className='edn__left__right__space bg-red'>
        <div>
          <Topbar title={formattedPath} />
        </div>

        <div className='common_layout'>
          <div>
            {/* banner */}
            <Banner />

            <div className='edn__h__card__wrapper'>
              <div className='edn__h__card__parent'>
                <div className='edn__h__card__icon__parent bg-[#F2E9FF]'>
                  <RiGraduationCapFill className='text-[#9000FF] text-3xl' />
                </div>
                <div>
                  <h3 className='edn__card__small__title'>Admitted Courses</h3>
                  <h4 className='edn__card__small__number'>
                    {data?.total_admitted}
                  </h4>
                </div>
              </div>
              <div className='edn__h__card__parent'>
                <div className='edn__h__card__icon__parent bg-[#FFE9F1]'>
                  <IoBookSharp className='text-[#E80054] text-3xl' />
                </div>
                <div>
                  <h3 className='edn__card__small__title'>Ongoing Courses</h3>
                  <h4 className='edn__card__small__number'>
                    {data?.total_ongoing}
                  </h4>
                </div>
              </div>
              <div className='edn__h__card__parent'>
                <div className='edn__h__card__icon__parent bg-[#E9FFF0]'>
                  <BiSolidBadgeCheck className='text-[#00E83F] text-3xl' />
                </div>
                <div>
                  <h3 className='edn__card__small__title'>Completed Courses</h3>
                  <h4 className='edn__card__small__number'>
                    {data?.total_completed}
                  </h4>
                </div>
              </div>
            </div>

            {/* lattest admitted course  */}
            <div className='edn__h__courses__container'>
              <div className=' flex justify-between md:justify-baseline md:gap-8 xl:gap-0 xl:justify-between items-center mb-5'>
                <h3 className='edn__section__title'>Latest admitted course</h3>
                <Link href='/dashboard/admitted-course'>
                  <p className='text-amber-300 cursor-pointer'>See all</p>
                </Link>
              </div>
              <div className='edn__h__course__card__wrapper'>
                {data?.admitted_course?.map((course, i) => (
                  <div key={i} className='edn__h__course__item'>
                    <img
                      src={course?.course_thumbnail}
                      className='rounded mb-3 w-full'
                    ></img>
                    <button className='edn__tooltip'>{course?.status}</button>
                    <h3 className='edn__title__heading'>
                      {course?.course_name}
                    </h3>

                    {/* teachers */}
                    <div className='my-5  '>
                      {course?.teachers.map((t, i) => (
                        <div key={i}>
                          <div className='flex gap-x-2 items-center mb-2'>
                            {' '}
                            <img
                              src={t.picture}
                              className='size-6 rounded-full '
                            ></img>
                            <h5 className='edn__card__medium__title'>
                              {t?.full_name}
                            </h5>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* button  */}
                    {/* <button className='edn__course__btn'>
                      {' '}
                      View Details{' '}
                      <span>
                        {' '}
                        <FaChevronRight />{' '}
                      </span>
                    </button> */}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl  lg:px-6 py-10 px-3 lg:mt-0 mt-10'>
            {/* attendance */}
            {/* <div>
              <h2 className='edn__section__title'>Class Attendance</h2>
              <div className='flex justify-center items-center my-10'>
                <Circle value={32} max={100} />
              </div>
            </div> */}

            {/* upcomming class schedule */}
            <div className=''>
              <div className='flex justify-between md:justify-baseline md:gap-8 xl:justify-between xl:gap-0 items-center mb-5 '>
                <h2 className='edn__section__title'>Upcoming Classes</h2>
                <Link href='/dashboard/class-schedule'>
                  <p className='text-[#FBBD08] cursor-pointer'>See all</p>
                </Link>
              </div>
              <div >
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-5 w-full' >
                  {Array.isArray(data?.upcoming_class_schedule) &&
                    data.upcoming_class_schedule.map((classItem, i) => {
                      const date = new Date(classItem.class_date)
                      const startTime = new Date(
                        `1970-01-01T${classItem.class_start}`
                      )
                      const endTime = new Date(
                        `1970-01-01T${classItem.class_end}`
                      )

                      const formattedDate = date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit'
                      }) // e.g., "May 23"

                      const formattedStartTime = startTime.toLocaleTimeString(
                        'en-US',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        }
                      ) // e.g., "13:16"

                      const formattedEndTime = endTime.toLocaleTimeString(
                        'en-US',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        }
                      ) // e.g., "14:17"

                      return (
                        <div key={i} className='edn__h__upcomming__wrapper w-full '>
                          <div className='edn__h__upcomming__card__parent'>
                            <div className='edn__h__upcomming__card__child__parent'>
                              <div className='edn__h__upcomming__card__icon__parent'>
                                {' '}
                                <MdOutlineChromeReaderMode className='text-xl' />
                              </div>
                              <div>
                                <h3 className='edn__card__medium__title'>
                                  {classItem.class_title}
                                </h3>
                                <p className='text-sm  '>
                                  {formattedDate} -- {formattedStartTime} -{' '}
                                  {formattedEndTime}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>

            {/* upcomming Assingnament */}
            <div>
              <div className='flex justify-between items-center mb-5 mt-10'>
                <h2 className='edn__section__title'>Upcoming Assignment</h2>
                <Link href='/dashboard/class-schedule'>
                  <p className='text-[#FBBD08] cursor-pointer'>See all</p>
                </Link>
              </div>
              <div>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-5 w-full'>
                  {Array.isArray(data?.upcomming_assignment) &&
                    data.upcomming_assignment.map((assignItem, i) => {
                      return (
                        <div key={i} className='edn__h__upcomming__wrapper  '>
                          <div className='edn__h__upcomming__card__parent'>
                            <div className='edn__h__upcomming__card__child__parent'>
                              <div className='edn__h__upcomming__card__icon__parent'>
                                {' '}
                                <LuBrain className='text-xl text-[#FBBD08]' />
                              </div>
                              <div>
                                <h3 className='edn__card__medium__title'>
                                  {assignItem.assignment_title}
                                </h3>
                                <p className='text-sm  '>
                                  {assignItem?.left_days} Days
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

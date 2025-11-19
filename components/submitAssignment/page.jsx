'use client'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useToken } from '../hooks/GetToken'
import axios from 'axios'
import CommonBanner from '../common/commonBanner'
import Topbar from '../topbar/page'

export default function SubmitAssignment () {
  // https://lmsapi.eduden.io/api/assignments/

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

  // api call for submit attendance
  useEffect(() => {
    if (!token) return

    const fetchData = async () => {
      try {
        console.log(token)
        const response = await axios.get(
          'https://lmsapi.eduden.io/api/assignments/',
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

  console.log(data, 'submit assignmet data')

  return (
    <section>
      <div className='edn__left__right__space'>
        <Topbar title={formattedPath} />

        {/* Main content */}
        <div className='common_layout '>
          <div></div>
          {/* <div className=''>
            {filteredData.length > 0 ? (
              <div className='grid grid-cols-3 gap-5 mt-10 mb-10'>
                {filteredData.map((d, i) => (
                  <div
                    key={i}
                    className='border border-black/10 rounded-xl p-4  '
                  >
                    <div>
                      <p className=' mt-2 mb-3 edn__small__text'>
                        {new Date(d.uploaded_at).toLocaleDateString()}
                      </p>
                      <div>
                        <h2 className='edn__title__heading'>{d.title}</h2>
                        <h2 className='edn__small__text'>{d.course_name}</h2>

                        {d?.files.map((f, i) => (
                          <div
                            key={i}
                            onClick={() =>
                              handleDownload(
                                f.file,
                                `${f.filename}.${f.file_type}`
                              )
                            }
                            className='flex justify-between p-5 rounded-lg bg-gray-100 mt-5 gap-3 mb-2 items-center cursor-pointer hover:bg-gray-50 transition'
                          >
                            <div>
                              <p className='edn__small__text'>{f?.filename}</p>
                              <p className='edn__xs__text'>{f?.file_type}</p>
                            </div>
                            <div>
                              <FaDownload className='text-xl text-[#FBBD08]' />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-gray-500 mt-10'>No course material found.</p>
            )}
          </div> */}
          <div>
            <CommonBanner />
          </div>
        </div>
      </div>
    </section>
  )
}

import CourseMaterial from '@/components/courseMaterial/page'
import React from 'react'

export const metadata = {
  title: 'eduden - Course Material',
  description:
    'Access and download all your course materials easily. Stay prepared with organized lecture notes, assignments, and study resources from your Eduden dashboard.'
}

export default function page () {
  return (
    <section className='edn__sideToLeftSpace'>
      <CourseMaterial />
    </section>
  )
}

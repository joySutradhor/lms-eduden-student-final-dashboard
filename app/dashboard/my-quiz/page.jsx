import MyQuize from '@/components/myQuize/page'
import React from 'react'

export const metadata = {
  title: 'eduden - My Quiz',
  description: 'View and attempt all your course quizzes in one place. Track your quiz performance, review past results, and stay on top of your learning goals from your Eduden dashboard.'
}



export default function page() {
  return (
    <section className='edn__sideToLeftSpace'>
       <MyQuize/>
    </section>
  )
}

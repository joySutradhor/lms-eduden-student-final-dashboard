import ViewResult from '@/components/myQuize/ViewResult'
import React from 'react'

export const metadata = {
  title: 'eduden - Quiz Result',
  description: 'Check your quiz results with detailed scores and feedback. Monitor your progress, identify improvement areas, and stay informed on your academic performance through the Eduden dashboard.'
}


function page() {
  return (
    <section className='edn__sideToLeftSpace'> <ViewResult/> </section>
  )
}

export default page
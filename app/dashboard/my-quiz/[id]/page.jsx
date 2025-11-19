import TakeQuiz from '@/components/myQuize/TakeQuiz'
import React from 'react'

export const metadata = {
  title: 'eduden - Take Quiz',
  description:
    'Access all your available quizzes, attempt them with ease, and test your knowledge to stay on track with your course progress through the Eduden student dashboard.'
}

export default function page () {
  return (
    <section>
      <TakeQuiz />
    </section>
  )
}

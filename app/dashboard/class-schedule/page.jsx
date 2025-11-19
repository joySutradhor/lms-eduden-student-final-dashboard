import ClassSchedule from '@/components/classSchedule/page'

export const metadata = {
  title: 'eduden - Class Schedule',
  description: 'Access the official Eduden class schedule to view up-to-date course timings, subjects, and daily academic plans. Stay organized and never miss a session.'
}


export default function page () {
  return (
    <section>
      <ClassSchedule />
    </section>
  )
}

import { IoHomeOutline } from 'react-icons/io5'
import { SlCalender } from 'react-icons/sl'
import { LuFolderCode } from 'react-icons/lu'
import { MdOutlineIntegrationInstructions } from 'react-icons/md'
import { FaFileCircleQuestion } from 'react-icons/fa6'
import { FaFileAlt } from 'react-icons/fa'
import { FaAward } from 'react-icons/fa'
import { FaIndianRupeeSign } from "react-icons/fa6";
import { ImProfile } from "react-icons/im";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";




export const menuList = () => {
  return [
    { name: 'Dashboard', href: '/dashboard', icon: <IoHomeOutline /> },
    { name: 'Class Schednle', href: '/dashboard/class-schedule', icon: <SlCalender /> },
    {
      name: 'Admitted Courses',
      href: '/dashboard/admitted-course',
      icon: <LuFolderCode />
    },
    {
      name: 'Course Material',
      href: '/dashboard/course-material',
      icon: <MdOutlineIntegrationInstructions />
    },
    { name: 'My quiz', href: '/dashboard/my-quiz', icon: <FaFileCircleQuestion /> },
    // { name: 'Submit Assignment', href: '/dashboard/submit-assignment', icon: <MdOutlineAssignmentTurnedIn /> },
    { name: 'My Attendance', href: '/dashboard/my-attendance', icon: <FaFileAlt /> },
    { name: 'Payment History', href: '/dashboard/payment-history', icon: <FaIndianRupeeSign /> },
    { name: 'My Profile', href: '/dashboard/profile', icon: <ImProfile /> },
    { name: 'My Certificate', href: '/dashboard/my-certificate', icon: <FaAward /> }
  ]
}

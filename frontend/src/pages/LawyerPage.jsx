
import React from 'react'
import {motion} from "framer-motion"
import LawyerList from '@/components/lawyers/LawyerList'

const LawyerPage = () => {
  
  return (
    <div className='2xl:px-32 xl:px-16 lg:px-8 px-4 w-full h-[100vh] overflow-y-auto py-10 pb-30'>
        <div className='w-full flex flex-col items-center justify-center gap-6 mt-14'>
            <div>

            <motion.h1 initial={{y:100,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.5}} className='font-bold text-4xl  lg:text-6xl text-center text-gradient-green-subehading'>Meet Our Lawyers</motion.h1>
            </div>
            <motion.p initial={{y:100,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.5 , delay:0.3}} className='text-center text-[16px]'>Experienced professionals across multiple areas of law.</motion.p>
        </div>
        <LawyerList/>
    </div>
  )
}

export default LawyerPage
import React from 'react'
import { motion } from "motion/react"

const OnboardingCTA = () => {
  return (
    <div className='min-h-screen w-full flex items-center justify-center  lg:px-8 xl:px-16 2xl:px-32'>
        <div className='flex flex-col items-center justify-center space-y-10'>
            {/* HEading CTA  */}
            <div className='space-y-2'>
                <motion.h1 initial={{y:100,opacity:0}} whileInView={{y:0,opacity:1}} transition={{duration:0.6}} className='text-gradient-onboarding-light text-center dark:text-gradient-onboarding-dark font-bold text-3xl md:text-4xl lg:text-6xl'>Your AI Legal Partner, Ready</motion.h1>
                <motion.h1  initial={{y:100,opacity:0}} whileInView={{y:0,opacity:1}} transition={{duration:0.6,delay:0.2}} className='text-gradient-onboarding-light text-center dark:text-gradient-onboarding-dark font-bold text-3xl md:text-4xl lg:text-6xl'> When You Are.</motion.h1>
            </div>
            <p className='text-[18px]  opacity-80'>
                Get fast, reliable, and secure legal guidance — backed by AI and expert insights.
            </p>
            <div className='p-1 hover:shadow-lg hover:shadow-green-400/20 group border-2 border-emerald-500 rounded hover:scale-102 transition-all duration-150'>
                <button className='px-6 group-hover:bg-gradient-to-r from-[#10B981] text-[17px] to-[#338066] transition-all duration-150 py-2 rounded  '>
                    Your Legal Partner Awaits 
                </button>
            </div>
            <p className="mt-2 text-[14px] leading-snug text-gray-500 dark:text-gray-400">
            ⚠️ <strong>Disclaimer:</strong> AI guidance only; not a substitute for professional legal advice.
            </p>

        </div>
    </div>
  )
}

export default OnboardingCTA
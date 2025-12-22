import React from 'react'

const Background = () => {
  return (
    <div className='fixed h-screen w-screen inset-0 -z-10 overflow-hidden'>
      
      {/* White grid lines */}
      <div className='absolute w-full h-full bg-background/2 inset-0 
        pointer-events-none'>
      </div>

      {/* Blurred gradient circles */}
      <div className='relative flex h-full w-full items-center justify-center gap-8  '>
        <div className='absolute left-1/2 h-[400px] w-[450px] rounded-full blur-2xl bg-gradient-to-r dark:from-emerald-400/40 from-emerald-400/100 to-emerald-400/80 dark:to-emerald-400/80  opacity-20'></div>
      </div>

    </div>
  )
}

export default Background

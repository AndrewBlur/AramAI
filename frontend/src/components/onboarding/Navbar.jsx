import React from 'react'
import { ModeToggle } from "../mode-toggle";

const Navbar = () => {
  return (
    <nav className='w-full py-2 h-fit flex items-center justify-center inset-0 fixed z-100 bg-background/80 px-2 md:px-4 lg:px-8 xl:px-16 2xl:px-32  backdrop-blur-xl'>
        <div className='flex flex-row justify-between items-center gap-5 h-full  container'>

            {/* Logo  */}
            <div className='font-goldman text-xl font-medium'>
                Aram AI
            </div>
            <div className='flex items-center space-x-12 '>
                <ModeToggle />
                <button onClick={() => {
                    window.location.href = '/login';
                }}>
                <div className='group px-4 py-2 shadow shadow-foreground/10 border-1 relative hover:scale-102 rounded  font-medium  overflow-hidden cursor-pointer'>
                    <div className='w-full rotate-30 h-5  absolute left-0 translate-x-[100%] group-hover:translate-x-0 transition-all duration-300 bg-foreground/5 '>
                        
                    </div>
                    <p className='text-sm'>Get Started</p>
                </div>
                </button>
            </div>
        </div>
        

    </nav>
  )
}

export default Navbar
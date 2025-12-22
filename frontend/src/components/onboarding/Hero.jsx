import React from 'react'
import { ChevronDown } from "lucide-react"
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { motion } from "motion/react"
import Background from './Background';


gsap.registerPlugin(useGSAP,SplitText);

const Hero = () => {
    useGSAP(()=>{
        document.fonts.ready.then(()=>{
            const heroSplit = new SplitText('.title',{type:'chars, words' , });
            const paragraphSplit = new SplitText('.subtitle',{type:'lines' , })
            const subheadingSplit = new SplitText('.subheading',{type:"lines",})
            subheadingSplit.lines.forEach((line)=>line.classList.add('text-gradient-green-subehading'))
            

            gsap.from(paragraphSplit.lines, {
                yPercent: 100,   // start off-screen below
                opacity: 0,
                clipPath: "inset(100% 0 0 0)",
                duration: 1.8,
                ease: "expo.out",
                delay: 1,
                stagger: 0.06,
            });
            gsap.from(subheadingSplit.lines, {
                yPercent: 100,   // start off-screen below
                opacity: 0,
                clipPath: "inset(100% 0 0 0)",
                duration: 1.8,
                ease: "expo.out",
                delay: 1,
                stagger: 0.06,
            });
            heroSplit.chars.forEach((char)=>char.classList.add('text-gradient-onboarding-light'))
            heroSplit.chars.forEach((char)=>char.classList.add('dark:text-gradient-onboarding-dark'))
            gsap.from(heroSplit.chars ,{yPercent:100,duration:1.8,ease:"expo.out",stagger:0.06})
        })
    },[])
  return (
    <div id='hero' className="relative z-10  min-h-screen w-full border border-transparent bg-transparent px-4 md:px-4 lg:px-8 xl:px-16 2xl:px-32 ">
        <div className="relative flex flex-col justify-between min-h-screen w-full ">
            {/* Title at top/center */}
            <div className="pt-30 text-center pb-20">
                <h1 className="text-6xl md:text-[11vw] font-goldman title">ARAM AI</h1>
            </div>

            {/* Subheading at bottom */}
            <div className="  pb-20 space-y-6 flex justify-between items-start">
                <div className='space-y-2 hidden md:block'>
                    <h2 className="text-2xl md:text-[30px] font-bold subheading ">
                        Fast. Reliable. Secure <br /> Legal Support
                    </h2>
                    <p className=' text-[17px] subtitle'>

                        Trusted legal solutions delivered quickly and <br/>securely.
                    </p>
                </div>
                <div className='space-y-4 text-sm w-100 md:w-80'>
                    <p className='   text-[17px] subtitle'>Discover how our AI-powered legal platform works—step inside to see fast, secure guidance unfold.</p>
                    <motion.a  initial={{opacity:0 , y:10}} animate={{opacity:1,y:0 }} transition={{duration:0.6, delay:1.8}} href="#knowMore" className='group flex gap-2 font-medium  hover:text-gradient-green items-center '>
                        <p className='group-hover:text-gradient-green-subehading'>KNOW MORE</p>
                        <ChevronDown className='group-hover:rotate-180 transition-all duration-100 group-hover:text-[#059669]'/>
                    </motion.a>
                </div>
            </div>
        </div>
    </div>

  )
}

export default Hero 
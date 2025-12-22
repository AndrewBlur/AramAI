import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

import { motion } from "motion/react"

gsap.registerPlugin(ScrollTrigger);

const ScrollSection = () => {
  const containerRef = useRef(null);
  const sectionsRef = useRef(null);

  useGSAP(() => {
    if (window.innerWidth < 1024) return; // ✅ Only horizontal scroll on lg+

    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const sections = sectionsRef.current;

      if (!container || !sections) return;

      const getScrollWidth = () =>
        sections.scrollWidth - window.innerWidth;

      ScrollTrigger.addEventListener("refreshInit", () => {
        gsap.set(sections, { x: 0 });
      });

      gsap.to(sections, {
        x: () => -getScrollWidth(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${getScrollWidth()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-auto lg:h-screen overflow-hidden"
      id="knowMore"
    >
      <div
        ref={sectionsRef}
        className="flex flex-col lg:flex-row h-auto lg:h-screen w-full lg:w-[300vw]" // ✅ col on sm/md, row on lg
        style={{ willChange: "transform" }}
      >
        {/* Section 1 */}
        <section className="relative min-h-screen gap-20 w-full flex flex-col lg:flex-row items-center justify-evenly text-4xl">
          
           
          <div className="pl-4 lg:pl-8 xl:pl-16 2xl:pl-32 gap-14 flex flex-col w-full">
                <div>
                    <motion.h1 className="font-bold md:text-6xl text-4xl lg:leading-16 text-gradient-onboarding-light dark:text-gradient-onboarding-dark" initial={{opacity:0,y:100}} whileInView={{opacity:1,y:0}} transition={{duration:0.8}}>
                        At Heart, We Are 
                    </motion.h1>
                    <motion.h1  className="font-bold md:text-6xl text-4xl mt-2 md:mt-4 text-gradient-onboarding-light dark:text-gradient-onboarding-dark" initial={{opacity:0,y:100}} whileInView={{opacity:1,y:0}} transition={{duration:0.8,delay:0.25}}>Legal Guides</motion.h1>
                </div>
                <motion.p className="text-[20px] text-foreground/80 leading-8 "  initial={{opacity:0,y:100}} whileInView={{opacity:1,y:0}} transition={{duration:0.8,delay:0.50}}>We don’t just connect you to lawyers.<br/>
                    We connect you to people who listen,
                    understand, and help you move forward.
                </motion.p>
                <div className="  gap-10 md:flex-wrap lg:flex-norwrap  items-center justify-between hidden lg:flex">
                    <motion.div className="text-[18px] px-6 flex items-center bg-foreground/10  dark:bg-foreground/2 rounded-xl border border-background/30 min-h-20 flex-1/3 hover:shadow-xl shadow-emerald-500/5 hover:scale-102 transition-all duration-150"  initial={{opacity:0,y:100}} whileInView={{opacity:1,y:0}} transition={{duration:0.8,delay:1}}>
                        <div className="flex gap-4">

                        <p>{"⚡  "}</p>
                        Quick AI-powered answers to common doubts
                        </div>
                    </motion.div>
                    <motion.div className="text-[18px] px-6 flex items-center bg-foreground/10  dark:bg-foreground/2 rounded-xl border border-background/30 min-h-20 flex-1/3 hover:shadow-xl shadow-emerald-500/5 hover:scale-102 transition-all duration-150"  initial={{opacity:0,y:100}} whileInView={{opacity:1,y:0}} transition={{duration:0.8,delay:1.1}}>
                        <div className="flex gap-4">

                        <p>{"🤝  "}</p>
                        One-to-one consultations with expert lawyers
                        </div>
                    </motion.div>
                    <motion.div className="text-[18px] px-6 flex items-center bg-foreground/10  dark:bg-foreground/2 rounded-xl border border-background/30 min-h-20 flex-1/3 hover:shadow-xl shadow-emerald-500/5 hover:scale-102 transition-all duration-150"  initial={{opacity:0,y:100}} whileInView={{opacity:1,y:0}} transition={{duration:0.8,delay:1.2}}>
                        <div className="flex gap-4">

                        <p>{"🔒  "}</p>
                        Always private. Always secure.
                        </div>
                    </motion.div>
                </div>
          </div>
          <div  className="pr-4 lg:pr-8 xl:pr-16 2xl:pr-32 lg:h-[80vh] md:w-[70%] w-[90%] lg:w-[50%]">
            <div className="h-full w-full  rounded-4xl">
                <motion.img initial={{scale:0.5}} whileInView={{scale:1}} transition={{duration:1}} exit={{scale:0.5}} src="/images/botreadingbook.jpg" className="w-full h-full object-cover rounded-4xl" alt="" />
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="relative min-h-screen  w-full flex flex-col lg:flex-row items-center justify-evenly text-4xl gap-20">
            <div className="pl-4 lg:pl-8 xl:pl-16 2xl:pl-32 gap-10  flex flex-col w-full">
              <div className="space-y-4">

                <motion.h1 className="font-bold md:text-6xl text-4xl lg:leading-16 text-gradient-onboarding-light dark:text-gradient-onboarding-dark" initial={{opacity:0,y:100}} whileInView={{opacity:1,y:0}} transition={{duration:0.8}}>
                        Why Us? 
                </motion.h1>
                <motion.h3 className="ml-2 font-bold md:text-2xl text-2xl lg:leading-16 text-gradient-onboarding-light dark:text-gradient-onboarding-dark" initial={{opacity:0,y:100}} whileInView={{opacity:1,y:0}} transition={{duration:0.8}}>
                        Clarity in Complexity
                </motion.h3>
              </div>
              <motion.p className="text-[20px] text-foreground/60 leading-8 "  initial={{opacity:0,y:100}} whileInView={{opacity:1,y:0}} transition={{duration:0.8,delay:0.50}}>
                    Law feels confusing. We simplify it.<br/>
                    With AI + expert insight, you get clear, actionable guidance—without the jargon.
              </motion.p>
              <div className="  gap-10 flex-wrap  items-center justify-between hidden lg:flex">
                    <motion.div className="text-[18px] px-6 flex items-center bg-foreground/10  dark:bg-foreground/2 rounded-xl border border-background/30 min-h-20 flex-1/3 hover:shadow-xl shadow-emerald-500/5 hover:scale-102 transition-all duration-150"  initial={{opacity:0,y:100}} whileInView={{opacity:1,y:0}} transition={{duration:0.8,delay:1}}>
                        <div className="flex gap-4">

                        <p>{"⚖️  "}</p>
                        Accurate & reliable legal answers
                        </div>
                    </motion.div>
                    <motion.div className="text-[18px] px-6 flex items-center bg-foreground/10  dark:bg-foreground/2 rounded-xl border border-background/30 min-h-20 flex-1/3 hover:shadow-xl shadow-emerald-500/5 hover:scale-102 transition-all duration-150"  initial={{opacity:0,y:100}} whileInView={{opacity:1,y:0}} transition={{duration:0.8,delay:1.1}}>
                        <div className="flex gap-4">

                        <p>{"⏱️  "}</p>
                          Save time with instant responses
                        </div>
                    </motion.div>
                    <motion.div className="text-[18px] px-6 flex items-center bg-foreground/10  dark:bg-foreground/2 rounded-xl border border-background/30 min-h-20 flex-1/3 hover:shadow-xl shadow-emerald-500/5 hover:scale-102 transition-all duration-150"  initial={{opacity:0,y:100}} whileInView={{opacity:1,y:0}} transition={{duration:0.8,delay:1.2}}>
                        <div className="flex gap-4">

                        <p>{"🌍  "}</p>
                          Accessible anytime, anywhere
                        </div>
                    </motion.div>
                </div>

            </div>
            <div  className="pr-4 lg:pr-8 xl:pr-16 2xl:pr-32 lg:h-[80vh] md:w-[70%] w-[90%] lg:w-[50%]">
            <div className="h-full w-full  rounded-4xl">
                <motion.img initial={{scale:0.5}} whileInView={{scale:1}} transition={{duration:1}} src="/images/expertconsulting.jpg" className="w-full h-full object-cover rounded-4xl" alt="" />
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="min-h-screen w-full flex flex-col lg:flex-row items-center justify-center  text-4xl">
          <div className="pl-4 lg:pl-8 xl:pl-16 2xl:pl-32 gap-14 flex flex-col w-full">
              <motion.h1 className="font-bold md:text-6xl text-4xl lg:leading-16 text-gradient-onboarding-light     dark:text-gradient-onboarding-dark  " initial={{opacity:0,y:100}} whileInView={{opacity:1,y:0}} transition={{duration:0.8}}>
                        A Path You Can Trust
              </motion.h1>
              <motion.p className="text-[20px] text-foreground/60 leading-8 "  initial={{opacity:0,y:100}} whileInView={{opacity:1,y:0}} transition={{duration:0.8,delay:0.50}}>
                    Law is a journey, and every step should feel guided.<br/>
                    We walk with you, from your first doubt to your final decision.
              </motion.p>
          </div>
          <div className="px-4 lg:px-8 xl:px-16 2xl:px-32 grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10 lg:gap-y-30 h-full  md:h-fit mt-20 lg:mt-0  w-full">
            <motion.div initial={{x:-100,y:-100,rotate:-10,opacity:0}} whileInView={{x:0,y:0,rotate:0,opacity:1}} transition={{duration:0.6,delay:0.4}} className=" rounded-xl hover:bg-foreground/2 hover:scale-102 transition-all duration-150 group flex px-6 py-4 flex-col ">
              <div className="flex gap-4 font-bold text-xl">
                <h4 className="">📌 Ask Freely</h4>
              </div>
              <p className="text-[16px] font-light pt-8 dark:opacity-60 ">our worries deserve a space—start by simply sharing them.</p>
              
              <p className="text-nor"></p>
            </motion.div>

            <motion.div initial={{x:100,y:-100,rotate:10,opacity:0}} whileInView={{x:0,y:0,rotate:0,opacity:1}} transition={{duration:0.6,delay:0.4}} className=" rounded-xl hover:bg-foreground/2 hover:scale-102 transition-all duration-150 group flex px-6 py-4 flex-col  ">
              <div className="flex gap-4 font-bold text-xl">
                <h4 className="">✨ Instant Guidance</h4>
              </div>
              <p className="text-[16px] font-light pt-8 dark:opacity-60">AI gives you a direction in seconds, cutting through the noise.</p>
              
              <p className="text-nor"></p>
            </motion.div>


            <motion.div initial={{x:-100,y:100,rotate:10,opacity:0}} whileInView={{x:0,y:0,rotate:0,opacity:1}} transition={{duration:0.6,delay:0.4}} className="rounded-xl hover:bg-foreground/2 hover:scale-102 transition-all duration-150 group flex px-6 py-4 flex-col ">
              <div className="flex gap-4 font-bold text-xl">
                <h4 className="">👩‍⚖️ Expert Intervention</h4>
              </div>
              <p className="text-[16px] font-light pt-8 dark:opacity-60">If needed, a lawyer steps in to give depth, context, and advice.</p>
              
              <p className="text-nor"></p>
            </motion.div>


            <motion.div initial={{x:100,y:100,rotate:-10,opacity:0}} whileInView={{x:0,y:0,rotate:0,opacity:1}} transition={{duration:0.6,delay:0.4}} className=" rounded-xl hover:bg-foreground/2 hover:scale-102 transition-all duration-150 group flex px-6 py-4 flex-col ">
              <div className="flex gap-4 font-bold text-xl">
                <h4 className="">🚀 Resolution Ahead</h4>
              </div>
              <p className="text-[16px] font-light pt-8 dark:opacity-60">No endless waiting—just a clear way forward, always within reach.</p>
              
              <p className="text-nor"></p>
            </motion.div>
            
          </div>

          
        </section>

      
      </div>
    </div>
  );
};

export default ScrollSection;

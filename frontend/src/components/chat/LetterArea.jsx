import { useAuthStore } from '@/store/useAuthStore'
import { X } from 'lucide-react'
import React from 'react'

const LetterArea = () => {
  const { showLetter, toggleShowLetter } = useAuthStore()

  return (
    <>
      {/* Backdrop */}
      {showLetter && (
        <div
          onClick={toggleShowLetter}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[190]"
        />
      )}

      {/* Slide-in drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[80%] md:w-[40%] xl:w-200
                   bg-background border-l border-border z-[200]
                   transform transition-transform duration-200 ease-in-out
                   ${showLetter ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Close button */}
        <div className="flex justify-end p-2">
          <button
            onClick={toggleShowLetter}
            className="p-2 bg-foreground/5 hover:bg-foreground/10 rounded-full"
          >
            <X />
          </button>
        </div>

        {/* Content area */}
        <div className="p-4">
          <h2 className="text-lg font-semibold">Letter</h2>
          <p className="text-sm opacity-70">Your letter content goes here...</p>
        </div>
      </div>
    </>
  )
}

export default LetterArea

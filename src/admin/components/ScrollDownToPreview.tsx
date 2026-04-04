import { ChevronsDown } from 'lucide-react'
import React from 'react'

const ScrollDownToPreview = () => {
  return (
    <div>
         <a href="#livepreviewsection">
            <div
              className="fixed top-5 right-5 z-40 bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-pointer px-5 py-3 rounded-full shadow-lg flex items-center gap-2 font-semibold text-sm max-w-xs hover:scale-105 transition-transform animate-pulse-custom"
              // onClick={handlescrollDown}
            >
              <span>Scroll Down to Check the preview</span>
              <ChevronsDown className="w-5 h-5" />
            </div>
          </a>
    </div>
  )
}

export default ScrollDownToPreview
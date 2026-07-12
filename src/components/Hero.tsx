'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section 
      className="relative rounded-3xl mx-auto my-8 overflow-hidden max-w-[1200px]"
      style={{ backgroundColor: '#F9F8F5' }}
    >
      {/* Background cover image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/background-cover.png"
          alt="Background texture" 
          fill
          className="object-cover opacity-100"
          quality={100}
          priority
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-12 md:px-16 lg:px-20 py-16 md:py-20">
        <div className="mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left side - Text and buttons */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-light text-gray-400 font-sans">
                Kai Tran
              </h1>
              
              <div className="space-y-1">
                <p className="text-base md:text-lg text-gray-700 leading-relaxed font-sans">
                  Interdisciplinary product designer
                </p>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed font-sans">
                  who makes learning feel like play
                </p>
              </div>
              
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-mono pt-2">
                Combined experience in: Enterprise Finance, EdTech, Gaming
              </p>
              
              {/* Three card buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6">
                <Link 
                  href="/works"
                  className="bg-white rounded-lg p-5 text-left shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="text-sm mb-2 group-hover:translate-x-1 transition-transform font-sans">→</div>
                  <div className="font-medium text-sm mb-1 font-sans">Selected Works</div>
                  <div className="text-xs text-gray-500 font-sans">ApolloEd Edu Dashboard</div>
                </Link>
                
                <Link 
                  href="/play"
                  className="bg-white rounded-lg p-5 text-left shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="text-sm mb-2 group-hover:translate-x-1 transition-transform font-sans">→</div>
                  <div className="font-medium text-sm mb-1 font-sans">Recent Play</div>
                  <div className="text-xs text-gray-500 font-sans">Meow Memory Lane</div>
                </Link>
                
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText('uxdesignerkaitran@gmail.com')
                    alert('Email copied to clipboard!')
                  }}
                  className="bg-white rounded-lg p-5 text-left shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="text-sm mb-2 group-hover:translate-x-1 transition-transform font-sans">→</div>
                  <div className="font-medium text-sm mb-1 font-sans">Contact Me</div>
                  <div className="text-xs text-gray-500 font-sans">Click to Copy</div>
                </button>
              </div>
              
              <div className="pt-2">
                <a 
                  href="#career" 
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-sans"
                >
                  see my career rodeo
                </a>
              </div>
            </div>
            
            {/* Right side - ASCII art cowboy */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[400px] aspect-square">
                <Image 
                  src="/images/kai-cowboy-static.png" 
                  alt="ASCII art cowboy character" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

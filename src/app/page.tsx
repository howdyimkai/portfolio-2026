import Hero from '@/components/Hero'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Company logos section */}
      <section className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-gray-600 mb-6">I've collaborated with →</p>
          {/* Add your company logos here */}
        </div>
      </section>
      
      {/* Rest of your sections will go here */}
    </div>
  )
}

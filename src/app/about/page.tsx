export default function AboutPage() {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">About Kai</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Design Philosophy</h2>
            <ul className="space-y-2 text-gray-600">
              <li>1. Learning should be fun and delightful</li>
              <li>2. Interfaces fade, letting content shine</li>
              <li>3. Remove friction, don't add complexity</li>
              <li>4. Build practical, time-saving systems</li>
              <li>5. Good design is invisible until needed</li>
            </ul>
          </div>
          <div>
            {/* Future: Add personal bio, photo, skills */}
            <p className="text-gray-600">
              An interdisciplinary product designer passionate about creating engaging, intuitive experiences.
            </p>
          </div>
        </div>
      </div>
    )
  }
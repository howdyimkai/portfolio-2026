// src/components/Footer.tsx
export default function Footer() {
    const currentYear = new Date().getFullYear();
  
    return (
      <footer className="bg-gray-100 py-6 mt-12">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="text-gray-600">
            © {currentYear} Kai Tran. All rights reserved.
          </div>
          <div className="flex space-x-4">
            <a href="https://linkedin.com" target="_blank" className="text-gray-600 hover:text-black">LinkedIn</a>
            <a href="https://github.com" target="_blank" className="text-gray-600 hover:text-black">GitHub</a>
            <a href="mailto:your-email@example.com" className="text-gray-600 hover:text-black">Contact</a>
          </div>
        </div>
      </footer>
    );
  }
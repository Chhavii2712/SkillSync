import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          <div>
            <div className="flex items-center text-xl font-bold mb-4">
              <span className="mr-1 text-brand-blue">⚡</span> SkillSync
            </div>
            <p className="text-gray-400 text-sm">Peer Learning, Reimagined.</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/find-hub" className="hover:text-white transition">Find a Hub</Link></li>
              <li><Link to="/" className="hover:text-white transition">Browse Skills</Link></li>
              <li><Link to="/" className="hover:text-white transition">Start Exchange</Link></li>
              <li><Link to="/" className="hover:text-white transition">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white transition">About</Link></li>
              <li><Link to="/history" className="hover:text-white transition">History</Link></li>
              <li><Link to="/careers" className="hover:text-white transition">Careers</Link></li>
              <li><Link to="/" className="hover:text-white transition">Press</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Connect</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/list-space" className="hover:text-white transition">List Your Space</Link></li>
              <li><Link to="/" className="hover:text-white transition">Contact</Link></li>
              <li><a href="#" className="hover:text-white transition">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition">LinkedIn</a></li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-sm text-gray-500">
          © 2026 SkillSync Inc. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

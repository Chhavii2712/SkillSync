import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find a Hub', path: '/find-hub' },
    { name: 'About', path: '/about' },
    { name: 'History', path: '/history' },
    { name: 'Careers', path: '/careers' },
    { name: 'List Your Space', path: '/list-space' },
  ]

  return (
    <>
      <nav className={`sticky top-0 z-50 bg-white transition-shadow border-b-[2px] border-black ${isScrolled ? 'shadow-md' : ''}`}>
        <div className="max-w-[1600px] mx-auto w-full">
          <div className="flex justify-between items-stretch h-[72px]">

            {/* Left Nav Grid section */}
            <div className="flex h-full border-r-[2px] border-black">
              {/* Logo Box */}
              <div className="flex items-center px-6 md:px-10 border-r-[2px] border-black">
                <Link to="/" className="text-black font-extrabold text-xl tracking-tight">
                  SkillSync
                </Link>
              </div>

              {/* Decorative Grid Box */}
              <div className="hidden md:grid grid-cols-2 grid-rows-2 w-[72px] h-full border-r-[2px] border-black">
                <div className="border-r border-b border-black"></div>
                <div className="bg-yellow-400 border-b border-black"></div>
                <div className="bg-orange-500 border-r border-black"></div>
                <div className="bg-blue-500"></div>
              </div>

              {/* Menu Icon Box */}
              <div
                className="flex items-center justify-center w-[72px] h-full cursor-pointer hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <div className="w-6 border-b-2 border-black"></div>
              </div>
            </div>

            {/* Auth Actions */}
            <div className="flex items-center px-6 md:px-10 space-x-6">
              {user ? (
                /* ── Profile avatar with hover dropdown ── */
                <div className="relative group">
                  <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-black text-sm uppercase cursor-pointer border-[2px] border-black select-none">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                    <div className="px-4 py-3 border-b-[2px] border-black">
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400">Signed in as</p>
                      <p className="text-sm font-bold text-black truncate">{user.displayName || user.email}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-3 text-sm font-bold text-black hover:bg-red-50 hover:text-red-600 uppercase tracking-wide transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="text-sm font-bold text-black hover:text-gray-600 uppercase tracking-wide"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition uppercase tracking-wide"
                  >
                    Join the Exchange
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mega Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-[72px] left-0 w-full bg-white border-b-[2px] border-black shadow-xl z-40">
            <div className="grid grid-cols-1 md:grid-cols-4 max-w-[1600px] mx-auto">
              <div className="col-span-1 border-r-[2px] border-black p-8 hidden md:block">
                <h3 className="text-2xl font-bold mb-4">Navigate</h3>
                <p className="text-gray-500">Explore the SkillSync platform.</p>
              </div>
              <div className="col-span-3 grid grid-cols-2 md:grid-cols-3">
                {navLinks.map((link, idx) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block p-6 md:p-8 text-xl font-bold hover:bg-gray-50 border-b-[2px] border-black md:border-b-0 ${idx % 3 !== 2 ? 'md:border-r-[2px] border-black' : ''} ${location.pathname === link.path ? 'bg-gray-100' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}

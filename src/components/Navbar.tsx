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
      <nav className={`sticky top-0 z-50 bg-white transition-shadow ${isScrolled ? 'shadow-md border-b border-gray-200' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center text-brand-blue font-bold text-xl">
              <span className="mr-1">⚡</span> SkillSync
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className={`flex items-center h-full text-sm font-medium transition ${
                    location.pathname === link.path 
                      ? 'text-brand-blue border-b-2 border-brand-blue' 
                      : 'text-gray-600 hover:text-brand-blue'
                  }`}
                  style={location.pathname === link.path ? { marginBottom: '-2px' } : {}}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Auth Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-sm font-medium text-gray-700">{user.displayName || user.email}</span>
                  <button onClick={logout} className="text-sm text-gray-600 hover:text-red-600">Logout</button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsAuthModalOpen(true)} className="text-sm font-medium text-gray-600 hover:text-brand-blue">
                    Log In
                  </button>
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-brand-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition"
                  >
                    Apply Now
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 text-2xl focus:outline-none">
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white absolute w-full shadow-md">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === link.path ? 'text-brand-blue bg-blue-50' : 'text-gray-700 hover:text-brand-blue hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t my-2 pt-2">
                {user ? (
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md">
                    Logout
                  </button>
                ) : (
                  <button onClick={() => { setIsMobileMenuOpen(false); setIsAuthModalOpen(true); }} className="block w-full text-left px-3 py-2 text-base font-medium text-brand-blue hover:bg-blue-50 rounded-md">
                    Log In / Apply
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  )
}

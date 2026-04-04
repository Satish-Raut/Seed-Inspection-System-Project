import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Leaf } from 'lucide-react'

const navLinks = [
  { label: 'Home',        href: '#home' },
  { label: 'Features',    href: '#features' },
  { label: 'How It Works',href: '#how-it-works' },
  { label: 'Crops',       href: '#crops' },
  { label: 'About',       href: '#about' },
]

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [activeLink, setActiveLink] = useState('#home')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleNavClick = (href) => {
    setActiveLink(href)
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-3 bg-transparent' : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            
            {/* ── Logo ── */}
            <button
              onClick={() => handleNavClick('#home')}
              className="px-4 py-2 bg-white/40 backdrop-blur-md border border-white/40 rounded-2xl flex items-center gap-3 active:scale-95 transition-all group shadow-sm hover:shadow-md hover:bg-white/60 cursor-pointer"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                  <Leaf size={20} fill="currentColor" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent-gold rounded-full border-2 border-white shadow-sm" />
              </div>
              <div className="text-left">
                <span className="block font-black text-xl text-text-primary leading-none tracking-tight">
                  SeedInspect
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="h-[2px] w-4 bg-primary-mid rounded-full" />
                  <span className="block text-[10px] font-black tracking-[0.2em] uppercase text-primary-mid">
                    PRO
                  </span>
                </div>
              </div>
            </button>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden md:flex items-center bg-white/40 backdrop-blur-md px-1.5 py-1.5 rounded-2xl border border-white/40 shadow-sm">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`relative px-5 py-2 text-sm font-bold rounded-xl transition-all duration-300 overflow-hidden cursor-pointer group ${
                    activeLink === link.href
                      ? 'text-primary bg-white shadow-sm ring-1 ring-black/5'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span className="relative z-10">{link.label}</span>
                  {activeLink !== link.href && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-50 transition-transform duration-300" />
                  )}
                </button>
              ))}
            </div>

            {/* ── Desktop CTA ── */}
            <div className="hidden md:flex items-center bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/40 shadow-sm gap-1">
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-bold text-text-secondary hover:text-text-primary hover:bg-white/50 rounded-xl transition-all"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 text-sm font-black rounded-xl bg-text-primary text-white
                           hover:bg-black hover:shadow-[0_8px_20px_-5px_rgba(0,0,0,0.3)]
                           active:scale-95 transition-all duration-300
                           flex items-center gap-2"
              >
                Sign Up Free
              </Link>
            </div>

            {/* ── Mobile Hamburger ── */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-text-primary border border-gray-200 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu Overlay ── */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
        style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
      />

      {/* ── Mobile Drawer ── */}
      <div
        className={`fixed top-0 right-0 h-full w-72 z-50 md:hidden transition-transform duration-300 ease-in-out
                    bg-white shadow-2xl flex flex-col border-l border-border ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <Leaf size={16} />
            </div>
            <span className="font-extrabold text-text-primary">SeedInspect Pro</span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col px-4 py-6 gap-1 flex-1">
          {navLinks.map((link) => (
             <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeLink === link.href
                  ? 'bg-primary-lighter text-primary'
                  : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="px-4 pb-8 flex flex-col gap-3">
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="w-full py-3 text-center text-sm font-bold rounded-xl border-2 border-border text-text-primary hover:bg-gray-50 transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/register"
            onClick={() => setMenuOpen(false)}
            className="w-full py-3 text-center text-sm font-bold rounded-xl bg-text-primary text-white hover:bg-black transition-colors"
          >
            Sign Up Free
          </Link>
        </div>
      </div>
    </>
  )
}

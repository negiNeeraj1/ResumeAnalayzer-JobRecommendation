'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/assets/Logo-Photoroom.png';
export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="font-poppins backdrop-blur-md shadow-lg sticky top-0 z-50" style={{ backgroundColor: '#FBF3D1' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={Logo}
                alt="apniNaukari Logo"
                width={90}
                height={90}
                className="w-32 h-32 object-contain"
              />
        
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200" style={{ color: '#6B5B47' }}>
                Home
              </Link>
              <Link href="/analyze" className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-white/20" style={{ color: '#6B5B47' }}>
                Analyze Resume
              </Link>
              <Link href="/jobs" className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-white/20" style={{ color: '#6B5B47' }}>
                Find Jobs
              </Link>
              <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-white/20" style={{ color: '#6B5B47' }}>
                About
              </Link>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200" style={{ color: '#6B5B47' }}>
              Sign In
            </Link>
            <Link href="/signup" className="px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl" style={{ backgroundColor: '#B6AE9F', color: '#fff' }}>
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md transition-colors duration-200"
              style={{ color: '#B6AE9F' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 backdrop-blur-md rounded-lg mt-2 shadow-lg" style={{ backgroundColor: '#DEDED1' }}>
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200" style={{ color: '#B6AE9F' }}>
                Home
              </Link>
              
              <Link href="/jobs" className="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-white/20" style={{ color: '#B6AE9F' }}>
                Find Jobs
              </Link>
              <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-white/20" style={{ color: '#B6AE9F' }}>
                About
              </Link>
              <div className="border-t pt-4 mt-4" style={{ borderColor: '#C5C7BC' }}>
                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200" style={{ color: '#B6AE9F' }}>
                  Sign In
                </Link>
                <Link href="/signup" className="block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 mt-2" style={{ backgroundColor: '#B6AE9F', color: '#FBF3D1' }}>
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

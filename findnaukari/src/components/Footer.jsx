import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/assets/Logo-Photoroom.png';

export const Footer = () => {
  return (
    <footer className="font-poppins" style={{ backgroundColor: '#B6AE9F' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo and Brand */}


          {/* Quick Links */}
          <div className="flex flex-wrap items-center space-x-6 text-sm">
            <Link href="/analyze" className="transition-colors duration-200 hover:underline" style={{ color: '#FBF3D1' }}>
              Resume Analysis
            </Link>
            <Link href="/jobs" className="transition-colors duration-200 hover:underline" style={{ color: '#FBF3D1' }}>
              Find Jobs
            </Link>
            <Link href="/about" className="transition-colors duration-200 hover:underline" style={{ color: '#FBF3D1' }}>
              About
            </Link>
            <Link href="/contact" className="transition-colors duration-200 hover:underline" style={{ color: '#FBF3D1' }}>
              Contact
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm" style={{ color: '#DEDED1' }}>
            © 2024 apniNaukari. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

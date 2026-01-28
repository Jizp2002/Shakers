import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background-light/95 backdrop-blur-sm border-b border-[#e7f3eb]">
      <div className="flex justify-center w-full">
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center w-full">
          <div className="flex flex-col max-w-[960px] flex-1">
            <div className="flex items-center justify-between whitespace-nowrap py-3">
              {/* Logo Area */}
              <div className="flex items-center gap-4 text-text-main">
                <div className="w-8 h-8 text-primary">
                  <svg className="w-full h-full" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4L6 44H42L24 4Z" fill="currentColor" stroke="currentColor" strokeWidth="4"></path>
                    <path d="M24 16L14 38H34L24 16Z" fill="#f6f8f6"></path>
                  </svg>
                </div>
                <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Camp 2024</h2>
              </div>

              {/* Desktop Nav */}
              <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                <nav className="flex items-center gap-9">
                  <a href="#" className="text-sm font-medium leading-normal hover:text-primary transition-colors">About</a>
                  <a href="#gallery" className="text-sm font-medium leading-normal hover:text-primary transition-colors">Gallery</a>
                  <a href="#location" className="text-sm font-medium leading-normal hover:text-primary transition-colors">Location</a>
                </nav>
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-text-main text-sm font-bold leading-normal tracking-[0.015em] hover:brightness-110 transition-all">
                  <span className="truncate">Register</span>
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden p-2 text-text-main"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            
            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-100 flex flex-col gap-4 items-center bg-background-light">
                <a href="#" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>About</a>
                <a href="#gallery" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>Gallery</a>
                <a href="#location" className="text-sm font-medium hover:text-primary" onClick={() => setIsMenuOpen(false)}>Location</a>
                <button className="w-full max-w-xs rounded-lg h-10 bg-primary text-text-main font-bold text-sm">
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-light border-t border-[#e7f3eb] pt-16 pb-8">
      <div className="flex justify-center w-full">
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 flex-col max-w-[960px]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Brand Column */}
            <div className="flex flex-col gap-4 col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 text-text-main">
                <div className="w-6 h-6 text-primary">
                  <svg className="w-full h-full" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 4L6 44H42L24 4Z" fill="currentColor"></path>
                  </svg>
                </div>
                <h2 className="text-lg font-bold">Camp 2024</h2>
              </div>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Creating the next generation of leaders through adventure, community, and fun. Join us this summer!
              </p>
            </div>

            {/* Navigation Column */}
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-text-main">Navigation</h4>
              <a href="#" className="text-gray-500 text-sm hover:text-primary transition-colors">Home</a>
              <a href="#" className="text-gray-500 text-sm hover:text-primary transition-colors">About Us</a>
              <a href="#" className="text-gray-500 text-sm hover:text-primary transition-colors">Safety</a>
              <a href="#" className="text-gray-500 text-sm hover:text-primary transition-colors">FAQs</a>
            </div>

            {/* Contact Column */}
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-text-main">Contact</h4>
              <div className="flex items-center gap-2 text-gray-500 text-sm hover:text-primary transition-colors cursor-pointer">
                <Mail size={18} />
                hello@camp2024.com
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm hover:text-primary transition-colors cursor-pointer">
                <Phone size={18} />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm hover:text-primary transition-colors cursor-pointer">
                <MapPin size={18} />
                Camp Lakota, CA
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[#e7f3eb] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-xs">© 2024 Camp Organization. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
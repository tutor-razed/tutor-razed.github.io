
import React from 'react';
import { SECTIONS } from '../constants';

const Header: React.FC = () => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="border-b-4 border-black bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center">
        <div className="flex justify-between items-end border-b border-gray-300 pb-2 mb-4 text-xs font-bold uppercase tracking-widest text-gray-600">
          <span>Edition: Digital</span>
          <span className="text-sm font-serif-display text-gray-900 tracking-normal">Founded in 2025</span>
          <span>{today}</span>
        </div>
        <h1 className="font-serif-display text-6xl md:text-8xl tracking-tighter mb-4 cursor-pointer hover:opacity-80">
          THE DAILY CHRONICLE
        </h1>
        <nav className="border-y border-black py-2 mt-4">
          <ul className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs font-bold uppercase tracking-wider text-gray-800">
            {SECTIONS.map((s) => (
              <li key={s} className="hover:text-red-600 cursor-pointer transition-colors">
                {s}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;

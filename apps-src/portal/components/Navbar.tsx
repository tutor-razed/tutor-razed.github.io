import React, { useState } from "react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="glass-morphism fixed w-full z-50 border-b border-white/20 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-2xl">TR</span>
            </div>
            <span className="text-2xl font-black tracking-tight text-indigo-900">
              Tutor Razed
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            <a
              href="#/"
              className="text-indigo-900 hover:text-pink-500 font-bold text-lg transition-colors"
            >
              Start Here
            </a>
            <a
              href="#/resources"
              className="text-indigo-900 hover:text-pink-500 font-bold text-lg transition-colors"
            >
              Fun Library
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-indigo-900 p-2"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 p-6 space-y-6">
          <a href="#/" className="block text-indigo-900 font-bold text-xl">
            Start Here
          </a>
          <a
            href="#/resources"
            className="block text-indigo-900 font-bold text-xl"
          >
            Fun Library
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import React, { useState } from 'react';
import logo from '../assets/logo.svg';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white text-white py-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 flex justify-between items-center">
          <div className="logo flex items-center gap-3">
            <img src="/src/assets/logo.svg" alt="Buskrz" className="h-20 w-auto" />
    
          </div>
          
          {/* Burger Menu Button */}
          <button
            onClick={toggleMenu}
            className="xl:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
            aria-label="Ouvrir le menu"
          >
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden xl:block">
            <ul className="flex list-none m-0 p-0 gap-6">
              <li>
                <a 
                  href="#accueil" 
                  className="text-[#CE5526] text-m no-underline font-medium transition-colors duration-300 hover:text-blue-400"
                >
                  Accueil
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  className="text-[#CE5526] text-m no-underline font-medium transition-colors duration-300 hover:text-blue-400"
                >
                  Se connecter
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  className="text-[#CE5526] text-m no-underline font-medium transition-colors duration-300 hover:text-blue-400"
                >
                  S'inscrire
                </a>
              </li>
              <li>
                <a 
                  href="#MesConcerts" 
                  className="text-[#CE5526] text-m no-underline font-medium transition-colors duration-300 hover:text-blue-400"
                >
                  Mes concerts
                </a>
              </li>
              <li>
                <a 
                  href="#AddLieu" 
                  className="text-[#CE5526] text-m no-underline font-medium transition-colors duration-300 hover:text-blue-400"
                >
                  Ajouter un lieu
                </a>
              </li>
              <li>
                <a 
                  href="#addConcert"
                  className="text-[#CE5526] text-m no-underline font-medium transition-colors duration-300 hover:text-blue-400"
                >
                  Ajouter un concert
                </a>
              </li>
              
            </ul>
          </nav>
        </div>
      </header>

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-40 xl:hidden"
          onClick={closeMenu}
        ></div>
      )}

      {/* Slide Menu */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white text-black shadow-2xl z-50 transform transition-transform duration-300 ease-in-out xl:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8">
          {/* Close Button */}
          <div className="flex justify-end mb-8">
            <button
              onClick={closeMenu}
              className="text-white hover:text-blue-400 transition-colors duration-300"
              aria-label="Fermer le menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu Links */}
          <nav>
            <ul className="space-y-6">
              <li>
                <a 
                  href="#accueil" 
                  onClick={closeMenu}
                  className="block text-left text-black text-xl font-medium no-underline transition-colors duration-300 hover:text-[#CE5526] py-2"
                >
                  Accueil
                </a>
              </li>
              <li>
                <a 
                  href="#services" 
                  onClick={closeMenu}
                  className="block text-left text-black text-xl font-medium no-underline transition-colors duration-300 hover:text-[#CE5526] py-2"
                >
                  Se connecter
                </a>
              </li>
              <li>
                <a 
                  href="#contact" 
                  onClick={closeMenu}
                  className="block text-left text-black text-xl font-medium no-underline transition-colors duration-300 hover:text-[#CE5526] py-2"
                >
                  S'inscrire
                </a>
              </li>
              <li>
                <a 
                  href="#MesConcerts" 
                  onClick={closeMenu}
                  className="block text-left text-black text-xl font-medium no-underline transition-colors duration-300 hover:text-[#CE5526] py-2"
                >
                  Mes concerts
                </a>
              </li>
              <li>
                <a 
                  href="#AddLieu" 
                  onClick={closeMenu}
                  className="block text-left text-black text-xl font-medium no-underline transition-colors duration-300 hover:text-[#CE5526] py-2"
                >
                  Ajouter un lieu
                </a>
              </li>
              <li>
                <a 
                  href="#addConcert"
                  onClick={closeMenu}
                  className="block text-left text-black text-xl font-medium no-underline transition-colors duration-300 hover:text-[#CE5526] py-2"
                >
                  Ajouter un concert
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;

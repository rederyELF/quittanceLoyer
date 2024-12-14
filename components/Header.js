import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import { FiUser, FiLogOut, FiMenu, FiX, FiSettings, FiGrid } from 'react-icons/fi';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useAuth();

  // Gestion du clic en dehors du dropdown pour le fermer
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Erreur de déconnexion:', error);
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo et titre */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center">
              <Image 
                src="/icons/logo-icon.svg"
                width={32}
                height={32}
                alt="Logo"
                className="text-blue-600"
              />
              <h1 className="ml-2 text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
                Générateur de Quittances
              </h1>
            </Link>
          </div>

          {/* Navigation et Auth */}
          <div className="flex items-center gap-6">
            {/* Menu principal */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/guide" className="text-gray-600 hover:text-gray-900">
                Guide
              </Link>
              <Link href="/history" className="text-gray-600 hover:text-gray-900">
                Historique
              </Link>
            </nav>

            {/* Auth Section */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <FiUser className="w-5 h-5" />
                  <span>Mon compte</span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    onMouseLeave={() => setIsDropdownOpen(false)}
                    className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                  >
                    <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                      {user.email}
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FiGrid className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FiSettings className="w-4 h-4" />
                      Profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Connexion
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Inscription
                </Link>
              </div>
            )}

            {/* Menu mobile */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile déroulant */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <Link
                href="/guide"
                className="text-gray-600 hover:text-gray-900 px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Guide
              </Link>
              <Link
                href="/history"
                className="text-gray-600 hover:text-gray-900 px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Historique
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 
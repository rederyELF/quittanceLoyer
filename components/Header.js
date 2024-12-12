import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Bannière d'information */}
      <div className="bg-blue-600 text-white px-4 py-2 text-center text-sm">
        <p>
          🎉 Nouveau : Générez plusieurs quittances en une seule fois ! 
          <button className="ml-2 underline hover:text-blue-100">En savoir plus</button>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo et titre */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Image 
                src="/icons/logo-icon.svg"
                width={32}
                height={32}
                alt="Logo"
                className="text-blue-600 [&>path]:stroke-blue-600"
                style={{ color: '#2563eb' }}
              />
              <Link href="/" className="ml-2">
                <h1 className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
                  Générateur de Quittances
                </h1>
              </Link>
            </div>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Accueil
            </Link>
            <Link 
              href="/guide"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Guide d&apos;utilisation
            </Link>
            <Link 
              href="/legal"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Mentions légales
            </Link>
            <a 
              href="https://github.com/rubenedery"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span className="flex items-center">
                <svg className="h-5 w-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd"/>
                </svg>
                GitHub
              </span>
            </a>
            <a 
              href="https://www.buymeacoffee.com/rubenEDE"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              ☕️ Buy me a coffee
            </a>
          </nav>

          {/* Bouton menu mobile */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg 
              className="h-6 w-6 text-gray-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Accueil
              </Link>
              <Link 
                href="/guide"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Guide d&apos;utilisation
              </Link>
              <Link 
                href="/legal"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Mentions légales
              </Link>
              <a 
                href="https://github.com/rubenedery"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                GitHub
              </a>
              <a 
                href="https://www.buymeacoffee.com/rubenEDE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                ☕️ Buy me a coffee
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 
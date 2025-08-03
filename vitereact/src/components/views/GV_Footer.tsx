import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/main';

const GV_Footer: React.FC = () => {
  const selectedLanguage = useAppStore(state => state.selected_language);
  const setSelectedLanguage = useAppStore(state => state.updateLanguage);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
  };

  return (
    <footer className="bg-gray-800 text-gray-300 py-6 px-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link to="/about" className="hover:underline">About</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">Contact</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:underline">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
              </li>
            </ul>
          </nav>
        </div>
        
        <div className="mb-4 md:mb-0">
          <select 
            value={selectedLanguage} 
            onChange={handleLanguageChange} 
            className="bg-gray-900 text-gray-300 border-none p-2 rounded-md"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
        
        <div>
          <ul className="flex space-x-4">
            <li>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg className="w-6 h-6 fill-current text-gray-300" viewBox="0 0 24 24">
                  {/* Sample Icon Path */}
                  <path d="..."/>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg className="w-6 h-6 fill-current text-gray-300" viewBox="0 0 24 24">
                  {/* Sample Icon Path */}
                  <path d="..."/>
                </svg>
              </a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg className="w-6 h-6 fill-current text-gray-300" viewBox="0 0 24 24">
                  {/* Sample Icon Path */}
                  <path d="..."/>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default GV_Footer;
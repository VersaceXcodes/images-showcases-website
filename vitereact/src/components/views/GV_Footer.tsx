import React from 'react';
import { Link } from 'react-router-dom';

const GV_Footer: React.FC = () => {
  return (
    <>
      <footer className="bg-gray-800 text-white py-6 fixed bottom-0 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Navigation and Info Links */}
            <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0">
              <Link to="/about" className="text-sm hover:text-gray-400 mr-4">
                About
              </Link>
              <Link to="/contact" className="text-sm hover:text-gray-400 mr-4">
                Contact Us
              </Link>
              <Link to="/privacy" className="text-sm hover:text-gray-400 mr-4">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm hover:text-gray-400">
                Terms of Service
              </Link>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a href="https://twitter.com" aria-label="Twitter" className="hover:text-gray-400">
                <svg className="w-5 h-5 fill-current" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M459.4 151.7c.3 2.8.3 5.7.3 8.6 0 87.8-66.8 188.8-188.8 188.8-37.4 0-72.3-11-101.1-29.6 5.2.6 10.4.9 15.7.9 31 0 59.6-10.5 82.3-28-29-.5-54.6-19.7-63.2-46 4.1.8 8.3 1.3 12.5 1.3 6.1 0 12-.8 17.7-2.3-30.2-6.1-52.8-32.8-52.8-64.8v-.8c8.9 5 19.1 8.1 29.9 8.4-17.8-12-29.7-32.4-29.7-55.5 0-12.3 3.3-23.8 9-33.8 32.4 39.9 81 66.1 135.7 69-1.1-4.9-1.7-10.1-1.7-15.3 0-37.5 30.4-68 68-68 19.6 0 37.2 8.3 49.6 21.8 15.5-3 30-8.7 43.1-16.5-5.1 15.8-15.8 29-29.8 37.4 13.8-1.7 26.8-5.3 39-10.7-9.3 13.3-21.2 25-34.8 34.3z"></path>
                </svg>
              </a>
              <a href="https://facebook.com" aria-label="Facebook" className="hover:text-gray-400">
                <svg className="w-5 h-5 fill-current" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.5 91 225.8 210 240.3V327h-63v-71H218v-55.3c0-62.3 37-96.5 93.6-96.5 27.1 0 55.6 4.9 55.6 4.9v61h-31.3c-30.8 0-40.3 19.1-40.3 39.6V256h68.6l-11 71H296v169.3C415 481.8 504 379.5 504 256z"></path>
                </svg>
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className="hover:text-gray-400">
                <svg className="w-5 h-5 fill-current" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="instagram" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M224.1 141c-63.6 0-114.9 51.7-114.9 115 0 37 16.3 66.7 41.5 88.8 7.3 6.5 7 17.9-.5 24.4-12.8 12-29.3 24.8-46.1 35.3-6.7 5-16.5 4.1-22.6-2.9-14.6-16.1-26.9-47.9-30.1-49.7-.3-.2-.2-8.3-2.1-28.1-4.1-41.8 15.4-81.7 46-110.3C126.7 147.3 174.8 128 224.1 128h.6c16.8 0 33.1 2.6 48.5 7.7 31.9 8.3 61.8 26 110.5 69.8-4.9-5.3-13.1-13.1-33.2-33-16.4-16.2-20.7-12-20.7-12-10.5-53-20.3-83-28.6-98.3-13.3-23.9-38.4-16.4-46.6-13.5l-63.9 1.3c-1.4 10.5-17.8 7.6-29.4 9.2-11.9 1.6-21.3 10.5-20.1 47.1 0 0 26.6 3.1 29.4-28.6 0 4 .3 10.4.7 13.8 0 1.3-.4-13.6 19.6-1.4C30.7 221.8 224.1 309.4 224.1 141z"></path>
                </svg>
              </a>
            </div>

          </div>
        </div>
      </footer>
    </>
  );
};

export default GV_Footer;
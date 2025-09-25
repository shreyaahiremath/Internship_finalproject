
'use client';

import Poll from '../../components/Poll';
import { useState, useEffect } from 'react';
import { Sun, Moon, Globe } from 'lucide-react';

interface PollPageProps {
  searchParams: { headline?: string; details?: string; image?: string };
}

// Navbar component
const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState('EN');

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  return (
    <nav className="bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6 text-white dark:text-gray-200">
            <a href="/" className="font-bold text-lg hover:text-blue-300 transition-colors">Faithpolls</a>
          </div>
          <div className="flex items-center space-x-4 text-white">
            <div className="relative">
              <button className="flex items-center gap-1 hover:text-blue-300 transition-colors">
                <Globe size={18} />
                <span>{language}</span>
              </button>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Poll Page
export default function PollPage({ searchParams }: PollPageProps) {
  const { headline, details, image } = searchParams;

  if (!headline || !details) {
    return (
      <div className="dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <Navbar />
        <p className="text-white text-center text-lg mt-10">
          No news selected. Please go back and select an article.
        </p>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-900 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          🗳 Faith Poll
        </h1>
        <Poll headline={headline} details={details} image={image} />
      </main>
    </div>
  );
}

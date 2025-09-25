


'use client'

import { useState, useEffect, useRef } from 'react'
import { Sun, Moon, Globe, Info, MessageSquare, PieChart, ChevronDown } from 'lucide-react'
import Link from 'next/link';

// --- Translation dictionary for navbar text ---
const translations: { [key: string]: { [key: string]: string } } = {
  en: { home: 'Home', polls: 'Polls', communityVoices: 'Community Voices', aboutUs: 'About Us' },
  es: { home: 'Inicio', polls: 'Encuestas', communityVoices: 'Voces de la Comunidad', aboutUs: 'Sobre Nosotros' },
  hi: { home: 'होम', polls: 'पोल', communityVoices: 'सामुदायिक आवाजें', aboutUs: 'हमारे बारे में' }
}

// --- Religion to Languages mapping ---
const religionLanguages: { [key: string]: string[] } = {
  "🙏 Hinduism": ["Hindi", "English"],
  "☪️ Islam": ["Urdu", "Arabic", "English"],
  "✝️ Christianity": ["English", "Spanish", "French"],
  "🪯 Sikhism": ["Punjabi", "English"],
  "☸️ Buddhism": ["Tibetan", "Pali", "English"],
  "🕉️ Jainism": ["Gujarati", "Hindi", "English"],
  "🌍 Other": ["English"]
}

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedReligion, setSelectedReligion] = useState("🙏 Hinduism")
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Set initial dark mode
  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && prefersDark)) {
      document.documentElement.classList.add('dark')
      setIsDarkMode(true)
    } else {
      document.documentElement.classList.remove('dark')
      setIsDarkMode(false)
    }
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Dark mode toggle
  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDarkMode(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDarkMode(true)
    }
  }

  return (
    <nav className="bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Left side: Links */}
          <div className="flex items-center space-x-6 text-white dark:text-gray-200">
            <a href="#" className="font-bold text-lg hover:text-blue-300 dark:hover:text-blue-400 transition-colors">Faithpolls</a>
            <div className="hidden md:flex items-center space-x-4">
              <a href="#" className="hover:text-blue-300 dark:hover:text-blue-400 transition-colors">{translations['en'].home}</a>
              <a href="#" className="flex items-center gap-1 hover:text-blue-300 dark:hover:text-blue-400 transition-colors">
                <PieChart size={16} /> {translations['en'].polls}
              </a>
              <a href="#" className="flex items-center gap-1 hover:text-blue-300 dark:hover:text-blue-400 transition-colors">
                <MessageSquare size={16} /> {translations['en'].communityVoices}
              </a>
              <Link
  href="/about-us"
  className="flex items-center gap-1 hover:text-blue-300 dark:hover:text-blue-400 transition-colors"
>
  <Info size={16} /> About Us
</Link>

            </div>
          </div>

          {/* Right side: Religion + Language + Dark Mode */}
          <div className="flex items-center space-x-4 text-white dark:text-gray-200">

            {/* Religion + Language Dropdown */}
            <div className="flex items-center space-x-2">
              <select
                value={selectedReligion}
                onChange={(e) => {
                  setSelectedReligion(e.target.value)
                  setSelectedLanguage(religionLanguages[e.target.value][0])
                }}
                className="bg-white/20 dark:bg-gray-700 text-white px-2 py-1 rounded-md"
              >
                {Object.keys(religionLanguages).map((religion) => (
                  <option key={religion} value={religion}>{religion}</option>
                ))}
              </select>

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-white/20 dark:bg-gray-700 text-white px-2 py-1 rounded-md"
              >
                {religionLanguages[selectedReligion].map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-700/40 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

        </div>
      </div>
    </nav>
  )
}


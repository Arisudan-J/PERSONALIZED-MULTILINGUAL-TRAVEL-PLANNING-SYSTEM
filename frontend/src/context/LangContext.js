import React, { createContext, useContext, useState } from 'react';
import en from '../translations/en.json';
import ta from '../translations/ta.json';
import hi from '../translations/hi.json';

const LangContext = createContext();
const translations = { en, ta, hi };

export const LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi',   nativeLabel: 'हिंदी',   flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil',   nativeLabel: 'தமிழ்',   flag: '🌟' },
];

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('swadeshi_lang') || 'en');

  const t = (key) => {
    const keys = key.split('.');
    let val = translations[lang];
    for (const k of keys) val = val && val[k];
    return val || key;
  };

  const switchLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('swadeshi_lang', newLang);
  };

  const currentLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <LangContext.Provider value={{ lang, t, switchLang, currentLang, LANGUAGES }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);

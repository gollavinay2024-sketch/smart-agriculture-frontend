import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('smart_agri_lang') || 'en';
  });

  const [activeResult, setActiveResult] = useState(() => {
    try {
      const saved = sessionStorage.getItem('smart_agri_active_result');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('smart_agri_lang', lang);
  };

  const updateActiveResult = (result) => {
    setActiveResult(result);
    if (result) {
      sessionStorage.setItem('smart_agri_active_result', JSON.stringify(result));
    } else {
      sessionStorage.removeItem('smart_agri_active_result');
    }
  };

  // Translation helper
  const t = (path) => {
    const keys = path.split('.');
    let curr = translations[language] || translations.en;
    for (const key of keys) {
      if (curr && curr[key] !== undefined) {
        curr = curr[key];
      } else {
        // Fallback to English
        let fallback = translations.en;
        for (const fbKey of keys) {
          if (fallback && fallback[fbKey] !== undefined) {
            fallback = fallback[fbKey];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return curr;
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      t,
      activeResult,
      setActiveResult: updateActiveResult
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "./translation/en.json"
import ar from "./translation/ar.json"

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    ar: {
      translation: ar,
    },
  },
  lng: "ar", // Default language
  fallbackLng: "ar",
  interpolation: {
    escapeValue: false, // React already escapes values by default
  },
})

export default i18n
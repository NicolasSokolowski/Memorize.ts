import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18next
  .use(initReactI18next)
  .use(HttpApi)
  .use(LanguageDetector)
  .init({
    fallbackLng: "en",
    ns: ["common", "home", "auth", "training", "deck", "card", "errors"],
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json"
    },
    detection: {
      order: ["localStorage", "cookie", "navigator"],
      caches: ["localStorage"]
    },
    supportedLngs: ["en", "fr"],
    interpolation: {
      escapeValue: false
    }
  })
  .then(() => {
    const lang = i18next.language;
    const supported = i18next.options.supportedLngs;

    if (supported && Array.isArray(supported) && !supported.includes(lang)) {
      i18next.changeLanguage("en");
    }
  });

export default i18next;

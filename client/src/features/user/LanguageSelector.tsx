import i18next from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function LanguageSelector() {
  const [language, setLanguage] = useState(i18next.language);
  const { t } = useTranslation("common");

  useEffect(() => {
    i18next.changeLanguage(language);
  }, [language]);

  return (
    <div className="flex justify-center lg:justify-start">
      <div className="relative mb-20 flex h-16 w-96 font-patua text-xl text-textPrimary lg:ml-20">
        <div className="flex w-1/3 items-center justify-center">
          <label htmlFor="language">{t("language")}</label>
        </div>
        <div className="flex w-2/3 justify-end">
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="flex w-full appearance-none rounded-md bg-secondary text-center text-white shadow-custom-light focus:outline-none"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default LanguageSelector;

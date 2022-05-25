import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './locales/resources.js';

const initLocalisation = (defaultLanguage) => {
  i18next
    .use(initReactI18next)
    .init({
      resources,
      lng: defaultLanguage,
      interpolation: {
        escapeValue: false,
      },
    });
};

export { initLocalisation };
export default i18next;

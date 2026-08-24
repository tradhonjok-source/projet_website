import fr from '../messages/fr.json';
import en from '../messages/en.json';

export const translations = {
  fr,
  en
} as const;

export type Locale = 'fr' | 'en';

export function getTranslations(locale: Locale) {
  return translations[locale];
}

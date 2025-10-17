import { STRINGS } from './strings';

export const createT = (language) => (key, params) => {
  let text = STRINGS[language]?.[key];
  if (!text) return key;
  if (params) {
    for (const p in params) {
      text = text.replace(new RegExp(`{{${p}}}`, 'g'), String(params[p]));
    }
  }
  return text;
};

// src/redux/language/language.actions.js

export const setLanguage = (lang, translations) => ({
  type: 'SET_LANGUAGE',
  payload: { lang, translations }
});

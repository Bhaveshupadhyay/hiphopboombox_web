// src/redux/language/language.reducer.js

const initialState = {
  currentLang: 'en',
  translations: {}
};

const languageReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return {
        ...state,
        currentLang: action.payload.lang,
        translations: action.payload.translations
      };
    default:
      return state;
  }
};

export default languageReducer;
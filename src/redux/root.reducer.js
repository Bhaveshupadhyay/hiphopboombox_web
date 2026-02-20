import { combineReducers } from 'redux';

import languageReducer from './language/language.reducer';

import userReducer from './user/user.reducer';

export default combineReducers({
	lang: languageReducer,
	user: userReducer,
});
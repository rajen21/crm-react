import { combineReducers } from '@reduxjs/toolkit';
import navbarReducer from './navbar/store';

const reducer = combineReducers({
    navbarReducer,
});

export default reducer;
import { combineReducers } from '@reduxjs/toolkit';
import homeReducer from './home/sotre';
import regReducer from './regisration/store';
import profileReducer from './profile/store';

const reducer = combineReducers({
    homeReducer,
    regReducer,
    profileReducer,
});

export default reducer;
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import componentStore from '../components/store';
import containerStore from '../containers/store';

const reducer = combineReducers({
    containerStore,
    componentStore
});

export const store = configureStore({reducer})
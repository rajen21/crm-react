import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    userLogoutData: {
        isUserLogedout: false,
        logoutLoading: false,
        logoutError: null,
    },
    isLoading: false,
    error: null,
};


export const userLogout = createAsyncThunk('navbar/userLogout', async () => {
    const response = await fetch('http://localhost:8080/user/logout', {
        method: 'GET',
    });
    const res = await response.json();
    return res;
});

const navSlice = createSlice({
    name: 'navbar',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(userLogout.pending, (state, action) => {
            state.userLogoutData.logoutLoading = true;
        });
        builder.addCase(userLogout.fulfilled, (state, action) => {
            state.userLogoutData.logoutLoading = false;
            state.userLogoutData.isUserLogedout = action.payload.status;
            state.userLogoutData.logoutError = null;
        });
        builder.addCase(userLogout.rejected, (state, action) => {
            state.userLogoutData.logoutLoading = false;
            state.userLogoutData.logoutError = `Error`;
        });
    }
});

export const logoutData = (state) => state?.componentStore?.navbarReducer?.userLogoutData

export default navSlice.reducer;
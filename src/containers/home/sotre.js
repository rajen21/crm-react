import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    adjacentData: {
        isDataLoading: false,
        listData: [],
        dataError: null,
    },
    userData: {
        first_name: '',
        last_name: '',
        email: '',
        age: 0,
        active: false,
        id: '',
        adminID: [],
        agentID: '',
        adminID: '',
        agentID: '',
        role: '',
        isUserLoding: false,
        userError: null,
    },
    isLoading: false,
    error: null,
};

export const fetchUserLoggedin = createAsyncThunk('home/fetchUserLoggedin', async (url) => {
    const response = await fetch(`http://localhost:8080/user${url}`, { method: 'GET' })
    const data = await response.json();
    return data;
});

export const getAdjacentData = createAsyncThunk('home/getAdjecentData', async (url) => {
    const response = await fetch(`http://localhost:8080/user${url}`, {
        method: 'GET',
    });
    const data = await response.json();
    return data;
});

const homeSlice = createSlice({
    name: 'home',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchUserLoggedin.pending, (state, action) => {
            state.userData.isUserLoding = true;
        });
        builder.addCase(fetchUserLoggedin.fulfilled, (state, action) => {
            state.userData.isUserLoding = false;
            state.userData.first_name = action.payload.first_name;
            state.userData.last_name = action.payload.last_name;
            state.userData.active = action.payload.active;
            state.userData.age = action.payload.age;
            state.userData.email = action.payload.email;
            state.userData.id = action.payload.id;
            state.userData.adminID = action.payload.adminID;
            state.userData.agentID = action.payload.agentID;
            state.userData.role = action.payload.role;
            state.userData.userError = null;
        });
        builder.addCase(fetchUserLoggedin.rejected, (state, action) => {
            state.userData.isUserLoding = false;
            state.userData.userError = 'Error';
        });
        builder.addCase(getAdjacentData.pending, (state, action) => {
            state.adjacentData.isDataLoading = true;
        });
        builder.addCase(getAdjacentData.fulfilled, (state, action) => {
            state.adjacentData.isDataLoading = false;
            state.adjacentData.listData = action.payload;
            state.adjacentData.dataError = null;
        });
        builder.addCase(getAdjacentData.rejected, (state, action) => {
            state.adjacentData.isDataLoading = false;
            state.adjacentData.dataError = `Error`;
        });
    }
});

export const adjacentData = (state) => state?.containerStore?.homeReducer?.adjacentData;
export const loggedinUserData = (state) => state?.containerStore?.homeReducer?.userData;

export default homeSlice.reducer;

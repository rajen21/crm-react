import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    userData: {
        first_name: '',
        last_name: '',
        email: '',
        age: 0,
        active: null,
        id: '',
        adminID: [],
        agentID: '',
        role: '',
        isUserLoding: null,
        userError: null,
    },
    adjacentData: {
        isDataLoading: null,
        listData: [],
        dataError: null,
    },
    deletedUser: {
        deleteLoading: null,
        isUserDeleted: null,
        deleteError: null
    },
    isLoading: null,
    error: null,
};

export const getUserData = createAsyncThunk('profile/getUserData', async (id) => {
    const req = await fetch(`http://localhost:8080/user/${id}`, { method: 'GET' });
    const res = await req.json();
    return res;
});

export const getAdjacentData = createAsyncThunk('profile/getAdjecentData', async (url) => {
    const response = await fetch(`http://localhost:8080/user${url}`, {
        method: 'GET',
    });
    const data = await response.json();
    return data;
});

export const onDeleteUser = createAsyncThunk('profile/onDeleteUser', async (id) => {
    const req = await fetch(`http://localhost:8080/user/${id}`, {
        method: 'DELETE',
    });
    const res = await req.json();
    return res;
});

export const onDeleteUserAdjacentData = createAsyncThunk('profile/onDeleteUserAdjacentData', async (qry) => {
    const req = await fetch(`http://localhost:8080/user${qry}`, {
        method: 'DELETE',
    });
    const res = await req.json();
    return res;
});

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getUserData.pending, (state, action) => {
            state.userData.isUserLoding = true;
        });
        builder.addCase(getUserData.fulfilled, (state, action) => {
            state.userData.isUserLoding = false;
            state.userData.id = action.payload.id;
            state.userData.email = action.payload.email;
            state.userData.first_name = action.payload.first_name;
            state.userData.last_name = action.payload.last_name;
            state.userData.age = action.payload.age;
            state.userData.active = action.payload.active;
            state.userData.adminID = action.payload.adminID;
            state.userData.agentID = action.payload.agentID;
            state.userData.role = action.payload.role;
            state.userData.userError = null;
        });
        builder.addCase(getUserData.rejected, (state, action) => {
            state.userData.isUserLoding = false;
            state.userData.userError = `Error`;
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
        builder.addCase(onDeleteUser.pending, (state, action) => {
            state.deletedUser.deleteLoading = true;
        });
        builder.addCase(onDeleteUser.fulfilled, (state, action) => {
            state.deletedUser.deleteLoading = false;
            state.deletedUser.isUserDeleted = action.payload;
            state.deletedUser.deleteError = null;
        });
        builder.addCase(onDeleteUser.rejected, (state, action) => {
            state.deletedUser.deleteLoading = false;
            state.deletedUser.deleteError = `Error`;
        });
    }
});

export const adjacentData = (state) => state?.containerStore?.profileReducer?.adjacentData;
export const profileUserData = (state) => state?.containerStore?.profileReducer?.userData;
export const userDeletedData = (state) => state?.containerStore?.profileReducer?.deletedUser;

export default profileSlice.reducer
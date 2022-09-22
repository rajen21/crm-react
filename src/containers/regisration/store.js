import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    roles: {
        isRoleLoading: null,
        roleResult: [],
        roleError: null,
    },
    isLoading: null,
    error: null,
};

export const getRoles = createAsyncThunk('registration/getRoles', async () => {
    const response = await fetch('http://localhost:8080/role', { 
        method: 'GET',
     });
    const data = await response.json();
    return data;
});

const regiSlice = createSlice({
    name: 'registration',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(getRoles.pending, (state, action) => {
            state.roles.isRoleLoading = true;
        });
        builder.addCase(getRoles.fulfilled, (state, action) => {
            state.roles.isRoleLoading = false;
            state.roles.roleResult = action.payload;
            state.roles.roleError = null;
        });
        builder.addCase(getRoles.rejected, (state, action) => {
            state.roles.roleError = `error occured in getting data`;
        });
    }
});

export const rolesData = (state) => state?.containerStore?.regReducer?.roles;

export default regiSlice.reducer;

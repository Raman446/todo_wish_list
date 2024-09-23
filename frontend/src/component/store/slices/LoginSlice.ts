import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    _id: string | null,
    userName: string | null,
    type: string | null
}

const initialState: UserState = {
    _id: null,
    userName: null,
    type: null
}

const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<UserState>) => {

            state._id = action.payload._id;
            state.userName = action.payload.userName;
            state.type = action.payload.type;
        },
        logout: (state) => {
            state._id = null;
            state.userName = null;
            state.type = null;
        }
    }
})



export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
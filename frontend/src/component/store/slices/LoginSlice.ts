import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState{
    _id: string | null,
    userName: string | null
}

const initialState: UserState ={
    _id: null,
    userName: null
}

const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<UserState>) =>{
            // console.log("kkkkk", action.payload)
            
            state._id = action.payload._id;
            state.userName = action.payload.userName;

            // console.log("ooooooo", state.userName)
        },
        logout: (state)=>{
            state._id = null;
            state.userName = null;
        }
    }
})



export const {login, logout} = userSlice.actions;
export default userSlice.reducer;
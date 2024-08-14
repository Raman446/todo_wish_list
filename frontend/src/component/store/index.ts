import { configureStore } from "@reduxjs/toolkit";
import LoginSlice from "./slices/LoginSlice";

const store = configureStore({
    reducer: {
        userSlice: LoginSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
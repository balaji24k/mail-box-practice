import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./AuthSlice";

const ReduxStore = configureStore({
    reducer : {
        auth : authSlice.reducer
    }
})

export default ReduxStore;
import {configureStore} from '@reduxjs/toolkit';
import themeReducer from "./Slice/ThemeSlice";

const store = configureStore({
    reducer : {
        themes: themeReducer,
    }
})

export default store;
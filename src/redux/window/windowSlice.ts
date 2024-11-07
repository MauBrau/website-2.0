import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Define a type for the slice state
interface WindowState {
    height: string;
    width: string;
}

// Define the initial state using that type
const initialState: WindowState = {
    height: '0px',
    width: '0px'
};

export const windowSlice = createSlice({
    name: "window",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // // Use the PayloadAction type to declare the contents of `action.payload`
        updateWindow: (state, action: PayloadAction<{height: string, width: string}>) => {
          state.height = action.payload.height;
          state.width = action.payload.width;
        },
    },
});

export const { updateWindow } = windowSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectWindowHeight = (state: RootState) => state.window.height;
export const selectWindowWidth = (state: RootState) => state.window.width;

export default windowSlice.reducer;

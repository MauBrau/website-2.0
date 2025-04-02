import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Define a type for the slice state
interface WindowState {
    isDesktop: boolean;
}

// Define the initial state using that type
const initialState: WindowState = {
    isDesktop: true
};

export const windowStatusSlice = createSlice({
    name: "windowStatus",
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        updateWindow: (state, action: PayloadAction<{isDesktop: boolean}>) => {
          state.isDesktop = action.payload.isDesktop;
        },
    },
});

export const { updateWindow } = windowStatusSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectWindowStatusIsDesktop = (state: RootState) => state.window.isDesktop;

export default windowStatusSlice.reducer;

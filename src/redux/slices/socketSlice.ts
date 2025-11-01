import { createSlice } from "@reduxjs/toolkit";
import type { SocketState } from "../../types/type";

const initialState: SocketState = {
  connected: false,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
  },
});


export const { setConnected } = socketSlice.actions;
export default socketSlice.reducer;

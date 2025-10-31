import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  id: string | null;
  username: string | null;
  email: string | null;
  role: string | null;
}

const initialState: AuthState = {
  id: null,
  username: null,
  email: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    addAuth: (
      state,
      action: PayloadAction<{ username: string; email: string; role: string; id: string }>
    ) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.id = action.payload.id;
    },
    removeAuth: (state) => {
      state.username = null;
      state.email = null;
      state.role = null;
      state.id = null;
    },
  },
});

export const { addAuth, removeAuth } = authSlice.actions;
export default authSlice.reducer;

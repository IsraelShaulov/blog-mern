import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  error: null,
  loading: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateProfileImageSuccess: (state, action) => {
      if (state.currentUser) {
        state.currentUser.profilePicture = action.payload;
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  updateProfileImageSuccess,
} = userSlice.actions;

export default userSlice.reducer;

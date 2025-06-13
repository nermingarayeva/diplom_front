import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accounts: [],
};

const accountSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    setAccounts(state, action) {
      state.accounts = action.payload;
    },
    addAccount(state, action) {
      state.accounts.push(action.payload);
    },
    removeAccount(state, action) {
      state.accounts = state.accounts.filter(account => account._id !== action.payload);
    }
  }
});

export const { setAccounts, addAccount, removeAccount } = accountSlice.actions;
export default accountSlice.reducer;

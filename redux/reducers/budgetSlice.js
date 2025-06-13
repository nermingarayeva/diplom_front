import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  budgets: [],
};

const budgetSlice = createSlice({
  name: "budgets",
  initialState,
  reducers: {
    setBudgets(state, action) {
      state.budgets = action.payload;
    },
    addBudget(state, action) {
      state.budgets.push(action.payload);
    },
    removeBudget(state, action) {
      state.budgets = state.budgets.filter(b => b._id !== action.payload);
    }
  }
});

export const { setBudgets, addBudget, removeBudget } = budgetSlice.actions;
export default budgetSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  goals: [],
};

const goalSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    setGoals(state, action) {
      state.goals = action.payload;
    },
    addGoal(state, action) {
      state.goals.push(action.payload);
    },
    removeGoal(state, action) {
      state.goals = state.goals.filter(goal => goal._id !== action.payload);
    }
  }
});

export const { setGoals, addGoal, removeGoal } = goalSlice.actions;
export default goalSlice.reducer;

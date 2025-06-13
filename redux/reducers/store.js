import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/userSlice";
import accountReducer from "../reducers/accountSlice";
import transactionReducer from "../reducers/transactionSlice";
import budgetReducer from "../reducers/budgetSlice";
import goalReducer from "../reducers/goalSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    accounts: accountReducer,
    transactions: transactionReducer,
    budgets: budgetReducer,
    goals: goalReducer,
  },
});

export default store;

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import Accounts from "../pages/Accounts";
import Home from "../pages/Home";
import NotFound from "../components/NotFound";
import Budgets from "../pages/Budgets";
import Goals from "../pages/Goals";
import Transactions from "../pages/Transactions";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/" element={<Home />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/transactions" element={<Transactions/>} />
          <Route path="/budgets" element={<Budgets />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

import React from "react";
import "../css/Header.css";
const Header = () => {
  return (
    <div className="Navbar">
      <div className="logo">
        <h3>easypay</h3>
        <p>digital bank</p>
      </div>
      <div className="nav">
        <a href="/accounts">
          <h5>Accounts</h5>
        </a>
        <a href="/goals">
          <h5>Goals</h5>
        </a>
        <a href="/transactions">
          <h5>Transactions</h5>
        </a>
        <a href="/budgets">
          <h5>Mobile Load & Packages</h5>
        </a>
      </div>
      <button>Create New Account</button>
    </div>
  );
};

export default Header;

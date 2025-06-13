import React from "react";
import "../css/Home.css";
const Home = () => {
  return (
    <div>
      <div className="home">
        <div className="banner">
          <h2>Personal Finance</h2>
          <h4>
            This is our bread and butter: Money has decades of experience
            reporting on everything related to personal finance. Whether you're
            seeking budgeting tips, advice for saving money or ways to pay off
            debt, we've got you covered.
          </h4>
        </div>
        <img src="/jpeg/banner (2).jpg" alt="Banner" />
      </div>
      <div className="services">
        <h1>Services</h1>
        <div className="serv">
          <div>
            <img src="\jpeg\finance-management_15165056.png" alt="" />
            <h4>Making Money</h4>
          </div>
          <div>
            <img src="\jpeg\wallet_18518877.png" alt="" />
            <h4>Saving Money</h4>
          </div>
          <div>
            <img src="\jpeg\budget_3526525.png" alt="" />
            <h4>Budgeting</h4>
          </div>
          <div>
            <img src="\jpeg\strategic-plan_10981732.png" alt="" />
            <h4>Financal Planning</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

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
          <div className="card">
            <img src="\jpeg\finance-management_15165056.png" alt="" />
            <h4>Making Money</h4>
          </div>
          <div className="card">
            <img src="\jpeg\wallet_18518877.png" alt="" />
            <h4>Saving Money</h4>
          </div>
          <div className="card">
            <img src="\jpeg\budget_3526525.png" alt="" />
            <h4>Budgeting</h4>
          </div>
          <div className="card">
            <img src="\jpeg\strategic-plan_10981732.png" alt="" />
            <h4>Financal Planning</h4>
          </div>
        </div>
      </div>
      <div className="basics">
        <div>
          <img src="/jpeg/basic.jpg" alt="" />
        </div>
        <div className="bas">
          <a href="" className="a">
            Financal Basics
          </a>
          <a href="" className="b">
            Ready to take control of your money? Start by taking a deep breath.
            We'll help you get started.
          </a>
        </div>
      </div>
      <div className="b3">
        <h2>The Fidelity perspective</h2>
        <h4>
          <img src="/jpeg/okay.png" alt="" />
          <a href="">Budgeting:</a> Spend less than you earn and prepare for
          emergency costs, like a medical expense or car repair.
        </h4>
        <h4>
          <img src="/jpeg/okay.png" alt="" />
          <a href="">Managing debt:</a> Eliminate high-interest debt, like
          credit cards or private student loans.
        </h4>
        <h4>
          <img src="/jpeg/okay.png" alt="" />
          <a href="">Saving:</a> When saving for retirement, an early start can
          make all the difference. Make the most of your contributions through
          available employer match programs.
        </h4>
      </div>
    </div>
  );
};

export default Home;

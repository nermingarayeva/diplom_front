import React, { useState } from "react";
import "../css/Header.css";

const Header = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Yeni istifadəçi yaradıldı:", formData);
    setShowCreateForm(false);
  };

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
        <a href="/news">
          <h5>News</h5>
        </a>
      </div>
      <button onClick={() => setShowCreateForm(true)}>Create New Account</button>

      {showCreateForm && (
        <div className="modal-form">
          <div className="modal-content">
            <h2>Yeni Hesab Yarat</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="firstName"
                placeholder="Ad"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Soyad"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Şifrə"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Şifrəni təkrar yazın"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <div className="flex space-x-3">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Yarat
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Ləğv et
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;

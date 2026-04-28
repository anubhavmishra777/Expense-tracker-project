
import React, { useState } from "react";
import axios from "axios";

function Login({ setLoggedIn }) {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/login", {
        email: email,
        password: password
      });

      if (res.data.status === "success") {

        // 🔥 Save session
        localStorage.setItem("user", res.data.username || "User");

        console.log("Login Successful!");

        // 🔥 IMPORTANT FIX (DELAY ADDED)
        setTimeout(() => {
          setLoggedIn(true);
        }, 500);  // 👉 0.5 sec delay

      }

    } catch (error) {
      const errorMsg =
        error.response?.data?.detail || "Invalid Email or Password";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Expense Tracker</h2>

        <p style={{ color: "rgb(221, 221, 221)", marginBottom: "20px" }}>
          Welcome back! Please login to your account.
        </p>

        <div className="input-group">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          className="login-btn"
          onClick={login}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p
          className="signup-footer"
          style={{ marginTop: "15px", fontSize: "14px" }}
        >
          <span style={{ color: "#ff416c", cursor: "pointer" }}>
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;

import React, { useState, useEffect } from "react";
import "./App.css";

import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Summary from "./components/Summary";
import Charts from "./components/Charts";
import Login from "./components/Login"; 

function App() {
  const [refresh, setRefresh] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); 


  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setLoggedIn(true);
    }
  }, []);

  const reload = () => setRefresh(!refresh);

  //  Logout function
  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
  };

  return (
    <div className="App">
      {!loggedIn ? (
        // 🔐 Agar user login nahi hai toh sirf ye dikhega
        <div className="login-screen">
            <Login setLoggedIn={setLoggedIn} />
        </div>
      ) : (
        
        <div className="dashboard">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>Expense Tracker</h2>
            <button onClick={handleLogout} style={{ backgroundColor: "#ff4d4d", color: "white", padding: "5px 15px", borderRadius: "5px", cursor: "pointer" }}>
              Logout
            </button>
          </div>

          <div className="card">
            <ExpenseForm reload={reload} />
          </div>

          <div className="card">
            <Summary refresh={refresh} />
          </div>

          <div className="bottom">
            <div className="box">
              <Charts refresh={refresh} />
            </div>

            <div className="box">
              <ExpenseList refresh={refresh} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
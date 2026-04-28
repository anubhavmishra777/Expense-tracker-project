import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/signup", {
        username,
        email,
        password
      });
      alert(res.data.message);
    } catch (error) {
      alert("Signup Fail: " + error.response.data.detail);
    }
  };

  return (
    <div className="card">
      <h2>Signup</h2>
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} /><br/>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} /><br/>
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br/>
      <button onClick={handleSignup}>Create Account</button>
    </div>
  );
}

export default Signup;
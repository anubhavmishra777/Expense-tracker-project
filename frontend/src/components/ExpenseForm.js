
import React, { useState } from "react";
import axios from "axios";

function ExpenseForm({ reload }) {
  const [desc, setDesc] = useState("");
  const [amt, setAmt] = useState("");
  const [date, setDate] = useState("");

  const add = async () => {
    if (!desc || !amt || !date) {
      alert("Fill all fields");
      return;
    }

    await axios.post("http://127.0.0.1:8000/add-expense", {
      description: desc,
      amount: Number(amt),
      date: date
    });

    setDesc("");
    setAmt("");
    setDate("");
    reload();
  };

  return (
    <div>
      <h3>Add Expense</h3>

      <input
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Description"
      />

      <input
        value={amt}
        onChange={(e) => setAmt(e.target.value)}
        placeholder="Amount"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button onClick={add}>Add</button>
    </div>
  );
}

export default ExpenseForm;
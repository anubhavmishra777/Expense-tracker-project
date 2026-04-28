import React, { useEffect, useState } from "react";
import axios from "axios";

function ExpenseList({ refresh }) {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editDesc, setEditDesc] = useState("");
  const [editAmt, setEditAmt] = useState("");

  // 🔹 Fetch Data
  const fetchData = async () => {
    const res = await axios.get("http://127.0.0.1:8000/get-expenses");
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  // 🔴 DELETE
  const handleDelete = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/delete-expense/${id}`);
    fetchData();
  };

  // 🟠 EDIT CLICK
  const handleEdit = (e) => {
    setEditId(e.id);
    setEditDesc(e.description);
    setEditAmt(e.amount);
  };

  // 🟢 UPDATE SAVE
  const handleUpdate = async () => {
    await axios.put(`http://127.0.0.1:8000/update-expense/${editId}`, {
      description: editDesc,
      amount: editAmt
    });

    setEditId(null);
    fetchData();
  };

  return (
    <div className="card">
      <h3>📋 Expense List</h3>

      {data.map((e) => (
        <div className="expense-item" key={e.id}>

          {editId === e.id ? (
            <>
              <input
                value={editDesc}
                onChange={(ev) => setEditDesc(ev.target.value)}
              />

              <input
                value={editAmt}
                onChange={(ev) => setEditAmt(ev.target.value)}
              />

              <button onClick={handleUpdate}>Save</button>
            </>
          ) : (
            <>
              <span>
                {e.description} - ₹{e.amount} ({e.category})
              </span>

              <div>
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(e)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(e.id)}
                >
                  Delete
                </button>
              </div>
            </>
          )}

        </div>
      ))}

    </div>
  );
}

export default ExpenseList;
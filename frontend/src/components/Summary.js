
import React, { useEffect, useState } from "react";
import axios from "axios";

function Summary({ refresh }) {
  const [total, setTotal] = useState(0);
  const [top, setTop] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertColor, setAlertColor] = useState("green");
  const [prediction, setPrediction] = useState(0);
  const [anomaly, setAnomaly] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/get-expenses")
      .then(res => {
        let sum = 0;
        let map = {};
        let dates = [];

        res.data.forEach(e => {
          sum += Number(e.amount);

          map[e.category] = (map[e.category] || 0) + Number(e.amount);

          if (e.date) {
            dates.push(new Date(e.date));
          }
        });

        // 🔹 TOTAL + TOP CATEGORY
        let max = 0, t = "";
        for (let k in map) {
          if (map[k] > max) {
            max = map[k];
            t = k;
          }
        }

        setTotal(sum);
        setTop(t);

        // 🔴 ALERT
        const BUDGET = 5000;

        if (sum > BUDGET) {
          setAlertMsg("🔴 Overspending!");
          setAlertColor("red");
        } else if (sum > BUDGET * 0.8) {
          setAlertMsg("🟠 Near budget");
          setAlertColor("orange");
        } else {
          setAlertMsg("🟢 Safe");
          setAlertColor("green");
        }

        // 📊 PREDICTION
        if (dates.length > 0) {
          const minDate = new Date(Math.min(...dates));
          const maxDate = new Date(Math.max(...dates));

          const diffDays =
            (maxDate - minDate) / (1000 * 60 * 60 * 24) + 1;

          const avgPerDay = sum / diffDays;

          const monthlyPrediction = avgPerDay * 30;

          setPrediction(Math.round(monthlyPrediction));
        }
      });

    // 🔥 ANOMALY CALL
    axios.get("http://127.0.0.1:8000/detect-anomaly")
      .then(res => setAnomaly(res.data.message));

  }, [refresh]);

  return (
  <div className="card">

    <div className="summary-box">
      <div className="summary-item total">
        Total Spending <br /> ₹{total}
      </div>

      <div className="summary-item top-category">
        Top Category <br /> {top}
      </div>
    </div>

    <h3 className="alert" style={{ color: alertColor }}>
      {alertMsg}
    </h3>

    <h3>📊 Expected Monthly: ₹{prediction}</h3>

    <h3>{anomaly}</h3>

  </div>
);
}

export default Summary;
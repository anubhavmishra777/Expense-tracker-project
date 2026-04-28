

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2

app = FastAPI()

# 🔥 CORS FIX (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 PostgreSQL CONNECTION (SAFE WAY)
def get_conn():
    return psycopg2.connect(
        database="expense_db",
        user="postgres",
        password="76076",
        host="localhost",
        port="5432"
    )

# 🔥 CATEGORY FUNCTION
def detect_category(text):
    if not text:
        return "Others"
    text = text.lower()
    if any(w in text for w in ["pizza","burger","food","eat"]):
        return "Food"
    elif any(w in text for w in ["uber","bus","train","travel"]):
        return "Travel"
    elif any(w in text for w in ["shopping","clothes","shirt"]):
        return "Shopping"
    else:
        return "Others"

# =========================
# 🔐 SIGNUP
# =========================
@app.post("/signup")
def signup(data: dict):
    conn = get_conn()
    cur = conn.cursor()

    try:
        cur.execute(
            "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
            (data.get("username"), data.get("email"), data.get("password"))
        )
        conn.commit()
        return {"status": "success"}
    except:
        conn.rollback()
        return {"status": "fail", "message": "User exists"}
    finally:
        cur.close()
        conn.close()

# =========================
# 🔐 LOGIN
# =========================
@app.post("/login")
def login(data: dict):
    conn = get_conn()
    cur = conn.cursor()

    cur.execute(
        "SELECT username FROM users WHERE email=%s AND password=%s",
        (data.get("email"), data.get("password"))
    )

    user = cur.fetchone()

    cur.close()
    conn.close()

    if user:
        return {"status": "success", "username": user[0]}
    else:
        raise HTTPException(status_code=401, detail="Invalid email or password")

# =========================
# ✅ ADD EXPENSE
# =========================
@app.post("/add-expense")
def add_expense(data: dict):
    conn = get_conn()
    cur = conn.cursor()

    category = detect_category(data.get("description"))

    cur.execute(
        "INSERT INTO expenses (description, amount, category, date) VALUES (%s, %s, %s, %s)",
        (data.get("description"), data.get("amount"), category, data.get("date"))
    )

    conn.commit()
    cur.close()
    conn.close()

    return {"message": "Added"}

# =========================
# ✅ GET EXPENSES
# =========================
@app.get("/get-expenses")
def get_expenses():
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("SELECT * FROM expenses ORDER BY id")
    rows = cur.fetchall()

    cur.close()
    conn.close()

    result = []
    for r in rows:
        result.append({
            "id": r[0],
            "description": r[1],
            "amount": r[2],
            "category": r[3],
            "date": str(r[4])
        })
    return result

# =========================
# ✅ DELETE
# =========================
@app.delete("/delete-expense/{id}")
def delete_expense(id: int):
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("DELETE FROM expenses WHERE id=%s", (id,))
    conn.commit()

    cur.close()
    conn.close()

    return {"message": "Deleted"}

# =========================
# ✅ UPDATE
# =========================
@app.put("/update-expense/{id}")
def update_expense(id: int, data: dict):
    conn = get_conn()
    cur = conn.cursor()

    category = detect_category(data.get("description"))

    cur.execute(
        "UPDATE expenses SET description=%s, amount=%s, category=%s WHERE id=%s",
        (data.get("description"), data.get("amount"), category, id)
    )

    conn.commit()
    cur.close()
    conn.close()

    return {"message": "Updated"}

# =========================
# 🔴 BUDGET ALERT
# =========================
@app.get("/check-alert")
def check_alert():
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("SELECT amount FROM expenses")
    data = cur.fetchall()

    cur.close()
    conn.close()

    total = sum([d[0] for d in data])
    BUDGET = 5000

    if total > BUDGET:
        return {"status": "overspending"}
    elif total > BUDGET * 0.8:
        return {"status": "warning"}
    else:
        return {"status": "safe"}

# =========================
# 📊 PREDICTION
# =========================
@app.get("/prediction")
def prediction():
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("SELECT amount FROM expenses")
    data = cur.fetchall()

    cur.close()
    conn.close()

    if not data:
        return {"prediction": 0}

    avg = sum([d[0] for d in data]) / len(data)
    return {"prediction": round(avg * 30)}

# =========================
# ⚠️ ANOMALY
# =========================
@app.get("/detect-anomaly")
def detect_anomaly():
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("SELECT amount FROM expenses")
    data = cur.fetchall()

    cur.close()
    conn.close()

    if len(data) < 2:
        return {"message": "Not enough data"}

    amounts = [d[0] for d in data]
    avg = sum(amounts) / len(amounts)
    last = amounts[-1]

    if last > avg * 2:
        return {"message": "Unusual spending!"}
    else:
        return {"message": "Normal"}
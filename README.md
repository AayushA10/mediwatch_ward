# 🏥 MediWatch – Ward Occupancy Dashboard

MediWatch is a full-stack ward occupancy monitoring system designed to help hospitals manage patient admissions, discharges, ICU load, and real-time bed usage using an intuitive dashboard interface.


---

## 🚀 Features

- 🔹 **Admit Patient Form** – Add new patients with name, ward, and ICU status
- 🔁 **Discharge Patients** – Update discharge status with a single click
- 🔍 **Search & Filter** – Filter patients by name, ward, or status
- 📊 **Patient Summary Chart** – View admitted vs. discharged patients
- 📉 **ICU Load Chart** – Visualize ICU vs. General occupancy
- 📄 **Export CSV** – Download current patient list as a CSV file
- 🔃 **Pagination** – View patients across multiple pages
- ⏳ **Loading Spinners** – Enhanced user experience
- 🔐 **Role-based Access Control** – Admin/Doctor/Nurse routes secured
- 📦 **SQLite Database** – Lightweight and portable

---

## 🛠️ Tech Stack

### Frontend
- **React.js + Tailwind CSS**
- `Recharts` for visualizations
- Axios for API calls

### Backend
- **FastAPI (Python)**
- SQLite with SQLAlchemy ORM
- Role-based Auth with JWT

---

## 📂 Folder Structure
mediwatch/
│
├── backend/ # FastAPI backend
│ ├── models/ # SQLAlchemy models
│ ├── routes/ # API route logic
│ └── auth/ # JWT auth & role handling
│
├── frontend/ # React frontend (Tailwind UI)
│ ├── src/pages/ # Patient Dashboard
│ ├── components/ # Form, Table, Charts
│ └── utils/ # API helpers
│
├── patients.db # SQLite DB
└── README.md

---

## 🧪 Local Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/AayushA10/mediwatch_ward.git
cd mediwatch_ward

2. Backend (FastAPI)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

3. Frontend (React)
cd ../frontend
npm install
npm run dev

🧠 Future Enhancements
🧾 Patient medical records view
📅 Daily admit/discharge trends
🧠 ML-based bed availability prediction
📱 Mobile responsive UI

🙌 Acknowledgments
Built as a part of a personal healthcare analytics project to demonstrate full-stack engineering, UI/UX, and data visualization skills in a real-world setting.



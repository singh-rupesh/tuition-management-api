# 📚 Tuition Management System

A full-stack web application to manage tuition center operations including student records, attendance, and academic data — built with React.js and FastAPI.

---

## 🚀 Features

- 🔐 Secure JWT Authentication (Login / Logout)
- 👨‍🎓 Student CRUD Operations (Add, View, Update, Delete)
- 📋 Attendance Tracking
- 📊 Academic Data Management
- ⚡ Fast REST API with FastAPI & Uvicorn
- 💾 Database management with SQLAlchemy & SQLite
- 📱 Responsive UI with Tailwind CSS

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI Framework |
| Tailwind CSS | Styling |
| Axios | API Communication |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | Backend Framework |
| Python | Core Language |
| SQLAlchemy | ORM |
| SQLite | Database |
| JWT | Authentication |
| Uvicorn | ASGI Server |

---

## 📁 Project Structure

```
tuition-management-api/
├── main.py          # FastAPI app entry point
├── auth.py          # JWT authentication logic
├── database.py      # Database connection setup
├── models.py        # SQLAlchemy models
├── schemas.py       # Pydantic schemas
├── requirements.txt # Python dependencies
└── tuition-frontend/ # React.js frontend
```

---

## ⚙️ Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/singh-rupesh/tuition-management-api.git
cd tuition-management-api

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd tuition-frontend
npm install
npm start
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | User Login |
| GET | `/students` | Get all students |
| POST | `/students` | Add new student |
| PUT | `/students/{id}` | Update student |
| DELETE | `/students/{id}` | Delete student |

---

## 👨‍💻 Author

**Rupesh Singh**  
B.Tech AI/ML — Sushant University, Gurugram  
[LinkedIn](https://www.linkedin.com/in/rupeshsingh09/) | [GitHub](https://github.com/singh-rupesh)

# 1️⃣ Imports
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from sqlalchemy import extract, func
from typing import Optional, List
from datetime import date
from fastapi.security import OAuth2PasswordRequestForm

from database import engine, SessionLocal
from models import Base, Student, Attendance, Payment, Admin
from schemas import (
    StudentCreate, StudentOut,
    AttendanceCreate, AttendanceOut,
    AdminCreate, AdminLogin,
    PaymentCreate, PaymentOut
)
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_admin
)

# 2️⃣ Create app
app = FastAPI()

# 3️⃣ Create tables
Base.metadata.create_all(bind=engine)

# 4️⃣ DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---------------- ROOT ----------------
@app.get("/")
def root():
    return {"message": "API is running 🚀"}


# ================= ADMIN ROUTES (OPEN) =================

@app.post("/register")
def register(admin: AdminCreate, db: Session = Depends(get_db)):
    existing = db.query(Admin).filter(Admin.username == admin.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    new_admin = Admin(
        username=admin.username,
        hashed_password=hash_password(admin.password)
    )

    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return {"message": "Admin created successfully"}


@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    db_admin = db.query(Admin).filter(
        Admin.username == form_data.username
    ).first()

    if not db_admin or not verify_password(
        form_data.password,
        db_admin.hashed_password
    ):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
        data={"sub": db_admin.username}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

# ================= STUDENT ROUTES (PROTECTED) =================

@app.post("/students", response_model=StudentOut)
def create_student(
    student: StudentCreate,
    db: Session = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):
    db_student = Student(**student.dict())

    db.add(db_student)

    try:
        db.commit()
        db.refresh(db_student)
        return db_student
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Phone already exists")


@app.get("/students", response_model=List[StudentOut])
def get_students(
    db: Session = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):
    return db.query(Student).all()


@app.get("/students/{student_id}", response_model=StudentOut)
def get_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student


@app.delete("/students/{student_id}")
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    db.delete(student)
    db.commit()

    return {"message": "Student deleted successfully"}


# ================= ATTENDANCE ROUTES (PROTECTED) =================

@app.post("/attendance")
def mark_attendance(
    attendance: AttendanceCreate,
    db: Session = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):
    student = db.query(Student).filter(Student.id == attendance.student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Prevent duplicate attendance
    existing_attendance = db.query(Attendance).filter(
        Attendance.student_id == attendance.student_id,
        Attendance.date == attendance.date
    ).first()

    if existing_attendance:
        raise HTTPException(
            status_code=400,
            detail="Attendance already marked for this student on this date"
        )

    new_attendance = Attendance(**attendance.dict())

    db.add(new_attendance)
    db.commit()
    db.refresh(new_attendance)

    return new_attendance

@app.get("/attendance", response_model=List[AttendanceOut])
def get_attendance(
    student_id: Optional[int] = None,
    date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):
    query = db.query(Attendance)

    if student_id:
        query = query.filter(Attendance.student_id == student_id)

    if date:
        query = query.filter(Attendance.date == date)

    return query.all()


# ================= FEE ROUTES (PROTECTED) =================

@app.get("/students/{student_id}/fee")
def calculate_fee(
    student_id: int,
    db: Session = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    present_days = db.query(Attendance).filter(
        Attendance.student_id == student_id,
        Attendance.present == True
    ).count()

    total_fee = present_days * student.fee_per_day

    return {
        "student_id": student_id,
        "present_days": present_days,
        "fee_per_day": student.fee_per_day,
        "total_fee": total_fee
    }


@app.get("/students/{student_id}/monthly-fee")
def calculate_monthly_fee(
    student_id: int,
    year: int,
    month: int,
    db: Session = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):

    # Month validation
    if month < 1 or month > 12:
        raise HTTPException(
            status_code=400,
            detail="Invalid month. Month must be between 1 and 12"
        )

    student = db.query(Student).filter(Student.id == student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    present_days = db.query(Attendance).filter(
        Attendance.student_id == student_id,
        Attendance.present == True,
        extract("year", Attendance.date) == year,
        extract("month", Attendance.date) == month
    ).count()

    monthly_fee = present_days * student.fee_per_day

    total_paid = db.query(func.coalesce(func.sum(Payment.amount_paid), 0)).filter(
        Payment.student_id == student_id,
        Payment.year == year,
        Payment.month == month
    ).scalar()

    remaining = monthly_fee - total_paid

    if remaining <= 0 and monthly_fee > 0:
        status = "Paid"
    elif total_paid == 0:
        status = "Unpaid"
    else:
        status = "Partial"

    return {
        "student_id": student_id,
        "year": year,
        "month": month,
        "present_days": present_days,
        "fee_per_day": student.fee_per_day,
        "monthly_fee": monthly_fee,
        "amount_paid": total_paid,
        "remaining_amount": remaining,
        "status": status
    }


    # ================= ADMIN INFO (PROTECTED) =================

@app.get("/admin/me")
def get_current_admin_info(
    current_admin: str = Depends(get_current_admin)
):
    return {
        "logged_in_admin": current_admin
    }

# ================= PAYMENT ROUTES (PROTECTED) =================

@app.post("/payments")
def record_payment(
    payment: PaymentCreate,
    db: Session = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):

    student = db.query(Student).filter(Student.id == payment.student_id).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    if payment.month < 1 or payment.month > 12:
        raise HTTPException(
            status_code=400,
            detail="Invalid month. Month must be between 1 and 12"
        )

    new_payment = Payment(**payment.dict())

    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)

    return new_payment
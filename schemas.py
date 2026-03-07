from pydantic import BaseModel
from datetime import date

# ---------------- STUDENT ----------------

class StudentCreate(BaseModel):
    name: str
    phone: str
    join_date: date
    fee_per_day: int


class StudentOut(StudentCreate):
    id: int

    class Config:
        from_attributes = True


# ---------------- ATTENDANCE ----------------

class AttendanceCreate(BaseModel):
    student_id: int
    date: date
    present: bool


class AttendanceOut(AttendanceCreate):
    id: int

    class Config:
        from_attributes = True

        # -------- PAYMENT --------

class PaymentCreate(BaseModel):
    student_id: int
    year: int
    month: int
    amount_paid: int


class PaymentOut(PaymentCreate):
    id: int

    class Config:
        from_attributes = True

#-------admin-------

class AdminCreate(BaseModel):
    username: str
    password: str


class AdminLogin(BaseModel):
    username: str
    password: str




class PaymentOut(BaseModel):
    id: int
    student_id: int
    amount_paid: float
    month: int
    year: int

    class Config:
        orm_mode = True



    class PaymentOut(BaseModel):
        id: int
        student_id: int
        amount_paid: float
        month: int
        year: int

        class Config:
            orm_mode = True
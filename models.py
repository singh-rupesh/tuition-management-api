from sqlalchemy import Column, Integer, String, Date
from database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    phone = Column(String, unique=True, index=True)
    join_date = Column(Date)
    fee_per_day = Column(Integer)


from sqlalchemy import Column, Integer, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    present = Column(Boolean, default=True)

    student_id = Column(Integer, ForeignKey("students.id"))
    student = relationship("Student", backref="attendance")



from sqlalchemy import Column, Integer, ForeignKey
from database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    year = Column(Integer)
    month = Column(Integer)
    amount_paid = Column(Integer)

    from sqlalchemy import Column, Integer, String
from database import Base

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)


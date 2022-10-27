from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Date,Boolean
from sqlalchemy.orm import declarative_base, relationship
import enum

Base=declarative_base()

class roles(enum.Enum):
    customer = "customer"
    pharmacist = "pharmacist"

class statuss(enum.Enum):
    placed = "placed"
    approved = "approved"
    delivered = "delivered"
    completed = "completed"

class Medicine(Base):
    __tablename__ = 'Medicine'
    medication_id=Column(Integer,primary_key=True)
    medicine_name=Column(String)
    medicine_quantity=Column(Integer)
    medicine_price=Column(Integer)
    photoUrls=Column(String)
    inDemand=Column(Boolean)

class Order(Base):
    __tablename__ = 'Order'
    prescription_id = Column(Integer, primary_key=True)
    customer_id = Column( Integer, ForeignKey("User.customer_id"))
    doctor_id = Column( Integer, ForeignKey("Pharmacists.doctor_id"))
    data = Date()
    status = Column(Enum(statuss))

class Order_Items(Base):
    __tablename__ = 'Order_Items'
    prescription_id=Column(Integer,ForeignKey("Order.prescription_id"), primary_key=True)
    medication_id=Column(Integer,ForeignKey("Medicine.medication_id"), primary_key=True)

class User(Base):
    __tablename__= 'User'
    customer_id = Column(Integer, primary_key=True)
    first_name = Column(String)
    last_name = Column(String)
    password = Column(String)
    phone = Column(String)
    email = Column(String)
    role=Column(Enum(roles))

class Pharmacists(Base):
    __tablename__ = 'Pharmacists'
    doctor_id = Column(Integer, primary_key=True)
    license=Column(Boolean)






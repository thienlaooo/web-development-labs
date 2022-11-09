from sqlalchemy import Column, Integer, String, ForeignKey, Enum, Date, Boolean, ARRAY
from sqlalchemy.orm import declarative_base, relationship, validates
import enum
import re
import bcrypt

Base = declarative_base()


def validate_name(name):
    length = len(name)
    if length <= 3 or length > 40:
        raise ValueError("Length of username should be less than 40 and more than 4 characters long")
    return name


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
    id=Column(Integer,primary_key=True)
    name=Column(String)
    quantity=Column(Integer)
    price=Column(Integer)
    producer=Column(String)
    photoUrls=Column(ARRAY(String))
    inDemand=Column(Boolean)
    @validates("price")
    def check_price(self, key, price):
        if price <= 0:
            raise ValueError("Daun, vvedy norm chyslo")
        else:
            return price

    def to_dict(self) -> dict:
        return {
            'name': self.name,
            'quantity': self.quantity,
            'price': self.price,
            'producer': self.producer,
            'photoUrls': self.photoUrls,
            'inDemand': str(self.inDemand)
        }


class Order(Base):
    __tablename__ = 'Order'
    id = Column(Integer, primary_key=True)
    customer_id = Column( Integer, ForeignKey("User.id"))
    date = Column(Date)
    status = Column(Enum(statuss))

class Order_Items(Base):
    __tablename__ = 'Order_Items'
    prescription_id=Column(Integer,ForeignKey("Order.id"), primary_key=True)
    medication_id=Column(Integer,ForeignKey("Medicine.id"), primary_key=True)

class User(Base):
    __tablename__= 'User'
    id = Column(Integer, primary_key=True)
    first_name = Column(String)
    last_name = Column(String)
    password = Column(String)
    phone = Column(String, unique=True)
    email = Column(String, unique=True)
    role = Column(Enum(roles))

    def to_dict(self) -> dict:
        return {
            'first_name': self.first_name,
            'last_name': self.last_name,
            'password': self.password,
            'phone': self.phone,
            'email': self.email,
            'role': str(self.role)
        }

    @validates("first_name")
    def validate_first_name(self, key, first_name):
        return validate_name(first_name)

    @validates("last_name")
    def validate_last_name(self, key, last_name):
        return validate_name(last_name)

    __email_r = re.compile("""(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[""" +
                           """\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")""" +
                           """@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|""" +
                           """2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:""" +
                           """(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])""")
    __password_r = re.compile("^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$")
    __phone_r = re.compile("^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$")

    @validates("email")
    def validate_email(self, key, email):
        if User.__email_r.match(email) is None:
            raise ValueError("Invalid email")

        return email

    @validates("password")
    def validate_password(self, key, password: str):
        if User.__password_r.match(password) is None:
            raise ValueError("This is not password(8 characters long+, one letter and number")
        new_password = bytes(password, "utf-8")
        new_password = bcrypt.hashpw(new_password, bcrypt.gensalt(12))
        return new_password.decode("utf-8")

    @validates("phone")
    def validate_phone(self, key, phone):
        if User.__phone_r.match(phone) is None:
            raise ValueError("This is not a phone number")

        return phone







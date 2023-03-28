from flask import Flask, Blueprint
from flask_httpauth import HTTPBasicAuth
import bcrypt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.Models.Models import User

auth_bp = Blueprint('auth', __name__)
auth = HTTPBasicAuth()
engine = create_engine("postgresql://postgres:postgres@localhost:5432/pharmacy")
Session = sessionmaker(bind=engine)
user_session = Session()


@auth.verify_password
def verify_password(email, password):
    user = user_session.query(User).filter(User.email == email).first()
    if user is not None and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return user


@auth.get_user_roles
def get_user_role(user):
    return [user.role.name]

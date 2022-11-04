from flask import Flask, Blueprint, Response, request, jsonify, json
import json
from psycopg2 import IntegrityError
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from Models.Models import User
from Encoder import AlchemyEncoder
engine = create_engine("postgresql://postgres:admin@localhost:5432/Pharmacy")
Session = sessionmaker(bind=engine)
session = Session()
user_api = Blueprint('user_api', __name__)




@user_api.route("/api/v1/user", methods=['POST'])
def create_user():
    user_data = request.get_json()
    if user_data is None:
        return Response(status=402)
    if(('first_name' in user_data) and
            ('last_name' in user_data) and
            ('password' in user_data) and
            ('phone' in user_data) and
            ('email' in user_data) and
            ('role' in user_data)):
        first_name = user_data['first_name']
        last_name = user_data['last_name']
        password = user_data['password']
        phone = user_data['phone']
        email = user_data['email']
        role = user_data['role']
        user = User(first_name=first_name, last_name=last_name, password=password, phone=phone,
                    email=email, role=role)
        session.add(user)
        try:
            session.commit()
        except IntegrityError:
            return Response("Popusk na useri", status=402)
        return Response("Harosh", status=200)
    else:
        Response("Popusk na useri", status=402)


@user_api.route("/api/v1/user/<userId>", methods=['GET'])
def get_user(userId):
    user = session.query(User)
    currentUser = user.get(int(userId))
    if currentUser is None:
        return Response("User doesn't exist", status=404)
    return Response(
          response=json.dumps(currentUser.to_dict(), cls=AlchemyEncoder),
          status=200,
          mimetype='application/json'
      )


@user_api.route("/api/v1/user/<userId>", methods=['DELETE'])
def delete_user(userId):
    user = session.query(User)
    currentUser = user.get(int(userId))
    if currentUser is None:
        return Response("User doesn't exist", status=404)
    session.delete(currentUser)
    try:
        session.commit()
    except IntegrityError:
        return Response("Delete failed", status=402)
    return Response("User was deleted", status=200)

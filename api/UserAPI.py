from flask import Flask, Blueprint, Response, request, jsonify, json
import json
import bcrypt
from sqlalchemy.exc import IntegrityError
from sqlalchemy import create_engine, update
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
        return Response("Invalid request body!", status=400)
    try:
        user = User(**user_data)
        session.add(user)
        session.commit()
    except IntegrityError:
        return Response("Create failed", status=402)
    return Response("User was created", status=200)


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
    try:
        session.delete(currentUser)
        session.commit()
    except IntegrityError:
        return Response("Delete failed", status=402)
    return Response("User was deleted", status=200)


@user_api.route("/api/v1/user", methods=['PUT'])
def update_user():
    user_data = request.get_json()
    if user_data is None:
        return Response("Invalid request body!", status=400)
    if 'id' in user_data:
        try:
            user = User(**user_data)
            session.query(User).filter(User.id == user.id).update(user_data, synchronize_session="fetch")
            session.commit()
        except IntegrityError:
            return Response("Update failed", status=402)
        return Response("User was updated", status=200)
    return Response("Invalid request body!", status=400)


@user_api.route("/api/v1/user/login", methods=['GET'])
def login_user():
    data = request.get_json()
    if data is None:
        return Response("Invalid request body!", status=400)
    try:
        if 'password' in data and 'email' in data:
            user = session.query(User).filter_by(email=data['email']).first()
            if not bcrypt.checkpw(data['password'].encode("utf-8"), user.password.encode("utf-8")):
                return Response("Invalid password or email specified", status=404)
            return Response(json.dumps(user.to_dict()), status=200)
    except IntegrityError:
        return Response("Invalid email or password specified", status=400)
    return Response("Invalid request body!", status=400)
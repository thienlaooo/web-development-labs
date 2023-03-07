import base64

from flask import Flask, Blueprint, Response, request, jsonify, json
import json
import bcrypt
from sqlalchemy.exc import IntegrityError
from sqlalchemy import create_engine, update
from sqlalchemy.orm import sessionmaker
from Models.Models import User, roles
from api.Auth import auth

engine = create_engine("postgresql://postgres:postgres@localhost:5432/pharmacy")
Session = sessionmaker(bind=engine)
session = Session()
user_api = Blueprint('user_api', __name__)


@user_api.route("/api/v1/user", methods=['POST'])
def create_user():
    try:
        user_data = request.get_json()
    except:
        return {"message": "Invalid request body!"}, 400
    if user_data["role"] == roles.pharmacist.value:
        return {"message": "Can't create a user as pharmacist"}, 400
    try:
        user = User(**user_data)
        session.add(user)
        session.commit()
    except IntegrityError:
        return {"message": "Create failed"}, 400
    return {"message": "User was created"}, 200


@user_api.route("/api/v1/user/<userId>", methods=['GET'])
@auth.login_required(role='pharmacist')
def get_user(userId):
    user = session.query(User)
    currentUser = user.get(int(userId))
    if currentUser is None:
        return {"message": "User doesn't exist"}, 404
    return Response(
          response=json.dumps(currentUser.to_dict()),
          status=200,
          mimetype='application/json'
      )


@user_api.route("/api/v1/user/<userId>", methods=['DELETE'])
@auth.login_required(role='pharmacist')
def delete_user(userId):
    user = session.query(User)
    currentUser = user.get(int(userId))
    if currentUser is None:
        return {"message": "User doesn't exist"}, 404
    try:
        session.delete(currentUser)
        session.commit()
    except IntegrityError:
        return {"message": "Delete failed"}, 400
    return {"message": "User was deleted"}, 200


@user_api.route("/api/v1/user", methods=['PUT'])
@auth.login_required(role=['customer', 'pharmacist'])
def update_user():
    user_data = request.get_json()
    if user_data is None:
        return {"message": "Invalid request body!"}, 400
    if 'id' in user_data and auth.current_user().id == int(user_data['id']) or auth.current_user().role == roles.pharmacist:
        if auth.current_user().role != roles.pharmacist and "role" in user_data:
            return {"message": "Only pharmacist can change a role of user!"}, 403
        else:
            try:
                user = User(**user_data)
                session.query(User).filter(User.id == user.id).update(user_data, synchronize_session="fetch")
                session.commit()
            except IntegrityError:
                return {"message": "Update failed"}, 400
            return {"message": "User was updated"}, 200
    return {"message": "Invalid request body!"}, 400


@user_api.route("/api/v1/user/login", methods=['GET'])
def login_user():
    try:
        data = request.get_json()
    except:
        return {"message": "Invalid request body!"}, 400
    try:
        if 'password' in data and 'email' in data:
            user = session.query(User).filter_by(email=data['email']).first()
            if not bcrypt.checkpw(data['password'].encode("utf-8"), user.password.encode("utf-8")):
                return Response("Invalid password", status=404)
            token = base64.encodebytes(f"{data['email']}:{data['password']}".encode('utf-8'))
            return jsonify({'basic': token.decode("utf-8").replace("\n", "")}), 200
    except:
        return {"message": "Invalid email or password specified"}, 400

from flask import Flask, Blueprint, Response, request, jsonify, json
import json
from psycopg2 import IntegrityError
from sqlalchemy import create_engine, update
from sqlalchemy.orm import sessionmaker
from Models.Models import Order
from Encoder import AlchemyEncoder
engine = create_engine("postgresql://postgres:admin@localhost:5432/Pharmacy")
Session = sessionmaker(bind=engine)
session = Session()
store_api = Blueprint('store_api', __name__)


@store_api.route("/api/v1/store/order", methods=['POST'])
def create_order():
    order_data = request.get_json()
    if order_data is None:
        return Response(status=402)
    try:
        order = Order(**order_data)
        session.add(order)
        session.commit()
    except IntegrityError:
        return Response("Update failed", status=402)
    return Response("User was updated", status=200)
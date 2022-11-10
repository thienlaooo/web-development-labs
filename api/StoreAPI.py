from flask import Flask, Blueprint, Response, request, jsonify, json
import json
from psycopg2 import IntegrityError
from sqlalchemy import create_engine, update
from sqlalchemy.orm import sessionmaker
from Models.Models import Order, Medicine, Order_Medicine
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
        return Response("Create failed", status=402)
    return Response("Order was created", status=200)


@store_api.route("/api/v1/store/inventory", methods=['GET'])
def get_inventory():
    medicines = session.query(Medicine).all()
    medicinesJson = []
    if medicines is None:
        return Response("Medicines not found", status=404)
    for medicine in medicines:
        medicinesJson.append(medicine.to_dict())
    return Response(
        response=json.dumps(medicinesJson, cls=AlchemyEncoder),
        status=200,
        mimetype='application/json'
    )


@store_api.route("/api/v1/store/order/medicine", methods=['POST'])
def add_medicine_to_order():
    order_medicine_data = request.get_json()
    if order_medicine_data is None:
        return Response(status=402)
    medicine = session.query(Medicine)
    current_medicine = medicine.get(int(order_medicine_data['medicine_id']))
    if current_medicine is None:
        return Response('Medicine not found', 404)
    order = session.query(Order)
    current_order = order.get(int(order_medicine_data['order_id']))
    if current_order is None:
        return Response('Order not found', 404)
    order_medicine = Order_Medicine(medicine_id=order_medicine_data['medicine_id'], order_id=order_medicine_data['order_id'])
    session.add(order_medicine)
    try:
        session.commit()
    except IntegrityError:
        return Response(status=402)
    return Response('Medicine successfully added to order!', status=200)


@store_api.route("/api/v1/store/order/<orderId>/getMedicines", methods=['GET'])
def get_order_items(orderId):
    current_order = session.query(Order).get(int(orderId))
    if current_order is None:
        return Response('User not found', 404)
    medicines = session.query(Order_Medicine).filter_by(order_id=orderId)
    response_json = []
    if medicines is None:
        return Response("Medicines not found", status=404)
    # response_json.append(current_order.to_dict())
    for medicine in medicines:
        response_json.append(medicine.medicine.to_dict())
    return Response(
        response=json.dumps(response_json, cls=AlchemyEncoder),
        status=200,
        mimetype='application/json'
    )


@store_api.route("/api/v1/store/order/<orderId>", methods=['GET'])
def get_order(orderId):
    current_order = session.query(Order).get(int(orderId))
    if current_order is None:
        return Response('Order not found', 404)
    return Response(
        response=json.dumps(current_order.to_dict(), cls=AlchemyEncoder),
        status=200,
        mimetype='application/json'
    )


@store_api.route("/api/v1/store/order/<orderId>", methods=['DELETE'])
def delete_order(orderId):
    order = session.query(Order)
    current_order = order.get(int(orderId))
    if current_order is None:
        return Response('Order not found', 404)
    try:
        session.delete(current_order)
        session.commit()
    except IntegrityError:
        return Response("Delete failed", status=402)
    return Response("Order was deleted", status=200)
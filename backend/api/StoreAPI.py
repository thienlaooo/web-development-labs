from flask import Flask, Blueprint, Response, request, jsonify, json
import json

from flask_cors import cross_origin
from psycopg2 import IntegrityError
from sqlalchemy import create_engine, update
from sqlalchemy.orm import sessionmaker
from Models.Models import Order, Medicine, Order_Medicine, roles
from api.Auth import auth

engine = create_engine("postgresql://postgres:postgres@localhost:5432/pharmacy")
Session = sessionmaker(bind=engine)
session = Session()
store_api = Blueprint('store_api', __name__)


@store_api.route("/api/v1/store/inventory", methods=['GET'])
def get_inventory():
    medicines = session.query(Medicine).all()
    medicinesJson = []
    if medicines is None:
        return {"message": "Medicines not found"}, 404
    for medicine in medicines:
        medicinesJson.append(medicine.to_dict())
    return Response(
        response=json.dumps(medicinesJson),
        status=200,
        mimetype='application/json'
    )


@store_api.route("/api/v1/store/order", methods=['POST'])
@auth.login_required(role=["customer", "pharmacist"])
def create_order():
    try:
        order_data = request.get_json()
    except:
        return {"message": "Invalid request body!"}, 400
    try:
        order = Order(**order_data)
        order.customer_id = auth.current_user().id
        session.add(order)
        session.commit()
    except IntegrityError:
        return {"message": "Create failed"}, 400
    return {"message": "Order was created"}, 200


@store_api.route("/api/v1/store/order/medicine", methods=['POST'])
@auth.login_required(role=["customer", "pharmacist"])
def add_medicine_to_order():
    order_medicine_data = request.get_json()
    if order_medicine_data is None:
        return {"message": "Invalid request body!"}, 400
    medicine = session.query(Medicine)
    current_medicine = medicine.get(int(order_medicine_data['medicine_id']))
    if current_medicine is None:
        return {"message": "Medicine not found"}, 404
    order = session.query(Order)
    current_order = order.get(int(order_medicine_data['order_id']))
    if current_order.customer_id != auth.current_user().id and \
            auth.current_user().role != roles.pharmacist:
        return {"message": "Access forbidden, not your order"}, 403
    if current_order is None:
        return {"message": 'Order not found'}, 404
    order_medicine = Order_Medicine(medicine_id=order_medicine_data['medicine_id'],
                                    order_id=order_medicine_data['order_id'])
    session.add(order_medicine)
    try:
        session.commit()
    except IntegrityError:
        return Response(status=402)
    return {"message": 'Medicine successfully added to order!'}, 200


@store_api.route("/api/v1/store/order/<orderId>/getMedicines", methods=['GET'])
@auth.login_required(role=["customer", "pharmacist"])
def get_order_items(orderId):
    current_order = session.query(Order).get(int(orderId))
    if current_order is None:
        return {"message": 'Order not found'}, 404
    medicines = session.query(Order_Medicine).filter_by(order_id=orderId)
    response_json = []
    if medicines is None:
        return {"message": "Medicine not found"}, 404
    for medicine in medicines:
        response_json.append(medicine.medicine.to_dict())
    return Response(
        response=json.dumps(response_json),
        status=200,
        mimetype='application/json'
    )


@store_api.route("/api/v1/store/order/<orderId>", methods=['GET'])
@auth.login_required(role=["customer", "pharmacist"])
def get_order(orderId):
    with Session.begin() as session:
        current_order = session.query(Order).get(int(orderId))
        if current_order is None:
            return {"message": 'Order not found'}, 404
        if current_order.customer_id != auth.current_user().id and \
                auth.current_user().role != roles.pharmacist:
            return {"message": "Access forbidden, not your order"}, 403

        return Response(
            response=json.dumps(current_order.to_dict()),
            status=200,
            mimetype='application/json'
        )


@store_api.route("/api/v1/store/order/<orderId>", methods=['DELETE'])
@auth.login_required(role="pharmacist")
def delete_order(orderId):
    order = session.query(Order)
    current_order = order.get(int(orderId))
    if current_order is None:
        return {"message": 'Order not found'}, 404
    try:
        session.delete(current_order)
        session.commit()
    except IntegrityError:
        return {"message": "Delete failed"}, 400
    return {"message": "Order was deleted"}, 200


@store_api.route("/api/v1/store/order/<orderId>/<medicineId>", methods=['DELETE'])
@auth.login_required(role=["customer", "pharmacist"])
def delete_medicine_from_order(orderId, medicineId):
    order_medicine = session.query(Order_Medicine)
    current_med = order_medicine.filter_by(order_id=int(orderId), medicine_id=int(medicineId)).first()
    if current_med is None:
        return {"message": 'Medicine is not in order'}, 400
    try:
        session.delete(current_med)
        session.commit()
    except IntegrityError:
        return {"message": "Delete failed"}, 400
    return {"message": "Medicine was deleted from order"}, 200

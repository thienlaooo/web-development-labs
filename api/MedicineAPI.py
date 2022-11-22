import json

from flask import Flask, Blueprint, Response, request
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
from Models.Models import Medicine
from api.Auth import auth

engine = create_engine("postgresql://postgres:admin@localhost:5432/Pharmacy")
Session = sessionmaker(bind=engine)
session = Session()
medicine_api = Blueprint('medicine_api', __name__)


@medicine_api.route("/api/v1/medicine", methods=['POST'])
@auth.login_required(role="pharmacist")
def create_medicine():
    try:
        medicine_data = request.get_json()
    except:
        return Response("Invalid request body!", status=400)
    try:
        medicine = Medicine(**medicine_data)
        medicine_query = session.query(Medicine)
        check_medicine = medicine_query.filter_by(name=medicine_data["name"], producer=medicine_data["producer"]).first()
        if check_medicine is not None:
            return Response("Medicine already exists", status=400)
        session.add(medicine)
        session.commit()
    except IntegrityError:
        return Response("Create failed", status=400)
    return Response("Medicine was created", status=200)


@medicine_api.route("/api/v1/medicine/<medicineId>", methods=['GET'])
def get_medicine(medicineId):
    medicine = session.query(Medicine)
    currentMedicine = medicine.get(int(medicineId))
    if currentMedicine is None:
        return Response("Medicine doesn't exist", status=404)
    return Response(
        response=json.dumps(currentMedicine.to_dict()),
        status=200,
        mimetype='application/json'
    )


@medicine_api.route("/api/v1/medicine", methods=['PUT'])
@auth.login_required(role="pharmacist")
def update_medicine():
    try:
        medicine_data = request.get_json()
    except:
        return Response("Invalid request body!", status=400)
    if 'id' in medicine_data:
        try:
            medicine = Medicine(**medicine_data)
            session.query(Medicine).filter(Medicine.id == medicine.id).update(medicine_data, synchronize_session="fetch")
            session.commit()
        except IntegrityError:
            return Response("Update failed", status=400)
        return Response("Medicine was updated", status=200)


@medicine_api.route("/api/v1/medicine/<medicineId>", methods=['DELETE'])
@auth.login_required(role="pharmacist")
def delete_medicine(medicineId):
    medicine = session.query(Medicine)
    currentMedicine = medicine.get(int(medicineId))
    if currentMedicine is None:
        return Response("Medicine doesn't exist", status=404)
    try:
        session.delete(currentMedicine)
        session.commit()
    except IntegrityError:
        return Response("Delete failed", status=400)
    return Response("Medicine was deleted", status=200)


@medicine_api.route("/api/v1/medicine/addInDemand", methods=['POST'])
@auth.login_required(role=["customer", "pharmacist"])
def add_in_demand_medicine():
    try:
        demand_data = request.get_json()
    except:
        return Response("Invalid request body!", status=400)
    medicine = session.query(Medicine)
    currentMedicine = medicine.get(int(demand_data["medicine"]))
    if currentMedicine is None:
        return Response("Medicine doesn't exist", status=404)
    try:
        session.query(Medicine).filter(Medicine.id == demand_data["medicine"]).update({"inDemand": True}, synchronize_session="fetch")
        session.commit()
    except IntegrityError:
        return Response("Add in demand failed", status=402)
    return Response("Medicine was added in demand", status=200)


@medicine_api.route("/api/v1/medicine/<medicineId>/uploadImage", methods=['POST'])
@auth.login_required(role="pharmacist")
def add_photos_to_medicine(medicineId):
    try:
        photos_data = request.get_json()
    except:
        return Response("Invalid request body!", status=400)
    medicine = session.query(Medicine)
    currentMedicine = medicine.get(int(medicineId))
    if currentMedicine is None:
        return Response("Medicine doesn't exist", status=404)
    try:
        session.query(Medicine).filter(Medicine.id == medicineId).update(photos_data, synchronize_session="fetch")
        session.commit()
    except IntegrityError:
        return Response("Adding a photo failed", status=402)
    return Response("Photo was successfully added", status=200)

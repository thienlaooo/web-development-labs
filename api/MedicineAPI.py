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
        if medicine_data is None:
            return {"message": "Invalid request body!"}, 400
    except:
        return {"message": "Invalid request body!"}, 400
    try:
        medicine = Medicine(**medicine_data)
        medicine_query = session.query(Medicine)
        check_medicine = medicine_query.filter_by(name=medicine_data["name"], producer=medicine_data["producer"]).first()
        if check_medicine is not None:
            return {"message": "Medicine already exists"}, 400
        session.add(medicine)
        session.commit()
    except IntegrityError:
        return {"message": "Create failed"}, 400
    return {"message": "Medicine was created"}, 200


@medicine_api.route("/api/v1/medicine/<medicineId>", methods=['GET'])
def get_medicine(medicineId):
    medicine = session.query(Medicine)
    currentMedicine = medicine.get(int(medicineId))
    if currentMedicine is None:
        return {"message": "Medicine doesn't exist"}, 404
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
        return {"message": "Invalid request body!"}, 400
    if 'id' in medicine_data:
        try:
            medicine = Medicine(**medicine_data)
            session.query(Medicine).filter(Medicine.id == medicine.id).update(medicine_data, synchronize_session="fetch")
            session.commit()
        except IntegrityError:
            return {"message": "Update failed"}, 400
        return {"message": "Medicine was updated"}, 200


@medicine_api.route("/api/v1/medicine/<medicineId>", methods=['DELETE'])
@auth.login_required(role="pharmacist")
def delete_medicine(medicineId):
    medicine = session.query(Medicine)
    currentMedicine = medicine.get(int(medicineId))
    if currentMedicine is None:
        return {"message": "Medicine doesn't exist"}, 404
    try:
        session.delete(currentMedicine)
        session.commit()
    except IntegrityError:
        return {"message": "Delete failed"}, 400
    return {"message": "Medicine was deleted"}, 200


@medicine_api.route("/api/v1/medicine/addInDemand", methods=['POST'])
@auth.login_required(role=["customer", "pharmacist"])
def add_in_demand_medicine():
    try:
        demand_data = request.get_json()
    except:
        return {"message": "Invalid request body!"}, 400
    medicine = session.query(Medicine)
    currentMedicine = medicine.get(int(demand_data["medicine"]))
    if currentMedicine is None:
        return {"message": "Medicine doesn't exist"}, 404
    try:
        session.query(Medicine).filter(Medicine.id == demand_data["medicine"]).update({"inDemand": True}, synchronize_session="fetch")
        session.commit()
    except IntegrityError:
        return {"message": "Add in demand failed"}, 400
    return {"message": "Medicine was added in demand"}, 200


@medicine_api.route("/api/v1/medicine/<medicineId>/uploadImage", methods=['POST'])
@auth.login_required(role="pharmacist")
def add_photos_to_medicine(medicineId):
    try:
        photos_data = request.get_json()
    except:
        return {"message": "Invalid request body!"}, 400
    medicine = session.query(Medicine)
    currentMedicine = medicine.get(int(medicineId))
    if currentMedicine is None:
        return {"message": "Medicine doesn't exist"}, 404
    try:
        session.query(Medicine).filter(Medicine.id == medicineId).update(photos_data, synchronize_session="fetch")
        session.commit()
    except IntegrityError:
        return {"message": "Adding a photo failed"}, 400
    return {"message": "Photo was successfully added"}, 200

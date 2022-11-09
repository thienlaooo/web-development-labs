import json

from flask import Flask, Blueprint, Response, request
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
from Models.Models import Medicine
from api.Encoder import AlchemyEncoder

engine = create_engine("postgresql://postgres:admin@localhost:5432/Pharmacy")
Session = sessionmaker(bind=engine)
session = Session()
medicine_api = Blueprint('medicine_api', __name__)


@medicine_api.route("/api/v1/medicine", methods=['POST'])
def create_medicine():
    medicine_data = request.get_json()
    if medicine_data is None:
        return Response(status=402)
    if(('name' in medicine_data) and
            ('quantity' in medicine_data) and
            ('price' in medicine_data) and
            ('photoUrls' in medicine_data) and
            ('inDemand' in medicine_data) and
            ('producer') in medicine_data):
        name = medicine_data['name']
        quantity = medicine_data['quantity']
        price = medicine_data['price']
        photoUrls = medicine_data['photoUrls']
        inDemand = medicine_data['inDemand']
        producer = medicine_data['producer']
        medicine = Medicine(name=name,quantity=quantity,
                            price=price,photoUrls=photoUrls, inDemand=inDemand, producer=producer)
        session.add(medicine)
        try:
            session.commit()
        except IntegrityError:
            return Response("Popusk na useri", status=402)
        return Response("Harosh", status=200)
    else:
        Response("Popusk na useri", status=402)


@medicine_api.route("/api/v1/medicine/<medicineId>", methods=['GET'])
def get_medicine(medicineId):
    medicine = session.query(Medicine)
    currentMedicine = medicine.get(int(medicineId))
    if currentMedicine is None:
        return Response("Medicine doesn't exist", status=404)
    return Response(
        response=json.dumps(currentMedicine.to_dict(), cls=AlchemyEncoder),
        status=200,
        mimetype='application/json'
    )


@medicine_api.route("/api/v1/medicine/<medicineId>", methods=['DELETE'])
def delete_medicine(medicineId):
    medicine = session.query(Medicine)
    currentMedicine = medicine.get(int(medicineId))
    if currentMedicine is None:
        return Response("Medicine doesn't exist", status=404)
    session.delete(currentMedicine)
    try:
        session.commit()
    except IntegrityError:
        return Response("Delete failed", status=402)
    return Response("Medicine was deleted", status=200)


@medicine_api.route("/api/v1/medicine/addInDemand", methods=['POST'])
def add_in_demand_medicine():
    demand_data = request.get_json()
    if demand_data is None:
        return Response(status=402)
    medicine = session.query(Medicine)
    currentMedicine = medicine.get(int(demand_data["medicine"]))
    if currentMedicine is None:
        return Response("Medicine doesn't exist", status=404)
    session.query(Medicine).filter(Medicine.id == demand_data["medicine"]).update({"inDemand" : True}, synchronize_session="fetch")
    try:
        session.commit()
    except IntegrityError:
        return Response("Add in demand failed", status=402)
    return Response("Medicine was added in demand", status=200)
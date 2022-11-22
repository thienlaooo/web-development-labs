import json


def test_create_medicine(new_client):
    request_body = {
        "id": 5,
        "name": "Aspirin",
        "quantity": 10,
        "price": 350,
        "producer": "Bayer",
        "inDemand": False
    }
    response = new_client.post("/api/v1/medicine", data=json.dumps(request_body),
                               auth=("pharm@gmail.com", "123qwerty"), headers={'Content-Type': 'application/json'})
    assert response.status_code == 200
    assert b"Medicine was created" in response.response


def test_create_empty_medicine(new_client):
    response = new_client.post("/api/v1/medicine", auth=("pharm@gmail.com", "123qwerty"),
                               headers={'Content-Type': 'application/json'})
    assert response.status_code == 400
    assert b"Invalid request body!" in response.response


def test_create_same_medicine(new_client):
    request_body = {
        "id": 6,
        "name": "Aspirin",
        "quantity": 12,
        "price": 200,
        "producer": "Bayer",
        "inDemand": True
    }
    response = new_client.post("/api/v1/medicine", data=json.dumps(request_body),
                               auth=("pharm@gmail.com", "123qwerty"), headers={'Content-Type': 'application/json'})
    assert response.status_code == 400
    assert b"Medicine already exists" in response.response


def test_get_medicine_by_id(new_client):
    response = new_client.get("/api/v1/medicine/5")
    assert response.status_code == 200
    assert b'{"name": "Aspirin", "quantity": 10, "price": 350, "producer": "Bayer", ' \
           b'"photoUrls": null, "inDemand": "False"}' in response.data


def test_get_medicine_by_wrong_id(new_client):
    response = new_client.get("/api/v1/medicine/8")
    assert response.status_code == 404
    assert b"Medicine doesn't exist" in response.response


def test_edit_medicine(new_client):
    request_body = {
        "id": 5,
        "quantity": 10,
        "producer": "Farmak"
    }
    response = new_client.put("/api/v1/medicine", data=json.dumps(request_body),
                              auth=("pharm@gmail.com", "123qwerty"), headers={'Content-Type': 'application/json'})
    assert response.status_code == 200
    assert b"Medicine was updated" in response.response


def test_edit_empty_medicine(new_client):
    response = new_client.put("/api/v1/medicine", auth=("pharm@gmail.com", "123qwerty"),
                              headers={'Content-Type': 'application/json'})
    assert response.status_code == 400
    assert b"Invalid request body!" in response.data


def test_add_in_demand(new_client):
    request_body = {
        "medicine": 5
    }
    response = new_client.post("/api/v1/medicine/addInDemand", data=json.dumps(request_body),
                               auth=("pharm@gmail.com", "123qwerty"), headers={'Content-Type': 'application/json'})
    assert response.status_code == 200
    assert b"Medicine was added in demand" in response.response


def test_add_empty_in_demand(new_client):
    response = new_client.post("/api/v1/medicine/addInDemand", auth=("pharm@gmail.com", "123qwerty"),
                               headers={'Content-Type': 'application/json'})
    assert response.status_code == 400
    assert b"Invalid request body!" in response.response


def test_add_wrong_in_demand(new_client):
    request_body = {
        "medicine": 10
    }
    response = new_client.post("/api/v1/medicine/addInDemand", data=json.dumps(request_body),
                               auth=("pharm@gmail.com", "123qwerty"), headers={'Content-Type': 'application/json'})
    assert response.status_code == 404
    assert b"Medicine doesn't exist" in response.response


def test_add_photos(new_client):
    request_body = {
        "photoUrls": "photo_2022-05-13_14-39-28"
    }
    response = new_client.post("/api/v1/medicine/5/uploadImage", data=json.dumps(request_body),
                               auth=("pharm@gmail.com", "123qwerty"), headers={'Content-Type': 'application/json'})
    assert response.status_code == 200
    assert b"Photo was successfully added" in response.response


def test_add_empty_photos(new_client):
    response = new_client.post("/api/v1/medicine/5/uploadImage",
                               auth=("pharm@gmail.com", "123qwerty"), headers={'Content-Type': 'application/json'})
    assert response.status_code == 400
    assert b"Invalid request body!" in response.data


def test_add_photos_to_wrong_medicine(new_client):
    request_body = {
        "photoUrls": "photo_2022-05-13_14-39-28"
    }
    response = new_client.post("/api/v1/medicine/10/uploadImage", data=json.dumps(request_body),
                               auth=("pharm@gmail.com", "123qwerty"), headers={'Content-Type': 'application/json'})
    assert response.status_code == 404
    assert b"Medicine doesn't exist" in response.response


def test_delete_medicine(new_client):
    response = new_client.delete("/api/v1/medicine/5", auth=("pharm@gmail.com", "123qwerty"))
    assert response.status_code == 200
    assert b"Medicine was deleted" in response.response


def test_delete_wrong_medicine(new_client):
    response = new_client.delete("/api/v1/medicine/8", auth=("pharm@gmail.com", "123qwerty"))
    assert response.status_code == 404
    assert b"Medicine doesn't exist" in response.response


def test_create_medicine_same_id(new_client):
    request_body = {
        "id": 1,
        "name": "Paracetamol",
        "quantity": 10,
        "price": 350,
        "producer": "Bayer",
        "inDemand": False
    }
    response = new_client.post("/api/v1/medicine", data=json.dumps(request_body),
                               auth=("pharm@gmail.com", "123qwerty"), headers={'Content-Type': 'application/json'})
    assert response.status_code == 400
    assert b"Create failed" in response.response

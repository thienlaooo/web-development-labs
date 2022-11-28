import json


def test_get_inventory(new_client):
    response = new_client.get("/api/v1/store/inventory")
    assert response.status_code == 200
    assert b'[{"name": "Talavin", "quantity": 20, "price": 125, "producer": null, ' \
           b'"photoUrls": null, "inDemand": "None"}]' in response.data


def test_create_order(new_client):
    request_body = {
        "id": 1,
        "customer_id": 3,
        "date": "2022-10-10",
        "status": "placed"
    }
    response = new_client.post("/api/v1/store/order", data=json.dumps(request_body),
                               auth=("johhhn@email.com", "123qwerty"), headers={'Content-Type': 'application/json'})
    assert response.status_code == 200
    assert b"Order was created" in response.response


def test_create_empty_order(new_client):
    response = new_client.post("/api/v1/store/order",
                               auth=("johhhn@email.com", "123qwerty"), headers={'Content-Type': 'application/json'})
    assert response.status_code == 400
    assert b'Invalid request body' in response.data


def test_add_medicine_to_order(new_client):
    request_body = {
        "medicine_id": 1,
        "order_id": 1
    }
    response = new_client.post("/api/v1/store/order/medicine", data=json.dumps(request_body),
                               auth=("johhhn@email.com", "123qwerty"), headers={'Content-Type': 'application/json'})
    assert response.status_code == 200
    assert b'Medicine successfully added to order!' in response.response


def test_delete_order(new_client):
    response = new_client.delete("/api/v1/store/order/1", auth=("pharm@gmail.com", "123qwerty"),
                                 headers={'Content-Type': 'application/json'})
    assert response.status_code == 200
    assert b"Order was deleted" in response.response


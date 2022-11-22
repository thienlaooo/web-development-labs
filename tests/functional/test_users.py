import json
import requests as requests


def test_home_page(new_client):
    response = new_client.get("/api/v1/hello-world-22")
    assert response.status_code == 200


def test_create_empty_user(new_client):
    response = new_client.post("/api/v1/user", headers={'Content-Type': 'application/json'})
    assert response.status_code == 400
    assert b'Invalid request body' in response.data


def test_add_user(new_client):
    request_body = {
        "id": 30,
        "first_name": "Vitaliy",
        "last_name": "Pihotskiy",
        "password": "123qwerty",
        "phone": "380987345126",
        "email": "vitaliy@email.com",
        "role": "pharmacist"
    }
    response = new_client.post("/api/v1/user", data=json.dumps(request_body),
                               headers={'Content-Type': 'application/json'})
    assert response.status_code == 200
    assert b'User was created' in response.response


def test_edit_user(new_client):
    request_body = {
        "id": 30,
        "first_name": "Oleh"
    }
    response = new_client.put("/api/v1/user", data=json.dumps(request_body), auth=("vitaliy@email.com", "123qwerty"),
                              headers={'Content-Type': 'application/json'})
    assert response.status_code == 200
    assert b"User was updated" in response.response


def test_get_user_with_id_unathorized(new_client):
    response = new_client.get("/api/v1/user/3", auth=("johhhn@email.com", "123qwerty"))
    assert response.status_code == 403
    assert b'Unauthorized Access' in response.response


def test_delete_user(new_client):
    response = new_client.delete("/api/v1/user/30", auth=("pharm@gmail.com", "123qwerty"))
    assert response.status_code == 200
    assert b'User was deleted' in response.response


def test_delete_user_wrong_id(new_client):
    response = new_client.delete("/api/v1/user/40", auth=("pharm@gmail.com", "123qwerty"))
    assert response.status_code == 404
    assert b"User doesn't exist" in response.response


def test_get_user_with_invalid_id(new_client):
    response = new_client.get("/api/v1/user/30", auth=("pharm@gmail.com", "123qwerty"))
    assert response.status_code == 404
    assert b"User doesn't exist" in response.data


def test_get_user_with_id(new_client):
    response = new_client.get("/api/v1/user/3", auth=("pharm@gmail.com", "123qwerty"))
    assert response.status_code == 200
    assert b'{"first_name": "John", "last_name": "James", "password": "$2b$12$5.QzVKKhsN5JpRAHfjX7qudF7WMuHBHTNnJgHH3TEajkWZCFO5Z.W", ' \
           b'"phone": "380987345120", "email": "johhhn@email.com", "role": "roles.customer"}' in response.data


def test_login(new_client):
    request_body = {
        "email": "pharm@gmail.com",
        "password": "123qwerty"
    }
    response = new_client.get("/api/v1/user/login", data=json.dumps(request_body), headers={'Content-Type': 'application/json'})
    assert response.status_code == 200


def test_login_invalid_password(new_client):
    request_body = {
        "email": "pharm@gmail.com",
        "password": "123qwertyy"
    }
    response = new_client.get("/api/v1/user/login", data=json.dumps(request_body), headers={'Content-Type': 'application/json'})
    assert response.status_code == 404
    assert b"Invalid password" in response.response


def test_login_invalid_data(new_client):
    request_body = {
        "email": "Ohayo",
        "password": "Oni-chan"
    }
    response = new_client.get("/api/v1/user/login", data=json.dumps(request_body), headers={'Content-Type': 'application/json'})
    assert response.status_code == 400
    assert b"Invalid email or password specified" in response.response


def test_empty_login(new_client):
    response = new_client.get("/api/v1/user/login", headers={'Content-Type': 'application/json'})
    assert response.status_code == 400
    assert b"Invalid request body!" in response.response


def test_add_same_user(new_client):
    request_body = {
        "id": 3,
        "first_name": "Vitaliy",
        "last_name": "Pihotskiy",
        "password": "123qwerty",
        "phone": "380987345126",
        "email": "vitaliy@email.com",
        "role": "pharmacist"
    }
    response = new_client.post("/api/v1/user", data=json.dumps(request_body),
                               headers={'Content-Type': 'application/json'})
    assert response.status_code == 400
    assert b'Create failed' in response.response

import json
import requests as requests


url = "/api/v1/hello-world-22"


def test_home_page(new_client):
    response = new_client.get(url)
    assert response.status_code == 200

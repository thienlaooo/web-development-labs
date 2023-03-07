import pytest
from Models.Models import User, Medicine, Order, Order_Medicine, Base
from app import create_app


@pytest.fixture(scope='module')
def new_user():
    user = User(first_name='Oleh', last_name='Rysin', password='123qwerty',
                phone='380987345124', email='oleh@gmail.com', role='customer')
    return user


@pytest.fixture(scope='module')
def new_medicine():
    medicine = Medicine(name='Penicilin', quantity=10, price=300,
                        producer='Bayer', inDemand=False)
    return medicine


@pytest.fixture(scope='module')
def new_client():
    flask_app = create_app()

    with flask_app.test_client() as testing_client:
        yield testing_client



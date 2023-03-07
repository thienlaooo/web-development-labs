import pytest


# tests related to user
def test_new_user(new_user):
    assert new_user.email == 'oleh@gmail.com'
    assert new_user.password != '123qwerty'
    assert new_user.first_name == 'Oleh'
    assert new_user.last_name == 'Rysin'
    assert new_user.phone == '380987345124'
    assert new_user.role == 'customer'


def wrong_password(user):
    user.password = '1234'


def test_wrong_password(new_user):
    with pytest.raises(ValueError) as exc_info:
        wrong_password(new_user)
    assert str(exc_info.value) == 'This is not password(8 characters long+, one letter and number'


def wrong_email(user):
    user.email = 'helloworld'


def test_wrong_email(new_user):
    with pytest.raises(ValueError) as exc_info:
        wrong_email(new_user)
    assert str(exc_info.value) == 'Invalid email'


def wrong_phone_number(user):
    user.phone = 'phone'


def test_wrong_phone_number(new_user):
    with pytest.raises(ValueError) as exc_info:
        wrong_phone_number(new_user)
    assert str(exc_info.value) == 'This is not a phone number'


def wrong_name(user):
    user.first_name = 'd'


def test_wrong_name(new_user):
    with pytest.raises(ValueError) as exc_info:
        wrong_name(new_user)
    assert str(exc_info.value) == 'Length of name should be less than 40 and more than 4 characters long'


# tests related to medicine
def test_new_medicine(new_medicine):
    assert new_medicine.inDemand == False
    assert new_medicine.name == 'Penicilin'
    assert new_medicine.producer == 'Bayer'
    assert new_medicine.quantity == 10
    assert new_medicine.price == 300


def wrong_quantity(medicine):
    medicine.quantity = -10


def test_wrong_quantity(new_medicine):
    with pytest.raises(ValueError) as exc_info:
        wrong_quantity(new_medicine)
    assert str(exc_info.value) == 'Incorrect quantity!'


def wrong_price(medicine):
    medicine.price = -10


def test_wrong_price(new_medicine):
    with pytest.raises(ValueError) as exc_info:
        wrong_price(new_medicine)
    assert str(exc_info.value) == 'Incorrect price!'

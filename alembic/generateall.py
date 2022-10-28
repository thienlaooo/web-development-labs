from sqlalchemy import create_engine
from Models.Models import *
from alembic.config import Config
from alembic import command

engine = create_engine("postgresql://postgres:1111@localhost:5432/new")
Base.metadata.create_all(engine)
alembic_cfg = Config("alembic.ini")
command.stamp(alembic_cfg, "head")
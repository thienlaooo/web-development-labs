revision = '3512b954651e'
down_revision = None
branch_labels = None

from alembic import op
import sqlalchemy as sa
import sys

sys.path = ['', '..'] + sys.path[1:]
import Models.Models as mo


def upgrade():
    op.add_column("User", sa.Column('first_name', mo.String))


def downgrade():
    op.drop_column("User", 'first_name')

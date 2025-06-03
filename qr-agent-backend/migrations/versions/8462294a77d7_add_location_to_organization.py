"""Add location to organization

Revision ID: 8462294a77d7
Revises: bb742492aea9
Create Date: 2025-06-03 13:42:27.828996

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '8462294a77d7'
down_revision = 'bb742492aea9'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('organizations', sa.Column('location', sa.String(length=255), nullable=True))

def downgrade():
    op.drop_column('organizations', 'location')
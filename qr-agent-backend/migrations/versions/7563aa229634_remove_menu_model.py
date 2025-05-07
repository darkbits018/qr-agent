"""Remove Menu model

Revision ID: 7563aa229634
Revises: 6a9e8c92c927
Create Date: 2025-05-07 11:38:21.039230

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import text

# revision identifiers, used by Alembic.
revision = '7563aa229634'
down_revision = '6a9e8c92c927'
branch_labels = None
depends_on = None


def upgrade():
    # Skip dropping the foreign key constraint since it was already removed manually
    conn = op.get_bind()
    result = conn.execute(text(
        "SELECT column_name FROM information_schema.columns WHERE table_name = 'menu_items';"
    ))
    columns = [row[0] for row in result]  # Access the first element of each tuple
    if 'menu_id' in columns:
        with op.batch_alter_table('menu_items', schema=None) as batch_op:
            batch_op.drop_column('menu_id')

    # Drop the `menus` table (if it still exists)
    op.execute("DROP TABLE IF EXISTS menus CASCADE")

    # Add new columns to `menu_items` table
    with op.batch_alter_table('menu_items', schema=None) as batch_op:
        batch_op.add_column(sa.Column('organization_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('dietary_preference', sa.String(length=50), nullable=True))
        batch_op.add_column(sa.Column('available_times', sa.String(length=100), nullable=True))
        batch_op.create_foreign_key(None, 'organizations', ['organization_id'], ['id'])


def downgrade():
    with op.batch_alter_table('menu_items', schema=None) as batch_op:
        batch_op.add_column(sa.Column('menu_id', sa.INTEGER(), autoincrement=False, nullable=True))
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('menu_items_menu_id_fkey', 'menus', ['menu_id'], ['id'])
        batch_op.drop_column('available_times')
        batch_op.drop_column('dietary_preference')
        batch_op.drop_column('organization_id')

    op.create_table('menus',
                    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
                    sa.Column('name', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
                    sa.Column('organization_id', sa.INTEGER(), autoincrement=False, nullable=True),
                    sa.Column('is_active', sa.BOOLEAN(), autoincrement=False, nullable=True),
                    sa.ForeignKeyConstraint(['organization_id'], ['organizations.id'],
                                            name='menus_organization_id_fkey'),
                    sa.PrimaryKeyConstraint('id', name='menus_pkey')
                    )
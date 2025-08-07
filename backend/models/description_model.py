from sqlalchemy import Column, String, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from database.sql import Base
import uuid

class DescriptionModel(Base):
    __tablename__ = "descriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    connection_id = Column(UUID(as_uuid=True), nullable=False)
    table_name = Column(String, nullable=False)
    column_name = Column(String, nullable=True)
    description = Column(Text, nullable=False)

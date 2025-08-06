from sqlalchemy import Column, String, Integer, Boolean
from database.base import Base

class ConnectionModel(Base):
    __tablename__ = "connections"

    id = Column(String, primary_key=True, index=True)
    type = Column(String, nullable=False)

    connection_string = Column(String, nullable=True)

    username = Column(String, nullable=True)
    password = Column(String, nullable=True)
    host = Column(String, nullable=True)
    port = Column(Integer, nullable=True)
    database = Column(String, nullable=True)

    is_active = Column(Boolean, default=True)
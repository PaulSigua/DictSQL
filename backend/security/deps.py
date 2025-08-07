from fastapi import Depends, HTTPException
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from database.sql import get_db
from models.user_model import User
from services.auth_service import SECRET_KEY, ALGORITHM

def get_current_user(token: str = Depends(lambda: None), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(status_code=401, detail="Token inválido")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user

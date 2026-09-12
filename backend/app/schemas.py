from datetime import datetime
from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


class UpdateUserRequest(BaseModel):
    name: str | None = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: str
    password: str

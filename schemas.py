from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class UserBase(BaseModel):
    username: str
    email: str
    name: str
    roll_number: str
    department: str
    year: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    profile_picture_url: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class ItemBase(BaseModel):
    item_name: str
    description: str
    category: str
    location: str
    date: date
    contact: str
    item_type: str  # Lost, Found
    status: str = "Pending"  # Pending, Claimed, Returned
    image_url: Optional[str] = None


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    item_name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    date: Optional[date] = None
    contact: Optional[str] = None
    item_type: Optional[str] = None
    status: Optional[str] = None
    image_url: Optional[str] = None


class ItemResponse(ItemBase):
    id: int
    user_id: Optional[int] = None
    reporter: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)

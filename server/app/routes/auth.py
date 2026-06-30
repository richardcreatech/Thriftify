from fastapi import APIRouter
from app.schemas.auth import SignupSchema
from app.controllers.auth import signup_controller

router = APIRouter()


@router.post("/signup")
async def signup(user: SignupSchema):
    return await signup_controller(user)
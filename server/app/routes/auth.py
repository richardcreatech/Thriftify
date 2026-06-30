from fastapi import APIRouter
from app.schemas.auth import SignupSchema
from app.controllers.auth import signup_controller
from app.schemas.auth import LoginSchema
from app.controllers.auth import login_controller

router = APIRouter()


@router.post("/signup")
async def signup(user: SignupSchema):
    return await signup_controller(user)

@router.post("/login")
async def login(user: LoginSchema):
    return await login_controller(user)
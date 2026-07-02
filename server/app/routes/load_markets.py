from fastapi import APIRouter
from app.controllers.load_market import get_markets_controller


router = APIRouter()


@router.get("/get_markets")
async def read_markets():
    return await get_markets_controller()
from fastapi import APIRouter
from app.controllers.load_market import get_a_market, get_markets_controller


router = APIRouter()


@router.get("/get_markets")
async def read_markets():
    return await get_markets_controller()

@router.get("/get_a_market/{market_id}")
async def read_market(market_id: str):
    return await get_a_market(market_id)
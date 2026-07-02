from app.database import db
from bson import ObjectId
from fastapi import HTTPException

from bson import ObjectId
from fastapi import HTTPException


async def get_markets_controller():
    markets = await db.markets.find(
        {"status": "active"}
    ).to_list(length=None)

    public_markets = [
        {
            "id": str(market["_id"]),
            "name": market["name"],
            "description": market["description"],
            "logo": market["logo"],
            "products": [
                {
                    "name": product["name"],
                    "category": product["category"],
                    "price": product["price"],
                    "quantity": product["quantity"],
                    "imageURL": product["imageURL"],
                }
                for product in market["products"]
            ],
            # "reviews": market["reviews"],
        }
        for market in markets
    ]

    return {
        "success": True,
        "markets": public_markets,
    }




async def get_a_market(market_id: str):

    # Validate the ID
    if not ObjectId.is_valid(market_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid market ID."
        )

    # Find the market
    market = await db.markets.find_one(
        {"_id": ObjectId(market_id)}
    )

    if market is None:
        raise HTTPException(
            status_code=404,
            detail="Market not found."
        )

    # Build a response without exposing MongoDB ObjectIds
    public_market = {
        "id": str(market["_id"]),
        "owner": str(market["owner"]),
        "name": market["name"],
        "description": market["description"],
        "logo": market["logo"],
        "products": [
            {
                "name": product["name"],
                "category": product["category"],
                "price": product["price"],
                "quantity": product["quantity"],
                "imageURL": product["imageURL"],
                "order_number": product["order_number"],
                "revenue_generated": product["revenue_generated"],
            }
            for product in market["products"]
        ],
        # "reviews": market["reviews"],
    }

    return {
        "success": True,
        "market": public_market,
    }






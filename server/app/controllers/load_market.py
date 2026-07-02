from app.database import db

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
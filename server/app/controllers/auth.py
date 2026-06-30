from app.database import db

async def signup_controller(user):
    existing = await db.users.find_one({
        "email": user.email
    })

    if existing:
        return {
            "success": False,
            "message": "Email already exists"
        }

    new_user = {
        "username": user.username,
        "email": user.email,
        "password": user.password
    }

    await db.users.insert_one(new_user)

    return {
        "success": True,
        "message": "Account created"
    }
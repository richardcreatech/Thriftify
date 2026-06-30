from app.database import db
import bcrypt
from app.utils.jwt import create_access_token

async def signup_controller(user):
    existing = await db.users.find_one({
        "email": user.email
    })

    if existing:
        return {
            "success": False,
            "message": "Email already exists"
        }
    
    hashed_password = bcrypt.hashpw(
    user.password.encode("utf-8"),
    bcrypt.gensalt()
).decode("utf-8")

    new_user = {
    "name": user.name,
    "email": user.email,
    "password": hashed_password,
    "role":"buyer"
}

    await db.users.insert_one(new_user)

    return {
        "success": True,
        "message": "Account created"
    }

async def login_controller(user):
    existing_user = await db.users.find_one({
        "email": user.email
    })

    if not existing_user:
        return {
            "success": False,
            "message": "Invalid email or password"
        }

    password_match = bcrypt.checkpw(
        user.password.encode("utf-8"),
        existing_user["password"].encode("utf-8")
    )

    if not password_match:
        return {
            "success": False,
            "message": "Invalid email or password"
        }
    
    token = create_access_token({
    "id": str(existing_user["_id"]),
    "email": existing_user["email"]
})

    return {
    "success": True,
    "message": "Login successful",
    "token": token,
    "user": {
        "id": str(existing_user["_id"]),
        "name": existing_user["name"],
        "email": existing_user["email"]
    }
}



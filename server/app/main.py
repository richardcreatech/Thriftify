from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# from app.routes.auth import router as auth_router
# from app.routes.products import router as product_router
# from app.routes.marketplace import router as marketplace_router
# from app.routes.orders import router as order_router

# app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
# app.include_router(product_router, prefix="/products", tags=["Products"])
# app.include_router(marketplace_router, prefix="/marketplace", tags=["Marketplace"])
# app.include_router(order_router, prefix="/orders", tags=["Orders"])

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
)
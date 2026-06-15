from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI(title="MediBook Gateway")

SPRING_URL = "http://springboot:8080/api"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "MediBook FastAPI Gateway Running!"}

@app.post("/gateway/register")
async def register(data: dict):
    async with httpx.AsyncClient() as client:
        res = await client.post(f"{SPRING_URL}/register", json=data)
        return res.json()

@app.post("/gateway/login")
async def login(data: dict):
    async with httpx.AsyncClient() as client:
        res = await client.post(f"{SPRING_URL}/login", json=data)
        return res.json()

@app.get("/gateway/providers")
async def get_providers():
    async with httpx.AsyncClient() as client:
        res = await client.get(f"{SPRING_URL}/providers")
        return res.json()

@app.get("/gateway/slots/{provider_id}")
async def get_slots(provider_id: int):
    async with httpx.AsyncClient() as client:
        res = await client.get(f"{SPRING_URL}/slots/{provider_id}")
        return res.json()

@app.post("/gateway/book")
async def book(data: dict):
    async with httpx.AsyncClient() as client:
        res = await client.post(f"{SPRING_URL}/book", json=data)
        return res.json()

@app.get("/gateway/my-appointments/{user_id}")
async def my_appointments(user_id: int):
    async with httpx.AsyncClient() as client:
        res = await client.get(f"{SPRING_URL}/my-appointments/{user_id}")
        return res.json()

@app.delete("/gateway/cancel/{id}")
async def cancel(id: int):
    async with httpx.AsyncClient() as client:
        res = await client.delete(f"{SPRING_URL}/cancel/{id}")
        return res.json()

@app.get("/gateway/admin/users")
async def all_users():
    async with httpx.AsyncClient() as client:
        res = await client.get(f"{SPRING_URL}/admin/users")
        return res.json()

@app.get("/gateway/admin/appointments")
async def all_appointments():
    async with httpx.AsyncClient() as client:
        res = await client.get(f"{SPRING_URL}/admin/appointments")
        return res.json()

@app.get("/gateway/admin/providers")
async def all_providers():
    async with httpx.AsyncClient() as client:
        res = await client.get(f"{SPRING_URL}/admin/providers")
        return res.json()

@app.get("/health")
def health():
    return {"status": "healthy", "gateway": "FastAPI"}
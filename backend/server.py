"""Studio Wonderland API (FastAPI).

Mirrors the previous Next.js route handlers:
  - GET  /api/                      health
  - GET  /api/news?site&category    proxy to the Clara/koodh CMS (independent of MongoDB)
  - GET  /api/news/{article_id}     proxy to the CMS article endpoint
  - GET/POST            /api/productions          (MongoDB)
  - PUT/DELETE          /api/productions/{id}      (MongoDB)
  - GET/POST            /api/contact               (MongoDB)

Designed for a /frontend (React SPA) + /backend (FastAPI) VPS deployment, served
behind nginx which proxies /api -> this service.
"""
import os
import uuid
from datetime import datetime, timezone

import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "studio_wonderland")
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*")
NEWS_BASE = "https://clr.koodh.com/api/news"

app = FastAPI(title="Studio Wonderland API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in CORS_ORIGINS.split(",")] if CORS_ORIGINS != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MongoDB (lazy) ---------------------------------------------------------
_client = None
_db = None


def get_db():
    global _client, _db
    if _db is None:
        _client = AsyncIOMotorClient(MONGO_URL)
        _db = _client[DB_NAME]
    return _db


DEFAULT_PRODUCTIONS = [
    {
        "title": "De Grote Sinterklaasshow 2024",
        "year": 2024,
        "description": "Een uitverkochte tournee vol muziek, dans en magie. Duizenden gezinnen beleefden samen een onvergetelijke avond vol verwondering.",
        "cover": "https://images.unsplash.com/photo-1579170085683-923338faa919?auto=format&fit=crop&w=1600&q=80",
        "gallery": [
            "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1600&q=80",
            "https://images.pexels.com/photos/4218027/pexels-photo-4218027.jpeg?auto=compress&cs=tinysrgb&w=1600",
        ],
        "videos": [],
    },
    {
        "title": "Huis van de Kerstman 2023",
        "year": 2023,
        "description": "Een warme winterbeleving waar families zelf het verhaal binnenstapten.",
        "cover": "https://images.unsplash.com/photo-1543589077-47d81606c1bf?auto=format&fit=crop&w=1600&q=80",
        "gallery": [],
        "videos": [],
    },
]


async def seed_productions(db):
    if await db.productions.count_documents({}) == 0:
        docs = []
        for p in DEFAULT_PRODUCTIONS:
            docs.append({"id": str(uuid.uuid4()), **p, "created_at": datetime.now(timezone.utc)})
        if docs:
            await db.productions.insert_one(docs[0]) if len(docs) == 1 else await db.productions.insert_many(docs)


def strip_id(doc):
    doc.pop("_id", None)
    return doc


# --- Health -----------------------------------------------------------------
@app.get("/api/")
@app.get("/api")
async def root():
    return {"message": "Studio Wonderland API"}


# --- News proxy (independent of MongoDB) ------------------------------------
@app.get("/api/news")
async def news_list(site: str = "sinterklaas-genk", category: str = "homepagina"):
    url = f"{NEWS_BASE}/{site}/{category}"
    try:
        async with httpx.AsyncClient(timeout=15) as c:
            r = await c.get(url, headers={"Accept": "application/json"})
        if r.status_code != 200:
            return JSONResponse({"items": [], "count": 0})
        return JSONResponse(r.json())
    except Exception:
        return JSONResponse({"items": [], "count": 0})


@app.get("/api/news/{article_id}")
async def news_article(article_id: str):
    url = f"{NEWS_BASE}/articles/{article_id}"
    try:
        async with httpx.AsyncClient(timeout=15) as c:
            r = await c.get(url, headers={"Accept": "application/json"})
        if r.status_code != 200:
            return JSONResponse({"error": "Artikel niet gevonden"}, status_code=404)
        return JSONResponse(r.json())
    except Exception:
        return JSONResponse({"error": "Kon artikel niet laden"}, status_code=502)


# --- Productions (MongoDB) --------------------------------------------------
@app.get("/api/productions")
async def productions_list():
    db = get_db()
    await seed_productions(db)
    items = await db.productions.find({}).sort([("year", -1), ("created_at", -1)]).to_list(200)
    return [strip_id(i) for i in items]


@app.post("/api/productions")
async def productions_create(request: Request):
    db = get_db()
    b = await request.json()
    obj = {
        "id": str(uuid.uuid4()),
        "title": b.get("title") or "Naamloze productie",
        "year": int(b.get("year") or datetime.now().year),
        "description": b.get("description") or "",
        "cover": b.get("cover") or "",
        "gallery": b.get("gallery") if isinstance(b.get("gallery"), list) else [],
        "videos": b.get("videos") if isinstance(b.get("videos"), list) else [],
        "created_at": datetime.now(timezone.utc),
    }
    await db.productions.insert_one(dict(obj))
    return strip_id(dict(obj))


@app.put("/api/productions/{item_id}")
async def productions_update(item_id: str, request: Request):
    db = get_db()
    b = await request.json()
    update = {}
    for k in ["title", "year", "description", "cover", "gallery", "videos"]:
        if b.get(k) is not None:
            update[k] = int(b[k]) if k == "year" else b[k]
    await db.productions.update_one({"id": item_id}, {"$set": update})
    doc = await db.productions.find_one({"id": item_id})
    if not doc:
        return JSONResponse({"error": "Productie niet gevonden"}, status_code=404)
    return strip_id(doc)


@app.delete("/api/productions/{item_id}")
async def productions_delete(item_id: str):
    db = get_db()
    await db.productions.delete_one({"id": item_id})
    return {"success": True}


# --- Contact (MongoDB) ------------------------------------------------------
@app.post("/api/contact")
async def contact_create(request: Request):
    db = get_db()
    b = await request.json()
    if not b.get("name") or not b.get("email") or not b.get("message"):
        return JSONResponse({"error": "name, email en message zijn verplicht"}, status_code=400)
    obj = {
        "id": str(uuid.uuid4()),
        "name": b["name"],
        "email": b["email"],
        "subject": b.get("subject") or "",
        "message": b["message"],
        "created_at": datetime.now(timezone.utc),
    }
    await db.messages.insert_one(dict(obj))
    return strip_id(dict(obj))


@app.get("/api/contact")
async def contact_list():
    db = get_db()
    items = await db.messages.find({}).sort([("created_at", -1)]).to_list(500)
    return [strip_id(i) for i in items]

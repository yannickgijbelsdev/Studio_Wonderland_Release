import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

let client
let db

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

const DEFAULT_PRODUCTIONS = [
  {
    title: 'De Grote Sinterklaasshow 2024',
    year: 2024,
    description: 'Een uitverkochte tournee vol muziek, dans en magie. Duizenden gezinnen beleefden samen een onvergetelijke avond vol verwondering.',
    cover: 'https://images.unsplash.com/photo-1579170085683-923338faa919?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1600&q=80',
      'https://images.pexels.com/photos/4218027/pexels-photo-4218027.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.unsplash.com/photo-1584228363795-3a8b2c2c1d78?auto=format&fit=crop&w=1600&q=80'
    ],
    videos: []
  },
  {
    title: 'Huis van de Kerstman 2023',
    year: 2023,
    description: 'Een magische winterwereld waarin gezinnen letterlijk het huis van de Kerstman binnenstapten. Warme lichtjes, sneeuw en verwondering in elke kamer.',
    cover: 'https://images.unsplash.com/photo-1703270102010-0003360a821f?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511600173735-a896042389cf?auto=format&fit=crop&w=1600&q=80',
      'https://images.pexels.com/photos/28920806/pexels-photo-28920806.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?auto=format&fit=crop&w=1600&q=80'
    ],
    videos: []
  },
  {
    title: 'Winterdroom Familietour',
    year: 2022,
    description: 'Een intieme reeks belevingen waarin families samen op reis gingen door een wereld van licht, muziek en warmte.',
    cover: 'https://images.unsplash.com/photo-1639178952543-1c0ea3cbacaa?auto=format&fit=crop&w=1600&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1549227082-0ea18ce30397?auto=format&fit=crop&w=1600&q=80',
      'https://images.pexels.com/photos/773594/pexels-photo-773594.jpeg?auto=compress&cs=tinysrgb&w=1600'
    ],
    videos: []
  }
]

async function seedProductions(db) {
  const count = await db.collection('productions').countDocuments()
  if (count === 0) {
    const docs = DEFAULT_PRODUCTIONS.map(p => ({ ...p, id: uuidv4(), created_at: new Date() }))
    await db.collection('productions').insertMany(docs)
  }
}

async function handleRoute(request, { params }) {
  const { path = [] } = await params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    if ((route === '/' || route === '/root') && method === 'GET') {
      return handleCORS(NextResponse.json({ message: 'Studio Wonderland API' }))
    }

    // ---- PRODUCTIONS ----
    if (route === '/productions' && method === 'GET') {
      await seedProductions(db)
      const items = await db.collection('productions').find({}).sort({ year: -1, created_at: -1 }).toArray()
      return handleCORS(NextResponse.json(items.map(({ _id, ...r }) => r)))
    }

    if (route === '/productions' && method === 'POST') {
      const b = await request.json()
      const obj = {
        id: uuidv4(),
        title: b.title || 'Naamloze productie',
        year: Number(b.year) || new Date().getFullYear(),
        description: b.description || '',
        cover: b.cover || '',
        gallery: Array.isArray(b.gallery) ? b.gallery : [],
        videos: Array.isArray(b.videos) ? b.videos : [],
        created_at: new Date()
      }
      await db.collection('productions').insertOne(obj)
      const { _id, ...r } = obj
      return handleCORS(NextResponse.json(r))
    }

    if (route.startsWith('/productions/') && method === 'PUT') {
      const id = path[1]
      const b = await request.json()
      const update = {}
      ;['title', 'year', 'description', 'cover', 'gallery', 'videos'].forEach(k => {
        if (b[k] !== undefined) update[k] = k === 'year' ? Number(b[k]) : b[k]
      })
      await db.collection('productions').updateOne({ id }, { $set: update })
      const doc = await db.collection('productions').findOne({ id })
      if (!doc) return handleCORS(NextResponse.json({ error: 'Productie niet gevonden' }, { status: 404 }))
      const { _id, ...r } = doc
      return handleCORS(NextResponse.json(r))
    }

    if (route.startsWith('/productions/') && method === 'DELETE') {
      const id = path[1]
      await db.collection('productions').deleteOne({ id })
      return handleCORS(NextResponse.json({ success: true }))
    }

    // ---- CONTACT ----
    if (route === '/contact' && method === 'POST') {
      const b = await request.json()
      if (!b.name || !b.email || !b.message) {
        return handleCORS(NextResponse.json({ error: 'name, email en message zijn verplicht' }, { status: 400 }))
      }
      const obj = {
        id: uuidv4(),
        name: b.name,
        email: b.email,
        subject: b.subject || '',
        message: b.message,
        created_at: new Date()
      }
      await db.collection('messages').insertOne(obj)
      const { _id, ...r } = obj
      return handleCORS(NextResponse.json(r))
    }

    if (route === '/contact' && method === 'GET') {
      const items = await db.collection('messages').find({}).sort({ created_at: -1 }).toArray()
      return handleCORS(NextResponse.json(items.map(({ _id, ...r }) => r)))
    }

    return handleCORS(NextResponse.json({ error: `Route ${route} not found` }, { status: 404 }))
  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json({ error: 'Internal server error' }, { status: 500 }))
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute

# MongoDB Backend Setup for Client Studies

## 1. Create MongoDB Atlas database

Create a cluster and database for `ghl-prime`.

## 2. Add environment file

Copy `server/.env.example` to `server/.env` and set:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
```

## 3. Install backend dependencies

```bash
cd server
npm install
```

## 4. Seed starter case studies

```bash
cd server
node src/scripts/seed.js
```

## 5. Start the backend

```bash
cd server
npm run dev
```

## API routes

- `GET /api/health`
- `GET /api/case-studies`
- `GET /api/case-studies/:slug`
- `POST /api/case-studies`
- `PUT /api/case-studies/:id`
- `DELETE /api/case-studies/:id`

## Frontend integration note

To use the live backend from the frontend later, add a frontend env var like:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

Then point case studies fetches to that API.

## Shareable links

Each case study uses a unique `slug`, enabling links such as:

- `/client-studies/home-services-lead-automation`
- `/client-studies/saas-crm-migration`
- `/client-studies/real-estate-ai-agent`

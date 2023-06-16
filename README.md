# Server for SkinSight App

Backend apps for SkinSight

## Setup

Note : Required NodeJS version >= 18.0.0

- Check npm version

```bash
npm -v
```

- Install dependencies

```bash
npm install
```

- Copy .env.example to .env

```bash
cp .env.example .env
```

- Database migration

```bash
npx prisma db push
```

- Database seeder

```bash
npx prisma db seed
```

## 🔥 Firing Up Server

- Development Mode

```bash
npm run serve
```

- Production Mode

  **Working in Progress. Coming Soon**

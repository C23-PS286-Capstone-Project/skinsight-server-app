# Server for SkinSight App

Backend apps for SkinSight

## API Documentations

https://documenter.getpostman.com/view/13203177/2s93m8xKRr

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

- Connect to database

```bash
edit url on scheme.prisma
```

- Database migration

```bash
npx prisma db push
```

- Database seeder

```bash
npx prisma db seed
```

- Connect to google cloud bucket

```bash
edit file serviceaccountkey.json
edit projectId, bucketName on ModelController.json
```

## 🔥 Firing Up Server

- Development Mode

```bash
npm run serve
```

- Production Mode

```bash
On google cloud shell: gcloud run deploy skinsight-server-app --source .
```

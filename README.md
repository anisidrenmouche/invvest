# Invvest

## Lancer en local

```bash
npm install
npm run dev
```

Ouvre http://localhost:3000

## Configuration Clerk (auth)

1. Crée un compte sur https://clerk.com
2. Crée une application
3. Copie les clés dans `.env.local` :

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Déployer sur Vercel

1. Push sur GitHub
2. Import sur https://vercel.com
3. Ajoute les variables d'environnement Clerk dans Settings → Environment Variables

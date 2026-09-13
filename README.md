# HouseCraft Access Website

A separate Next.js application for the HouseCraft FCFS registration flow. The existing NFT generation code, trait library, and outputs remain unchanged.

## Run locally

Requirements: Node.js 20.9 or newer.

```bash
cd website
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. With blank Supabase variables, local development uses demo mode: the full flow works, but the entry is only logged by the server and is not persisted.

## Assets

- Replace `public/assets/background.gif` with the final animated background. It is rendered fixed, full-screen, centered, covered, and at low opacity.
- Place the final hammer sprite at `public/assets/hammer.png`. Until then, `HammerNailCheck` uses its built-in CSS pixel hammer.
- A future saw sprite can be placed at `public/assets/saw.png`. The current brand mark is a CSS crossed hammer and hand saw because no original logo/PFP tool asset was present.
- Collection animations live at `public/assets/nfts/01.gif` through `06.gif`. The current files are copied from the existing HouseCraft generated test collection and can be replaced in place.

Keep replacement art square and use pixelated rendering. The collection master is 1254 × 1254 px and uses stepped blocks, dark espresso outlines, terracotta, cream, sky blue, grass green, and stone grey.

## Social links

Edit `config/social.ts`:

- `HOUSECRAFT_X_PROFILE` controls FOLLOW.
- `PINNED_POST_URL` controls LIKE, REPOST, and COMMENT.

Until configured, task links safely open `https://x.com`. The interface never claims API verification: users open the link and explicitly mark each task complete.

## Supabase

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local`.
4. Add the project URL as `SUPABASE_URL` and the server secret key as `SUPABASE_SECRET_KEY`.
5. Restart the development server.

The browser submits only to `app/api/entries/route.ts`; validation and normalization run again on the server. The server-only data module sends the secret key directly to the Supabase REST API. X usernames and EVM wallets are stored lowercase. Database checks and unique indexes prevent duplicate normalized usernames and wallets. Never prefix the secret key with `NEXT_PUBLIC_`, import the data module into a Client Component, or commit `.env.local`.

Submitted wallets are stored in `public.fcfs_entries`. RLS remains enabled, all table permissions are revoked from anonymous and authenticated browser roles, and no public INSERT policy is created. The secret server credential bypasses RLS only inside the validated API route. The project owner can view entries from the private Supabase Dashboard/Table Editor; protect the Supabase account and never expose the secret key.

Production rate limiting is enforced by a Vercel Firewall rule for `POST /api/entries`: 5 requests per 60 seconds per IP address. It runs before the request reaches the Next.js route or Supabase.

## Deploy to Vercel later

1. Import the repository in Vercel.
2. Set the Root Directory to `website`.
3. Add both environment variables from `.env.example` in Project Settings.
4. Deploy using the standard Next.js preset.

No domain, wallet connection, X OAuth/API verification, minting, or smart contract is included in this version.

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
4. Add the project URL and anon key.
5. Restart the development server.

The browser submits to `app/api/entries/route.ts`; validation and normalization run again on the server. X usernames and EVM wallets are stored lowercase. Database checks and unique indexes prevent duplicate normalized usernames and wallets. The anon key is designed to be public, while row-level security allows only inserts matching the required completed-task checks. Do not place a Supabase service-role key in this application.

Submitted wallets are stored in `public.fcfs_entries`. The SQL revokes all table permissions from anonymous and authenticated browser roles, then grants anonymous users only `INSERT`. There is no public `SELECT`, `UPDATE`, or `DELETE` access. The project owner can view entries from the private Supabase Dashboard/Table Editor; protect the Supabase account and never expose the service-role key.

## Deploy to Vercel later

1. Import the repository in Vercel.
2. Set the Root Directory to `website`.
3. Add both environment variables from `.env.example` in Project Settings.
4. Deploy using the standard Next.js preset.

No domain, wallet connection, X OAuth/API verification, minting, or smart contract is included in this version.

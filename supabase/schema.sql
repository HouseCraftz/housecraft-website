create extension if not exists pgcrypto;

create table if not exists public.fcfs_entries (
  id uuid primary key default gen_random_uuid(),
  x_username text not null,
  evm_wallet text not null,
  follow_completed boolean not null default false,
  like_completed boolean not null default false,
  repost_completed boolean not null default false,
  comment_completed boolean not null default false,
  created_at timestamptz not null default now(),
  constraint x_username_format check (x_username ~ '^[a-z0-9_]{1,15}$'),
  constraint evm_wallet_format check (evm_wallet ~ '^0x[0-9a-f]{40}$'),
  constraint all_tasks_complete check (
    follow_completed and like_completed and repost_completed and comment_completed
  )
);

create unique index if not exists fcfs_entries_x_username_unique
  on public.fcfs_entries (lower(x_username));

create unique index if not exists fcfs_entries_evm_wallet_unique
  on public.fcfs_entries (lower(evm_wallet));

alter table public.fcfs_entries enable row level security;

revoke all on table public.fcfs_entries from anon, authenticated;
grant insert on table public.fcfs_entries to anon;

drop policy if exists "allow anonymous fcfs entry" on public.fcfs_entries;
create policy "allow anonymous fcfs entry"
  on public.fcfs_entries for insert to anon
  with check (
    follow_completed and like_completed and repost_completed and comment_completed
  );

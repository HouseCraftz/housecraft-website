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
grant insert on table public.fcfs_entries to service_role;
drop policy if exists "allow anonymous fcfs entry" on public.fcfs_entries;

-- No public INSERT policy is created. The validated server route writes with
-- SUPABASE_SECRET_KEY, which stays server-only and bypasses RLS.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated, service_role;

create table if not exists private.housecraft_registration_rate_limits (
  ip_hash text primary key,
  minute_window_started_at timestamptz not null,
  minute_request_count integer not null,
  hour_window_started_at timestamptz not null,
  hour_request_count integer not null,
  updated_at timestamptz not null
);

create index if not exists housecraft_registration_rate_limits_updated_at_idx
  on private.housecraft_registration_rate_limits (updated_at);

revoke all on table private.housecraft_registration_rate_limits
  from public, anon, authenticated, service_role;

create or replace function public.check_housecraft_registration_rate_limit(p_ip_hash text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  checked_at timestamptz := clock_timestamp();
  allowed boolean;
begin
  if p_ip_hash !~ '^[0-9a-f]{64}$' then
    return false;
  end if;

  delete from private.housecraft_registration_rate_limits
  where updated_at < checked_at - interval '24 hours';

  insert into private.housecraft_registration_rate_limits as limits (
    ip_hash,
    minute_window_started_at,
    minute_request_count,
    hour_window_started_at,
    hour_request_count,
    updated_at
  ) values (
    p_ip_hash,
    checked_at,
    1,
    checked_at,
    1,
    checked_at
  )
  on conflict (ip_hash) do update set
    minute_window_started_at = case
      when limits.minute_window_started_at <= checked_at - interval '1 minute' then checked_at
      else limits.minute_window_started_at
    end,
    minute_request_count = case
      when limits.minute_window_started_at <= checked_at - interval '1 minute' then 1
      else limits.minute_request_count + 1
    end,
    hour_window_started_at = case
      when limits.hour_window_started_at <= checked_at - interval '1 hour' then checked_at
      else limits.hour_window_started_at
    end,
    hour_request_count = case
      when limits.hour_window_started_at <= checked_at - interval '1 hour' then 1
      else limits.hour_request_count + 1
    end,
    updated_at = checked_at
  returning minute_request_count <= 5 and hour_request_count <= 20 into allowed;

  return allowed;
end;
$$;

revoke all on function public.check_housecraft_registration_rate_limit(text)
  from public, anon, authenticated;
grant execute on function public.check_housecraft_registration_rate_limit(text)
  to service_role;

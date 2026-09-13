export type FcfsEntry = {
  x_username: string;
  evm_wallet: string;
  follow_completed: boolean;
  like_completed: boolean;
  repost_completed: boolean;
  comment_completed: boolean;
};

export class EntryConflictError extends Error {}
export class EntryConfigurationError extends Error {}

export async function createEntry(entry: FcfsEntry) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    if (process.env.NODE_ENV === "development") {
      console.info("HouseCraft demo submission (Supabase is not configured):", entry);
      return { demo: true };
    }
    throw new EntryConfigurationError("Database is not configured.");
  }

  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/fcfs_entries`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(entry),
    cache: "no-store",
  });

  if (response.status === 409) throw new EntryConflictError("This X account or wallet is already registered.");
  if (!response.ok) throw new Error("The entry could not be stored.");
  return { demo: false };
}

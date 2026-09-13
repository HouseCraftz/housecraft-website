import "server-only";

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

type SupabaseError = {
  code?: unknown;
  message?: unknown;
  details?: unknown;
  hint?: unknown;
};

function diagnosticValue(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function logSupabaseError(status: number, error: SupabaseError) {
  console.error("HouseCraft Supabase insert failed", {
    status,
    code: diagnosticValue(error.code),
    message: diagnosticValue(error.message),
    details: diagnosticValue(error.details),
    hint: diagnosticValue(error.hint),
  });
}

function uniqueConflictMessage(error: SupabaseError) {
  const signature = [error.message, error.details, error.hint]
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();

  if (signature.includes("x_username")) return "This X account is already registered.";
  if (signature.includes("evm_wallet")) return "This wallet is already registered.";
  return "This X account or wallet is already registered.";
}

export async function createEntry(entry: FcfsEntry) {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    if (process.env.NODE_ENV === "development") {
      console.info("HouseCraft demo submission (Supabase is not configured):", entry);
      return { demo: true };
    }
    throw new EntryConfigurationError("Database is not configured.");
  }

  const endpoint = `${url.replace(/\/+$/, "")}/rest/v1/fcfs_entries`;
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: secretKey,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(entry),
      cache: "no-store",
    });
  } catch (error) {
    console.error("HouseCraft Supabase request failed before receiving a response", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : undefined,
    });
    throw new Error("The entry could not be stored.");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({})) as SupabaseError;
    logSupabaseError(response.status, error);
    if (response.status === 409 || error.code === "23505") {
      throw new EntryConflictError(uniqueConflictMessage(error));
    }
    throw new Error("The entry could not be stored.");
  }
  return { demo: false };
}

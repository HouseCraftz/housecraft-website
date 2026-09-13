import "server-only";

import { createHmac } from "node:crypto";
import { ipAddress } from "@vercel/functions";

export class RateLimitConfigurationError extends Error {}

type SupabaseRateLimitError = {
  code?: unknown;
  message?: unknown;
  details?: unknown;
  hint?: unknown;
};

function diagnosticValue(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function logRateLimitError(status: number, error: SupabaseRateLimitError) {
  console.error("HouseCraft rate-limit check failed", {
    status,
    code: diagnosticValue(error.code),
    message: diagnosticValue(error.message),
    details: diagnosticValue(error.details),
    hint: diagnosticValue(error.hint),
  });
}

export async function isRegistrationAllowed(request: Request) {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    if (process.env.NODE_ENV === "development") return true;
    throw new RateLimitConfigurationError("Rate limiting is not configured.");
  }

  const clientIp = ipAddress(request);
  if (!clientIp) {
    if (process.env.NODE_ENV === "development") return true;
    throw new RateLimitConfigurationError("Client IP is unavailable.");
  }

  const ipHash = createHmac("sha256", secretKey)
    .update(`housecraft-registration:${clientIp}`)
    .digest("hex");
  const endpoint = `${url.replace(/\/+$/, "")}/rest/v1/rpc/check_housecraft_registration_rate_limit`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: secretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_ip_hash: ipHash }),
      cache: "no-store",
    });
  } catch (error) {
    console.error("HouseCraft rate-limit request failed before receiving a response", {
      name: error instanceof Error ? error.name : undefined,
      message: error instanceof Error ? error.message : undefined,
    });
    throw new RateLimitConfigurationError("Rate limiting is temporarily unavailable.");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({})) as SupabaseRateLimitError;
    logRateLimitError(response.status, error);
    throw new RateLimitConfigurationError("Rate limiting is temporarily unavailable.");
  }

  return await response.json() === true;
}

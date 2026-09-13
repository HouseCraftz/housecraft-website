import { NextResponse } from "next/server";
import { createEntry, EntryConfigurationError, EntryConflictError } from "@/lib/entries";
import { isRegistrationAllowed, RateLimitConfigurationError } from "@/lib/rate-limit";
import { isValidWallet, isValidXUsername, normalizeWallet, normalizeXUsername } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    if (!await isRegistrationAllowed(request)) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please wait and try again." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const xUsername = normalizeXUsername(String(body.x_username ?? ""));
    const wallet = normalizeWallet(String(body.evm_wallet ?? ""));
    const taskKeys = ["follow_completed", "like_completed", "repost_completed", "comment_completed"] as const;

    if (!isValidXUsername(xUsername)) {
      return NextResponse.json({ error: "Enter a valid X username." }, { status: 400 });
    }
    if (!isValidWallet(wallet)) {
      return NextResponse.json({ error: "Enter a valid EVM wallet." }, { status: 400 });
    }
    if (!taskKeys.every((key) => body[key] === true)) {
      return NextResponse.json({ error: "Complete all four social tasks first." }, { status: 400 });
    }

    const result = await createEntry({
      x_username: xUsername.toLowerCase(),
      evm_wallet: wallet,
      follow_completed: true,
      like_completed: true,
      repost_completed: true,
      comment_completed: true,
    });

    return NextResponse.json({ ok: true, demo: result.demo });
  } catch (error) {
    if (error instanceof EntryConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof EntryConfigurationError || error instanceof RateLimitConfigurationError) {
      return NextResponse.json({ error: "Registration is temporarily unavailable." }, { status: 503 });
    }
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

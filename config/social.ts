export const HOUSECRAFT_X_PROFILE = "https://x.com/HouseCraftz?s=20";
export const PINNED_POST_URL = "https://x.com/HouseCraftz?s=20";

export const SOCIAL_TASKS = [
  { id: "follow", label: "FOLLOW", href: HOUSECRAFT_X_PROFILE, detail: "HOUSECRAFT ON X" },
  { id: "like", label: "LIKE", href: PINNED_POST_URL, detail: "PINNED POST" },
  { id: "repost", label: "REPOST", href: PINNED_POST_URL, detail: "PINNED POST" },
  { id: "comment", label: "COMMENT", href: PINNED_POST_URL, detail: "PINNED POST" },
] as const;

export type SocialTaskId = (typeof SOCIAL_TASKS)[number]["id"];

export const X_USERNAME_PATTERN = /^[A-Za-z0-9_]{1,15}$/;
export const EVM_WALLET_PATTERN = /^0x[a-fA-F0-9]{40}$/;

export function normalizeXUsername(value: string) {
  return value.trim().replace(/^@+/, "");
}

export function normalizeWallet(value: string) {
  return value.trim().toLowerCase();
}

export function isValidXUsername(value: string) {
  return X_USERNAME_PATTERN.test(normalizeXUsername(value));
}

export function isValidWallet(value: string) {
  return EVM_WALLET_PATTERN.test(value.trim());
}

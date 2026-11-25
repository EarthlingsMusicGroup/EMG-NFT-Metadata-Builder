/**
 * Plain-language checks mirroring `src/lib/validation.ts` and the limits on
 * the collection inputs. Kept inside this folder so the widget can move to
 * another app without importing the builder.
 */

export type CheckName =
  | "url"
  | "uri"
  | "hexColor"
  | "tokenSymbol"
  | "evmAddress"
  | "solanaAddress"
  | "xrplAddress"
  | "tezosAddress"
  | "nearAddress"
  | "mime"
  | "nftType"
  | "policyId"
  | "positiveInt"
  | "isoDate"
  | "royalty"
  | "itemImage"
  | "ipfsKey";

export type CheckExtra = {
  required?: boolean;
  requiredNote?: string;
  chain?: string | null;
  min?: number;
  max?: number;
  ipfsOn?: boolean;
};

const URL_NOTE =
  "That isn't a full URL. The checker says “Invalid URL format”. Include https://.";

const URI_NOTE =
  "Use a URI that starts with ipfs://, ar://, http://, or https://.";

export function explainCheck(
  check: CheckName,
  value: string,
  extra: CheckExtra = {},
): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    if (extra.required) {
      return extra.requiredNote ?? "This field is required.";
    }
    if (check === "ipfsKey") {
      return ipfsKeyNote("", extra);
    }
    return null;
  }

  switch (check) {
    case "url":
      return isUrl(trimmed) ? null : URL_NOTE;
    case "uri":
      return isUri(trimmed) ? null : `${URI_NOTE} The checker rejects other shapes.`;
    case "hexColor":
      return hexNote(trimmed);
    case "tokenSymbol":
      return /^[A-Z0-9]{1,10}$/.test(trimmed)
        ? null
        : "Use 1–10 characters, uppercase letters and digits only. The checker says “Symbol must be 1-10 uppercase alphanumeric characters”.";
    case "evmAddress":
      return /^0x[a-fA-F0-9]{40}$/.test(trimmed)
        ? null
        : "EVM addresses are 0x plus 40 hex characters.";
    case "solanaAddress":
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmed)
        ? null
        : "Solana addresses are base58, 32–44 characters, with no 0, O, I, or l.";
    case "xrplAddress":
      return /^r[a-zA-Z0-9]{24,34}$/.test(trimmed)
        ? null
        : "XRPL classic addresses start with r and then 24–34 letters or numbers. The checker says “Invalid XRPL address format”.";
    case "tezosAddress":
      return /^tz[1-3][a-zA-Z0-9]{33}$/.test(trimmed)
        ? null
        : "Tezos addresses start with tz1, tz2, or tz3 and then 33 characters. The checker says “Invalid Tezos address format”.";
    case "nearAddress":
      return /^[a-z0-9._-]+$/.test(trimmed) && trimmed.length <= 64
        ? null
        : "NEAR accounts are lowercase letters, digits, dots, underscores, or hyphens, up to 64 characters.";
    case "mime":
      return /^[a-z]+\/[a-z0-9\-+.]+$/.test(trimmed)
        ? null
        : "Use a lowercase MIME type like image/png. The checker says “Invalid MIME type format”.";
    case "nftType":
      return nftTypeNote(trimmed);
    case "policyId":
      return /^[0-9a-fA-F]{56}$/.test(trimmed)
        ? null
        : "Policy IDs are exactly 56 hex characters. The checker says “Invalid policy ID format (56 hex characters)”.";
    case "positiveInt":
      return positiveIntNote(trimmed);
    case "isoDate":
      return !Number.isNaN(Date.parse(trimmed)) && trimmed.includes("T")
        ? null
        : "Use an ISO 8601 timestamp that includes T. The checker says “Invalid date format (ISO 8601 required)”.";
    case "royalty":
      return royaltyNote(trimmed, extra.min ?? 0, extra.max ?? 100);
    case "itemImage":
      return itemImageNote(trimmed, extra.chain ?? null);
    case "ipfsKey":
      return ipfsKeyNote(trimmed, extra);
    default:
      return null;
  }
}

function isUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function isUri(value: string): boolean {
  return /^(ipfs|ar|https?):\/\//i.test(value);
}

function hexNote(value: string): string | null {
  if (value.startsWith("#")) {
    return "Drop the #. This box wants exactly 6 hex digits, like FFFFFF.";
  }
  if (!/^[0-9A-Fa-f]{6}$/.test(value)) {
    return "Use exactly 6 hex digits and no #. The checker says “Invalid hex color format (6 characters)”.";
  }
  return null;
}

function nftTypeNote(value: string): string | null {
  if (!/^[a-zA-Z]+\.v[0-9]+$/.test(value)) {
    return "Use a word, then .v, then digits — art.v0. Other shapes get “Invalid NFT type format”.";
  }
  if (value !== "art.v0") {
    return "For XRPL schema support, nftType must be art.v0.";
  }
  return null;
}

function positiveIntNote(value: string): string | null {
  const numeric = Number(value);
  if (!Number.isInteger(numeric) || numeric <= 0) {
    return "Use a whole number greater than zero. Zero and decimals are rejected.";
  }
  return null;
}

function royaltyNote(value: string, min: number, max: number): string | null {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < min || numeric > max) {
    return `Stay between ${min} and ${max}. That is the range on this box.`;
  }
  return null;
}

function itemImageNote(value: string, chain: string | null): string | null {
  if (chain === "xrp" && !isUri(value)) {
    return "On XRPL the image must be a URI (ipfs://, ar://, http://, or https://). A bare filename fails. The checker says “image must be a valid URI”.";
  }
  return null;
}

function ipfsKeyNote(value: string, extra: CheckExtra): string | null {
  if (!extra.ipfsOn) return null;
  if (!value.trim()) {
    return "API key is required while upload is on. I won't read the key aloud. It stays in this browser.";
  }
  return null;
}

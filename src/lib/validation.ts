import type { AnyMetadata, ChainType, ValidationError } from "./types";

export const VALIDATION_RULES = {
  ethereumAddress: (value: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(value);
  },

  solanaAddress: (value: string): boolean => {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value);
  },

  xrplAddress: (value: string): boolean => {
    return /^r[a-zA-Z0-9]{24,34}$/.test(value);
  },

  tezosAddress: (value: string): boolean => {
    return /^tz[1-3][a-zA-Z0-9]{33}$/.test(value);
  },

  nearAddress: (value: string): boolean => {
    return /^[a-z0-9._-]+$/.test(value) && value.length <= 64;
  },

  url: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  hexColor: (value: string): boolean => {
    return /^[0-9A-Fa-f]{6}$/.test(value);
  },

  email: (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },

  ipfsHash: (value: string): boolean => {
    return (
      /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(value) || value.startsWith("ipfs://")
    );
  },

  mimeType: (value: string): boolean => {
    return /^[a-z]+\/[a-z0-9\-\+\.]+$/.test(value);
  },

  positiveInteger: (value: number): boolean => {
    return Number.isInteger(value) && value > 0;
  },

  percentage: (value: number): boolean => {
    return value >= 0 && value <= 100;
  },

  royaltyBasisPoints: (value: number): boolean => {
    return value >= 0 && value <= 10000;
  },

  nonEmptyString: (value: string): boolean => {
    return typeof value === "string" && value.trim().length > 0;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },

  isoDate: (value: string): boolean => {
    return !isNaN(Date.parse(value)) && value.includes("T");
  },

  tokenSymbol: (value: string): boolean => {
    return /^[A-Z0-9]{1,10}$/.test(value);
  },

  nftType: (value: string): boolean => {
    return /^[a-z]+\.[v0-9]+$/.test(value);
  },
};

export function validateEthereumMetadata(metadata: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!VALIDATION_RULES.nonEmptyString(metadata.name)) {
    errors.push({ field: "name", message: "Name is required", entryId: "" });
  }

  if (!VALIDATION_RULES.nonEmptyString(metadata.description)) {
    errors.push({
      field: "description",
      message: "Description is required",
      entryId: "",
    });
  }

  if (!VALIDATION_RULES.nonEmptyString(metadata.image)) {
    errors.push({ field: "image", message: "Image is required", entryId: "" });
  }

  // Optional field validations
  if (metadata.external_url && !VALIDATION_RULES.url(metadata.external_url)) {
    errors.push({
      field: "external_url",
      message: "Invalid URL format",
      entryId: "",
    });
  }

  if (
    metadata.background_color &&
    !VALIDATION_RULES.hexColor(metadata.background_color)
  ) {
    errors.push({
      field: "background_color",
      message: "Invalid hex color format (6 characters)",
      entryId: "",
    });
  }

  if (metadata.animation_url && !VALIDATION_RULES.url(metadata.animation_url)) {
    errors.push({
      field: "animation_url",
      message: "Invalid URL format",
      entryId: "",
    });
  }

  if (metadata.attributes && Array.isArray(metadata.attributes)) {
    metadata.attributes.forEach((attr: any, index: number) => {
      if (!VALIDATION_RULES.nonEmptyString(attr.trait_type)) {
        errors.push({
          field: `attributes[${index}].trait_type`,
          message: "Trait type is required",
          entryId: "",
        });
      }
      if (
        attr.value === undefined ||
        attr.value === null ||
        attr.value === ""
      ) {
        errors.push({
          field: `attributes[${index}].value`,
          message: "Value is required",
          entryId: "",
        });
      }
    });
  }

  return errors;
}

export function validateSolanaMetadata(metadata: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!VALIDATION_RULES.nonEmptyString(metadata.name)) {
    errors.push({ field: "name", message: "Name is required", entryId: "" });
  }

  if (!VALIDATION_RULES.nonEmptyString(metadata.symbol)) {
    errors.push({
      field: "symbol",
      message: "Symbol is required",
      entryId: "",
    });
  } else if (!VALIDATION_RULES.tokenSymbol(metadata.symbol)) {
    errors.push({
      field: "symbol",
      message: "Symbol must be 1-10 uppercase alphanumeric characters",
      entryId: "",
    });
  }

  if (!VALIDATION_RULES.nonEmptyString(metadata.description)) {
    errors.push({
      field: "description",
      message: "Description is required",
      entryId: "",
    });
  }

  if (!VALIDATION_RULES.nonEmptyString(metadata.image)) {
    errors.push({ field: "image", message: "Image is required", entryId: "" });
  }

  if (metadata.external_url && !VALIDATION_RULES.url(metadata.external_url)) {
    errors.push({
      field: "external_url",
      message: "Invalid URL format",
      entryId: "",
    });
  }

  if (metadata.properties) {
    if (
      metadata.properties.creators &&
      Array.isArray(metadata.properties.creators)
    ) {
      metadata.properties.creators.forEach((creator: any, index: number) => {
        if (!VALIDATION_RULES.solanaAddress(creator.address)) {
          errors.push({
            field: `properties.creators[${index}].address`,
            message: "Invalid Solana address",
            entryId: "",
          });
        }
        if (
          typeof creator.share !== "number" ||
          creator.share < 0 ||
          creator.share > 100
        ) {
          errors.push({
            field: `properties.creators[${index}].share`,
            message: "Share must be a number between 0 and 100",
            entryId: "",
          });
        }
      });
    }
  }

  if (metadata.seller_fee_basis_points !== undefined) {
    if (
      !VALIDATION_RULES.royaltyBasisPoints(metadata.seller_fee_basis_points)
    ) {
      errors.push({
        field: "seller_fee_basis_points",
        message: "Seller fee must be between 0 and 10000 basis points",
        entryId: "",
      });
    }
  }

  return errors;
}

export function validateXRPMetadata(metadata: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!VALIDATION_RULES.nonEmptyString(metadata.name)) {
    errors.push({ field: "name", message: "Name is required", entryId: "" });
  }

  if (!VALIDATION_RULES.nonEmptyString(metadata.description)) {
    errors.push({
      field: "description",
      message: "Description is required",
      entryId: "",
    });
  }

  if (!VALIDATION_RULES.nonEmptyString(metadata.image)) {
    errors.push({ field: "image", message: "Image is required", entryId: "" });
  }

  if (metadata.issuer && !VALIDATION_RULES.xrplAddress(metadata.issuer)) {
    errors.push({
      field: "issuer",
      message: "Invalid XRPL address format",
      entryId: "",
    });
  }

  if (metadata.nftType && !VALIDATION_RULES.nftType(metadata.nftType)) {
    errors.push({
      field: "nftType",
      message: "Invalid NFT type format (e.g., art.v0)",
      entryId: "",
    });
  }

  if (metadata.media_type && !VALIDATION_RULES.mimeType(metadata.media_type)) {
    errors.push({
      field: "media_type",
      message: "Invalid MIME type format",
      entryId: "",
    });
  }

  if (metadata.schema && !VALIDATION_RULES.url(metadata.schema)) {
    errors.push({
      field: "schema",
      message: "Invalid schema URL format",
      entryId: "",
    });
  }

  return errors;
}

export function validateCardanoMetadata(metadata: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!VALIDATION_RULES.nonEmptyString(metadata.name)) {
    errors.push({ field: "name", message: "Name is required", entryId: "" });
  }

  if (!VALIDATION_RULES.nonEmptyString(metadata.description)) {
    errors.push({
      field: "description",
      message: "Description is required",
      entryId: "",
    });
  }

  if (!VALIDATION_RULES.nonEmptyString(metadata.image)) {
    errors.push({ field: "image", message: "Image is required", entryId: "" });
  }

  if (metadata.mediaType && !VALIDATION_RULES.mimeType(metadata.mediaType)) {
    errors.push({
      field: "mediaType",
      message: "Invalid MIME type format",
      entryId: "",
    });
  }

  if (metadata.mint) {
    if (
      metadata.mint.policy_id &&
      !/^[a-fA-F0-9]{56}$/.test(metadata.mint.policy_id)
    ) {
      errors.push({
        field: "mint.policy_id",
        message: "Invalid policy ID format (56 hex characters)",
        entryId: "",
      });
    }
  }

  return errors;
}

export function validateNearMetadata(metadata: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!VALIDATION_RULES.nonEmptyString(metadata.title)) {
    errors.push({ field: "title", message: "Title is required", entryId: "" });
  }

  if (!VALIDATION_RULES.nonEmptyString(metadata.description)) {
    errors.push({
      field: "description",
      message: "Description is required",
      entryId: "",
    });
  }

  if (!VALIDATION_RULES.nonEmptyString(metadata.media)) {
    errors.push({ field: "media", message: "Media is required", entryId: "" });
  }

  if (
    metadata.copies !== undefined &&
    !VALIDATION_RULES.positiveInteger(metadata.copies)
  ) {
    errors.push({
      field: "copies",
      message: "Copies must be a positive integer",
      entryId: "",
    });
  }

  if (metadata.issued_at && !VALIDATION_RULES.isoDate(metadata.issued_at)) {
    errors.push({
      field: "issued_at",
      message: "Invalid date format (ISO 8601 required)",
      entryId: "",
    });
  }

  if (metadata.expires_at && !VALIDATION_RULES.isoDate(metadata.expires_at)) {
    errors.push({
      field: "expires_at",
      message: "Invalid date format (ISO 8601 required)",
      entryId: "",
    });
  }

  return errors;
}

export function validateTezosMetadata(metadata: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!VALIDATION_RULES.nonEmptyString(metadata.name)) {
    errors.push({ field: "name", message: "Name is required", entryId: "" });
  }

  if (!VALIDATION_RULES.nonEmptyString(metadata.description)) {
    errors.push({
      field: "description",
      message: "Description is required",
      entryId: "",
    });
  }

  if (!VALIDATION_RULES.nonEmptyString(metadata.image)) {
    errors.push({ field: "image", message: "Image is required", entryId: "" });
  }

  if (metadata.creators && Array.isArray(metadata.creators)) {
    metadata.creators.forEach((creator: string, index: number) => {
      if (!VALIDATION_RULES.tezosAddress(creator)) {
        errors.push({
          field: `creators[${index}]`,
          message: "Invalid Tezos address format",
          entryId: "",
        });
      }
    });
  }

  if (metadata.minter && !VALIDATION_RULES.tezosAddress(metadata.minter)) {
    errors.push({
      field: "minter",
      message: "Invalid Tezos address format",
      entryId: "",
    });
  }

  if (
    metadata.decimals !== undefined &&
    !VALIDATION_RULES.positiveInteger(metadata.decimals)
  ) {
    errors.push({
      field: "decimals",
      message: "Decimals must be a positive integer",
      entryId: "",
    });
  }

  return errors;
}

export function validateFlowMetadata(metadata: any): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!VALIDATION_RULES.nonEmptyString(metadata.name)) {
    errors.push({ field: "name", message: "Name is required", entryId: "" });
  }

  if (!VALIDATION_RULES.nonEmptyString(metadata.description)) {
    errors.push({
      field: "description",
      message: "Description is required",
      entryId: "",
    });
  }

  if (!VALIDATION_RULES.nonEmptyString(metadata.image)) {
    errors.push({ field: "image", message: "Image is required", entryId: "" });
  }

  if (
    metadata.serialNumber !== undefined &&
    !VALIDATION_RULES.positiveInteger(metadata.serialNumber)
  ) {
    errors.push({
      field: "serialNumber",
      message: "Serial number must be a positive integer",
      entryId: "",
    });
  }

  if (metadata.externalURL && !VALIDATION_RULES.url(metadata.externalURL)) {
    errors.push({
      field: "externalURL",
      message: "Invalid URL format",
      entryId: "",
    });
  }

  return errors;
}

export function validateMetadata(
  metadata: AnyMetadata,
  chain: ChainType,
  entryId: string = "",
): ValidationError[] {
  const errors: ValidationError[] = [];

  const addEntryId = (error: ValidationError) => ({ ...error, entryId });

  switch (chain) {
    case "ethereum":
    case "polygon":
    case "base":
    case "arbitrum":
    case "optimism":
    case "avalanche":
    case "bsc":
      return validateEthereumMetadata(metadata).map(addEntryId);

    case "solana":
      return validateSolanaMetadata(metadata).map(addEntryId);

    case "xrp":
      return validateXRPMetadata(metadata).map(addEntryId);

    case "cardano":
      return validateCardanoMetadata(metadata).map(addEntryId);

    case "near":
      return validateNearMetadata(metadata).map(addEntryId);

    case "tezos":
      return validateTezosMetadata(metadata).map(addEntryId);

    case "flow":
      return validateFlowMetadata(metadata).map(addEntryId);

    default:
      return [];
  }
}

export function validateAllMetadata(
  metadataEntries: Array<{ id: string; metadata: AnyMetadata }>,
  chain: ChainType,
): ValidationError[] {
  const allErrors: ValidationError[] = [];

  metadataEntries.forEach((entry) => {
    const errors = validateMetadata(entry.metadata, chain, entry.id);
    allErrors.push(...errors);
  });

  return allErrors;
}

export function getValidationSummary(errors: ValidationError[]) {
  const totalErrors = errors.length;
  const errorFields = new Set(errors.map((e) => e.field));
  const uniqueFields = errorFields.size;

  return {
    totalErrors,
    uniqueFields,
    hasErrors: totalErrors > 0,
    errorsByField: errors.reduce(
      (acc, error) => {
        if (!acc[error.field]) acc[error.field] = [];
        acc[error.field].push(error);
        return acc;
      },
      {} as Record<string, ValidationError[]>,
    ),
  };
}

import type { ChainSchema, ChainType } from "./types";

export const CHAIN_SCHEMAS: Record<ChainType, ChainSchema> = {
  ethereum: {
    id: "ethereum",
    name: "Ethereum (ERC-721/1155)",
    description:
      "OpenSea-compatible metadata standard with full ERC-721/1155 support",
    icon: "⟠",
    defaultMetadata: {
      name: "",
      description: "",
      image: "",
      external_url: "",
      attributes: [],
      background_color: "",
      animation_url: "",
      youtube_url: "",
      video_url: "",
      audio_url: "",
    },
    requiredFields: ["name", "description", "image"],
    optionalFields: [
      "external_url",
      "attributes",
      "background_color",
      "animation_url",
      "youtube_url",
      "video_url",
      "audio_url",
    ],
    supportsAttributes: true,
    attributeFormat: "ethereum",
  },

  base: {
    id: "base",
    name: "Base (Coinbase L2)",
    description: "Base blockchain with ERC-721 compatibility",
    icon: "🔵",
    defaultMetadata: {
      name: "",
      description: "",
      image: "",
      external_url: "",
      attributes: [],
    },
    requiredFields: ["name", "description", "image"],
    optionalFields: [
      "external_url",
      "attributes",
      "background_color",
      "animation_url",
      "youtube_url",
      "video_url",
      "audio_url",
    ],
    supportsAttributes: true,
    attributeFormat: "ethereum",
  },

  arbitrum: {
    id: "arbitrum",
    name: "Arbitrum",
    description: "Arbitrum L2 with ERC-721 compatibility",
    icon: "🔷",
    defaultMetadata: {
      name: "",
      description: "",
      image: "",
      external_url: "",
      attributes: [],
    },
    requiredFields: ["name", "description", "image"],
    optionalFields: [
      "external_url",
      "attributes",
      "background_color",
      "animation_url",
      "youtube_url",
      "video_url",
      "audio_url",
    ],
    supportsAttributes: true,
    attributeFormat: "ethereum",
  },

  optimism: {
    id: "optimism",
    name: "Optimism",
    description: "Optimism L2 with ERC-721 compatibility",
    icon: "🔴",
    defaultMetadata: {
      name: "",
      description: "",
      image: "",
      external_url: "",
      attributes: [],
    },
    requiredFields: ["name", "description", "image"],
    optionalFields: [
      "external_url",
      "attributes",
      "background_color",
      "animation_url",
      "youtube_url",
      "video_url",
      "audio_url",
    ],
    supportsAttributes: true,
    attributeFormat: "ethereum",
  },

  avalanche: {
    id: "avalanche",
    name: "Avalanche",
    description: "Avalanche C-Chain with ERC-721 compatibility",
    icon: "🔺",
    defaultMetadata: {
      name: "",
      description: "",
      image: "",
      external_url: "",
      attributes: [],
    },
    requiredFields: ["name", "description", "image"],
    optionalFields: [
      "external_url",
      "attributes",
      "background_color",
      "animation_url",
      "youtube_url",
      "video_url",
      "audio_url",
    ],
    supportsAttributes: true,
    attributeFormat: "ethereum",
  },

  bsc: {
    id: "bsc",
    name: "BSC (Binance Smart Chain)",
    description: "BSC with ERC-721 compatibility",
    icon: "🟡",
    defaultMetadata: {
      name: "",
      description: "",
      image: "",
      external_url: "",
      attributes: [],
    },
    requiredFields: ["name", "description", "image"],
    optionalFields: [
      "external_url",
      "attributes",
      "background_color",
      "animation_url",
      "youtube_url",
      "video_url",
      "audio_url",
    ],
    supportsAttributes: true,
    attributeFormat: "ethereum",
  },

  cardano: {
    id: "cardano",
    name: "Cardano (CIP-25)",
    description: "Cardano NFT standard with full CIP-25 support",
    icon: "🔵",
    defaultMetadata: {
      name: "",
      description: "",
      image: "",
      external_url: "",
      mediaType: "image/png",
      files: [],
      attributes: [],
      version: "1.0",
      mint: {
        policy_id: "",
        asset_name: "",
      },
    },
    requiredFields: ["name", "description", "image"],
    optionalFields: [
      "external_url",
      "mediaType",
      "files",
      "attributes",
      "version",
      "mint",
    ],
    supportsAttributes: true,
    attributeFormat: "ethereum",
  },

  flow: {
    id: "flow",
    name: "Flow",
    description:
      "Flow blockchain NFT standard with resource-oriented programming",
    icon: "💧",
    defaultMetadata: {
      name: "",
      description: "",
      image: "",
      external_url: "",
      attributes: [],
      thumbnail: "",
      serialNumber: 0,
      externalURL: "",
      resourceID: "",
      resourceType: "",
    },
    requiredFields: ["name", "description", "image"],
    optionalFields: [
      "external_url",
      "attributes",
      "thumbnail",
      "serialNumber",
      "externalURL",
      "resourceID",
      "resourceType",
    ],
    supportsAttributes: true,
    attributeFormat: "ethereum",
  },

  near: {
    id: "near",
    name: "NEAR Protocol (NEP-171)",
    description: "NEAR NFT standard with full NEP-171 support",
    icon: "🌐",
    defaultMetadata: {
      title: "",
      description: "",
      media: "",
      media_hash: "",
      copies: 1,
      issued_at: "",
      expires_at: "",
      starts_at: "",
      updated_at: "",
      extra: "",
      reference: "",
      reference_hash: "",
      reference_blob: "",
      // Compatibility fields
      name: "",
      image: "",
      external_url: "",
    },
    requiredFields: ["title", "description", "media"],
    optionalFields: [
      "media_hash",
      "copies",
      "issued_at",
      "expires_at",
      "starts_at",
      "updated_at",
      "extra",
      "reference",
      "reference_hash",
      "reference_blob",
      "name",
      "image",
      "external_url",
    ],
    supportsAttributes: false,
    attributeFormat: "ethereum",
  },

  solana: {
    id: "solana",
    name: "Solana (Metaplex)",
    description: "Metaplex NFT standard with full Magic Eden compatibility",
    icon: "◎",
    defaultMetadata: {
      name: "",
      symbol: "",
      description: "",
      image: "",
      external_url: "",
      attributes: [],
      properties: {
        files: [],
        category: "image",
        creators: [],
      },
      collection: {
        name: "",
        family: "",
      },
      seller_fee_basis_points: 0,
    },
    requiredFields: ["name", "symbol", "description", "image"],
    optionalFields: [
      "external_url",
      "attributes",
      "properties",
      "collection",
      "seller_fee_basis_points",
    ],
    supportsAttributes: true,
    attributeFormat: "solana",
  },

  xrp: (() => {
    const base: ChainSchema = {
      id: "xrp",
      name: "XRP Ledger (XLS-20/24d)",
      description: "XRPL NFT metadata with XLS-20 & XLS-24d support",
      icon: "✕",
      defaultMetadata: {
        schema: "ipfs://QmNpi8rcXEkohca8iXu7zysKKSJYqCvBJn3xJwga8jXqWU",
        name: "",
        description: "",
        image: "",
        nftType: "art.v0",
        video: "",
        audio: "",
        file: "",
        attributes: [],
        collection: {
          name: "",
        },
      },
      requiredFields: ["schema", "nftType", "name", "description", "image"],
      optionalFields: ["video", "audio", "file", "collection", "attributes"],
      supportsAttributes: true,
      attributeFormat: "ethereum",
    };

    return base;
  })(),

  polygon: {
    id: "polygon",
    name: "Polygon",
    description: "Polygon NFT standard (ERC-721 compatible)",
    icon: "⬡",
    defaultMetadata: {
      name: "",
      description: "",
      image: "",
      external_url: "",
      attributes: [],
    },
    requiredFields: ["name", "description", "image"],
    optionalFields: [
      "external_url",
      "attributes",
      "background_color",
      "animation_url",
    ],
    supportsAttributes: true,
    attributeFormat: "ethereum",
  },

  tezos: {
    id: "tezos",
    name: "Tezos (TZIP-21)",
    description: "Tezos NFT standard with full TZIP-21 and FA2 support",
    icon: "ꜩ",
    defaultMetadata: {
      name: "",
      description: "",
      image: "",
      external_url: "",
      attributes: [],
      artifactUri: "",
      displayUri: "",
      thumbnailUri: "",
      creators: [],
      formats: [],
      decimals: 0,
      symbol: "",
      tags: [],
      date: "",
      minter: "",
      rights: "",
      language: "",
    },
    requiredFields: ["name", "description", "image"],
    optionalFields: [
      "external_url",
      "attributes",
      "artifactUri",
      "displayUri",
      "thumbnailUri",
      "creators",
      "formats",
      "decimals",
      "symbol",
      "tags",
      "date",
      "minter",
      "rights",
      "language",
    ],
    supportsAttributes: true,
    attributeFormat: "ethereum",
  },
};

export function getSchemaForChain(chain: ChainType): ChainSchema {
  return CHAIN_SCHEMAS[chain];
}

export function createDefaultMetadata(
  chain: ChainType,
  index: number,
  imageName: string,
  options: {
    issuer?: string;
    useXls24d?: boolean;
    collectionName?: string;
    creatorAddress?: string;
    royaltyPercentage?: number;
  } = {},
): any {
  const schema = getSchemaForChain(chain);
  const baseMetadata = { ...schema.defaultMetadata };
  const collectionName = options.collectionName || "MyCollection";
  const creatorAddress = options.creatorAddress || "";
  const royaltyPercentage = options.royaltyPercentage || 0;

  switch (chain) {
    case "ethereum":
    case "polygon":
    case "base":
    case "arbitrum":
    case "optimism":
    case "avalanche":
    case "bsc":
      return {
        ...baseMetadata,
        name: `${collectionName} #${index}`,
        description: `Item #${index} from ${collectionName}`,
        image: imageName,
        external_url: "",
        attributes: [],
        background_color: "FFFFFF",
        animation_url: "",
        youtube_url: "",
        video_url: "",
        audio_url: "",
      };

    case "solana":
      return {
        ...baseMetadata,
        name: `${collectionName} #${index}`,
        symbol: "NFT",
        description: `Item #${index} from ${collectionName}`,
        image: imageName,
        external_url: "",
        attributes: [],
        properties: {
          files: [{ uri: imageName, type: "image/png" }],
          category: "image",
          creators: creatorAddress
            ? [{ address: creatorAddress, share: 100, verified: false }]
            : [],
        },
        collection: {
          name: collectionName,
          family: collectionName,
        },
        seller_fee_basis_points: royaltyPercentage * 100,
      };

    case "xrp":
      return {
        ...baseMetadata,
        name: `${collectionName} #${index}`,
        description: `Item #${index} from ${collectionName}`,
        image: imageName,
        schema: "ipfs://QmNpi8rcXEkohca8iXu7zysKKSJYqCvBJn3xJwga8jXqWU",
        nftType: "art.v0",
        video: "",
        audio: "",
        file: "",
        attributes: [],
        collection: {
          name: collectionName,
        },
      };

    case "cardano":
      return {
        ...baseMetadata,
        name: `${collectionName} #${index}`,
        description: `Item #${index} from ${collectionName}`,
        image: imageName,
        external_url: "",
        attributes: [],
        mediaType: "image/png",
        files: [
          {
            name: imageName,
            mediaType: "image/png",
            src: imageName,
            hash: "",
          },
        ],
        version: "1.0",
        mint: {
          policy_id: "",
          asset_name: "",
        },
      };

    case "near":
      return {
        ...baseMetadata,
        title: `${collectionName} #${index}`,
        description: `Item #${index} from ${collectionName}`,
        media: imageName,
        media_hash: "",
        copies: 1,
        issued_at: new Date().toISOString(),
        expires_at: "",
        starts_at: "",
        updated_at: new Date().toISOString(),
        extra: "",
        reference: "",
        reference_hash: "",
        reference_blob: "",
        name: `${collectionName} #${index}`,
        image: imageName,
        external_url: "",
      };

    case "tezos":
      return {
        ...baseMetadata,
        name: `${collectionName} #${index}`,
        description: `Item #${index} from ${collectionName}`,
        image: imageName,
        external_url: "",
        attributes: [],
        artifactUri: imageName,
        displayUri: imageName,
        thumbnailUri: imageName,
        creators: creatorAddress ? [creatorAddress] : [],
        formats: [
          {
            uri: imageName,
            mimeType: "image/png",
            hash: "",
            fileSize: 0,
          },
        ],
        decimals: 0,
        symbol: "NFT",
        tags: [],
        date: new Date().toISOString(),
        minter: creatorAddress || "",
        rights: "",
        language: "en",
      };

    case "flow":
      return {
        ...baseMetadata,
        name: `${collectionName} #${index}`,
        description: `Item #${index} from ${collectionName}`,
        image: imageName,
        external_url: "",
        attributes: [],
        thumbnail: imageName,
        serialNumber: index,
        externalURL: "",
        resourceID: "",
        resourceType: "NFT",
      };

    default:
      return baseMetadata;
  }
}

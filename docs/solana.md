# Solana NFT Metadata Standards (Metaplex)

## Overview

Solana uses the Metaplex Token Metadata program for NFTs, which provides a standardized way to attach metadata to tokens. Unlike Ethereum, metadata is stored on-chain in dedicated accounts, with additional details stored off-chain.

## Metaplex Token Metadata Program

### Key Features
- **On-chain metadata**: Core metadata stored on-chain
- **Off-chain details**: Extended metadata in JSON format
- **Creator royalties**: Built-in royalty system
- **Collection support**: Native collection management
- **Programmable NFTs**: Custom authorization rules

## On-Chain Metadata Structure

### Metadata Account Layout

```rust
pub struct Metadata {
    pub key: Key,                    // 1 byte
    pub update_authority: Pubkey,    // 32 bytes
    pub mint: Pubkey,                // 32 bytes
    pub data: Data,                  // Variable
    pub primary_sale_happened: bool, // 1 byte
    pub is_mutable: bool,            // 1 byte
    pub edition_nonce: Option<u8>,   // 1 byte
    pub token_standard: Option<TokenStandard>, // 1 byte
    pub collection: Option<Collection>, // 34 bytes
    pub uses: Option<Uses>,          // 34 bytes
}

pub struct Data {
    pub name: String,                // Max 32 characters
    pub symbol: String,              // Max 10 characters
    pub uri: String,                 // Max 200 characters
    pub seller_fee_basis_points: u16, // Royalty percentage
    pub creators: Option<Vec<Creator>>, // Creator information
}
```

### Creator Structure

```rust
pub struct Creator {
    pub address: Pubkey,    // Creator's wallet address
    pub verified: bool,     // Whether creator is verified
    pub share: u8,          // Percentage share (0-100)
}
```

## Off-Chain Metadata JSON Schema

### Standard Structure

```json
{
  "name": "NFT Name",
  "symbol": "SYMBOL",
  "description": "NFT Description",
  "image": "https://example.com/image.png",
  "animation_url": "https://example.com/animation.mp4",
  "external_url": "https://example.com/nft/1",
  "attributes": [
    {
      "trait_type": "Color",
      "value": "Blue"
    },
    {
      "trait_type": "Rarity",
      "value": "Legendary"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://example.com/image.png",
        "type": "image/png"
      }
    ],
    "category": "image",
    "creators": [
      {
        "address": "CreatorWalletAddress",
        "share": 100
      }
    ]
  },
  "collection": {
    "name": "Collection Name",
    "family": "Collection Family"
  }
}
```

### Required Fields

- **name**: The name of the NFT (string, max 32 chars on-chain)
- **symbol**: The symbol of the NFT (string, max 10 chars on-chain)
- **description**: A description of the NFT (string)
- **image**: URL to the image resource (string, URI)

### Optional Fields

- **animation_url**: URL to animation/video (string, URI)
- **external_url**: External URL pointing to the NFT (string, URI)
- **attributes**: Array of trait objects
- **properties**: Additional properties object
- **collection**: Collection information

### Properties Structure

```json
{
  "files": [
    {
      "uri": "string",    // File URL
      "type": "string"    // MIME type
    }
  ],
  "category": "string",   // Category of the NFT
  "creators": [           // Must match on-chain creators
    {
      "address": "string", // Creator wallet address
      "share": "number"    // Share percentage (0-100)
    }
  ]
}
```

## Collection Support

### Collection Structure

```json
{
  "name": "Collection Name",
  "family": "Collection Family"
}
```

### On-Chain Collection

```rust
pub struct Collection {
    pub verified: bool,    // Whether collection is verified
    pub key: Pubkey,       // Collection mint address
}
```

## Programmable NFTs (pNFTs)

### Key Features
- **Frozen accounts**: Token accounts can be frozen
- **Authorization rules**: Custom transfer/use rules
- **Delegate system**: Controlled access patterns

### Authorization Rules

```rust
pub enum RuleSet {
    ProgramAllowList(Vec<Pubkey>),
    ProgramDenyList(Vec<Pubkey>),
    // ... other rule types
}
```

## Implementation Examples

### Basic NFT Creation

```typescript
import { 
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID
} from '@metaplex-foundation/mpl-token-metadata';

// Create metadata instruction
const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
  {
    metadata: metadataPDA,
    mint: mintKeypair.publicKey,
    mintAuthority: payer.publicKey,
    payer: payer.publicKey,
    updateAuthority: payer.publicKey,
  },
  {
    createMetadataAccountArgsV3: {
      data: {
        name: 'My NFT',
        symbol: 'MNFT',
        uri: 'https://example.com/metadata.json',
        sellerFeeBasisPoints: 500, // 5% royalty
        creators: [
          {
            address: payer.publicKey,
            verified: false,
            share: 100,
          },
        ],
        collection: null,
        uses: null,
      },
      isMutable: true,
      collectionDetails: null,
    },
  }
);
```

### Metadata Update

```typescript
import { 
  createUpdateMetadataAccountV2Instruction
} from '@metaplex-foundation/mpl-token-metadata';

const updateMetadataInstruction = createUpdateMetadataAccountV2Instruction(
  {
    metadata: metadataPDA,
    updateAuthority: updateAuthority.publicKey,
  },
  {
    updateMetadataAccountArgsV2: {
      data: {
        name: 'Updated NFT Name',
        symbol: 'UNFT',
        uri: 'https://example.com/updated-metadata.json',
        sellerFeeBasisPoints: 750, // 7.5% royalty
        creators: [
          {
            address: updateAuthority.publicKey,
            verified: true,
            share: 100,
          },
        ],
        collection: null,
        uses: null,
      },
      updateAuthority: updateAuthority.publicKey,
      primarySaleHappened: false,
      isMutable: true,
    },
  }
);
```

## Storage Recommendations

### Arweave (Recommended)
- **Pros**: Permanent storage, pay once, fast access
- **Cons**: Higher initial cost
- **URL Format**: `https://arweave.net/hash...`

### IPFS
- **Pros**: Decentralized, content-addressed
- **Cons**: Requires pinning service
- **URL Format**: `https://ipfs.io/ipfs/hash...`

### HTTP/HTTPS
- **Pros**: Easy to implement, fast access
- **Cons**: Centralized, can be taken down
- **URL Format**: `https://example.com/metadata.json`

## Best Practices

1. **Use Arweave** for permanent storage
2. **Verify creators** on-chain
3. **Set appropriate royalties** (5-10% common)
4. **Use collections** for related NFTs
5. **Validate metadata** before deployment
6. **Consider pNFTs** for advanced use cases
7. **Test thoroughly** on devnet first

## Common Extensions

### Candy Machine Integration

```json
{
  "name": "NFT Name",
  "symbol": "SYMBOL",
  "description": "NFT Description",
  "image": "https://example.com/image.png",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "Blue"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://example.com/image.png",
        "type": "image/png"
      }
    ],
    "category": "image",
    "creators": [
      {
        "address": "CreatorAddress",
        "share": 100
      }
    ]
  },
  "collection": {
    "name": "My Collection",
    "family": "My Family"
  }
}
```

## Testing

### Metadata Validation

```typescript
function validateMetaplexMetadata(metadata: any): boolean {
  // Required fields
  const required = ['name', 'symbol', 'description', 'image'];
  const missing = required.filter(field => !metadata[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  // Validate name length (on-chain limit)
  if (metadata.name.length > 32) {
    throw new Error('Name must be 32 characters or less');
  }
  
  // Validate symbol length (on-chain limit)
  if (metadata.symbol.length > 10) {
    throw new Error('Symbol must be 10 characters or less');
  }
  
  // Validate creators if present
  if (metadata.properties?.creators) {
    const totalShare = metadata.properties.creators.reduce(
      (sum: number, creator: any) => sum + creator.share, 0
    );
    if (totalShare !== 100) {
      throw new Error('Creator shares must total 100');
    }
  }
  
  return true;
}
```

## Resources

- [Metaplex Documentation](https://docs.metaplex.com/)
- [Token Metadata Program](https://github.com/metaplex-foundation/metaplex-program-library/tree/master/token-metadata)
- [Solana Program Library](https://spl.solana.com/)
- [Arweave Documentation](https://docs.arweave.org/)
- [Solana Cookbook](https://solanacookbook.com/)

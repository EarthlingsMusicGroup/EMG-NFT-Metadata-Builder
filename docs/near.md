# NEAR Protocol NFT Metadata Standards (NEP-171)

## Overview

NEAR Protocol uses the NEP-171 (NEAR Enhancement Proposal 171) standard for NFTs. This standard defines the core functionality for NFTs on NEAR, including metadata management and transfer operations.

## NEP-171 Standard

### Key Features
- **Core NFT Functions**: Mint, transfer, approve, revoke
- **Metadata Support**: Flexible metadata structure
- **Batch Operations**: Efficient batch transfers
- **Approval System**: Flexible approval mechanisms
- **Event Logging**: Comprehensive event system

## Metadata Structure

### Standard JSON Schema

```json
{
  "title": "NFT Title",
  "description": "NFT Description",
  "media": "https://example.com/media.png",
  "media_hash": "0x...",
  "copies": 1,
  "issued_at": "2023-01-01T00:00:00Z",
  "expires_at": "2024-01-01T00:00:00Z",
  "starts_at": "2023-01-01T00:00:00Z",
  "updated_at": "2023-01-01T00:00:00Z",
  "extra": "{\"rarity\":\"legendary\",\"level\":5}",
  "reference": "https://example.com/metadata.json",
  "reference_hash": "0x...",
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
    "category": "image",
    "files": [
      {
        "uri": "https://example.com/media.png",
        "type": "image/png"
      }
    ]
  }
}
```

### Required Fields

- **title**: The title of the NFT (string)
- **description**: A description of the NFT (string)
- **media**: URL to the media resource (string, URI)

### Optional Fields

- **media_hash**: Hash of the media file (string, hex)
- **copies**: Number of copies (number, default 1)
- **issued_at**: Issue timestamp (string, ISO 8601)
- **expires_at**: Expiration timestamp (string, ISO 8601)
- **starts_at**: Start timestamp (string, ISO 8601)
- **updated_at**: Last update timestamp (string, ISO 8601)
- **extra**: Additional data as JSON string (string)
- **reference**: URL to external metadata (string, URI)
- **reference_hash**: Hash of external metadata (string, hex)
- **attributes**: Array of attribute objects
- **properties**: Additional properties object

### Attribute Structure

```json
{
  "trait_type": "string",  // Attribute name
  "value": "any"           // Attribute value
}
```

### Properties Structure

```json
{
  "category": "string",    // Category of the NFT
  "files": [               // Array of file objects
    {
      "uri": "string",     // File URL
      "type": "string"     // MIME type
    }
  ]
}
```

## Contract Interface

### Core Functions

```rust
// Mint NFT
pub fn nft_mint(
    &mut self,
    token_id: TokenId,
    receiver_id: AccountId,
    token_metadata: TokenMetadata,
) -> Token;

// Transfer NFT
pub fn nft_transfer(
    &mut self,
    receiver_id: AccountId,
    token_id: TokenId,
    approval_id: Option<u64>,
    memo: Option<String>,
);

// Get token metadata
pub fn nft_token(&self, token_id: TokenId) -> Option<Token>;

// Get token metadata for multiple tokens
pub fn nft_tokens(
    &self,
    from_index: Option<U128>,
    limit: Option<u64>,
) -> Vec<Token>;

// Get tokens for owner
pub fn nft_tokens_for_owner(
    &self,
    account_id: AccountId,
    from_index: Option<U128>,
    limit: Option<u64>,
) -> Vec<Token>;
```

### Data Structures

```rust
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Token {
    pub token_id: TokenId,
    pub owner_id: AccountId,
    pub metadata: TokenMetadata,
    pub approved_account_ids: HashMap<AccountId, u64>,
    pub next_approval_id: u64,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct TokenMetadata {
    pub title: Option<String>,
    pub description: Option<String>,
    pub media: Option<String>,
    pub media_hash: Option<Base64VecU8>,
    pub copies: Option<u64>,
    pub issued_at: Option<u64>,
    pub expires_at: Option<u64>,
    pub starts_at: Option<u64>,
    pub updated_at: Option<u64>,
    pub extra: Option<String>,
    pub reference: Option<String>,
    pub reference_hash: Option<Base64VecU8>,
}
```

## Implementation Examples

### Basic NFT Contract (Rust)

```rust
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{env, near_bindgen, AccountId, TokenId};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    pub tokens: UnorderedMap<TokenId, Token>,
    pub token_metadata: UnorderedMap<TokenId, TokenMetadata>,
    pub owner_id: AccountId,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            tokens: UnorderedMap::new(b"tokens"),
            token_metadata: UnorderedMap::new(b"metadata"),
            owner_id: env::current_account_id(),
        }
    }
}

#[near_bindgen]
impl Contract {
    pub fn nft_mint(
        &mut self,
        token_id: TokenId,
        receiver_id: AccountId,
        token_metadata: TokenMetadata,
    ) -> Token {
        let token = Token {
            token_id: token_id.clone(),
            owner_id: receiver_id,
            metadata: token_metadata.clone(),
            approved_account_ids: HashMap::new(),
            next_approval_id: 0,
        };
        
        self.tokens.insert(&token_id, &token);
        self.token_metadata.insert(&token_id, &token_metadata);
        
        token
    }
    
    pub fn nft_token(&self, token_id: TokenId) -> Option<Token> {
        self.tokens.get(&token_id)
    }
}
```

### JavaScript Integration

```javascript
// Mint NFT
async function mintNFT(contract, tokenId, receiverId, metadata) {
  const tokenMetadata = {
    title: metadata.title,
    description: metadata.description,
    media: metadata.media,
    media_hash: metadata.mediaHash,
    copies: metadata.copies || 1,
    issued_at: Date.now(),
    extra: JSON.stringify(metadata.extra || {}),
    reference: metadata.reference,
    reference_hash: metadata.referenceHash,
  };
  
  return await contract.nft_mint({
    token_id: tokenId,
    receiver_id: receiverId,
    token_metadata: tokenMetadata,
  });
}

// Get token metadata
async function getTokenMetadata(contract, tokenId) {
  const token = await contract.nft_token({ token_id: tokenId });
  return token?.metadata;
}
```

## Storage Recommendations

### IPFS (Recommended)
- **Pros**: Decentralized, content-addressed, permanent
- **Cons**: Requires pinning service
- **URL Format**: `ipfs://QmHash...`

### Arweave
- **Pros**: Permanent storage, pay once
- **Cons**: Higher cost
- **URL Format**: `ar://hash...`

### HTTP/HTTPS
- **Pros**: Easy to implement, fast access
- **Cons**: Centralized, can be taken down
- **URL Format**: `https://example.com/metadata.json`

## Best Practices

1. **Use IPFS or Arweave** for permanent storage
2. **Include media_hash** for verification
3. **Use meaningful timestamps** for issued_at
4. **Include extra data** for additional attributes
5. **Validate metadata** before minting
6. **Test on testnet** first
7. **Consider gas costs** for batch operations

## Common Extensions

### Marketplace Integration

```json
{
  "title": "NFT Title",
  "description": "NFT Description",
  "media": "https://example.com/media.png",
  "media_hash": "0x...",
  "copies": 1,
  "issued_at": "2023-01-01T00:00:00Z",
  "extra": "{\"rarity\":\"legendary\",\"level\":5,\"marketplace\":\"opensea\"}",
  "reference": "https://example.com/metadata.json",
  "attributes": [
    {
      "trait_type": "Rarity",
      "value": "Legendary"
    }
  ],
  "properties": {
    "category": "image",
    "files": [
      {
        "uri": "https://example.com/media.png",
        "type": "image/png"
      }
    ]
  }
}
```

### Collection Support

```json
{
  "title": "Collection Item",
  "description": "Item from My Collection",
  "media": "https://example.com/media.png",
  "extra": "{\"collection\":\"My Collection\",\"collection_id\":\"collection_123\"}",
  "attributes": [
    {
      "trait_type": "Collection",
      "value": "My Collection"
    },
    {
      "trait_type": "Item Number",
      "value": 1
    }
  ]
}
```

## Testing

### Metadata Validation

```javascript
function validateNearMetadata(metadata) {
  // Required fields
  const required = ['title', 'description', 'media'];
  const missing = required.filter(field => !metadata[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  // Validate timestamps
  if (metadata.issued_at && isNaN(new Date(metadata.issued_at))) {
    throw new Error('Invalid issued_at timestamp');
  }
  
  if (metadata.expires_at && isNaN(new Date(metadata.expires_at))) {
    throw new Error('Invalid expires_at timestamp');
  }
  
  // Validate extra data
  if (metadata.extra) {
    try {
      JSON.parse(metadata.extra);
    } catch (e) {
      throw new Error('Invalid extra data format');
    }
  }
  
  // Validate attributes
  if (metadata.attributes) {
    metadata.attributes.forEach(attr => {
      if (!attr.trait_type || !attr.value) {
        throw new Error('Invalid attribute structure');
      }
    });
  }
  
  return true;
}
```

## Resources

- [NEP-171 Specification](https://github.com/near/NEPs/blob/master/neps/nep-0171.md)
- [NEAR Documentation](https://docs.near.org/)
- [NEAR SDK](https://github.com/near/near-sdk-rs)
- [IPFS Documentation](https://docs.ipfs.io/)
- [Arweave Documentation](https://docs.arweave.org/)

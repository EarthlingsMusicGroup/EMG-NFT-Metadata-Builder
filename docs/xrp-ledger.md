# XRP Ledger NFT Metadata Standards (XLS-20/24d)

## Overview

XRP Ledger uses the XLS-20 and XLS-24d standards for NFTs. XLS-20 introduces native NFT support to the XRP Ledger, while XLS-24d extends it with additional features like royalties and transfer fees.

## Standards

### XLS-20 (NFToken)
- **Purpose**: Native NFT support on XRP Ledger
- **Storage**: On-chain metadata storage
- **Features**: Mint, burn, transfer, and manage NFTs

### XLS-24d (NFTokenDID)
- **Purpose**: Decentralized identifiers and verifiable credentials
- **Features**: Enhanced metadata, royalties, and transfer fees
- **Extensions**: Additional metadata fields and validation

## Metadata Structure

### XLS-20 NFToken Structure

```json
{
  "NFTokenID": "000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D65",
  "URI": "https://example.com/metadata.json",
  "Flags": 1,
  "TransferFee": 500,
  "Issuer": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
  "Taxon": 0,
  "Sequence": 1,
  "Minted": "2023-01-01T00:00:00Z"
}
```

### XLS-24d Enhanced Structure

```json
{
  "NFTokenID": "000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D65",
  "URI": "https://example.com/metadata.json",
  "Flags": 1,
  "TransferFee": 500,
  "Issuer": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
  "Taxon": 0,
  "Sequence": 1,
  "Minted": "2023-01-01T00:00:00Z",
  "DID": "did:xrpl:rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
  "VerifiableCredentials": [
    {
      "type": "VerifiableCredential",
      "issuer": "did:xrpl:rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
      "credentialSubject": {
        "id": "did:xrpl:rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH",
        "NFTokenID": "000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D65"
      }
    }
  ]
}
```

### XLS-24d art.v0 Metadata Schema

The XRPL community-defined art.v0 type (XLS-24d) uses a JSON Schema with the following required fields:

- `schema` (URI to the schema definition, e.g., `ipfs://QmNpi8rcXEkohca8iXu7zysKKSJYqCvBJn3xJwga8jXqWU`)
- `nftType` (must match `^[a-zA-Z]+.v[0-9]+$`, e.g., `art.v0`)
- `name`
- `description`
- `image`

Optional, but schema-supported fields:

- `animation`, `video`, `audio`, `file` (URIs) — note: xrp.cafe does not currently support `animation`; prefer `video` for motion on that marketplace
- `collection` with `name` (required) and optional `family`
- `attributes` array of `{ trait_type, value, description? }` where `value` is string | integer | number

Full JSON Schema:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["schema", "nftType", "name", "description", "image"],
  "properties": {
    "schema": { "type": "string", "format": "uri" },
    "nftType": { "type": "string", "pattern": "(^[a-zA-Z]+.v[0-9]+$)" },
    "name": { "type": "string" },
    "description": { "type": "string" },
    "image": { "type": "string", "format": "uri" },
    "animation": { "type": "string", "format": "uri" },
    "video": { "type": "string", "format": "uri" },
    "audio": { "type": "string", "format": "uri" },
    "file": { "type": "string", "format": "uri" },
    "collection": {
      "type": "object",
      "properties": {
        "name": { "type": "string" },
        "family": { "type": "string" }
      },
      "required": ["name"]
    },
    "attributes": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "trait_type": { "type": "string" },
          "value": { "type": ["string", "integer", "number"] },
          "description": { "type": "string" }
        },
        "required": ["trait_type", "value"]
      }
    }
  }
}
```

Minimal art.v0 metadata example:

```json
{
  "schema": "ipfs://QmNpi8rcXEkohca8iXu7zysKKSJYqCvBJn3xJwga8jXqWU",
  "nftType": "art.v0",
  "name": "ART NFT #0",
  "description": "An ART NFT with minimum properties!",
  "image": "ipfs://QmcCST9U9qwJwuBxZyTJ6ePvdJHrub7yPkAcNeCKZQ3trn"
}
```

Full art.v0 example with all schema-supported fields:

```json
{
  "schema": "ipfs://QmNpi8rcXEkohca8iXu7zysKKSJYqCvBJn3xJwga8jXqWU",
  "nftType": "art.v0",
  "name": "ART NFT #0",
  "description": "An Art NFT with all properties supported by the art.v0 schema.",
  "image": "ipfs://QmcCST9U9qwJwuBxZyTJ6ePvdJHrub7yPkAcNeCKZQ3trn",
  "animation": "ipfs://QmfQGVwoxpqnAvDxFxW7bPsesivFas7FFjBcW9tVU5ymZQ",
  "video": "ipfs://QmWrLXyMFCB5XajAg9xRDkM9YtCvgMN7NqjmsgkoaV4k5k",
  "audio": "ipfs://QmQxMmXRrFZ8oMNtQjhaSnqosNTQFFzacT8F6kCoA4iSUd",
  "file": "ipfs://QmXVgDaHkXbyhnim8P9KmKG2khqLwnfT3fbZJRPBeVJDWY",
  "collection": {
    "name": "XLS-24d Examples",
    "family": "X-Tokenize Example NFTS"
  },
  "attributes": [
    {
      "trait_type": "Background",
      "description": "A dark background.",
      "value": "Black"
    },
    {
      "trait_type": "Text",
      "description": "A comforting message.",
      "value": "Hello XLS-24d"
    }
  ]
}
```

Additional project-specific fields are allowed by JSON Schema, but applications may ignore them; keep required art.v0 fields intact for compatibility.

## XLS-20 Fields

### Required Fields
- **NFTokenID**: Unique identifier for the NFT (64-character hex string)
- **URI**: URL to external metadata (string, URI)
- **Flags**: Bit flags for NFT properties (number)
- **Issuer**: XRP Ledger address of the issuer (string)
- **Taxon**: Category identifier (number)
- **Sequence**: Sequence number (number)

### Optional Fields
- **TransferFee**: Transfer fee in basis points (number, 0-50000)
- **Minted**: Timestamp when NFT was minted (string, ISO 8601)

## XLS-24d Extensions

### Additional Fields
- **DID**: Decentralized identifier (string)
- **VerifiableCredentials**: Array of verifiable credentials
- **Royalties**: Royalty information
- **TransferFees**: Transfer fee details

## Implementation Examples

### Basic NFT Minting (JavaScript)

```javascript
const { Client } = require('xrpl');

async function mintNFT() {
  const client = new Client('wss://xrplcluster.com/');
  await client.connect();
  
  const wallet = client.walletFromSeed('sEd...');
  
  const nftMint = {
    TransactionType: 'NFTokenMint',
    Account: wallet.address,
    NFTokenTaxon: 0,
    URI: 'https://example.com/metadata.json',
    Flags: 1, // Transferable
    TransferFee: 500, // 5% transfer fee
    Issuer: wallet.address
  };
  
  const response = await client.submit(nftMint, { wallet });
  console.log('NFT Minted:', response);
  
  await client.disconnect();
}
```

### Metadata Creation

```javascript
const ART_V0_SCHEMA =
  'ipfs://QmNpi8rcXEkohca8iXu7zysKKSJYqCvBJn3xJwga8jXqWU';

function createArtV0Metadata(nftData) {
  const metadata = {
    schema: nftData.schema || ART_V0_SCHEMA,
    nftType: 'art.v0',
    name: nftData.name,
    description: nftData.description,
    image: nftData.image
  };

  if (nftData.animation) metadata.animation = nftData.animation;
  if (nftData.video) metadata.video = nftData.video;
  if (nftData.audio) metadata.audio = nftData.audio;
  if (nftData.file) metadata.file = nftData.file;

  if (nftData.collection?.name) {
    metadata.collection = {
      name: nftData.collection.name,
      ...(nftData.collection.family
        ? { family: nftData.collection.family }
        : {})
    };
  }

  if (Array.isArray(nftData.attributes)) {
    metadata.attributes = nftData.attributes.map((attr) => ({
      trait_type: attr.trait_type,
      value: attr.value,
      ...(attr.description ? { description: attr.description } : {})
    }));
  }

  return metadata;
}

// Example usage
const nftData = {
  name: 'My XRPL NFT',
  description: 'A beautiful NFT on XRPL following art.v0',
  image: 'https://example.com/image.png',
  animation: 'https://example.com/animation.mp4',
  attributes: [
    {
      trait_type: 'Color',
      value: 'Blue'
    }
  ],
  collection: {
    name: 'Example Collection',
    family: 'XRPL Art'
  }
};

const metadata = createArtV0Metadata(nftData);
```

### NFT Transfer

```javascript
async function transferNFT(nftokenID, destination) {
  const client = new Client('wss://xrplcluster.com/');
  await client.connect();
  
  const wallet = client.walletFromSeed('sEd...');
  
  const nftAcceptOffer = {
    TransactionType: 'NFTokenAcceptOffer',
    Account: wallet.address,
    NFTokenBuyOffer: 'offer_id_here'
  };
  
  const response = await client.submit(nftAcceptOffer, { wallet });
  console.log('NFT Transferred:', response);
  
  await client.disconnect();
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
2. **Set appropriate transfer fees** (0-50%)
3. **Use meaningful taxon** for categorization
4. **Include creator information** in metadata
5. **Validate metadata** before minting
6. **Test on testnet** first
7. **Consider gas costs** for operations

## XRP Ledger-Specific Features

### Transfer Fees
- **Range**: 0-50,000 basis points (0-50%)
- **Purpose**: Creator royalties on transfers
- **Implementation**: Set in NFTokenMint transaction

### Taxon
- **Purpose**: Categorize NFTs
- **Range**: 0-4,294,967,295
- **Usage**: Group related NFTs together

### Flags
- **Transferable**: 0x00000001
- **OnlyXRP**: 0x00000002
- **TrustLine**: 0x00000004

## Common Extensions

### Marketplace Integration

```json
{
  "schema": "ipfs://QmNpi8rcXEkohca8iXu7zysKKSJYqCvBJn3xJwga8jXqWU",
  "nftType": "art.v0",
  "name": "NFT Name",
  "description": "NFT Description",
  "image": "https://example.com/image.png",
  "collection": {
    "name": "Collection Name",
    "family": "Collection Family"
  },
  "attributes": [
    {
      "trait_type": "Rarity",
      "value": "Legendary"
    }
  ],
  "creator": {
    "name": "Creator Name",
    "address": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"
  },
  "marketplace": {
    "external_url": "https://example.com/nft/1"
  },
  "video": "https://example.com/preview.mp4"
}
```

### Collection Support

```json
{
  "schema": "ipfs://QmNpi8rcXEkohca8iXu7zysKKSJYqCvBJn3xJwga8jXqWU",
  "nftType": "art.v0",
  "name": "Collection Item",
  "description": "Item from My Collection",
  "image": "https://example.com/image.png",
  "collection": {
    "name": "My Collection",
    "family": "Art Collection"
  },
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
function validateArtV0Metadata(metadata) {
  const required = ['schema', 'nftType', 'name', 'description', 'image'];
  const missing = required.filter((field) => !metadata[field]);

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }

  if (!/^[a-zA-Z]+\.v[0-9]+$/.test(metadata.nftType)) {
    throw new Error('Invalid nftType format; expected something like art.v0');
  }

  if (metadata.nftType !== 'art.v0') {
    throw new Error('nftType must be art.v0 for this schema');
  }

  const uriLike = /^(ipfs|ar|https?):\/\//i;
  ['schema', 'image', 'animation', 'video', 'audio', 'file'].forEach(
    (field) => {
      if (metadata[field] && !uriLike.test(metadata[field])) {
        throw new Error(`Field ${field} must be a valid URI (ipfs|ar|http)`);
      }
    }
  );

  if (metadata.collection) {
    if (!metadata.collection.name) {
      throw new Error('collection.name is required when collection is present');
    }
  }

  if (metadata.attributes) {
    metadata.attributes.forEach((attr) => {
      if (!attr.trait_type || attr.value === undefined || attr.value === null) {
        throw new Error('Invalid attribute structure');
      }
      if (
        !['string', 'number'].includes(typeof attr.value) &&
        !Number.isInteger(attr.value)
      ) {
        throw new Error('Attribute value must be string, integer, or number');
      }
    });
  }

  return true;
}
```

### Testnet Testing

```javascript
// Test on XRP Ledger Testnet
async function testOnTestnet() {
  const client = new Client('wss://s.altnet.rippletest.net:51233');
  await client.connect();
  
  // Test NFT operations here
  console.log('Connected to XRP Ledger Testnet');
  
  await client.disconnect();
}
```

## Resources

- [XLS-20 Specification](https://xrpl.org/nftoken.html)
- [XLS-24d Specification](https://xrpl.org/nftoken-did.html)
- [XRP Ledger Documentation](https://xrpl.org/)
- [XRPL.js Library](https://xrpl.org/docs/references/xrpl-js/)
- [IPFS Documentation](https://docs.ipfs.io/)

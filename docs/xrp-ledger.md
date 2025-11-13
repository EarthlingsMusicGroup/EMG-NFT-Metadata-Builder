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

### External Metadata JSON Schema

```json
{
  "name": "NFT Name",
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
    "category": "image",
    "files": [
      {
        "uri": "https://example.com/image.png",
        "type": "image/png"
      }
    ]
  },
  "collection": {
    "name": "Collection Name",
    "family": "Collection Family"
  },
  "creator": {
    "name": "Creator Name",
    "address": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"
  }
}
```

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
function createXRPMetadata(nftData) {
  const metadata = {
    name: nftData.name,
    description: nftData.description,
    image: nftData.image,
    animation_url: nftData.animation_url,
    external_url: nftData.external_url,
    attributes: nftData.attributes || [],
    properties: nftData.properties || {},
    collection: nftData.collection || null,
    creator: {
      name: nftData.creator?.name || 'Unknown',
      address: nftData.creator?.address || ''
    }
  };
  
  return metadata;
}

// Example usage
const nftData = {
  name: 'My XRP NFT',
  description: 'A beautiful NFT on XRP Ledger',
  image: 'https://example.com/image.png',
  attributes: [
    {
      trait_type: 'Color',
      value: 'Blue'
    }
  ],
  creator: {
    name: 'Artist Name',
    address: 'rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH'
  }
};

const metadata = createXRPMetadata(nftData);
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
  "name": "NFT Name",
  "description": "NFT Description",
  "image": "https://example.com/image.png",
  "attributes": [
    {
      "trait_type": "Rarity",
      "value": "Legendary"
    }
  ],
  "collection": {
    "name": "Collection Name",
    "family": "Collection Family"
  },
  "creator": {
    "name": "Creator Name",
    "address": "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"
  }
}
```

### Collection Support

```json
{
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
function validateXRPMetadata(metadata) {
  // Required fields
  const required = ['name', 'description', 'image'];
  const missing = required.filter(field => !metadata[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  // Validate attributes
  if (metadata.attributes) {
    metadata.attributes.forEach(attr => {
      if (!attr.trait_type || !attr.value) {
        throw new Error('Invalid attribute structure');
      }
    });
  }
  
  // Validate creator address
  if (metadata.creator?.address) {
    if (!metadata.creator.address.startsWith('r')) {
      throw new Error('Invalid XRP Ledger address format');
    }
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

# Tezos NFT Metadata Standards (TZIP-21)

## Overview

Tezos uses the TZIP-21 standard for NFT metadata, which is part of the FA2 (Fungible Asset) standard. TZIP-21 provides a comprehensive metadata schema for NFTs on Tezos, ensuring consistency and interoperability across platforms.

## TZIP-21 Standard

### Key Features
- **FA2 Compliant**: Built on Tezos FA2 standard
- **Comprehensive Schema**: Rich metadata structure
- **Creator Support**: Built-in creator information
- **Format Support**: Multiple media formats
- **Tag System**: Categorization and search
- **Royalty Support**: Creator royalties

## Metadata Structure

### Standard JSON Schema

```json
{
  "name": "NFT Name",
  "description": "NFT Description",
  "tags": ["art", "digital", "unique"],
  "symbol": "SYMBOL",
  "decimals": 0,
  "artifactUri": "https://example.com/artifact.png",
  "displayUri": "https://example.com/display.png",
  "thumbnailUri": "https://example.com/thumbnail.png",
  "creators": [
    {
      "address": "tz1...",
      "share": 100
    }
  ],
  "formats": [
    {
      "uri": "https://example.com/artifact.png",
      "mimeType": "image/png",
      "fileSize": 1024000,
      "fileName": "artifact.png",
      "dimensions": {
        "value": "1920x1080",
        "unit": "px"
      }
    }
  ],
  "attributes": [
    {
      "name": "Color",
      "value": "Blue",
      "type": "string"
    },
    {
      "name": "Rarity",
      "value": "Legendary",
      "type": "string"
    },
    {
      "name": "Level",
      "value": 5,
      "type": "number"
    }
  ],
  "generators": [
    {
      "name": "My Generator",
      "version": "1.0.0",
      "description": "Custom NFT generator"
    }
  ],
  "date": "2023-01-01T00:00:00Z",
  "rights": "All rights reserved",
  "rightUri": "https://example.com/rights.pdf",
  "isTransferable": true,
  "isBooleanAmount": false,
  "shouldPreferSymbol": false
}
```

### Required Fields

- **name**: The name of the NFT (string)
- **description**: A description of the NFT (string)
- **artifactUri**: URL to the main artifact (string, URI)
- **decimals**: Number of decimal places (number, typically 0 for NFTs)

### Optional Fields

- **tags**: Array of tags for categorization (string[])
- **symbol**: Symbol for the NFT (string)
- **displayUri**: URL to display image (string, URI)
- **thumbnailUri**: URL to thumbnail image (string, URI)
- **creators**: Array of creator information
- **formats**: Array of format information
- **attributes**: Array of attribute objects
- **generators**: Array of generator information
- **date**: Creation date (string, ISO 8601)
- **rights**: Rights information (string)
- **rightUri**: URL to rights document (string, URI)
- **isTransferable**: Whether NFT is transferable (boolean)
- **isBooleanAmount**: Whether amount is boolean (boolean)
- **shouldPreferSymbol**: Whether to prefer symbol over name (boolean)

### Creator Structure

```json
{
  "address": "string",  // Tezos address (tz1...)
  "share": "number"     // Share percentage (0-100)
}
```

### Format Structure

```json
{
  "uri": "string",           // File URL
  "mimeType": "string",      // MIME type
  "fileSize": "number",      // File size in bytes
  "fileName": "string",      // Original filename
  "dimensions": {            // Optional dimensions
    "value": "string",       // Dimensions (e.g., "1920x1080")
    "unit": "string"         // Unit (e.g., "px")
  }
}
```

### Attribute Structure

```json
{
  "name": "string",    // Attribute name
  "value": "any",      // Attribute value
  "type": "string"     // Value type (string, number, boolean, date)
}
```

### Generator Structure

```json
{
  "name": "string",        // Generator name
  "version": "string",     // Generator version
  "description": "string"  // Generator description
}
```

## FA2 Integration

### Token Metadata

```json
{
  "token_id": 1,
  "token_info": {
    "": "base64_encoded_metadata"
  }
}
```

### Metadata Storage

The metadata is stored as a base64-encoded JSON string in the `token_info` field of the FA2 contract.

## Implementation Examples

### Basic FA2 Contract (LIGO)

```ligo
type token_metadata = {
  token_id: nat;
  token_info: map(string, bytes);
};

type storage = {
  token_metadata: big_map(nat, token_metadata);
  ledger: big_map(address, nat);
  operators: big_map((address, address), unit);
  token_metadata: big_map(nat, token_metadata);
  total_supply: nat;
  admin: address;
};

let create_token_metadata (token_id: nat) (metadata: bytes): token_metadata =
  {
    token_id = token_id;
    token_info = (Big_map.literal [
      ("", metadata)
    ] : (string, bytes) big_map);
  };
```

### Metadata Creation (JavaScript)

```javascript
function createTzip21Metadata(nftData) {
  const metadata = {
    name: nftData.name,
    description: nftData.description,
    tags: nftData.tags || [],
    symbol: nftData.symbol || "",
    decimals: 0,
    artifactUri: nftData.artifactUri,
    displayUri: nftData.displayUri || nftData.artifactUri,
    thumbnailUri: nftData.thumbnailUri || nftData.artifactUri,
    creators: nftData.creators || [],
    formats: nftData.formats || [],
    attributes: nftData.attributes || [],
    generators: nftData.generators || [],
    date: new Date().toISOString(),
    rights: nftData.rights || "",
    rightUri: nftData.rightUri || "",
    isTransferable: true,
    isBooleanAmount: false,
    shouldPreferSymbol: false
  };
  
  return Buffer.from(JSON.stringify(metadata)).toString('base64');
}
```

## Storage Recommendations

### IPFS (Recommended)
- **Pros**: Decentralized, content-addressed, permanent
- **Cons**: Requires pinning service
- **URL Format**: `ipfs://QmHash...`

### Arweave
- **Pros**: Permanent storage, pay once
- **Cons**: Higher cost, less mature ecosystem
- **URL Format**: `ar://hash...`

### HTTP/HTTPS
- **Pros**: Easy to implement, fast access
- **Cons**: Centralized, can be taken down
- **URL Format**: `https://example.com/metadata.json`

## Best Practices

1. **Use IPFS or Arweave** for permanent storage
2. **Include all three URIs** (artifact, display, thumbnail)
3. **Set appropriate creators** with correct shares
4. **Use meaningful tags** for categorization
5. **Include format information** for better compatibility
6. **Validate metadata** before deployment
7. **Test on testnet** first

## Common Extensions

### Marketplace Integration

```json
{
  "name": "NFT Name",
  "description": "NFT Description",
  "artifactUri": "https://example.com/artifact.png",
  "displayUri": "https://example.com/display.png",
  "thumbnailUri": "https://example.com/thumbnail.png",
  "creators": [
    {
      "address": "tz1...",
      "share": 100
    }
  ],
  "formats": [
    {
      "uri": "https://example.com/artifact.png",
      "mimeType": "image/png",
      "fileSize": 1024000,
      "fileName": "artifact.png"
    }
  ],
  "attributes": [
    {
      "name": "Rarity",
      "value": "Legendary",
      "type": "string"
    }
  ],
  "tags": ["art", "digital", "unique"],
  "date": "2023-01-01T00:00:00Z"
}
```

### Collection Support

```json
{
  "name": "Collection Name",
  "description": "Collection Description",
  "artifactUri": "https://example.com/collection.png",
  "creators": [
    {
      "address": "tz1...",
      "share": 100
    }
  ],
  "tags": ["collection", "art"],
  "attributes": [
    {
      "name": "Collection Size",
      "value": 1000,
      "type": "number"
    }
  ]
}
```

## Testing

### Metadata Validation

```javascript
function validateTzip21Metadata(metadata) {
  // Required fields
  const required = ['name', 'description', 'artifactUri', 'decimals'];
  const missing = required.filter(field => !metadata[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  // Validate decimals
  if (metadata.decimals !== 0) {
    throw new Error('Decimals must be 0 for NFTs');
  }
  
  // Validate creators
  if (metadata.creators) {
    const totalShare = metadata.creators.reduce(
      (sum, creator) => sum + creator.share, 0
    );
    if (totalShare !== 100) {
      throw new Error('Creator shares must total 100');
    }
  }
  
  // Validate attributes
  if (metadata.attributes) {
    metadata.attributes.forEach(attr => {
      if (!attr.name || !attr.value || !attr.type) {
        throw new Error('Invalid attribute structure');
      }
    });
  }
  
  return true;
}
```

## Resources

- [TZIP-21 Specification](https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-21/tzip-21.md)
- [FA2 Standard](https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-12/tzip-12.md)
- [Tezos Documentation](https://tezos.com/developers/)
- [LIGO Documentation](https://ligolang.org/)
- [IPFS Documentation](https://docs.ipfs.io/)

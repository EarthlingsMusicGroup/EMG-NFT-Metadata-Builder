# Cardano NFT Metadata Standards (CIP-25)

## Overview

Cardano uses the CIP-25 (Cardano Improvement Proposal 25) standard for NFT metadata. Unlike other blockchains, Cardano stores NFT metadata directly on-chain within transaction metadata, ensuring permanence and immutability.

## CIP-25 Standard

### Key Features
- **On-chain Storage**: Metadata stored directly in transactions
- **Transaction-based**: Each NFT mint includes metadata
- **Permanent**: Immutable once confirmed
- **Standardized Schema**: Consistent JSON structure
- **Media Type Support**: Multiple file formats

## Metadata Structure

### Standard JSON Schema

```json
{
  "721": {
    "policy_id": {
      "asset_name": {
        "name": "NFT Name",
        "image": "ipfs://QmHash...",
        "mediaType": "image/png",
        "description": "NFT Description",
        "files": [
          {
            "name": "image.png",
            "mediaType": "image/png",
            "src": "ipfs://QmHash..."
          }
        ],
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
        "collection": {
          "name": "Collection Name",
          "family": "Collection Family"
        },
        "creator": {
          "name": "Creator Name",
          "url": "https://example.com/creator"
        },
        "properties": {
          "category": "image",
          "size": "1920x1080"
        }
      }
    }
  }
}
```

### Required Fields

- **name**: The name of the NFT (string)
- **image**: URL to the main image (string, URI)
- **mediaType**: MIME type of the main image (string)

### Optional Fields

- **description**: A description of the NFT (string)
- **files**: Array of file objects
- **attributes**: Array of attribute objects
- **collection**: Collection information
- **creator**: Creator information
- **properties**: Additional properties

### File Structure

```json
{
  "name": "string",        // File name
  "mediaType": "string",   // MIME type
  "src": "string"          // File URL
}
```

### Attribute Structure

```json
{
  "trait_type": "string",  // Attribute name
  "value": "any"           // Attribute value
}
```

### Collection Structure

```json
{
  "name": "string",        // Collection name
  "family": "string"       // Collection family
}
```

### Creator Structure

```json
{
  "name": "string",        // Creator name
  "url": "string"          // Creator URL
}
```

## Transaction Metadata

### Metadata Structure

```json
{
  "721": {
    "policy_id": {
      "asset_name": {
        // NFT metadata here
      }
    }
  }
}
```

### Policy ID and Asset Name

- **Policy ID**: 56-character hex string identifying the minting policy
- **Asset Name**: UTF-8 encoded string (up to 32 bytes)

## Implementation Examples

### Basic NFT Minting (Cardano CLI)

```bash
# Create policy script
cat > policy.script << EOF
{
  "keyHash": "$(cardano-cli address key-hash --payment-verification-key-file payment.vkey)",
  "type": "sig"
}
EOF

# Create policy ID
POLICY_ID=$(cardano-cli transaction policyid --script-file policy.script)

# Create asset name
ASSET_NAME="MyNFT"

# Create metadata
cat > metadata.json << EOF
{
  "721": {
    "$POLICY_ID": {
      "$ASSET_NAME": {
        "name": "My NFT",
        "image": "ipfs://QmHash...",
        "mediaType": "image/png",
        "description": "My first Cardano NFT"
      }
    }
  }
}
EOF

# Build transaction
cardano-cli transaction build \
  --tx-in $UTXO \
  --tx-out $ADDRESS+2000000+"1 $POLICY_ID.$ASSET_NAME" \
  --metadata-json-file metadata.json \
  --change-address $ADDRESS \
  --out-file tx.unsigned
```

### JavaScript Implementation

```javascript
function createCardanoMetadata(nftData, policyId, assetName) {
  const metadata = {
    "721": {
      [policyId]: {
        [assetName]: {
          name: nftData.name,
          image: nftData.image,
          mediaType: nftData.mediaType,
          description: nftData.description,
          files: nftData.files || [],
          attributes: nftData.attributes || [],
          collection: nftData.collection || null,
          creator: nftData.creator || null,
          properties: nftData.properties || {}
        }
      }
    }
  };
  
  return metadata;
}

// Example usage
const nftData = {
  name: "My Cardano NFT",
  image: "ipfs://QmHash...",
  mediaType: "image/png",
  description: "A beautiful Cardano NFT",
  attributes: [
    {
      trait_type: "Color",
      value: "Blue"
    }
  ],
  collection: {
    name: "My Collection",
    family: "Art"
  }
};

const policyId = "abc123...";
const assetName = "MyNFT";
const metadata = createCardanoMetadata(nftData, policyId, assetName);
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
- **URL Format**: `https://example.com/image.png`

## Best Practices

1. **Use IPFS or Arweave** for permanent storage
2. **Include mediaType** for all media files
3. **Use meaningful asset names** (UTF-8 encoded)
4. **Include collection information** for related NFTs
5. **Validate metadata** before minting
6. **Test on testnet** first
7. **Consider file size** limits

## Common Extensions

### Marketplace Integration

```json
{
  "721": {
    "policy_id": {
      "asset_name": {
        "name": "NFT Name",
        "image": "ipfs://QmHash...",
        "mediaType": "image/png",
        "description": "NFT Description",
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
          "url": "https://example.com/creator"
        }
      }
    }
  }
}
```

### Multi-file NFTs

```json
{
  "721": {
    "policy_id": {
      "asset_name": {
        "name": "Multi-file NFT",
        "image": "ipfs://QmHash...",
        "mediaType": "image/png",
        "description": "NFT with multiple files",
        "files": [
          {
            "name": "image.png",
            "mediaType": "image/png",
            "src": "ipfs://QmHash..."
          },
          {
            "name": "animation.mp4",
            "mediaType": "video/mp4",
            "src": "ipfs://QmHash2..."
          },
          {
            "name": "document.pdf",
            "mediaType": "application/pdf",
            "src": "ipfs://QmHash3..."
          }
        ]
      }
    }
  }
}
```

## Testing

### Metadata Validation

```javascript
function validateCardanoMetadata(metadata) {
  // Check if 721 key exists
  if (!metadata["721"]) {
    throw new Error('Missing 721 key in metadata');
  }
  
  // Get policy IDs
  const policyIds = Object.keys(metadata["721"]);
  if (policyIds.length === 0) {
    throw new Error('No policy IDs found');
  }
  
  // Validate each policy ID
  policyIds.forEach(policyId => {
    const assets = metadata["721"][policyId];
    const assetNames = Object.keys(assets);
    
    if (assetNames.length === 0) {
      throw new Error(`No assets found for policy ${policyId}`);
    }
    
    // Validate each asset
    assetNames.forEach(assetName => {
      const asset = assets[assetName];
      
      // Required fields
      const required = ['name', 'image', 'mediaType'];
      const missing = required.filter(field => !asset[field]);
      
      if (missing.length > 0) {
        throw new Error(`Missing required fields for asset ${assetName}: ${missing.join(', ')}`);
      }
      
      // Validate files if present
      if (asset.files) {
        asset.files.forEach(file => {
          if (!file.name || !file.mediaType || !file.src) {
            throw new Error('Invalid file structure');
          }
        });
      }
    });
  });
  
  return true;
}
```

## Resources

- [CIP-25 Specification](https://cips.cardano.org/cips/cip25/)
- [Cardano Documentation](https://docs.cardano.org/)
- [Cardano CLI Guide](https://docs.cardano.org/getting-started/installing-cardano-node)
- [IPFS Documentation](https://docs.ipfs.io/)
- [Arweave Documentation](https://docs.arweave.org/)

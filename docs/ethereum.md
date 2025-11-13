# Ethereum NFT Metadata Standards

## Overview

Ethereum is the original blockchain for NFTs, establishing the ERC-721 and ERC-1155 standards that have become the foundation for most other blockchain NFT implementations.

## Standards

### ERC-721
- **Purpose**: Non-fungible tokens (unique tokens)
- **Contract**: Single token type per contract
- **Metadata**: Stored off-chain, referenced via `tokenURI()`

### ERC-1155
- **Purpose**: Multi-token standard (fungible and non-fungible)
- **Contract**: Multiple token types per contract
- **Metadata**: Stored off-chain, referenced via `uri(uint256 id)`

## Metadata Structure

### Standard JSON Schema

```json
{
  "name": "NFT Name",
  "description": "NFT Description",
  "image": "https://example.com/image.png",
  "external_url": "https://example.com/nft/1",
  "animation_url": "https://example.com/animation.mp4",
  "background_color": "000000",
  "attributes": [
    {
      "trait_type": "Color",
      "value": "Blue"
    },
    {
      "trait_type": "Rarity",
      "value": "Legendary"
    },
    {
      "trait_type": "Level",
      "value": 5,
      "max_value": 10
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
  }
}
```

### Required Fields

- **name**: The name of the NFT (string)
- **description**: A human-readable description (string)
- **image**: URL to the image resource (string, URI)

### Optional Fields

- **external_url**: External URL pointing to the NFT (string, URI)
- **animation_url**: URL to animation/video (string, URI)
- **background_color**: Background color in hex format (string, 6 characters)
- **attributes**: Array of trait objects
- **properties**: Additional properties object

### Attributes Structure

```json
{
  "trait_type": "string", // Required: The name of the trait
  "value": "any",         // Required: The value of the trait
  "max_value": "number",  // Optional: Maximum value for numeric traits
  "display_type": "string" // Optional: How to display the trait
}
```

### Display Types

- `"number"`: Numeric value
- `"boost_number"`: Boost percentage
- `"boost_percentage"`: Boost percentage with % symbol
- `"date"`: Unix timestamp

## Implementation Examples

### Basic ERC-721 Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyNFT is ERC721 {
    string private _baseTokenURI;
    
    constructor(string memory baseURI) ERC721("MyNFT", "MNFT") {
        _baseTokenURI = baseURI;
    }
    
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(_baseURI(), tokenId.toString()));
    }
}
```

### Basic ERC-1155 Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MyMultiToken is ERC1155 {
    constructor(string memory uri) ERC1155(uri) {}
    
    function uri(uint256 id) public view override returns (string memory) {
        return string(abi.encodePacked(super.uri(id), id.toString()));
    }
}
```

## Storage Recommendations

### IPFS
- **Pros**: Decentralized, content-addressed, permanent
- **Cons**: Requires pinning service for permanence
- **URL Format**: `ipfs://QmHash...`

### Arweave
- **Pros**: Permanent storage, pay once
- **Cons**: Higher cost, less mature ecosystem
- **URL Format**: `ar://hash...`

### HTTP/HTTPS
- **Pros**: Easy to implement, fast access
- **Cons**: Centralized, can be taken down
- **URL Format**: `https://example.com/metadata/1.json`

## Best Practices

1. **Use IPFS or Arweave** for permanent storage
2. **Validate metadata** before deployment
3. **Include proper attributes** for marketplace compatibility
4. **Use HTTPS** for external URLs
5. **Test tokenURI** function thoroughly
6. **Consider gas optimization** for large collections

## Common Extensions

### ERC-4955: Namespaces
Allows vendor-specific data in metadata:

```json
{
  "name": "NFT Name",
  "description": "NFT Description",
  "image": "https://example.com/image.png",
  "namespaces": {
    "opensea": {
      "collection": "My Collection",
      "category": "art"
    }
  }
}
```

### ERC-5185: Metadata Update
Allows controlled metadata updates:

```json
{
  "name": "NFT Name",
  "description": "NFT Description",
  "image": "https://example.com/image.png",
  "update_mechanism": {
    "type": "merkle_proof",
    "merkle_root": "0x...",
    "proof": ["0x...", "0x..."]
  }
}
```

## Testing

### Metadata Validation

```javascript
// Validate ERC-721 metadata
function validateMetadata(metadata) {
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
}
```

## Resources

- [ERC-721 Standard](https://eips.ethereum.org/EIPS/eip-721)
- [ERC-1155 Standard](https://eips.ethereum.org/EIPS/eip-1155)
- [OpenSea Metadata Standards](https://docs.opensea.io/docs/metadata-standards)
- [IPFS Documentation](https://docs.ipfs.io/)
- [Arweave Documentation](https://docs.arweave.org/)

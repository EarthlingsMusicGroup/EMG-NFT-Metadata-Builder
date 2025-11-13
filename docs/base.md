# Base NFT Metadata Standards

## Overview

Base is Coinbase's Layer 2 scaling solution built on the OP Stack. It's fully compatible with Ethereum's ERC-721 and ERC-1155 standards, providing the same metadata structures and practices as Ethereum but with significantly lower transaction costs and faster confirmation times.

## Standards

### ERC-721 Compatibility
- **Purpose**: Non-fungible tokens (unique tokens)
- **Contract**: Single token type per contract
- **Metadata**: Stored off-chain, referenced via `tokenURI()`

### ERC-1155 Compatibility
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

## Base-Specific Considerations

### Network Details
- **Chain ID**: 8453 (Mainnet), 84531 (Base Goerli Testnet)
- **RPC URL**: `https://mainnet.base.org`
- **Block Explorer**: [Basescan](https://basescan.org/)
- **Gas Token**: ETH (same as Ethereum)

### Advantages over Ethereum
- **Lower Gas Fees**: 10-100x cheaper than Ethereum
- **Faster Transactions**: ~2 second block time
- **EVM Compatibility**: Deploy Ethereum contracts without changes
- **Coinbase Integration**: Native support in Coinbase Wallet

## Implementation Examples

### Basic ERC-721 Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BaseNFT is ERC721 {
    string private _baseTokenURI;
    
    constructor(string memory baseURI) ERC721("BaseNFT", "BNFT") {
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

### Deployment Script

```javascript
const { ethers } = require("hardhat");

async function main() {
  const BaseNFT = await ethers.getContractFactory("BaseNFT");
  const baseNFT = await BaseNFT.deploy("https://example.com/metadata/");
  
  await baseNFT.deployed();
  
  console.log("BaseNFT deployed to:", baseNFT.address);
  console.log("Base URI:", await baseNFT.baseURI());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

## Storage Recommendations

### IPFS (Recommended)
- **Pros**: Decentralized, content-addressed, permanent
- **Cons**: Requires pinning service for permanence
- **URL Format**: `ipfs://QmHash...`
- **Cost**: Free with pinning service

### Arweave
- **Pros**: Permanent storage, pay once
- **Cons**: Higher cost, less mature ecosystem
- **URL Format**: `ar://hash...`
- **Cost**: ~$0.01-0.10 per MB

### HTTP/HTTPS
- **Pros**: Easy to implement, fast access
- **Cons**: Centralized, can be taken down
- **URL Format**: `https://example.com/metadata/1.json`
- **Cost**: Hosting costs

## Best Practices

1. **Use IPFS or Arweave** for permanent storage
2. **Validate metadata** before deployment
3. **Include proper attributes** for marketplace compatibility
4. **Use HTTPS** for external URLs
5. **Test on Base Goerli testnet** first
6. **Consider gas optimization** for large collections
7. **Monitor gas prices** for cost-effective deployment

## Base-Specific Tools

### Development Tools
- **Hardhat**: Ethereum development framework
- **Truffle**: Development framework
- **Remix**: Online IDE
- **Base Studio**: Official development platform

### Deployment Tools
- **Base Studio**: One-click deployment
- **Hardhat**: Programmatic deployment
- **Truffle**: Migration-based deployment

### Testing
- **Base Goerli Testnet**: Base's testnet
- **Faucet**: Get test ETH tokens
- **Block Explorer**: [Base Goerli Basescan](https://goerli.basescan.org/)

## Common Extensions

### OpenSea Integration

```json
{
  "name": "NFT Name",
  "description": "NFT Description",
  "image": "https://example.com/image.png",
  "external_url": "https://example.com/nft/1",
  "attributes": [
    {
      "trait_type": "Color",
      "value": "Blue"
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

### Collection Metadata

```json
{
  "name": "Collection Name",
  "description": "Collection Description",
  "image": "https://example.com/collection.png",
  "external_url": "https://example.com/collection",
  "attributes": [
    {
      "trait_type": "Collection Size",
      "value": 1000
    }
  ]
}
```

## Testing

### Metadata Validation

```javascript
// Validate Base NFT metadata
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
  
  return true;
}
```

### Testnet Deployment

```javascript
// Deploy to Base Goerli testnet
async function deployToBaseGoerli() {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://goerli.base.org"
  );
  
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  const BaseNFT = await ethers.getContractFactory("BaseNFT");
  const baseNFT = await BaseNFT.connect(wallet).deploy(
    "https://example.com/metadata/"
  );
  
  await baseNFT.deployed();
  console.log("Deployed to:", baseNFT.address);
}
```

## Resources

- [Base Documentation](https://docs.base.org/)
- [Base Studio](https://base.org/studio)
- [Base Goerli Testnet](https://goerli.basescan.org/)
- [Base Faucet](https://faucet.base.org/)
- [OpenSea Base](https://opensea.io/assets/base)

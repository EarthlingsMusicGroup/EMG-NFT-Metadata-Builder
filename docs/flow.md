# Flow NFT Metadata Standards

## Overview

Flow uses a custom NFT standard with metadata stored on-chain within the NFT's smart contract. Flow's resource-oriented programming model provides unique capabilities for NFT management and metadata handling.

## Flow NFT Standard

### Key Features
- **Resource-oriented**: NFTs are resources, not simple data
- **On-chain Metadata**: Metadata stored directly in the contract
- **Composable**: NFTs can be composed and extended
- **Secure**: Built-in security through resource model
- **Scalable**: High throughput and low fees

## Metadata Structure

### Standard JSON Schema

```json
{
  "name": "NFT Name",
  "description": "NFT Description",
  "thumbnail": "https://example.com/thumbnail.png",
  "externalURL": "https://example.com/nft/1",
  "media": [
    {
      "file": {
        "url": "https://example.com/media.png",
        "type": "image/png"
      },
      "mediaType": "image/png"
    }
  ],
  "attributes": [
    {
      "name": "Color",
      "value": "Blue",
      "type": "String"
    },
    {
      "name": "Rarity",
      "value": "Legendary",
      "type": "String"
    },
    {
      "name": "Level",
      "value": 5,
      "type": "Int"
    }
  ],
  "traits": [
    {
      "name": "Background",
      "value": "Forest",
      "rarity": 0.1
    }
  ],
  "rarity": {
    "score": 0.95,
    "maxScore": 1.0,
    "rank": 1
  },
  "collection": {
    "name": "Collection Name",
    "description": "Collection Description",
    "externalURL": "https://example.com/collection",
    "squareImage": "https://example.com/collection-square.png",
    "bannerImage": "https://example.com/collection-banner.png",
    "socials": {
      "twitter": "https://twitter.com/collection",
      "discord": "https://discord.gg/collection"
    }
  }
}
```

### Required Fields

- **name**: The name of the NFT (string)
- **description**: A description of the NFT (string)
- **thumbnail**: URL to the thumbnail image (string, URI)

### Optional Fields

- **externalURL**: External URL pointing to the NFT (string, URI)
- **media**: Array of media objects
- **attributes**: Array of attribute objects
- **traits**: Array of trait objects
- **rarity**: Rarity information
- **collection**: Collection information

### Media Structure

```json
{
  "file": {
    "url": "string",    // Media URL
    "type": "string"    // MIME type
  },
  "mediaType": "string" // Media type
}
```

### Attribute Structure

```json
{
  "name": "string",     // Attribute name
  "value": "any",       // Attribute value
  "type": "string"      // Value type (String, Int, Float, Bool)
}
```

### Trait Structure

```json
{
  "name": "string",     // Trait name
  "value": "any",       // Trait value
  "rarity": "number"    // Rarity score (0-1)
}
```

### Rarity Structure

```json
{
  "score": "number",    // Rarity score (0-1)
  "maxScore": "number", // Maximum possible score
  "rank": "number"      // Rank within collection
}
```

### Collection Structure

```json
{
  "name": "string",           // Collection name
  "description": "string",    // Collection description
  "externalURL": "string",    // Collection URL
  "squareImage": "string",    // Square image URL
  "bannerImage": "string",    // Banner image URL
  "socials": {                // Social media links
    "twitter": "string",
    "discord": "string"
  }
}
```

## Contract Implementation

### Basic NFT Resource

```cadence
pub resource NFT: NonFungibleToken.INFT {
    pub let id: UInt64
    pub let name: String
    pub let description: String
    pub let thumbnail: String
    pub let externalURL: String
    pub let media: [Media]
    pub let attributes: [Attribute]
    pub let traits: [Trait]
    pub let rarity: Rarity?
    pub let collection: Collection?

    init(
        id: UInt64,
        name: String,
        description: String,
        thumbnail: String,
        externalURL: String,
        media: [Media],
        attributes: [Attribute],
        traits: [Trait],
        rarity: Rarity?,
        collection: Collection?
    ) {
        self.id = id
        self.name = name
        self.description = description
        self.thumbnail = thumbnail
        self.externalURL = externalURL
        self.media = media
        self.attributes = attributes
        self.traits = traits
        self.rarity = rarity
        self.collection = collection
    }
}

pub struct Media {
    pub let file: File
    pub let mediaType: String

    init(file: File, mediaType: String) {
        self.file = file
        self.mediaType = mediaType
    }
}

pub struct File {
    pub let url: String
    pub let type: String

    init(url: String, type: String) {
        self.url = url
        self.type = type
    }
}

pub struct Attribute {
    pub let name: String
    pub let value: AnyStruct
    pub let type: String

    init(name: String, value: AnyStruct, type: String) {
        self.name = name
        self.value = value
        self.type = type
    }
}

pub struct Trait {
    pub let name: String
    pub let value: AnyStruct
    pub let rarity: Float

    init(name: String, value: AnyStruct, rarity: Float) {
        self.name = name
        self.value = value
        self.rarity = rarity
    }
}

pub struct Rarity {
    pub let score: Float
    pub let maxScore: Float
    pub let rank: UInt32

    init(score: Float, maxScore: Float, rank: UInt32) {
        self.score = score
        self.maxScore = maxScore
        self.rank = rank
    }
}

pub struct Collection {
    pub let name: String
    pub let description: String
    pub let externalURL: String
    pub let squareImage: String
    pub let bannerImage: String
    pub let socials: Socials

    init(
        name: String,
        description: String,
        externalURL: String,
        squareImage: String,
        bannerImage: String,
        socials: Socials
    ) {
        self.name = name
        self.description = description
        self.externalURL = externalURL
        self.squareImage = squareImage
        self.bannerImage = bannerImage
        self.socials = socials
    }
}

pub struct Socials {
    pub let twitter: String?
    pub let discord: String?

    init(twitter: String?, discord: String?) {
        self.twitter = twitter
        self.discord = discord
    }
}
```

### NFT Contract

```cadence
pub contract MyNFT: NonFungibleToken {
    pub var totalSupply: UInt64
    pub var nextTokenID: UInt64
    pub var collection: @Collection

    init() {
        self.totalSupply = 0
        self.nextTokenID = 1
        self.collection <- create Collection()
    }

    pub fun mintNFT(
        name: String,
        description: String,
        thumbnail: String,
        externalURL: String,
        media: [Media],
        attributes: [Attribute],
        traits: [Trait],
        rarity: Rarity?,
        collection: Collection?
    ): @NFT {
        let nft <- create NFT(
            id: self.nextTokenID,
            name: name,
            description: description,
            thumbnail: thumbnail,
            externalURL: externalURL,
            media: media,
            attributes: attributes,
            traits: traits,
            rarity: rarity,
            collection: collection
        )
        
        self.nextTokenID = self.nextTokenID + 1
        self.totalSupply = self.totalSupply + 1
        
        return <-nft
    }

    pub fun getNFT(id: UInt64): &NFT? {
        return self.collection.getNFT(id: id)
    }
}
```

## JavaScript Integration

### Minting NFT

```javascript
// Mint NFT
async function mintNFT(contract, nftData) {
  const media = nftData.media.map(m => ({
    file: {
      url: m.file.url,
      type: m.file.type
    },
    mediaType: m.mediaType
  }));
  
  const attributes = nftData.attributes.map(attr => ({
    name: attr.name,
    value: attr.value,
    type: attr.type
  }));
  
  const traits = nftData.traits.map(trait => ({
    name: trait.name,
    value: trait.value,
    rarity: trait.rarity
  }));
  
  const rarity = nftData.rarity ? {
    score: nftData.rarity.score,
    maxScore: nftData.rarity.maxScore,
    rank: nftData.rarity.rank
  } : null;
  
  const collection = nftData.collection ? {
    name: nftData.collection.name,
    description: nftData.collection.description,
    externalURL: nftData.collection.externalURL,
    squareImage: nftData.collection.squareImage,
    bannerImage: nftData.collection.bannerImage,
    socials: {
      twitter: nftData.collection.socials?.twitter,
      discord: nftData.collection.socials?.discord
    }
  } : null;
  
  return await contract.mintNFT(
    nftData.name,
    nftData.description,
    nftData.thumbnail,
    nftData.externalURL,
    media,
    attributes,
    traits,
    rarity,
    collection
  );
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
2. **Include comprehensive media** information
3. **Use meaningful attributes** and traits
4. **Include rarity information** for marketplace compatibility
5. **Validate metadata** before minting
6. **Test on testnet** first
7. **Consider gas costs** for complex metadata

## Common Extensions

### Marketplace Integration

```json
{
  "name": "NFT Name",
  "description": "NFT Description",
  "thumbnail": "https://example.com/thumbnail.png",
  "externalURL": "https://example.com/nft/1",
  "media": [
    {
      "file": {
        "url": "https://example.com/media.png",
        "type": "image/png"
      },
      "mediaType": "image/png"
    }
  ],
  "attributes": [
    {
      "name": "Rarity",
      "value": "Legendary",
      "type": "String"
    }
  ],
  "traits": [
    {
      "name": "Background",
      "value": "Forest",
      "rarity": 0.1
    }
  ],
  "rarity": {
    "score": 0.95,
    "maxScore": 1.0,
    "rank": 1
  }
}
```

### Collection Support

```json
{
  "name": "Collection Item",
  "description": "Item from My Collection",
  "thumbnail": "https://example.com/thumbnail.png",
  "collection": {
    "name": "My Collection",
    "description": "A beautiful collection of NFTs",
    "externalURL": "https://example.com/collection",
    "squareImage": "https://example.com/collection-square.png",
    "bannerImage": "https://example.com/collection-banner.png",
    "socials": {
      "twitter": "https://twitter.com/collection",
      "discord": "https://discord.gg/collection"
    }
  }
}
```

## Testing

### Metadata Validation

```javascript
function validateFlowMetadata(metadata) {
  // Required fields
  const required = ['name', 'description', 'thumbnail'];
  const missing = required.filter(field => !metadata[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
  
  // Validate media
  if (metadata.media) {
    metadata.media.forEach(media => {
      if (!media.file || !media.file.url || !media.file.type) {
        throw new Error('Invalid media structure');
      }
    });
  }
  
  // Validate attributes
  if (metadata.attributes) {
    metadata.attributes.forEach(attr => {
      if (!attr.name || !attr.value || !attr.type) {
        throw new Error('Invalid attribute structure');
      }
    });
  }
  
  // Validate traits
  if (metadata.traits) {
    metadata.traits.forEach(trait => {
      if (!trait.name || !trait.value || typeof trait.rarity !== 'number') {
        throw new Error('Invalid trait structure');
      }
    });
  }
  
  return true;
}
```

## Resources

- [Flow Documentation](https://docs.onflow.org/)
- [Flow NFT Standard](https://github.com/onflow/flow-nft)
- [Cadence Language](https://docs.onflow.org/cadence/)
- [IPFS Documentation](https://docs.ipfs.io/)
- [Arweave Documentation](https://docs.arweave.org/)

# NFT Metadata Standards Documentation

This directory contains comprehensive documentation for NFT metadata standards across different blockchain networks. Each chain has its own specific metadata structure and requirements.

## Supported Blockchains

### EVM-Compatible Chains (ERC-721/1155)
- [Ethereum](./ethereum.md) - The original ERC-721/1155 standard
- [Polygon](./polygon.md) - ERC-721 compatible Layer 2
- [Base](./base.md) - Coinbase Layer 2 (ERC-721 compatible)
- [Arbitrum](./arbitrum.md) - Layer 2 scaling solution (ERC-721 compatible)
- [Optimism](./optimism.md) - Layer 2 scaling solution (ERC-721 compatible)
- [Avalanche](./avalanche.md) - High-performance blockchain (ERC-721 compatible)
- [BSC (Binance Smart Chain)](./bsc.md) - Binance's blockchain (ERC-721 compatible)

### Non-EVM Chains
- [Solana](./solana.md) - Metaplex Token Metadata standard
- [XRP Ledger](./xrp-ledger.md) - XLS-20/24d standard
- [Tezos](./tezos.md) - TZIP-21 standard
- [Cardano](./cardano.md) - CIP-25 standard
- [Flow](./flow.md) - Custom NFT standard
- [NEAR Protocol](./near.md) - NEP-171 standard

## Quick Reference

| Chain | Standard | Metadata Storage | Key Features |
|-------|----------|------------------|--------------|
| Ethereum | ERC-721/1155 | Off-chain (IPFS/Arweave) | Original standard, most widely adopted |
| Polygon | ERC-721 | Off-chain (IPFS/Arweave) | Low fees, Ethereum compatible |
| Solana | Metaplex | On-chain + Off-chain | Fast, low-cost transactions |
| XRP Ledger | XLS-20/24d | On-chain | Native NFT support, low fees |
| Tezos | TZIP-21 | Off-chain | FA2 compliant, formal verification |
| Cardano | CIP-25 | On-chain | Built into transaction metadata |
| Flow | Custom | On-chain | Resource-oriented programming |
| NEAR | NEP-171 | Off-chain | Developer-friendly, scalable |

## Common Metadata Fields

Most NFT standards share these common fields:
- **name**: The name of the NFT
- **description**: A description of the NFT
- **image**: URL to the main image/asset
- **attributes**: Array of trait objects with trait_type and value

## Best Practices

1. **Storage**: Use decentralized storage (IPFS, Arweave) for off-chain metadata
2. **Validation**: Always validate metadata against the chain's schema
3. **Permanence**: Ensure metadata URLs are permanent and accessible
4. **Standards**: Follow the official metadata standard for each chain
5. **Testing**: Test metadata structure before mainnet deployment

## Contributing

When adding new chains or updating existing documentation:
1. Follow the established format
2. Include complete JSON examples
3. Document all required and optional fields
4. Provide implementation examples
5. Update this main README with new chains

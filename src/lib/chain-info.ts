import type { ChainType } from "./types";

export interface ChainInfo {
  title: string;
  description: string;
  features: string[];
  links: { name: string; url: string }[];
}

export function getChainIconUrl(chainId: ChainType): string {
  const iconMap: Record<ChainType, string> = {
    ethereum:
      "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/eth.png",
    solana:
      "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/sol.png",
    xrp: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/xrp.png",
    polygon:
      "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/matic.png",
    tezos:
      "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/xtz.png",
    avalanche:
      "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/avax.png",
    bsc: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/bnb.png",
    cardano:
      "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/ada.png",
    flow: "https://raw.githubusercontent.com/onflow/assets/main/environments/flow/svg/logo.svg",
    near: "https://assets.coingecko.com/coins/images/10365/large/near_icon.png",
    base: "https://raw.githubusercontent.com/Aero25x/Cryptocurrencies-Logo/main/Base.svg",
    arbitrum:
      "https://raw.githubusercontent.com/Aero25x/Cryptocurrencies-Logo/main/Arbitrum.svg",
    optimism:
      "https://assets.coingecko.com/coins/images/25244/large/Optimism.png",
  };
  return iconMap[chainId] || iconMap.ethereum;
}

export const supportedChains: Array<{ id: ChainType; name: string }> = [
  { id: "ethereum", name: "Ethereum" },
  { id: "solana", name: "Solana" },
  { id: "polygon", name: "Polygon" },
  { id: "xrp", name: "XRP" },
  { id: "tezos", name: "Tezos" },
];

export function getChainInfo(chain: ChainType): ChainInfo {
  switch (chain) {
    case "ethereum":
      return {
        title: "Ethereum Collection",
        description:
          "ERC-721/1155 compatible metadata for OpenSea, Rarible, and other Ethereum marketplaces",
        features: [
          "OpenSea Compatible",
          "ERC-721 Standard",
          "Royalties Support",
          "Attributes System",
        ],
        links: [
          {
            name: "ERC-721 Standard",
            url: "https://eips.ethereum.org/EIPS/eip-721",
          },
          {
            name: "OpenSea Docs",
            url: "https://docs.opensea.io/docs/metadata-standards",
          },
        ],
      };
    case "solana":
      return {
        title: "Solana Collection",
        description:
          "Metaplex NFT standard for Solana marketplaces like Magic Eden and Solsea",
        features: [
          "Metaplex Standard",
          "Magic Eden Compatible",
          "Solana Royalties",
          "Collection Support",
        ],
        links: [
          {
            name: "Metaplex Docs",
            url: "https://docs.metaplex.com/programs/token-metadata/",
          },
          { name: "Magic Eden", url: "https://magiceden.io/" },
        ],
      };
    case "xrp":
      return {
        title: "XRPL Collection",
        description: "XLS-20 NFT standard for XRP Ledger marketplaces",
        features: [
          "XLS-20 Standard",
          "XRPL Native",
          "Low Fees",
          "Fast Transactions",
        ],
        links: [
          {
            name: "XLS-20 Standard",
            url: "https://xrpl.org/docs/tutorials/nft-tutorials/",
          },
          { name: "XRPL Docs", url: "https://xrpl.org/docs/" },
        ],
      };
    case "polygon":
      return {
        title: "Polygon Collection",
        description: "Ethereum-compatible NFTs on Polygon for lower gas fees",
        features: [
          "Ethereum Compatible",
          "Low Gas Fees",
          "OpenSea Compatible",
          "Fast Transactions",
        ],
        links: [
          { name: "Polygon Docs", url: "https://docs.polygon.technology/" },
          {
            name: "OpenSea Polygon",
            url: "https://opensea.io/collection/polygon",
          },
        ],
      };
    case "tezos":
      return {
        title: "Tezos Collection",
        description:
          "FA2 NFT standard for Tezos marketplaces like Objkt and Teia",
        features: [
          "FA2 Standard",
          "Objkt Compatible",
          "Tezos Royalties",
          "Energy Efficient",
        ],
        links: [
          { name: "FA2 Standard", url: "https://tezos.com/defi/fa2/" },
          { name: "Objkt", url: "https://objkt.com/" },
        ],
      };
    case "cardano":
      return {
        title: "Cardano Collection",
        description:
          "CIP-25 NFT standard for Cardano marketplaces like JPG Store and CNFT",
        features: [
          "CIP-25 Standard",
          "JPG Store Compatible",
          "Cardano Native",
          "Low Fees",
        ],
        links: [
          {
            name: "CIP-25 Standard",
            url: "https://cips.cardano.org/cips/cip25/",
          },
          { name: "JPG Store", url: "https://jpg.store/" },
        ],
      };
    case "near":
      return {
        title: "NEAR Collection",
        description: "NEP-171 NFT standard for NEAR Protocol marketplaces",
        features: [
          "NEP-171 Standard",
          "NEAR Native",
          "Low Fees",
          "Fast Transactions",
        ],
        links: [
          {
            name: "NEP-171 Standard",
            url: "https://github.com/near/NEPs/blob/master/neps/nep-0171.md",
          },
          { name: "NEAR Docs", url: "https://docs.near.org/" },
        ],
      };
    case "flow":
      return {
        title: "Flow Collection",
        description: "Flow NFT standard for Flow blockchain marketplaces",
        features: [
          "Flow Standard",
          "Resource-Oriented",
          "Low Fees",
          "Fast Transactions",
        ],
        links: [
          { name: "Flow Docs", url: "https://docs.onflow.org/" },
          {
            name: "Flow NFT Standard",
            url: "https://docs.onflow.org/core-contracts/nft-contract/",
          },
        ],
      };
    case "base":
      return {
        title: "Base Collection",
        description: "Ethereum-compatible NFTs on Base for lower gas fees",
        features: [
          "Ethereum Compatible",
          "Low Gas Fees",
          "OpenSea Compatible",
          "Coinbase Backed",
        ],
        links: [
          { name: "Base Docs", url: "https://docs.base.org/" },
          { name: "OpenSea Base", url: "https://opensea.io/collection/base" },
        ],
      };
    case "arbitrum":
      return {
        title: "Arbitrum Collection",
        description: "Ethereum-compatible NFTs on Arbitrum for lower gas fees",
        features: [
          "Ethereum Compatible",
          "Low Gas Fees",
          "OpenSea Compatible",
          "Fast Transactions",
        ],
        links: [
          { name: "Arbitrum Docs", url: "https://docs.arbitrum.io/" },
          {
            name: "OpenSea Arbitrum",
            url: "https://opensea.io/collection/arbitrum",
          },
        ],
      };
    case "optimism":
      return {
        title: "Optimism Collection",
        description: "Ethereum-compatible NFTs on Optimism for lower gas fees",
        features: [
          "Ethereum Compatible",
          "Low Gas Fees",
          "OpenSea Compatible",
          "Fast Transactions",
        ],
        links: [
          { name: "Optimism Docs", url: "https://docs.optimism.io/" },
          {
            name: "OpenSea Optimism",
            url: "https://opensea.io/collection/optimism",
          },
        ],
      };
    case "avalanche":
      return {
        title: "Avalanche Collection",
        description: "Ethereum-compatible NFTs on Avalanche for lower gas fees",
        features: [
          "Ethereum Compatible",
          "Low Gas Fees",
          "OpenSea Compatible",
          "Fast Transactions",
        ],
        links: [
          { name: "Avalanche Docs", url: "https://docs.avax.network/" },
          {
            name: "OpenSea Avalanche",
            url: "https://opensea.io/collection/avalanche",
          },
        ],
      };
    case "bsc":
      return {
        title: "BSC Collection",
        description:
          "Ethereum-compatible NFTs on Binance Smart Chain for lower gas fees",
        features: [
          "Ethereum Compatible",
          "Low Gas Fees",
          "OpenSea Compatible",
          "Fast Transactions",
        ],
        links: [
          { name: "BSC Docs", url: "https://docs.bnbchain.org/" },
          { name: "OpenSea BSC", url: "https://opensea.io/collection/bsc" },
        ],
      };
    default:
      return {
        title: "NFT Collection",
        description: "Configure your NFT collection",
        features: [],
        links: [],
      };
  }
}

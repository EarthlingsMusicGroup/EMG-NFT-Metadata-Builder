# EMG NFT Metadata Builder

**Privacy First**: No accounts, no servers, no data collection. Your projects are stored locally and never leave your device.

## Overview

EMG NFT Metadata Builder is a web application for creating, editing, and exporting NFT metadata across multiple blockchain networks. It provides a complete workflow from project creation to metadata export, with support for IPFS uploads and multiple export formats.

The application is fully client-side with no backend required. All data is stored locally in the browser using IndexedDB, ensuring privacy and offline capability.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/BankkRoll/nft-metadata-builder.git
cd EMG-NFT-Metadata-Builder

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS 4, shadcn/ui
- **State Management**: Zustand
- **Storage**: IndexedDB (client-side only)
- **Build Tool**: pnpm
- **Animation**: motion/react
- **Virtualization**: react-window

## How It Works

### Architecture

The application follows a component-based architecture with clear separation of concerns:

1. **State Management**: Zustand store manages projects, images, metadata entries, and UI state
2. **Storage Layer**: IndexedDB handles persistent storage of files and project data
3. **Schema System**: Chain-specific metadata schemas ensure compatibility with blockchain standards
4. **Validation**: Real-time validation ensures metadata meets blockchain requirements

### Workflow

1. **Project Creation**: Select blockchain and configure collection settings
2. **Image Upload**: Drag-and-drop interface stores images in IndexedDB
3. **Metadata Editing**: Chain-aware forms generate compliant metadata
4. **Preview**: Visual and JSON preview before export
5. **Export**: Multiple formats including JSON, ZIP, and IPFS upload

### Supported Blockchains

- Ethereum (ERC-721)
- Solana (Metaplex)
- XRP Ledger (XLS-20/24d)
- Polygon (ERC-721)
- Tezos (TZIP-21)
- Base, Arbitrum, Optimism, Avalanche, BSC (ERC-721)
- Cardano (CIP-25)
- Flow (NFT Standard)
- NEAR (NEP-171)

## Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Setup

See [Quick Start](#quick-start) above for basic setup instructions.

### Build

```bash
pnpm build
pnpm start
```

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx          # Home page
│   ├── p/[id]/           # Project page
│   └── settings/          # Settings page
├── components/            # React components
│   ├── collection/       # Collection configuration
│   ├── export/            # Export functionality
│   ├── home/              # Home page components
│   ├── layout/            # Layout components
│   ├── media/             # Media upload and preview
│   ├── metadata/          # Metadata editing
│   ├── metadata-editor/   # Main editor interface
│   ├── preview/           # Preview components
│   ├── project/           # Project management
│   ├── settings/          # Settings components
│   └── ui/                # Reusable UI components
├── lib/                   # Core utilities
│   ├── chain-info.ts      # Blockchain information
│   ├── file-validation.ts # File validation
│   ├── indexeddb.ts       # IndexedDB operations
│   ├── ipfs.ts           # IPFS upload
│   ├── project-store.ts   # Zustand store
│   ├── schemas.ts         # Metadata schemas
│   ├── types.ts           # TypeScript types
│   └── validation.ts      # Validation logic
└── hooks/                 # Custom React hooks
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:

- Code of conduct
- Development workflow
- Code style guidelines
- How to add new blockchain support
- Pull request process

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the existing code style
4. Test your changes thoroughly
5. Commit with clear messages
6. Push to your branch and open a Pull Request

For detailed guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Features

- Multi-chain metadata generation
- Local storage with IndexedDB
- Drag-and-drop image upload
- Batch metadata editing
- Real-time validation
- IPFS upload support
- Multiple export formats
- Dark/light theme
- Keyboard navigation
- Responsive design

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/), [React](https://react.dev/), and [TypeScript](https://www.typescriptlang.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Author: **Bankk** - [GitHub](https://github.com/BankkRoll)

## Support

- [Report a Bug](https://github.com/BankkRoll/nft-metadata-builder/issues)
- [Request a Feature](https://github.com/BankkRoll/nft-metadata-builder/issues)
- [Documentation](docs/)
- [Discussions](https://github.com/BankkRoll/nft-metadata-builder/discussions)


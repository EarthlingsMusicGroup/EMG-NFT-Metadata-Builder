# Contributing to EMG NFT Metadata Builder

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm (recommended) or npm
- Git

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/EarthlingsMusicGroup/EMG-NFT-Metadata-Builder.git
   cd EMG-NFT-Metadata-Builder
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

5. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Making Changes

1. **Plan your changes**: Consider opening an issue first to discuss major changes
2. **Write clean code**: Follow the existing code style and patterns
3. **Test thoroughly**: Ensure your changes work across different scenarios
4. **Update documentation**: Update README or relevant docs if needed

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **Naming**: 
  - Variables/Functions: `camelCase`
  - Components: `PascalCase`
  - Files: `kebab-case` or `lower-case`
  - Constants: `UPPER_CASE` or `camelCase` for non-exports
- **Components**: Keep them focused, reusable, and well-documented
- **No debug code**: Remove `console.log`, `debugger`, and unnecessary comments
- **Accessibility**: Follow WCAG guidelines and use semantic HTML
- **Performance**: Use memoization for expensive operations, virtualize long lists

### Commit Messages

Use clear, descriptive commit messages:

```
feat: Add support for new blockchain
fix: Resolve metadata validation issue
docs: Update README with new features
refactor: Improve component structure
test: Add tests for validation logic
```

### Pull Request Process

1. **Update your branch**: Rebase on latest `main` branch
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Ensure quality**:
   - Code follows style guidelines
   - All tests pass (if applicable)
   - No linting errors (`pnpm lint`)
   - Type checking passes (`pnpm type-check`)

3. **Create Pull Request**:
   - Use a clear, descriptive title
   - Describe what changes you made and why
   - Reference any related issues
   - Add screenshots for UI changes

4. **Respond to feedback**: Be open to suggestions and make requested changes

## Adding New Blockchain Support

To add support for a new blockchain:

1. **Add chain type** to `src/lib/types.ts`:
   ```typescript
   export type ChainType = 
     | "ethereum"
     | "solana"
     // ... existing chains
     | "your-new-chain"
   ```

2. **Create schema** in `src/lib/schemas.ts`:
   - Define the metadata structure
   - Add validation rules
   - Create default metadata generator

3. **Add chain info** to `src/lib/chain-info.ts`:
   - Chain name, symbol, logo
   - Documentation links
   - Network information

4. **Update chain config fields** in `src/components/collection/chain-config-fields.tsx`:
   - Add chain-specific configuration options

5. **Add metadata fields** in `src/components/metadata/chain-fields.tsx`:
   - Create form fields for chain-specific metadata

6. **Update preview components** if needed:
   - Add chain-specific preview rendering

7. **Add documentation** in `docs/`:
   - Create a markdown file explaining the chain's metadata standards

8. **Test thoroughly**:
   - Test metadata generation
   - Test validation
   - Test export functionality

## Reporting Issues

When reporting bugs or requesting features:

1. **Check existing issues**: Make sure the issue hasn't been reported
2. **Use issue templates**: Fill out the appropriate template
3. **Provide details**:
   - Clear description of the issue
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/OS information
   - Screenshots if applicable

## Questions?

Feel free to open a discussion or reach out to maintainers for help!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.


# sunset

## About Sunset

Sunset is an anonymous reporting platform that enables citizens to securely report corruption and misconduct in both public and private institutions. Built on the Midnight Network, the platform leverages zero-knowledge proofs and advanced privacy technology to protect the identity of whistleblowers while ensuring transparency and accountability.

The application allows users to submit detailed reports about corrupt practices while keeping their identity completely anonymous. This helps promote integrity in institutions and enables a more transparent and just society without fear of retaliation against those who report wrongdoing.

Key features:
- Complete anonymity for reporters using cryptographic techniques
- Secure storage of reports on blockchain with privacy preservation
- Protection against retaliation through zero-knowledge technology
- Support for reporting in both public institutions and private organizations

## Getting Started

### Prerequisites

- Node.js 22+ installed
- Docker installed (for proof server)

### Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup and deploy**:

   ```bash
   npm run setup
   ```

   This will:

   - Compile the Compact contract (compliants.compact)
   - Build TypeScript to JavaScript
   - Deploy contract to the testnet

3. **Interact with your contract**:
   ```bash
   npm run cli
   ```

### Available Scripts

- `npm run setup` - Compile, build, and deploy contract
- `npm run compile` - Compile Compact contract
- `npm run build` - Build TypeScript
- `npm run deploy` - Deploy contract to testnet
- `npm run cli` - Interactive CLI for contract
- `npm run check-balance` - Check wallet balance
- `npm run reset` - Reset all compiled/built files
- `npm run clean` - Clean build artifacts
- `npm run dev:web` - Run web app in development mode

### Environment Variables

Copy `.env.example` to `.env` and configure:

- `WALLET_SEED` - Your 64-character wallet seed (auto-generated)
- `MIDNIGHT_NETWORK` - Network to use (testnet)
- `PROOF_SERVER_URL` - Proof server URL
- `CONTRACT_NAME` - Contract name

### Project Structure

```
sunset/
├── contracts/
│   ├── compliants.compact    # Smart contract source
│   └── managed/               # Compiled artifacts
├── src/
│   ├── deploy.ts             # Deployment script
│   ├── providers/            # Shared providers
│   └── utils/                # Utility functions
├── web/
│   ├── app/                  # Next.js application
│   └── components/           # Shared components
├── .env                      # Environment config (keep private!)
├── deployment.json           # Deployment info
└── package.json              # Project dependencies
```

### Getting Testnet Tokens

1. Run `npm run deploy` to see your wallet address
2. Visit [https://midnight.network/test-faucet](https://midnight.network/test-faucet)
3. Enter your address to receive test tokens

### Learn More

- [Midnight Documentation](https://docs.midnight.network)
- [Compact Language Guide](https://docs.midnight.network/compact)
- [Tutorial Series](https://docs.midnight.network/tutorials)


Happy coding! 🌙
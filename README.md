# Sunset

![First page](/screenshots/Image1.png)

## About Sunset

Sunset is an anonymous reporting platform that enables citizens to securely report corruption and misconduct in both public and private institutions. Built on the Midnight Network, the platform leverages zero-knowledge proofs and advanced privacy technology to protect the identity of whistleblowers while ensuring transparency and accountability.

The application allows users to submit detailed reports about corrupt practices while keeping their identity completely anonymous. This helps promote integrity in institutions and enables a more transparent and just society without fear of retaliation against those who report wrongdoing.

Key features:
- Complete anonymity for reporters using cryptographic techniques
- Secure storage of reports on blockchain with privacy preservation
- Protection against retaliation through zero-knowledge technology
- Support for reporting in both public institutions and private organizations

![Dashboard](/screenshots/Image2.png)


## Available functions

1. Submit reports: Any whistleblower can enter all the necessary information: type of institution (public or private), the name of the institution, and the details of the complaint. The date is calculated automatically, as is the ID, and a public key for the whistleblower (without traceability to their secret key, ensuring privacy and security in the complaint).

![Submit report](/screenshots/Image3.png)

2. View reports: Review all the complaints/reports made.
3. View report details: Review the details of a specific report.
4. View report ownership: The person who filed the complaint/report can verify themselves in order to confirm it to the court if required.

## Future functions

1. Private details for a comptroller: The State Comptroller may receive certain details of the complaint that should not be made public (as it may be information that compromises an investigation or national security issues).
2. Feedback: The State Comptroller can send feedback on the complaint, which only the creator of the complaint can review.
3. Complaint status: Adjust the complaint status (from creation to investigation and closure) to provide greater transparency to citizens regarding the actions taken.
4. And much more.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Midnight Network SDK

## Getting Started

### Prerequisites

- Node.js 22+ installed
- Docker installed (for proof server)
- Midnight proof server running
- A Midnight wallet (Lace) installed and with funds. Visit [https://midnight.network/test-faucet](https://midnight.network/test-faucet) to get testnet tokens

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

   The contract will be deployed to the testnet and the address will be printed to the console, including creating the deployment.json file.

   The compiled contract files will be in the `contracts/managed/compliants` folder.

3. **Interact with the platform**:

   - Install the Lace Midnight wallet.

   - Start the web app:
   ```bash
   npm run dev:web
   ```

   - Connect your wallet and interact with the app.

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
- `npm run build:web` - Build web app for production
- `npm run start:web` - Start web app in production mode

### Environment Variables

Copy `.env.example` to `.env` and configure:

- `WALLET_SEED` - Your 64-character wallet seed (auto-generated if you use create-mn-app)
- `MIDNIGHT_NETWORK` - Network to use (testnet)
- `PROOF_SERVER_URL` - Proof server URL
- `CONTRACT_NAME` - Contract name (compliants)

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

### Contributors
[@techmartins](https://github.com/techmartins)
[@codebigint](https://github.com/codebigint)
[@musalawal](https://github.com/musalawal)
[@nescampos](https://github.com/nescampos)
[@scisamir](https://github.com/scisamir)

## License

MIT

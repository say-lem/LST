# Finable Backend

> *"A system reborn. A standard redefined. A new financial future — shaped by your hands."*

**Finable** is a secure financial backend system born from the Learnable 24 Backend Standardisation Test. Built with Express.js, Node.js, and MongoDB, this application implements the ancient Protocol left behind by Amarogba, the Last Codebender — a blueprint for secure, transparent, and trustworthy financial systems.

## The Story Behind Finable

In the legendary tale of financial collapse and redemption, Finable represents the culmination of the **Five Trials of Revival** — a quest to rebuild trust through secure code architecture. This backend system demonstrates mastery over:

- **Identity Management** with unique account creation
- **Virtual Card Generation** with secure tokenization  
- **Advanced Encryption** protocols protecting sensitive data
- **Transparent Record Keeping** with encrypted data management
- **Clear Documentation** standards for maintainable systems

Built to honor the Custodians' teachings and avoid the mistakes of Unoka the Compiler, Finable showcases modern security practices, proper environment configuration, and crystal-clear API documentation.

## 📋 Table of Contents

- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [RSA Key Generation](#-rsa-key-generation)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [Support](#-support)

## Features

- **Secure Account Creation**: Complete user registration system with unique 10-digit account numbers
- **Virtual Card Generation**: Automatic creation of secure 16-digit card numbers with CVV and expiry dates
- **RSA Encryption Protocol**: Advanced encryption for sensitive data (card details, phone numbers, birth dates)
- **Encrypted Data Management**: Secure storage and retrieval of encrypted information
- **Environment-Based Security**: No hardcoded secrets, following the Protocol's security standards
- **Transparent Record Keeping**: Complete audit trail with both encrypted and decrypted data access
- **Professional Documentation**: Comprehensive Postman documentation following industry standards

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js** (v14.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v6.0.0 or higher) - Comes with Node.js
- **MongoDB** - [Installation Guide](https://docs.mongodb.com/manual/installation/)
- **OpenSSL** - For generating RSA key pairs

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/say-lem/LST.git
   cd LST
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## ⚙️ Environment Setup

1. **Create environment file**
   ```bash
   cp .env.example .env
   ```

2. **Configure your `.env` file**
   ```env
   PORT=
   NODE_ENV=
   ACCESS_TOKEN_SECRET="your-super-secret-jwt-key-here"
   API_V1_STR=
   MONGO_URI=
   
   RSA_PUBLIC=
   RSA_PRIVATE=
   
   POSTMAN_DOC_LINK="https://documenter.getpostman.com/view/45326840/2sB2qdeyzb"
   GITHUB_REPO_LINK="your-github-repo-url"
   ```

## 🔑 RSA Key Generation

Generate your RSA key pair using OpenSSL:

```bash
# Generate an unencrypted private key
openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048

# Extract public key from private key
openssl rsa -pubout -in private.pem -out public.pem
```

**Important**: Copy the contents of `private.pem` and `public.pem` into your `.env` file as single-line strings (replace newlines with `\n`) or use run this code below .
Run this script to properly format your RSA keys for the `.env` file:

```js
// formatRsaKeyForEnv.js
const fs = require('fs');
const path = require('path');

function formatPemToEnvString(filePath, keyName) {
   if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
   }

   const raw = fs.readFileSync(filePath, 'utf-8').trim();
   const escaped = raw.replace(/\r?\n/g, '\\n') + '\\n%';

   return `${keyName}=${escaped}`;
}

// Example usage:
const privateKeyEnv = formatPemToEnvString('./private.pem', 'RSA_PRIVATE');
const publicKeyEnv = formatPemToEnvString('./public.pem', 'RSA_PUBLIC');

console.log('\nPaste into .env:\n');
console.log(privateKeyEnv);
console.log();
console.log(publicKeyEnv);
```

Save as `formatRsaKeyForEnv.js` and run:
```bash
node formatRsaKeyForEnv.js
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## 📚 API Documentation

### Available Endpoints

| Method | Endpoint | Description | Trial |
|--------|----------|-------------|-------|
| POST | `/accounts/register` | Create bank account with virtual card | Trial of Identity & Card |
| GET | `/accounts` | Get all accounts with encrypted/decrypted data | Trial of the Ledger |
| POST | `/decrypt` | Decrypt encrypted data and return plain text | Trial of the Cipher |

**The Five Trials of Revival Implemented:**
1. 🧬 **Trial of Identity**: Unique account creation with 10-digit account numbers
2. 💳 **Trial of the Card**: Automatic virtual card generation (16-digit number, CVV, expiry)
3. 🔐 **Trial of the Cipher**: RSA encryption for sensitive fields
4. 📜 **Trial of the Ledger**: Complete account listing with encryption management
5. 🗂️ **Trial of Clarity**: Professional Postman documentation

### 📖 Postman Documentation
Complete API documentation is available at: [Postman Docs](https://documenter.getpostman.com/view/45326840/2sB2qdeyzb)

### 🌐 Live Demo
Base URL: `https://learnable-standardization-test-wh0x.onrender.com`

## 📁 Project Structure

```
finable/
├── src/
│   ├── controllers/     # Route controllers
│   ├── services/         # Route services
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   └── utils/          # Utility functions
├── .env.example        # Environment template
├── package.json        # Dependencies and scripts
└── README.md          # Project documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions:

- 📧 Open an issue on GitHub
- 📖 Check the [Postman documentation](https://documenter.getpostman.com/view/45326840/2sB2qdeyzb)
- 💬 Review existing issues for solutions

---

**Built using Node.js, Express.js, and MongoDB**
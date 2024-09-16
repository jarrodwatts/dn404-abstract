# Contracts

This directory contains the smart contracts for the project.

## Setup

Install the dependencies:

```bash
npm install
```

Add your private key in a [configuration variable](https://hardhat.org/hardhat-runner/docs/guides/configuration-variables) or in the `.env` file.

Compile the contracts:

```bash
npx hardhat clean && npx hardhat compile --network abstractTestnet
```

Deploy & verify the contracts:

```bash
npx hardhat deploy-zksync --script deploy.ts
```

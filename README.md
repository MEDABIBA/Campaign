# 📦 Web3 Application

## 🚀 About this Project

This app is built with **React + Next.js**, uses a **MobX store**, and is written in **TypeScript**.  
Smart contracts are developed in **Solidity** using **Hardhat**, with tests written in **Mocha**.

## 🚀 How to Run the Project

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies::
   ```bash
   yarn install
   ```
3. Build the project:
   ```bash
   yarn build
   ```
4. Start the development server:
   ```bash
   yarn start
   ```

### Contracts

Navigate to the contracts directory:

1. Navigate to the contract directory:
   ```bash
   cd campaign/contracts
   ```
1. Deploy the contract to Sepolia:
   ```bash
   npx hardhat run scripts/deploy.ts --network sepolia
   ```

### 🛠 Tech Stack

Frontend: React, Next.js, TypeScript, MobX, Wagmi

Smart Contracts: Solidity, Hardhat, Web3

Testing: Mocha

Package Manager: Yarn

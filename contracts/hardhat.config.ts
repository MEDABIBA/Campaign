import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: "https://mainnet.infura.io/v3/7fbde31208034b8491c407c70cbd2379",
      accounts:
        "bb1be169d29c436dbc2803aee09ddda41c0bf747b466a33161d75c380bc3b580"
          ? ["bb1be169d29c436dbc2803aee09ddda41c0bf747b466a33161d75c380bc3b580"]
          : [],
    },
  },
};

export default config;

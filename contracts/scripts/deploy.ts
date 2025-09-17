import hre from "hardhat";
async function main() {
  const Factory = await hre.ethers.getContractFactory("Factory");
  const factory = await Factory.deploy();
  console.log("factory deployed at address: ", await factory.getAddress());
  const artifact = await hre.artifacts.readArtifact("Factory");
  console.log("Factory ABI:", JSON.stringify(artifact.abi, null, 2));
}
async function getCampaignAbi() {
  const artifact = await hre.artifacts.readArtifact("Campaign");
  console.log("Campaign ABI:", JSON.stringify(artifact.abi, null, 2));
}
main();
// getCampaignAbi();

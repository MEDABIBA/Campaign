import hre from "hardhat";
//Нужно задеплоить контракты
async function main() {
  const Factory = await hre.ethers.getContractFactory("Factory");
  const factory = await Factory.deploy(); // аргументы конструктора, если есть
  console.log("factory deployed at address: ", await factory.getAddress());
}
main();

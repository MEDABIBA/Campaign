import { Abi, Address } from "viem";

const buildRequestContracts = (requestsCount: string, id: Address, abi: Abi) => {
  if (!requestsCount || Number(requestsCount) === 0) return [];
  return Array.from({ length: Number(requestsCount) }, (_, i) => ({
    address: id,
    abi: abi,
    functionName: "requests",
    args: [i],
  }));
};
export default buildRequestContracts;

"use client";
import { useAccount, useConnect, useReadContract } from "wagmi";
import { config } from "./web3/config";
export default function Home() {
  const { address } = useAccount();
  const { connectors, connect } = useConnect();
  const { data } = useReadContract({
    ...config,
    functionName: "getDeployedCampaings",
  });
  console.log(address);
  console.log(data);
  return (
    <>
      {connectors.map((connector) => (
        <button key={connector.uid} onClick={() => connect({ connector })}>
          {connector.name}
        </button>
      ))}
    </>
  );
}

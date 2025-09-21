"use client";

import Link from "next/link";
import { useAccount, useConnect, useReadContract } from "wagmi";
import { Layout } from "../components/Layout";
import { config } from "../web3/FactoryConfig";
import Cards from "../components/Cards";
import { useEffect, useState } from "react";

export default function CapmaignIndex() {
  const { connectors, connect } = useConnect();
  const account = useAccount();
  const [mount, setMount] = useState(false);
  const { data } = useReadContract({
    ...config,
    functionName: "getDeployedCampaings",
  });
  useEffect(() => setMount(true), []);
  return mount ? (
    <Layout>
      {!account.isConnected ? (
        connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            className="ui black button"
            style={{ marginBottom: "15px" }}>
            {connector.name}
          </button>
        ))
      ) : (
        <button className="ui disabled button" style={{ marginBottom: "15px" }}>
          Connected!
        </button>
      )}
      <div className="ui cards">
        <Cards data={data} />
      </div>
      <Link href="/campaigns/new">
        <button className="ui primary right floated button">Create Campaign</button>
      </Link>
    </Layout>
  ) : null;
}

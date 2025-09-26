"use client";

import Link from "next/link";
import { useAccount, useConnect, useReadContract } from "wagmi";
import { Layout } from "../components/Layout";
import { config } from "../web3/FactoryConfig";
import Cards from "../components/Cards";
import { useEffect, useState } from "react";
import Button from "../components/Button";

export default function CapmaignIndex() {
  const { connectors, connect } = useConnect();
  const account = useAccount();
  const [mount, setMount] = useState(false);
  const { data } = useReadContract({
    ...config,
    functionName: "getDeployedCampaings",
  });
  console.log(data);
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
            {`Sign into: ${connector.name}`}
          </button>
        ))
      ) : (
        <Button isPending={false} inscription="Connected!" style={{ marginBottom: "15px" }} />
      )}
      <div className="ui cards">
        {data && data.length > 0 ? (
          <Cards data={data} />
        ) : (
          <div style={{ margin: "auto", fontSize: "24px" }}>Create a new campaign</div>
        )}
      </div>
      <Link href="/campaigns/new">
        <button className="ui primary right floated button" style={{ marginTop: "15px" }}>
          Create Campaign
        </button>
      </Link>
    </Layout>
  ) : null;
}

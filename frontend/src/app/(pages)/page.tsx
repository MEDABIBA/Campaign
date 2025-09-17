"use client";
import { useEffect, useState } from "react";
import "semantic-ui-css/semantic.min.css";

import Link from "next/link";
import { useAccount, useConnect, useReadContract } from "wagmi";
import { Layout } from "../components/Layout";
import { config } from "../web3/FactoryConfig";

export default function CapmaignIndex() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { connectors, connect } = useConnect();
  const account = useAccount();
  const { data } = useReadContract({
    ...config,
    functionName: "getDeployedCampaings",
  });
  if (!mounted) return null;
  console.log(account.address);
  return (
    <Layout>
      {connectors.map((connector) => (
        <button key={connector.uid} onClick={() => connect({ connector })}>
          {connector.name}
        </button>
      ))}
      {/* CAN BE RELOCATE TO COMPONENT FILE */}
      <div className="ui cards">
        {Array.isArray(data) &&
          data.map((addressItem, key) => (
            <div key={key} className="card" style={{ width: "366px" }}>
              <div className="content">
                <div className="header">Address of this campaign:</div>
                <div className="meta">{addressItem}</div>
                <Link href={`campaigns/${addressItem}`}>View Campaign</Link>
              </div>
            </div>
          ))}
      </div>
      <Link href="/campaigns/new">
        <button className="ui primary right floated button">Create Campaign</button>
      </Link>
    </Layout>
  );
}

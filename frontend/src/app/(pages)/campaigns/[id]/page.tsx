"use client";
import { Layout } from "@/app/components/Layout";
import { useParams } from "next/navigation";
import Card from "semantic-ui-react/dist/commonjs/views/Card/Card";
import CardContent from "semantic-ui-react/dist/commonjs/views/Card/CardContent";
import CardGroup from "semantic-ui-react/dist/commonjs/views/Card/CardGroup";
import CardHeader from "semantic-ui-react/dist/commonjs/views/Card/CardHeader";
import CardMeta from "semantic-ui-react/dist/commonjs/views/Card/CardMeta";

import { useState } from "react";
import { Form, Grid, GridColumn, Input } from "semantic-ui-react";
import { Address } from "viem";
import { useReadContract } from "wagmi";
import { abi } from "../../../web3/campaign.abi";
export default function CampaignShow() {
  const [inputValue, setInputvalue] = useState("");
  const { id } = useParams();
  const { data, isLoading } = useReadContract({
    abi,
    address: id as Address,
    functionName: "getSummary",
  }) as { data: number[]; isLoading: boolean };
  if (isLoading) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    );
  }
  const summary = [
    {
      header: "balance is:",
      meta: data[0],
    },
    {
      header: "minimumContribution is: ",
      meta: data[1],
    },
    {
      header: "requests is: ",
      meta: data[2],
    },
    {
      header: "approversCount is: ",
      meta: data[3],
    },
    {
      header: "manager is: ",
      meta: data[4],
    },
  ];

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    return true;
  }
  return (
    <Layout>
      <h1>CampaignShow</h1>
      <Grid>
        <GridColumn width={10}>
          <CardGroup>
            {summary.map((item, index) => (
              <Card key={index} style={{ overflowWrap: "break-word" }}>
                <CardContent>
                  <CardHeader>{item.header}</CardHeader>
                  <CardMeta>{item.meta}</CardMeta>
                </CardContent>
              </Card>
            ))}
          </CardGroup>
        </GridColumn>
        <GridColumn width={6}>
          <Form onSubmit={(e: React.FormEvent<HTMLFormElement>) => onSubmit(e)}>
            <h4>Amount to contribute</h4>
            <Input
              fluid
              label="wei"
              labelPosition="right"
              placeholder="Amount in wei"
              style={{ marginBottom: "10px" }}
              onChange={(event, data) => setInputvalue(data.value)}
              value={inputValue}
            />
            <button className="ui primary button">Contribute!</button>
          </Form>
        </GridColumn>
      </Grid>
    </Layout>
  );
}

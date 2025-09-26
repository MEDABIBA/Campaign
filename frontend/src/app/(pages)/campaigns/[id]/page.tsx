"use client";
import Link from "next/link";
import { useState } from "react";
import { abi } from "../../../web3/campaign.abi";
import { Address } from "viem";
import { Layout } from "@/app/components/Layout";
import { useParams } from "next/navigation";
import CardGroup from "semantic-ui-react/dist/commonjs/views/Card/CardGroup";
import { Form, Grid, GridColumn, Input, Loader } from "semantic-ui-react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import ErrorMessage from "@/app/components/ErrorMessage";
import validateInput from "@/app/helper/validateInput";
import CampaignSummary from "@/app/components/CampaignSummary";
import Button from "@/app/components/Button";

export default function CampaignShow() {
  const [inputValue, setInputvalue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [minimumContribution, setMinimumContribution] = useState("");
  const { id } = useParams();
  const { data: hash, error, writeContract, isPending } = useWriteContract();
  const { isSuccess: isConfirmed, isError } = useWaitForTransactionReceipt({ hash });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (validateInput(inputValue, Number(minimumContribution), setErrorMessage)) {
        setInputvalue("");
        await writeContract({
          abi,
          address: id as `0x${string}`,
          functionName: "contribute",
          value: BigInt(inputValue),
        });
      } else {
        console.log("nan");
      }
    } catch (err) {
      console.error("there is some error: ", err);
    }
  }
  return (
    <Layout>
      <h1>CampaignShow</h1>
      <Grid>
        <GridColumn width={10}>
          <CardGroup>
            <CampaignSummary
              id={id as Address}
              isConfirmed={isConfirmed}
              isError={isError}
              setMinimumContribution={setMinimumContribution}
            />
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
              onChange={(_, data) => setInputvalue(data.value)}
              value={inputValue}
            />
            {errorMessage && <h3 style={{ color: "red" }}>{errorMessage}</h3>}
            <Button isPending={isPending} inscription="Contribute!" />
          </Form>
          <ErrorMessage error={error} />
        </GridColumn>
        <Link href={`/campaigns/${id}/requests`}>
          <Button isPending={false} inscription="View Requests" />
        </Link>
      </Grid>
    </Layout>
  );
}

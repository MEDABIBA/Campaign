"use client";
import { Layout } from "@/app/components/Layout";
import { config } from "@/app/web3/FactoryConfig";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Form, FormField, Input, Loader, Message, MessageHeader } from "semantic-ui-react";
import { useAccount, useWriteContract } from "wagmi";

export default function CampaignNew() {
  const [contribution, setContribution] = useState("");
  const [isNumber, setIsNumber] = useState(true);
  const account = useAccount();
  const router = useRouter();
  const { data: hash, error, writeContract, isPending, isSuccess } = useWriteContract();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setIsNumber(true);
      if (typeof Number(contribution) == "number" && Number(contribution) >= 1) {
        await writeContract({
          ...config,
          functionName: "createCampaign",
          args: [Number(contribution)],
        });
      } else {
        setIsNumber(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (isSuccess) {
      router.push("/");
    }
  }, [isSuccess]);
  return (
    <Layout>
      <h2>Create New Campaign</h2>
      <Form onSubmit={(e: React.FormEvent<HTMLFormElement>) => onSubmit(e)}>
        <FormField>
          <label>Minimum Contribution</label>
          <Input
            name="minimumContribution"
            label="wei"
            labelPosition="right"
            placeholder="Minimum Contribution In Wei"
            value={contribution}
            onChange={(e) => setContribution(e.target.value)}
          />
        </FormField>
        <button type="submit" className="ui primary button">
          {isPending ? <Loader active inline size="mini" /> : "Create!"}
        </button>
        {error && (
          <Message size="big" negative>
            <MessageHeader>Oops!</MessageHeader>
            <p>{error.message} </p>
          </Message>
        )}
        {!isNumber && (
          <Message size="big" negative>
            <MessageHeader>Oops!</MessageHeader>
            <p>Value is not a number </p>
          </Message>
        )}
      </Form>
    </Layout>
  );
}

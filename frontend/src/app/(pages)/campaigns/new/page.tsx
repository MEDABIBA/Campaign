"use client";
import Button from "@/app/components/Button";
import ErrorMessage from "@/app/components/ErrorMessage";
import { Layout } from "@/app/components/Layout";
import { config } from "@/app/web3/FactoryConfig";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Form, FormField, Input, Loader } from "semantic-ui-react";
import { useWriteContract } from "wagmi";

export default function CampaignNew() {
  const [contribution, setContribution] = useState("");
  const [isNumber, setIsNumber] = useState(true);
  const router = useRouter();
  const { error, writeContract, isPending, isSuccess } = useWriteContract();

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
            placeholder="e.g., 1000000000000000000 (1 ETH)"
            value={contribution}
            disabled={isPending}
            error={!isNumber}
            onChange={(e) => setContribution(e.target.value)}
          />
        </FormField>
        <Button isPending={isPending} inscription={"Create!"} />
        <ErrorMessage error={error} />
        <ErrorMessage error={isNumber} />
      </Form>
    </Layout>
  );
}

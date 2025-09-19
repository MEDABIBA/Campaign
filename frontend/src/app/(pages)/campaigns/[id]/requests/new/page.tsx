"use client";
import { Layout } from "@/app/components/Layout";
import { useParams, useRouter } from "next/navigation";
import { Form, FormField, Input, Loader, MessageHeader, Message } from "semantic-ui-react";
import { Address } from "viem";
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { abi } from "@/app/web3/campaign.abi";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function CreateRequest() {
  const [description, setDescripton] = useState("");
  const [value, setValue] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isValid, setIsValid] = useState(true);
  const router = useRouter();
  const { data: hash, error, writeContract, isPending } = useWriteContract();
  const { isSuccess: isConfirmed, isError, error: txError } = useWaitForTransactionReceipt({ hash });
  const { id } = useParams();
  // 0xb753453d88e5046F511e162382C5C369Ef7d6289
  console.log(error);
  useEffect(() => {
    if (isConfirmed) {
      setDescripton("");
      setValue("");
      setRecipient("");
      router.push(`/campaigns/${id}/requests`);
    }
  }, [isConfirmed, router, id]);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (Number(value) >= 1 && recipient.startsWith("0x") && recipient.length === 42 && description) {
      setIsValid(true);
      try {
        await writeContract({
          abi,
          address: id as Address,
          functionName: "createRequest",
          args: [description, value, recipient],
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      setIsValid(false);
    }
  }
  return (
    <Layout>
      <h3>Create a Request</h3>
      <Link href={`/campaigns/${id}/requests`}>
        <button className="ui primary button" style={{ marginBottom: "15px" }}>
          Back
        </button>
      </Link>

      <Form onSubmit={(e) => onSubmit(e)}>
        <FormField>
          <label>Description</label>
          <Input value={description} onChange={(e, data) => setDescripton(data.value)} />
        </FormField>
        <FormField>
          <label>Value In ether</label>
          <Input value={value} onChange={(e, data) => setValue(data.value)} />
        </FormField>
        <FormField>
          <label>Recipient</label>
          <Input value={recipient} onChange={(e, data) => setRecipient(data.value)} />
        </FormField>
        <button className="ui primary button">{isPending ? <Loader active inline size="mini" /> : "Create!"}</button>
      </Form>
      {isError && (
        <Message size="big" negative>
          <MessageHeader>Oops!</MessageHeader>
          <p>{txError.message} </p>
        </Message>
      )}
      {error && (
        <Message size="big" negative>
          <MessageHeader>Oops!</MessageHeader>
          <p>{error.message} </p>
        </Message>
      )}
      {!isValid && (
        <Message size="big" negative>
          <MessageHeader>Write a valid value</MessageHeader>
          <p>Please write a valid values into inputs</p>
        </Message>
      )}
      {isConfirmed && (
        <Message size="big" positive>
          <MessageHeader>The request was successfully created</MessageHeader>
        </Message>
      )}
    </Layout>
  );
}

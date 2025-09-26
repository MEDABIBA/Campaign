"use client";
import { useEffect, useState } from "react";
import { abi } from "@/app/web3/campaign.abi";
import { Address } from "viem";
import { useParams, useRouter } from "next/navigation";
import { Layout } from "@/app/components/Layout";
import { Form, MessageHeader, Message } from "semantic-ui-react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import ErrorMessage from "@/app/components/ErrorMessage";
import validateOnSubmit from "@/app/helper/validateOnSubmit";
import FormFieldInput from "@/app/components/FormFieldInput";
import { ValidationResult } from "@/app/types";
import Button from "@/app/components/Button";
import BackButton from "@/app/components/BackButton";

export default function CreateRequest() {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [recipient, setRecipient] = useState("");
  const [errors, setErrors] = useState<ValidationResult["errors"]>({});
  const router = useRouter();
  const { id } = useParams();
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const { isSuccess: isConfirmed, isError } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) {
      setDescription("");
      setValue("");
      setRecipient("");
      router.push(`/campaigns/${id}/requests`);
    }
  }, [isConfirmed, router, id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { isValid, errors } = validateOnSubmit(value, recipient, description);
    if (!isValid) {
      setErrors(errors);
      return;
    }
    try {
      setErrors({});
      await writeContract({
        abi,
        address: id as Address,
        functionName: "createRequest",
        args: [description, value, recipient],
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Layout>
      <h3>Create a Request</h3>
      <BackButton route={`/campaigns/${id}/requests`} />
      <Form onSubmit={(e) => onSubmit(e)}>
        <FormFieldInput label={"Description"} value={description} setValue={setDescription} />
        <FormFieldInput label={"Value In ether"} value={value} setValue={setValue} />
        <FormFieldInput label={"Recipient"} value={recipient} setValue={setRecipient} />
        <Button isPending={isPending} inscription="Create!" />
      </Form>
      {Object.keys(errors).length > 0 && (
        <Message size="big" negative>
          <MessageHeader>Validation Error</MessageHeader>
          <ul>
            {Object.entries(errors).map(([key, value]) => (
              <li key={key}>{value}</li>
            ))}
          </ul>
        </Message>
      )}
      <ErrorMessage error={error} />
      <ErrorMessage error={!isError} />
    </Layout>
  );
}

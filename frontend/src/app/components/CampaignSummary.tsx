"use client";
import { Address } from "viem";
import { useReadContract } from "wagmi";
import { abi } from "../web3/campaign.abi";
import React, { useEffect, useMemo } from "react";
import { Card, CardContent, CardMeta, CardHeader } from "semantic-ui-react";

const CampaignSummary = ({
  id,
  isConfirmed,
  isError,
  setMinimumContribution,
}: {
  id: Address;
  isConfirmed: boolean;
  isError: boolean;
  setMinimumContribution: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { data, error, isLoading, refetch } = useReadContract({
    abi,
    address: id as Address,
    functionName: "getSummary",
  }) as { data: number[]; error: Error; isLoading: boolean; refetch: () => void };
  useEffect(() => {
    if (isConfirmed) {
      console.log("Transaction confirmed");
      refetch();
    } else if (isError) {
      console.error("Transaction failed, error:", error);
    }
  }, [isConfirmed, isError]);
  const summary = useMemo(() => {
    if (!isLoading && data) {
      return [
        { header: "balance is:", meta: data[0] },
        { header: "minimumContribution is: ", meta: data[1] },
        { header: "requests is: ", meta: data[2] },
        { header: "approversCount is: ", meta: data[3] },
        { header: "manager is: ", meta: data[4] },
      ];
    } else return [];
  }, [data, isLoading]);
  useEffect(() => {
    if (!isLoading && data) {
      setMinimumContribution(data[1].toString());
    }
  }, [data, isLoading, setMinimumContribution]);

  return summary?.map((item, index) => (
    <Card key={index} style={{ overflowWrap: "break-word" }}>
      <CardContent>
        <CardHeader>{item.header}</CardHeader>
        <CardMeta>{item.meta}</CardMeta>
      </CardContent>
    </Card>
  ));
};
export default CampaignSummary;

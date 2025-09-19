"use client";
import { Layout } from "@/app/components/Layout";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Abi, Address } from "viem";
import { useReadContract, useReadContracts, useWriteContract } from "wagmi";
import { abi } from "@/app/web3/campaign.abi";
import { useEffect, useMemo } from "react";
import { Label, TableCell, Table, TableBody, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react";
import { writeContract } from "viem/actions";

export default function RequestsPage() {
  const { id } = useParams();

  const { writeContract, error, isSuccess } = useWriteContract();
  const { data: requestsCount } = useReadContract({
    address: id as Address,
    abi,
    functionName: "getRequestsCount",
  });
  const { data: summaryData } = useReadContract({
    address: id as Address,
    abi,
    functionName: "getSummary",
  }) as { data: [bigint, bigint, bigint, bigint, string] };

  const contracts = useMemo(() => {
    if (!requestsCount || Number(requestsCount) === 0) return [];
    return Array.from({ length: Number(requestsCount) }, (_, i) => ({
      address: id as Address,
      abi: abi as Abi,
      functionName: "requests",
      args: [i],
    }));
  }, [requestsCount, id]);
  const { data: requestsData } = useReadContracts({ contracts });

  function onSubmit(e: React.FormEvent, index: number) {
    e.preventDefault;
    writeContract({
      address: id as Address,
      abi,
      functionName: "approveRequest",
      args: [index],
    });
  }
  function onFinalize(e: React.FormEvent, index: number) {
    e.preventDefault;
    writeContract({
      address: id as Address,
      abi,
      functionName: "finalizeRequest",
      args: [index],
    });
  }
  console.log(requestsData);
  return (
    <Layout>
      <h2>Requests</h2>
      <Table celled>
        <TableHeader>
          <TableRow>
            <TableHeaderCell>Id</TableHeaderCell>
            <TableHeaderCell>Value</TableHeaderCell>
            <TableHeaderCell>Description</TableHeaderCell>
            <TableHeaderCell>Recipient</TableHeaderCell>
            <TableHeaderCell>Approval Count</TableHeaderCell>
            <TableHeaderCell>Approve</TableHeaderCell>
            <TableHeaderCell>Finalize</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requestsData?.map((request, index) => {
            if (request.status == "success") {
              const result = request.result as [string, string, string, boolean, string];
              return (
                <TableRow
                  key={index}
                  positive={Number(result[4]) > Number(summaryData?.[3]) / 2 && !result[3]}
                  disabled={result[3]}>
                  <TableCell>{index}</TableCell>
                  <TableCell>{result[1]}</TableCell>
                  <TableCell>{result[0]}</TableCell>
                  <TableCell>{result[2]}</TableCell>
                  <TableCell>
                    {result[4]}/{summaryData?.[3]}
                  </TableCell>
                  <TableCell>
                    {!result[3] && (
                      <button className="ui basic green button" onClick={(e) => onSubmit(e, index)}>
                        Approve
                      </button>
                    )}
                  </TableCell>
                  <TableCell>
                    {!result[3] && (
                      <button className="ui teal basic button" onClick={(e) => onFinalize(e, index)}>
                        Finalize
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              );
            } else return null;
          })}
        </TableBody>
      </Table>
      <Link href={`/campaigns/${id}/requests/new`}>
        <button className="ui primary button" style={{ marginBottom: "15px" }}>
          Add Request
        </button>
      </Link>
    </Layout>
  );
}

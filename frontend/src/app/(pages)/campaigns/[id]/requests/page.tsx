"use client";
import { Layout } from "@/app/components/Layout";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Abi, Address } from "viem";
import { useReadContract, useReadContracts, useWriteContract } from "wagmi";
import { abi } from "@/app/web3/campaign.abi";
import { useMemo } from "react";
import {
  TableCell,
  Table,
  TableBody,
  TableHeader,
  TableHeaderCell,
  TableRow,
  GridRow,
  Grid,
  GridColumn,
} from "semantic-ui-react";
import "./index.css";
import buildRequestContracts from "@/app/helper/buildRequestContracts";
import { request } from "http";
import RequestDataRender from "@/app/components/RequestDataRender";

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
    return buildRequestContracts(requestsCount as string, id as Address, abi as Abi);
  }, [requestsCount, id]);
  const { data: requestsData } = useReadContracts({ contracts });

  function actionHandler(e: React.FormEvent, funcName: "approveRequest" | "finalizeRequest", index: number) {
    e.preventDefault;
    writeContract({
      address: id as Address,
      abi,
      functionName: funcName,
      args: [index],
    });
  }
  return (
    <Layout>
      <Grid>
        <GridRow>
          <GridColumn width={8}>
            <h2>Requests</h2>
          </GridColumn>
          <GridColumn width={8} textAlign="right">
            <Link href={`/campaigns/${id}/requests/new`}>
              <button className="ui primary button" style={{ marginBottom: "15px" }}>
                Add Request
              </button>
            </Link>
          </GridColumn>
        </GridRow>
      </Grid>

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
          <RequestDataRender
            requestsData={requestsData}
            summaryData={summaryData}
            id={id as Address}
            abi={abi as Abi}
          />
        </TableBody>
      </Table>
      <div>{`Found ${requestsCount} requests`}</div>
    </Layout>
  );
}

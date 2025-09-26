"use client";
import { Layout } from "@/app/components/Layout";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Abi, Address } from "viem";
import { useReadContract, useReadContracts } from "wagmi";
import { abi } from "@/app/web3/campaign.abi";
import { useMemo, useState } from "react";
import { Table, TableBody, TableHeader, TableHeaderCell, TableRow, GridRow, Grid, GridColumn } from "semantic-ui-react";
import "./index.css";
import buildRequestContracts from "@/app/helper/buildRequestContracts";
import RequestDataRender from "@/app/components/RequestDataRender";
import Button from "@/app/components/Button";
import BackButton from "@/app/components/BackButton";
import { CombinedError } from "@/app/types";
import ErrorMessage from "@/app/components/ErrorMessage";

export default function RequestsPage() {
  const { id } = useParams();
  const [combinedError, setCombinedError] = useState<CombinedError>(null);

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
  return (
    <Layout>
      <Grid>
        <GridRow>
          <GridColumn width={8}>
            <h2>Requests</h2>
            <BackButton route={`/campaigns/${id}`} />
          </GridColumn>
          <GridColumn width={8} textAlign="right">
            <Link href={`/campaigns/${id}/requests/new`}>
              <Button isPending={false} inscription="Add Request" style={{ marginBottom: "15px" }} />
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
            setCombinedError={setCombinedError}
          />
        </TableBody>
      </Table>
      <ErrorMessage error={combinedError} />
      <div>{`Found ${requestsCount} requests`}</div>
    </Layout>
  );
}

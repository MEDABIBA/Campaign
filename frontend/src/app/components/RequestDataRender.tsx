import { TableCell, TableRow } from "semantic-ui-react";
import { RequestData, requestResult } from "../types";
import { useWriteContract } from "wagmi";
import { Abi, Address } from "viem";

interface RequestDataRenderProps {
  requestsData: RequestData;
  summaryData: [bigint, bigint, bigint, bigint, string];
  id: Address;
  abi: Abi;
}

const RequestDataRender = ({ requestsData, summaryData, id, abi }: RequestDataRenderProps) => {
  const { writeContract } = useWriteContract();
  function actionHandler(e: React.FormEvent, funcName: "approveRequest" | "finalizeRequest", index: number) {
    e.preventDefault;
    writeContract({
      address: id as Address,
      abi,
      functionName: funcName,
      args: [index],
    });
  }
  if (!requestsData) return null;
  return requestsData?.map((request, index) => {
    if (request.status === "success") {
      const result = request.result as requestResult;
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
              <button
                className="ui basic green button hover-green"
                onClick={(e) => actionHandler(e, "approveRequest", index)}>
                Approve
              </button>
            )}
          </TableCell>
          <TableCell>
            {!result[3] && (
              <button
                className="ui teal basic button hover-teal"
                onClick={(e) => actionHandler(e, "finalizeRequest", index)}>
                Finalize
              </button>
            )}
          </TableCell>
        </TableRow>
      );
    }
  });
};
export default RequestDataRender;

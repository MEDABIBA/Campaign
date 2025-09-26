import { TableCell, TableRow } from "semantic-ui-react";
import { CombinedError, RequestDataRenderProps, requestResult } from "../types";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Address } from "viem";
import { useEffect } from "react";

const RequestDataRender = ({ requestsData, summaryData, id, abi, setCombinedError }: RequestDataRenderProps) => {
  console.log(requestsData);
  console.log(summaryData);
  const { writeContract, data: hash, error: writeError, isPending: isWriting } = useWriteContract();
  const { isError: isTxError, error: txError, isSuccess, refetch } = useWaitForTransactionReceipt({ hash });
  useEffect(() => {
    if (writeError) {
      setCombinedError(writeError as CombinedError);
    } else if (isTxError && txError) {
      setCombinedError(txError as CombinedError);
    } else {
      setCombinedError(null);
    }
  }, [writeError, isTxError, txError]);
  useEffect(() => {
    if (isSuccess) {
      refetch();
    } else if (isTxError) {
      console.error("Transaction failed, error:", txError);
    }
  }, [isSuccess]);
  async function actionHandler(e: React.FormEvent, funcName: "approveRequest" | "finalizeRequest", index: number) {
    try {
      e.preventDefault();
      await writeContract({
        address: id as Address,
        abi,
        functionName: funcName,
        args: [index],
      });
    } catch (err) {
      console.error(err);
    }
  }
  if (!requestsData) return null;
  return (
    <>
      {requestsData?.map((request, index) => {
        if (request.status === "success") {
          const result = request.result as requestResult;
          const isEnough = Number(result[4]) / Number(summaryData?.[3]);

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
                    disabled={isWriting}
                    onClick={(e) => actionHandler(e, "approveRequest", index)}>
                    Approve
                  </button>
                )}
              </TableCell>
              <TableCell>
                {!result[3] && (
                  <button
                    className="ui teal basic button hover-teal"
                    disabled={isWriting || !isEnough}
                    onClick={(e) => actionHandler(e, "finalizeRequest", index)}>
                    Finalize
                  </button>
                )}
              </TableCell>
            </TableRow>
          );
        }
      })}
    </>
  );
};
export default RequestDataRender;

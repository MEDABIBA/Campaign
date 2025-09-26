import { Dispatch, SetStateAction } from "react";
import { Abi, Address } from "viem";
import { ConnectorAccountNotFoundErrorType } from "wagmi";
import { WriteContractErrorType } from "wagmi/actions";

export type CombinedError = ConnectorAccountNotFoundErrorType | WriteContractErrorType | null;
export type requestResult = [string, string, string, boolean, string];
export type RequestData =
  | Array<
      | {
          result: unknown;
          status: "success";
        }
      | {
          error: Error;
          result?: unknown;
          status: "failure";
        }
    >
  | undefined;

export interface Cards {
  data: readonly Address[] | undefined;
}
export interface summary {
  header: string;
  meta: number;
}
export interface ValidationResult {
  isValid: boolean;
  errors: {
    value?: string;
    recipient?: string;
    description?: string;
  };
}
export interface RequestDataRenderProps {
  requestsData: RequestData;
  summaryData: [bigint, bigint, bigint, bigint, string];
  id: Address;
  abi: Abi;
  setCombinedError: Dispatch<SetStateAction<CombinedError>>;
}

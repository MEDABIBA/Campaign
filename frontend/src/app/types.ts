import { Address } from "viem";

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

import { Address } from "viem";
import { ValidationResult } from "../types";

const validateOnSubmit = (value: string, recipient: string | Address, description: string) => {
  const errors: ValidationResult["errors"] = {};
  if (!description.trim()) {
    errors.description = "Description is required";
  }

  const numValue = Number(value);
  if (isNaN(numValue) || numValue < 1) {
    errors.value = "Value must be a positive number";
  }

  if (!recipient.startsWith("0x") || recipient.length !== 42) {
    errors.recipient = "Invalid Ethereum address";
  }
  console.log(Object.keys(errors).length === 0);
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
export default validateOnSubmit;

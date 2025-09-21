const validateInput = (
  value: string,
  minmumContribution: number,
  setMessage: React.Dispatch<React.SetStateAction<string>>
) => {
  if (isNaN(Number(value)) || Number(value) <= minmumContribution) {
    setMessage(`Amount must be at least ${minmumContribution || 0} wei`);
    return false;
  } else {
    setMessage("");
    return true;
  }
};
export default validateInput;

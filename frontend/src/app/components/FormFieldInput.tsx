import { memo } from "react";
import { FormField, Input } from "semantic-ui-react";

const FormFieldInput = memo(
  ({
    label,
    value,
    setValue,
  }: {
    label: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
  }) => (
    <FormField>
      <label>{label}</label>
      <Input value={value} onChange={(_, data) => setValue(data.value)} />
    </FormField>
  )
);
FormFieldInput.displayName = "FormFieldInput";
export default FormFieldInput;

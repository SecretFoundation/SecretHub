import { TextField } from "@material-ui/core";
import { FieldAttributes, useField } from "formik";
import * as React from "react";

interface TextFieldProps {
  name: string;
  type: string;
  placeholder?: string;
  InputProps?: any;
  disabled?: boolean;
}

export const FormTextField: React.FC<TextFieldProps & FieldAttributes<{}>> = ({
  type,
  placeholder,
  disabled,
  InputProps,
  ...props
}: TextFieldProps) => {
  const [field, meta] = useField<{}>(props);
  const errorText = meta.error && meta.touched ? meta.error : "";

  if (type === "number") {
    return (
      <TextField
        id="outlined-number"
        type={type}
        label={placeholder}
        InputProps={InputProps}
        {...field}
        helperText={errorText}
        error={!!errorText}
        disabled={disabled}
      />
    );
  }

  return (
    <TextField
      type={type}
      placeholder={placeholder}
      InputProps={InputProps}
      fullWidth
      {...field}
      helperText={errorText}
      error={!!errorText}
    />
  );
};

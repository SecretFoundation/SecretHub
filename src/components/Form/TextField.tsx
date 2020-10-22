import MuiTextField, { TextFieldProps } from "@material-ui/core/TextField";
import { FieldSubscription, FieldValidator, FormApi } from "final-form";
import * as React from "react";
import { useField } from "react-final-form-hooks";

export type FieldInputValue = string | undefined;
export type ValidationError = string | undefined;

interface InnerProps {
  readonly name: string;
  readonly form: FormApi;
  readonly validate?: FieldValidator<FieldInputValue>;
  readonly onChanged?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly subscription?: FieldSubscription;
}

type Props = InnerProps & TextFieldProps;

export const TextField = ({ name, form, validate, onChanged, ...restProps }: Props): JSX.Element => {
  const { input, meta } = useField(name, form, validate);
  const error = meta.error && (meta.touched || !meta.pristine);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    input.onChange(event);

    if (onChanged) onChanged(event);
  };

  return (
    <MuiTextField
      error={error}
      name={input.name}
      value={input.value}
      helperText={error ? meta.error : undefined}
      onChange={handleChange}
      margin="normal"
      {...restProps}
    />
  );
};

export const longerThan = (minLength: number): FieldValidator<FieldInputValue> => {
  return (value): ValidationError => {
    if (value && value.length < minLength) {
      return `Must be longer than ${minLength} characters`;
    }

    return undefined;
  };
};

export function composeValidators<T>(...validators: readonly FieldValidator<T>[]): FieldValidator<T> {
  return (value, allValues, meta): ValidationError => {
    for (const validator of validators) {
      const validationError = validator(value, allValues, meta);

      if (validationError) {
        return validationError;
      }
    }

    return undefined;
  };
}

export const required: FieldValidator<FieldInputValue> = (value): ValidationError => {
  return value ? undefined : "Required";
};

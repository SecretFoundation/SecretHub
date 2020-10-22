import { Alert, AlertTitle } from "@material-ui/lab";
import * as React from "react";

export interface ErrorMessageProps {
  readonly error: string;
  readonly clearError: () => void;
}

// This is a page body to display when there is an error
export function ErrorMessage({ error, clearError }: ErrorMessageProps): JSX.Element {
  return (
    <Alert severity="error" onClose={clearError}>
      <AlertTitle>Error</AlertTitle>
      {error}
    </Alert>
  );
}

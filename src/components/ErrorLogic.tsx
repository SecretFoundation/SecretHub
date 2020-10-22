import * as React from "react";

import { useError } from "../service";
import { ErrorMessage } from "../theme";

function ErrorLogic(): JSX.Element {
  const { error, clearError } = useError();

  if (error) {
    return <ErrorMessage error={error} clearError={clearError} />;
  } else {
    return <div />;
  }
}

export default ErrorLogic;

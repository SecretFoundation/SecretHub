import * as React from "react";

interface ErrorProps {
  touched?: boolean;
  message?: string;
}

const Error: React.FC<ErrorProps> = ({ touched, message }) => {
  if (!touched) {
    return <div className="form-message invalid">&nbsp;</div>;
  }
  if (message) {
    return <div className="form-message invalid">{message}</div>;
  }
  return <div className="form-message valid">all good</div>;
};

export default Error;

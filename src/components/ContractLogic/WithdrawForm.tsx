import { Form, Formik } from "formik";
import * as React from "react";
import { toUscrt } from "../../service/helpers";

import { Button } from "../../theme";
import { useBaseStyles } from "../../theme";
import { FormValues } from "../Form";
import { FormTextField } from "../Form/fields/FormTextField";
import { WithdrawValidationSchema } from "../Form/validationSchema";

export const WITHDRAW_AMOUNT_FIELD = "withdrawAmountField";

interface WithdrawFormProps {
  readonly handleWithdraw: (values: FormValues) => void;
}

export const WithdrawForm: React.FC<WithdrawFormProps> = ({ handleWithdraw }: WithdrawFormProps) => {
  const classes = useBaseStyles();

  return (
    <Formik
      initialValues={{
        withdrawAmountField: "",
      }}
      validationSchema={WithdrawValidationSchema}
      onSubmit={async ({ withdrawAmountField }, { setSubmitting }) => {
        setSubmitting(true);
        handleWithdraw({ withdrawAmountField });
      }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit}  className={classes.tokenForm}>
          <div className={classes.tokenOpsInput}>
            <FormTextField placeholder="0" name={WITHDRAW_AMOUNT_FIELD} type="text" />
          </div>
          <div>
            <Button type="submit">
              Withdraw
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

import { Form, Formik } from "formik";
import * as React from "react";

import { Button } from "../../theme";
import { useBaseStyles } from "../../theme";
import { FormValues } from "../Form";
import { FormTextField } from "../Form/fields/FormTextField";
import { BidValidationSchema } from "../Form/validationSchema";

export const BID_AMOUNT_FIELD = "bidAmountField";

interface BidFormProps {
  readonly handleBid: (values: FormValues) => void;
}

export const BidForm: React.FC<BidFormProps> = ({ handleBid }: BidFormProps) => {
  const classes = useBaseStyles();

  return (
    <Formik
      initialValues={{
        bidAmountField: "",
      }}
      validationSchema={BidValidationSchema}
      onSubmit={async ({ bidAmountField }, { setSubmitting }) => {
        try {
          setSubmitting(true);
          handleBid({ bidAmountField });
        } catch (ex) {
          console.error(ex);
        }
      }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit} className={classes.tokenForm}>
          <div className={classes.tokenOpsInput}>
            <FormTextField placeholder="0" name={BID_AMOUNT_FIELD} type="text"/>
          </div>
          <div>
            <Button type="submit">
              Bid
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

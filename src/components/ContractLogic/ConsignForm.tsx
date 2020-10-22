import { Form, Formik } from "formik";
import * as React from "react";

import { Button } from "../../theme";
import { useBaseStyles } from "../../theme";
import { FormValues } from "../Form";
import { FormTextField } from "../Form/fields/FormTextField";
import { ConsignValidationSchema } from "../Form/validationSchema";

export const CONSIGN_AMOUNT_FIELD = "consignAmountField";

interface ConsignFormProps {
  readonly handleConsign: (values: FormValues) => void;
}

export const ConsignForm: React.FC<ConsignFormProps> = ({ handleConsign }: ConsignFormProps) => {
  const classes = useBaseStyles();

  return (
    <Formik
      initialValues={{
        consignAmountField: "",
      }}
      validationSchema={ConsignValidationSchema}
      onSubmit={async ({ consignAmountField }, { setSubmitting }) => {
        try {
          setSubmitting(true);
          handleConsign({ consignAmountField });
        } catch (ex) {
          console.error(ex);
        }
      }}
    >
      {({ handleSubmit }) => (
        <Form onSubmit={handleSubmit} className={classes.tokenForm}>
          <div className={classes.tokenOpsInput}>
            <FormTextField placeholder="0" name={CONSIGN_AMOUNT_FIELD} type="text"/>
          </div>
          <div>
            <Button type="submit">
              Consign
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

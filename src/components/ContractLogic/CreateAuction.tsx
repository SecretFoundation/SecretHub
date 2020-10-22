import { Form, Formik } from "formik";
import * as React from "react";

import { Button } from "../../theme";
import { useBaseStyles } from "../../theme";
import { FormValues } from "../Form";
import { FormTextField } from "../Form/fields/FormTextField";
import { CreateAuctionValidationSchema, ConsignValidationSchema } from "../Form/validationSchema";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from "@material-ui/core/FormControlLabel";

export const DESCRIPTION_FIELD = "descriptionField";
export const LABEL_FIELD = "labelField";
export const BID_CONTRACT_ADDRESS_FIELD = "bidContractAddressField";
export const SELL_CONTRACT_ADDRESS_FIELD = "sellContractAddressField";
export const BID_CONTRACT_CODE_HASH_FIELD = "bidContractHashField";
export const SELL_CONTRACT_CODE_HASH_FIELD = "sellContractHashField";
export const MIN_BID_AMOUNT_FIELD = "minimumBidAmountField";
export const SELL_AMOUNT_FIELD = "sellAmountField";

interface CreateAuctionProps {
  readonly loading: boolean;
  readonly handleCreateAuction: (values: FormValues) => void;
}

export const CreateAuction: React.FC<CreateAuctionProps> = ({ handleCreateAuction, loading }: CreateAuctionProps) => {
  const classes = useBaseStyles();
  const [open, setOpen] = React.useState(false);
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

    return (
        <div>
            <Button type="submit" disabled={loading} 
                onClick={handleClickOpen}>Create New Auction</Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle className={classes.createAuctionTitle} id="form-dialog-title">Create New Auction</DialogTitle>
                <DialogContent className={classes.createAuctionDialog}>
                    <Formik
                        initialValues={{
                            labelField: "",
                            bidContractAddressField: "secret1ljptw8mf5wk9n69j2v5vl4w2laqlrgspxykanp",
                            bidContractHashField: "a56c2f61d8c4e960f833fb491832c7feac62d6d6ca1ccea39a64afebc1d2d883",
                            sellContractAddressField: "secret1xpzds8dnlwr3ztqwmzffm5vd3lv993c5mszxa3",
                            sellContractHashField: "19af71c590b2dd8e0ee5216396ae44fe79a071605adead15fc31641497169e00",
                            descriptionField: "",
                            minimumBidAmountField: "100",
                            sellAmountField: "1000",

                        }}
                        validationSchema={CreateAuctionValidationSchema}
                        onSubmit={async ({ labelField, bidContractAddressField, bidContractHashField, sellContractAddressField, sellContractHashField, descriptionField, minimumBidAmountField, sellAmountField }, { setSubmitting }) => {
                        setSubmitting(true);
                        handleCreateAuction({ labelField, bidContractAddressField, bidContractHashField, sellContractAddressField, sellContractHashField, descriptionField, minimumBidAmountField, sellAmountField });
                        handleClose();
                        }}
                    >
                        {({ handleSubmit }) => (
                        <Form onSubmit={handleSubmit} className={classes.createAuctionForm}>
                            <div className={classes.createAuctionInput}>
                                <Grid container direction={"row"}>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <FormTextField placeholder="" name={LABEL_FIELD} type="text" required={true}/>
                                            }
                                            label="Label"
                                            labelPlacement="end"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <FormTextField placeholder="" name={DESCRIPTION_FIELD} type="text" required={true}/>
                                            }
                                            label="Description"
                                            labelPlacement="end"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <FormTextField placeholder="" name={MIN_BID_AMOUNT_FIELD} type="number" />
                                            }
                                            label="Minimum bid amount"
                                            labelPlacement="end"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <FormTextField placeholder="" name={SELL_AMOUNT_FIELD} type="number" />
                                            }
                                            label="Sell amount"
                                            labelPlacement="end"
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={5}>
                                        <Button type="reset" onClick={handleClose}>
                                            Cancel
                                        </Button>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Button type="submit" disabled={loading}>
                                            Create
                                        </Button>
                                    </Grid>
                                </Grid>
                                </div>
                        </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </div>
    );
  }

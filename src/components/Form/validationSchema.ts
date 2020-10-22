import * as Yup from "yup";

export const WithdrawValidationSchema = Yup.object().shape({
  withdrawAmountField: Yup.number()
    .min(0.000001, "Invalid withdraw amount"),
});

export const StakeValidationSchema = Yup.object().shape({
  stakeAmountField: Yup.number()
    .min(0.000001, "Invalid stake amount"),
});

export const ConsignValidationSchema = Yup.object().shape({
  amountField: Yup.number()
    .min(0.000001, "Invalid consignment amount"),
});

export const BidValidationSchema = Yup.object().shape({
  amountField: Yup.number()
    .min(0.000001, "Invalid Bid amount"),
});

export const CreateAuctionValidationSchema = Yup.object().shape({
  labelField: Yup.string()
    .min(3, "Min length")
    .max(64, "Max length")
    .required("Required"),
  descriptionField: Yup.string()
    .min(3, "Min length")
    .max(64, "Max length")
    .required("Required"),
  bidContractAddressField: Yup.string()
      .max(64, "Max length")
      .required("Required"),
  sellContractAddressField: Yup.string()
      .max(64, "Max length")
      .required("Required"),
  minimumBidAmountField: Yup.number()
      .min(0.000001, "Invalid minimum bid amount"),
  sellAmountField: Yup.number()
      .min(0.000001, "Invalid sell amount"),
});

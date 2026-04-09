import * as yup from "yup";
export const giftCardSchema = yup.object({
  code: yup
    .string()
 
      .min(1, "Code must be at least 1 characters")
      .max(64, "Code must be at most 125 characters")

    .required("Code is required."),
  amount_iqd: yup
    .number()
    .typeError("Amount must be a valid number.")
    .min(0.01, "Amount must be greater than zero.")

    .required("Amount is required."),

//   redeemed_at: yup
//     .date()
//     .typeError("Date must be a valid date.")
//     .required("Date is required."),




});


export const bulkGiftCardSchema = yup.object({

  amount_iqd: yup
    .number()
    .typeError("Amount must be a valid number.")
    .min(0.01, "Amount must be greater than zero.")

    .required("Amount is required."),
  count: yup
    .number()
    .typeError("count must be a valid number.")
    .min(1, "count must be greater than zero.")

    .required("count is required."),






});
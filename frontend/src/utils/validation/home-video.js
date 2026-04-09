import * as yup from "yup"
export const homeVideoSchema = yup
  .object({
    title: yup
      .string()
      .min(1, "Title must be at least 1 characters")
      .max(125, "Title must be at most 125 characters")
      .required("Title is required"),

    // banner_type_id: yup.string().required("Order number is required"),



banner_type: yup
  .string()
  .oneOf(["product", "category", null], "You need to select a valid banner type.")
  .nullable()
  .notRequired(),
    start_date: yup
      .date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .required("start date is required"),
    end_date: yup
      .date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .required("end date is required"),

  })
  .required()

import * as yup from "yup"
export const bannerSchema = yup
  .object({
    title: yup
      .string()
      .min(1, "Title must be at least 1 characters")
      .max(125, "Title must be at most 125 characters")
      .required("Title is required"),

    // banner_type_id: yup.string().required("Order number is required"),

    sort_order: yup
      .number()

      .integer("Order must be an number")
      .required("Order number is required"),
    // filter_id: yup
    //   .number()
    //   .positive("Filter  must be a positive number")
    //   .integer("Filter must be an number")
    //   .required("Filter number is required"),

    banner_type: yup
      .string()
      .oneOf(
        ["product", "category","products"],
        "You need to select a banner type."
      )
      .required("You need to select a banner type."),
    event_date: yup
      .date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .required("Event start date is required"),
    event_date_end: yup
      .date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .required("Event end date is required"),
    language_id: yup
      .string()
      .oneOf(["english", "arabic"], "You need to select a language.")
      .required("You need to select a language."),
  })
  .required()

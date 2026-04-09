import * as yup from "yup";
export const notificationSchema = yup
  .object({
    title: yup
      .string()
      .min(1, "Title must be at least 1 characters")
      .max(125, "Title must be at most 125 characters")
      .required("Title number is required"),

    body: yup
      .string()
      .min(1, "Body must be at least 1 characters")
      .max(225, "Body must be at most 125 characters")
      .required("Body number is required"),
    url: yup
      .string()
      .url('Invalid URL format'),

    type: yup
      .string()
      .oneOf(
        [ "product", "category"],
        "You need to select a notification type."
      )
      .required("You need to select a notification type."),
  })
  .required();

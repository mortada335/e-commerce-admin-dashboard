import * as yup from "yup"
export const brandSchema = yup
  .object({
    name: yup
      .string()
      .min(1, "Name must be at least 1 characters")
      .max(125, "Name must be at most 125 characters")
      .required("Name is required"),

    sort_order: yup.number().integer("Order must be an number"),
    image: yup.string().required("Image is required"),
    enabled: yup
      .string()
      .oneOf(["enabled", "disable"], "You need to select a brand status.")
      .required("You need to select a brand status."),
  })
  .required()

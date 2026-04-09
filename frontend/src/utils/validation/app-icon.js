import * as yup from "yup"
export const appIconSchema = yup
  .object({
    name: yup
      .string()
      .min(1, "Name must be at least 1 characters")
      .max(125, "Name must be at most 125 characters")
      .required("Name is required"),


    platform: yup
      .string()
      .oneOf(["1", "2","3"], "You need to select a icon platform.")
      .required("You need to select a icon platform."),
    enabled: yup
      .string()
      .oneOf(["enabled", "disable"], "You need to select a icon status.")
      .required("You need to select a icon status."),
  })
  .required()

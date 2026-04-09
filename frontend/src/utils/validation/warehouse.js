import * as yup from "yup";
export const warehouseSchema = yup.object({
  name: yup
    .string()
 
      .min(1, "name must be at least 1 characters")
      .max(64, "name must be at most 125 characters")

    .required("name is required."),
  code: yup
    .string()
 
      .min(1, "Code must be at least 1 characters")
      .max(64, "Code must be at most 125 characters")

    .required("Code is required."),





});


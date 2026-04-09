import * as yup from "yup"
export const updateProductOrderSchema = yup
  .object({
    select_product_id: yup.string().required("Product  is required"),

    quantity: yup
      .number()
      .positive("Filter  must be a positive number")
      .integer("Filter must be an number")
      .required("Filter number is required"),
  })
  .required()

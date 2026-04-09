import * as yup from "yup"

export const deliveryCostSchema = yup
  .object({
    cost: yup
      .number()
      .min(0, "Cost cannot be less than 0")
      .integer("Cost must be an number")
      .required("Cost number is required"),
    special_cost: yup.string().nullable(),

    special_cost_total_order: yup.string().nullable(),

    date_start: yup.date().nullable(),
    date_end: yup.date().nullable(),
  })
  .required()

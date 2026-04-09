import * as yup from "yup";

export const generalCouponSchema = yup.object({
  name: yup
    .string()
    .min(1, "Title must be at least 1 character")
    .max(125, "Title must be at most 125 characters")
    .required("Title is required"),
  code: yup
    .string()
    .min(1, "Code must be at least 1 character")
    .max(125, "Code must be at most 125 characters")
    .required("Code is required"),
  status: yup
    .string()
    .oneOf(["enabled", "disable"], "You need to select a coupon status.")
    .required("You need to select a coupon status."),

  // type: yup.string().required("Type is required."),

  discount: yup
    .number()
    .transform((value, originalValue) => {
      const newValue = parseFloat(value);
      String(originalValue).trim() === "" ? null : newValue;
    })
    .notRequired(),

  total_max: yup
    .number()
    // .positive("Total max must be a positive number")
    .integer("Total Max must be a number")
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable(),
  total_min: yup
    .number()
    // .positive("Total min must be a positive number")
    .integer("Total Min must be a number")
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? null : value
    )
    .nullable(),
  uses_total: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? 0 : value
    )
    .nullable()
    .integer("Uses Total must be a number")
    .notRequired(),
  uses_customer: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? 0 : value
    )
    .nullable()
    .integer("Uses Customer must be a number")
    .notRequired(),
  date_start: yup.date().required("Date Start is required"),
  date_end: yup.date().required("Date End is required"),
});

export const updateCouponStatusSchema = yup.object({

  status: yup
    .string()
    .oneOf(["enabled", "disable"], "You need to select a coupon status.")
    .required("You need to select a coupon status."),


  date_start: yup.date().required("Date Start is required"),
  date_end: yup.date().required("Date End is required"),
});

import * as yup from "yup"
export const productSchema = yup
  .object({
    nameEnglish: yup
      .string()
      .min(1, "Name in english must be at least 1 characters")
      .max(125, "Name in english must be at most 125 characters")
      .required("Name in english  is required"),

    nameArabic: yup
      .string()
      .min(1, "Name in arabic must be at least 1 characters")
      .max(125, "Name in arabic must be at most 125 characters")
      .required("Name in arabic  is required"),
    englishDescription: yup
      .string()
      .min(1, "description in english must be at least 1 characters")
 
      .required("description in english  is required"),
    arabicDescription: yup
      .string()
      .min(1, "description in arabic must be at least 1 characters")

      .required("description in arabic  is required"),

    model: yup
      .string()
      .min(1, "Model color must be at least 1 characters")
      .max(64, "Model color must be at most 30 characters")
      .required("Model color is required"),

    weight: yup
      .number()
      .required("weight number is required")

      .min(0, "weight products cannot be less than 0")
      .integer("weight must be an number"),
    width: yup
      .number()
      .required("width number is required")

      .min(0, "width products cannot be less than 0")
      .integer("width must be an number"),

    height: yup
      .number()
      .required("height number is required")

      .min(0, "height products cannot be less than 0")
      .integer("height must be an number"),
    length: yup
      .number()
      .required("length number is required")
      .min(0, "length products cannot be less than 0")
      .integer("length must be an number"),
    price: yup
      .number()
      .required("Price number is required")
      .integer("Price must be an number")
      .positive("Price must be a positive number"),
    discount_price: yup
      .string()
      .nullable()
      .min(0, "Num products cannot be less than 0"),

    available_quantity: yup
      .number()
      .min(0, "Num products cannot be less than 0")
      .required("Available Quantity number is required")
      .integer("Available Quantity must be an number"),
    // points: yup.number().nullable(),
    // .min(0, "Num products cannot be less than 0")
    // .integer("Available Quantity must be an number"),
    discount_start_date: yup.date(),
    discount_expiry_date: yup.date(),
    // status: yup
    //   .string()
    //   .oneOf([0, 1, 2, 3, 4], "You need to select a product status.")
    //   .required("You need to select a product status."),
  })
  .required()

export const applyRandomDiscountSchema = yup
  .object({
    num_products: yup
      .number()
      .transform((value, originalValue) =>
        String(originalValue).trim() === "" ? 0 : value
      )
      .nullable()
      .integer("Products Number must be a number")
      .notRequired(),

    discount_value: yup.string().required("Discount value is required."),
    discount_type: yup.string().required("Type is required."),
    discount_start_date: yup.date().required("Start Date is required"),
    discount_expiry_date: yup.date().required("End Date is required"),
  })
  .required()
export const productsBulkStatusUpdateSchema = yup
  .object({
    num_products: yup
      .number()
      .transform((value, originalValue) =>
        String(originalValue).trim() === "" ? 0 : value
      )
      .nullable()
      .integer("Products Number must be a number")
      .notRequired(),

    discount_value: yup.string().required("Discount value is required."),
    discount_type: yup.string().required("Type is required."),
    discount_start_date: yup.date().required("Start Date is required"),
    discount_expiry_date: yup.date().required("End Date is required"),
  })
  .required()
  export const optionSchema = yup
  .object({
    quantity: yup
      .number()
      .required("Quantity number is required")
      .integer("Quantity must be a number")
      .min(0, "Quantity must be 0 or a positive number"),
    price: yup
      .number()
      .required("Quantity number is required")
      .integer("Quantity must be a number")
      .min(0, "Quantity must be 0 or a positive number"),
        image: yup.string().required("Image is required"),
  })
  .required()
export const imageSchema = yup
  .object({
    sort_order: yup
    .number()
    .required("Sort Order number is required")
    .integer("Sort Order must be an number")
    .positive("Sort Order must be a positive number"),
  })
  .required()

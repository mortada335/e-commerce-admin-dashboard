import * as yup from "yup";
export const sectionSchema = yup
  .object({
    titleEn: yup
      .string()
      .min(1, "Title in english must be at least 1 characters")
      .max(125, "Title in english must be at most 125 characters")
      .required("Title in english is required"),

    titleAr: yup
      .string()
      .min(1, "Title in arabic must be at least 1 characters")
      .max(125, "Title in arabic must be at most 125 characters")
      .required("Title in arabic is required"),

    sub_titleEn: yup
      .string()
      .max(225, "subtitle in english must be at most 125 characters"),
    sub_titleAr: yup
      .string()
      .max(225, "subtitle in arabic must be at most 125 characters"),

    order_id: yup
      .number()
      .positive("Order  must be a positive number")
      .integer("Order must be an number")
      .required("Order number is required"),

    section_type: yup
      .number()
      .positive("Type  must be a positive number")
      .integer("Type must be an number")
      .required("Type number is required"),

    section_products_limit: yup
      .number("Products limit must be a number.")
      .positive("Product limit must be bigger than 0.")
      .integer("Type must be an number")
      .required("Products limit is required"),
  })
  .required();
export const editSectionSchema = yup
  .object({
    titleEn: yup
      .string()
      .min(1, "Title in english must be at least 1 characters")
      .max(125, "Title in english must be at most 125 characters")
      .required("Title in english is required"),

    titleAr: yup
      .string()
      .min(1, "Title in arabic must be at least 1 characters")
      .max(125, "Title in arabic must be at most 125 characters")
      .required("Title in arabic is required"),

    sub_titleEn: yup
      .string()
      .max(225, "subtitle in english must be at most 125 characters"),
    sub_titleAr: yup
      .string()
      .max(225, "subtitle in arabic must be at most 125 characters"),

    section_type: yup
      .number()
      .positive("Type  must be a positive number")
      .integer("Type must be an number")
      .required("Type number is required"),

    section_products_limit: yup
      .number("Products limit must be a number.")
      .positive("Product limit must be bigger than 0.")
      .integer("Type must be a number")
      .required("Products limit is required"),
  })
  .required();

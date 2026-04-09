import * as yup from "yup";
export const rankSchema = yup
  .object({
    rankNameEnglish: yup
      .string()
      .min(1, "Name in english must be at least 1 characters")
      .max(125, "Name in english must be at most 125 characters")
      .required("Name in english  is required"),

    rankNameArabic: yup
      .string()
      .min(1, "Name in arabic must be at least 1 characters")
      .max(125, "Name in arabic must be at most 125 characters")
      .required("Name in arabic is required"),

    min_points: yup
      .number()
      .integer("Min Points must be an number")
      .min(0)
      .max(2147483647)
      .required("Min Points number is required"),
    max_points: yup
      .number()
      .positive("Max Points  must be a positive number")
      .integer("Max Points must be an number")
      .min(1)
      .max(2147483647)
      .required("Max Points  number is required"),

    // status:yup.boolean(),
  })
  .required();

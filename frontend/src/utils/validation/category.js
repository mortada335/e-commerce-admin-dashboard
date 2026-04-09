import * as yup from "yup"
export const categorySchema = yup
  .object({
    nameEnglish: yup.string().nullable(),

    nameArabic: yup.string().nullable(),
    descriptionEnglish: yup.string().nullable(),

    descriptionArabic: yup.string().nullable(),

    // color: yup
    //   .string()
    //   .min(1, "Color must be at least 1 characters")
    //   .max(30, "Color must be at most 30 characters")
    //   .required("Color is required"),
    image: yup.string().required("Image is required"),

    transparency: yup
      .string()

      .nullable(),
    sort_order: yup
      .number()

      .integer("Order must be an number"),
    status: yup
      .string()
      .oneOf(["enabled", "disable"], "You need to select a note status.")
      .required("You need to select a note status."),
  })
  .required()

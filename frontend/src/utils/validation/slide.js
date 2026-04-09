import * as yup from "yup"
export const slideSchema = yup
  .object({
    englishTitle: yup
      .string()
      .min(1, "Title must be at least 1 characters")
      .max(125, "Title must be at most 125 characters")
      .required("Title is required"),
    arabicTitle: yup
      .string()
      .min(1, "Title must be at least 1 characters")
      .max(125, "Title must be at most 125 characters")
      .required("Title is required"),

    // banner_type_id: yup.string().required("Order number is required"),

    sort_order: yup
      .number()

      .integer("Order must be an number")
      .required("Order number is required"),
    // filter_id: yup
    //   .number()
    //   .positive("Filter  must be a positive number")
    //   .integer("Filter must be an number")
    //   .required("Filter number is required"),

    banner_type: yup
      .string()
      .oneOf(
        [ "product", "category"],
        "You need to select a banner type."
      )
      .required("You need to select a banner type."),
    //Add validation for the image field
    // englishImage: yup.string().required("Image is required"),
    // arabicImage: yup.string(),

    link: yup
      .string()
      .min(1, "link must be at least 1 characters")
      .required("You need to enter a banner link."),
    event_title: yup
      .string()
      .min(1, "Event title must be at least 1 characters")
      .required("You need to enter a banner event title."),
    event_date: yup.date(),
  })
  .required()

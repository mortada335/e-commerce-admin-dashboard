import * as yup from "yup"
export const noteSchema = yup
  .object({
    title: yup
      .string()
      .min(1, "Name must be at least 1 characters")
      .max(255, "Name must be at most 255 characters")
      .required("Name is required"),
    type: yup
      .string()
      .min(1, "Type must be at least 1 characters")
      .max(30, "Type must be at most 30 characters")
      .required("Type is required"),
    bgColor: yup
      .string()
      .min(1, "Background color must be at least 1 characters")
      .max(30, "Background color must be at most 30 characters")
      .required("Background color is required"),
    color: yup
      .string()
      .min(1, "Title color must be at least 1 characters")
      .max(30, "Title color must be at most 30 characters")
      .required("Title color is required"),

    icon: yup.string().required("Image is required"),
    status: yup
      .string()
      .oneOf(["enabled", "disable"], "You need to select a note status.")
      .required("You need to select a note status."),
    language: yup
      .string()
      .oneOf(
        ["english", "arabic", "kurdish"],
        "You need to select a note language."
      )
      .required("You need to select a note language."),
  })
  .required()

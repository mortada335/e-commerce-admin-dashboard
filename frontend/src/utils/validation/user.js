import * as yup from "yup"
export const userSchema = yup
  .object({
    username: yup
      .string()
      .matches(
        /^[\w.@+-]+$/,
        "Username can only contain letters, digits, and @/./+/-/_"
      )
      .min(1, "Username must be at least 1 character")
      .max(150, "Username must be at most 150 characters")
      .required("Username is required"),
    first_name: yup
      .string()
      .min(1, "First Name must be at least 1 characters")
      .max(150, "First Name must be at most 150 characters")
      .required("First Name is required"),
    last_name: yup
      .string()
      .min(1, "Last Name must be at least 1 characters")
      .max(150, "Last Name must be at most 150 characters")
      .required("Last Name is required"),
    password: yup
      .string()
      .min(8, "Pssword must be at least 8 characters")
      .required("Password is required"),
    status: yup
      .string()
      .oneOf(["active", "inactive"], "You need to select a user status.")
      .required("You need to select a user status."),
  })
  .required()

// EDIT
export const userEditSchema = yup
  .object({
    username: yup
      .string()
      .matches(
        /^[\w.@+-]+$/,
        "Username can only contain letters, digits, and @/./+/-/_"
      )
      .min(1, "Username must be at least 1 character")
      .max(150, "Username must be at most 150 characters")
      .required("Username is required"),
    first_name: yup
      .string()
      .min(1, "First Name must be at least 1 characters")
      .max(150, "First Name must be at most 150 characters")
      .required("First Name is required"),
    last_name: yup
      .string()
      .min(1, "Last Name must be at least 1 characters")
      .max(150, "Last Name must be at most 150 characters")
      .required("Last Name is required"),

  })
  .required()
export const referralCodeSchema = yup
  .object({
    code: yup
      .string()

      .min(1, "Code must be at least 1 character")
      .max(10, "Code must be at most 10 characters")
      .required("Code is required"),
  })
  .required()
export const RewardsPointsSchema = yup
  .object({
    points: yup
      .number()

      .integer("Points must be an number")
      .required("Points number is required"),

    reason: yup
      .string()
      .max("250", "Reason must be less than or equal to 250 characters."),
  })
  .required()

export const changeUserPasswordSchema = yup.object({
  password: yup
    .string()
    .min(8, "Password must be at least 8 character")
    .required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
})

export const userAdminSchema = yup.object({
  username: yup
    .string()
    .matches(
      /^[\w.@+-]+$/,
      "Username can only contain letters, digits, and @/./+/-/_"
    )
    .min(1, "Username must be at least 1 character")
    .max(150, "Username must be at most 150 characters")
    .required("Username is required"),

  first_name: yup
    .string()
    .max(32, "first name must be at most 32 characters")
    .notRequired(),

  last_name: yup
    .string()
    .max(32, "last name must be at most 32 characters")
    .notRequired(),

  password: yup
    .string()
    .min(1, "Password must be at least 1 character")
    .max(150, "Password must be at most 150 characters")
    .required(),

  email: yup
    .string()
    .email("Email must be a valid email")
    .max(254, "Email must be at most 254 characters")
    .notRequired(),
})

export const userAdminSchemaEdit = yup.object({
  username: yup
    .string()
    .matches(
      /^[\w.@+-]+$/,
      "Username can only contain letters, digits, and @/./+/-/_"
    )
    .min(1, "Username must be at least 1 character")
    .max(150, "Username must be at most 150 characters")
    .required("Username is required"),

  email: yup
    .string()
    .email("Email must be a valid email")
    .max(254, "Email must be at most 254 characters")
    .notRequired(),

  status: yup
    .string()
    .oneOf(["active", "inactive"], "You need to select a user status."),
})
export const cartSchema = yup.object({
  option: yup
    .string()
    .min(1, "Option must be at least 1 characters")
    .max(255, "Option must be at most 125 characters")
    .nullable()
    .notRequired(),

  quantity: yup.number().min(0).integer("Quantity must be an number"),
})

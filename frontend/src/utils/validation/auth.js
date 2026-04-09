import * as yup from "yup";

export const authSchema = yup.object({
  username: yup.string()
    .required("Username is required")
    .min(7, "Username must be at least 7 characters")
  ,
  password: yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")

}).required();


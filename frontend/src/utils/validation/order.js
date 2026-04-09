import * as yup from "yup"

export const orderSchema = yup
  .object({
    // customer_id: yup
    //   .number()
    //   .integer("Customer id must be an integer")
    //   .required("Customer id is required"),

    payment_firstname: yup
      .string()
      .min(1)
      .max(32)
      .required("Payment firstname is required"),
    payment_lastname: yup
      .string()
      .min(1)
      .max(32)
      .required("Payment lastname is required"),
    payment_address_1: yup
      .string()
      .min(1)
      .max(128)
      .required("Payment address 1 is required"),
    payment_address_2: yup.string().nonNullable().min(0).max(128),
    payment_city: yup
      .string()
      .min(1)
      .max(128)
      .required("Payment city is required"),
    payment_postcode: yup.string().min(0).max(10).nonNullable(),
    payment_custom_field: yup
      .string()
      .nullable()
      .min(0, "Payment custom field must be at least 1 character"),
    shipping_firstname: yup
      .string()
      .min(1)
      .max(32)
      .required("Shipping firstname is required"),
    shipping_lastname: yup
      .string()
      .min(1)
      .max(32)
      .required("Shipping lastname is required"),
    shipping_address_1: yup
      .string()
      .min(1)
      .max(128)
      .required("Shipping address 1 is required"),
    shipping_address_2: yup
      .string()

      .min(0, "Shipping address must be at most 1 characters")
      .max(128, "Shipping address  must be at most 125 characters")
      .nonNullable(),
    shipping_city: yup
      .string()

      .min(1, "Shipping city must be at most 1 characters")
      .max(128, "Shipping city  must be at most 125 characters")
      .required("Shipping city is required"),
    shipping_postcode: yup
      .string()

      .min(0, "Shipping postcode  must be at most 1 characters")
      .max(10, "Shipping postcode  must be at most 125 characters")
      .nonNullable(),
    shipping_custom_field: yup
      .string()
      .nullable()
      .min(0, "Shipping custom field must be at least 1 character"),
    payment_method: yup
      .string()
      .min(1, "Payment method  must be at most 1 characters")
      .max(128, "Payment method  must be at most 125 characters")
      .required("Payment method is required"),

    num_products: yup
      .number()
      .integer("Num products must be an integer")
      .nullable()
      .min(0, "Num products cannot be less than 0")
      .max(2147483647, "Num products cannot be greater than 2147483647"),
    comment: yup
      .string()
      .nullable()
      .min(0, "Comment must be at least 0 character"),
    coupon: yup
      .string()
      .nullable()
      .min(0, "Coupon must be at least 0 character"),
    sub_total: yup
      .number()
      .integer("Total  must be an integer")
      .min(0, "Total cannot be less than 0")
      .max(2147483647, "Total cannot be greater than 2147483647"),
    total_after_discount: yup
      .number()
      .integer("Total after discount must be an integer")
      .min(0, "Total after discount cannot be less than 0")
      .max(
        2147483647,
        "Total after discount cannot be greater than 2147483647"
      ),

    order_status_id: yup
      .string()
      .oneOf(
        ["New Order", "Completed", "Cancelled Order", "Refunded"],
        "You need to select a order status."
      )
      .required("You need to select a order status."),
  })
  .required()

export const statusSchema = yup
  .object({
    status: yup
      .string()
      .oneOf(
        ["Pending", "Completed", "Refunded", "Cancelled Order"],
        "You need to select a order status."
      )
      .required("You need to select a order status."),
    comment: yup
      .string()
      // .min(1, "Comment must be at least 1 characters")
      .max(125, "Comment must be at most 125 characters"),
    // .required("Comment is required"),
  })
  .required()
export const publishShipmentSchema = yup
  .object({
    senderHp: yup
      .string()
      .min(1, "Sender Phone Number must be at least 1 characters")
      .max(11, "Sender Phone Number must be at most 11 characters")
      .required("Sender Phone Number is required"),
    receiverHp1: yup
      .string()
      .min(1, "Receiver Phone Number must be at least 1 characters")
      .max(11, "Receiver Phone Number must be at most 11 characters")
      .required("Receiver Phone Number is required"),
    receiverHp2: yup
      .string()

      .max(11, "Receiver Second Phone Number must be at most 11 characters")
      .nullable(),
    receiverName: yup
      .string()
      .min(1, "Receiver Name must be at least 1 characters")
      .max(255, "Receiver Name must be at most 255 characters")
      .required("Receiver Name is required"),
    locationDetails: yup
      .string()
      .min(1, "Receiver Name must be at least 1 characters")
      .max(255, "Receiver Name must be at most 100 characters")
      .required("Receiver Name is required"),
  })
  .required()

import axiosInstance from "@/utils/axiosInstance"
import qs from "qs"

import { ORDERS_URL } from "@/utils/constants/urls"

const ordersRoute = "orders_admin/"

export const FetchAdminOrders = async (user, page = ordersRoute) => {
  try {
    const response = await axiosInstance.get(page, {
      headers: {
        Authorization: `Token ${user.token}`,
      },
    })

    return response
    // ...
  } catch (error) {
    // Handle the error
    return error
  }
}

export const FetchAdminOrders1 = async (
  searchKeyObject = {},
  page = ordersRoute
) => {
  try {
    const response = await axiosInstance.get(page, {
      params: { ...searchKeyObject },
      paramsSerializer: (params) => qs.stringify(params, { encode: false }),
    })

    return response
    // ...
  } catch (error) {
    // Handle the error
    return error
  }
}

export const FetchAdminOrderDetails = async (user, orderId) => {
  const formData = new FormData()
  formData.append("id", orderId)
  try {
    const response = await axiosInstance.post(`get_order_details/`, formData, {
      headers: {
        Authorization: `Token ${user.token}`,
      },
    })

    return response
    // ...
  } catch (error) {
    // Handle the error
    return error
  }
}

export const DeleteOrder = async (orderId) => {
  try {
    const response = await axiosInstance.delete(`${ordersRoute}${orderId}/`)
    return response
  } catch (error) {
    return error
  }
}

export const EditAdminOrder = async (id, newOrder) => {
  // const formData = new FormData();
  // formData.append("name", newBrand.name);
  // formData.append("image", newBrand.image);

  try {
    const response = await axiosInstance.put(`${ordersRoute}${id}/`, newOrder, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response
    // ...
  } catch (error) {
    // Handle the error
    return error
  }
}

export const EditAdminOrderStatus = async (id, new_order_status_id) => {
  try {
    const response = await axiosInstance.patch(`${ordersRoute}${id}/`, {
      order_status_id: new_order_status_id,
    })

    return response
  } catch (error) {
    // Handle the error
    return error
  }
}

export const EditAdminOrderStatusAndComment = async (
  id,
  new_order_status_id,
  new_comment,
  customer_notified_arr = ""
) => {
  // get previos array
  const arrayOfUserNotifiedOrNot =
    customer_notified_arr && customer_notified_arr != ""
      ? JSON.parse(customer_notified_arr)
      : ""

  if (arrayOfUserNotifiedOrNot?.length) {
    arrayOfUserNotifiedOrNot.unshift(0)
  }
  try {
    const response = await axiosInstance.patch(`${ordersRoute}${id}/`, {
      order_status_id: new_order_status_id,
      comment: new_comment || null,
      customer_notified_id: JSON.stringify(arrayOfUserNotifiedOrNot),
    })

    return response
  } catch (error) {
    // Handle the error
    return error
  }
}

export const EditCustomerNotifiedIdStringArray = async (
  id,
  new_customer_notified_arr
) => {
  try {
    const response = await axiosInstance.patch(`${ordersRoute}${id}/`, {
      customer_notified_id: JSON.stringify(new_customer_notified_arr),
    })

    return response
  } catch (error) {
    // Handle the error
    return error
  }
}

export const EditAdminOrderComment = async (id, new_comment) => {
  try {
    const response = await axiosInstance.patch(`${ordersRoute}${id}/`, {
      comment: new_comment,
    })

    return response
  } catch (error) {
    // Handle the error
    return error
  }
}

export const EditAdminOrderProducts = async (id, newProductsArray) => {
  try {
    const response = await axiosInstance.patch(`${ordersRoute}${id}/`, {
      order_products: newProductsArray,
    })

    return response
  } catch (error) {
    // Handle the error
    return error
  }
}

export const FetchAdminOrderById = async (orderId) => {
  try {
    const response = await axiosInstance.get(`${ordersRoute}${orderId}`)

    return response
    // ...
  } catch (error) {
    // Handle the error
    return error
  }
}

// Export orders list as CSV file.
export const getExportedCsv = async (
  // Search Key Object for params.
  searchKeyObject = {},

  // Item per page.
  itemPerPage = 25,

  // Current pages
  currentPage = 1,

  // End-point.
  URL = ORDERS_URL
) => {
  try {
    const response = await axiosInstance.get(
      `${URL}?page=${currentPage}&page_size=${itemPerPage}`,
      {
        params: { ...searchKeyObject, response_type: "csv" },
        paramsSerializer: (params) => qs.stringify(params, { encode: false }),
      }
    )

    return response

    // Space Purposes.
  } catch (error) {
    // Erorr Handling.
    return error
  }
}

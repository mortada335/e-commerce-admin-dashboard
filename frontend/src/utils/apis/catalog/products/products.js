import axiosInstance from "@/utils/axiosInstance"
import qs from "qs"
const productsRoute = "products_admin/"
const productImagesRoute = "product_images/"
const SearchProductsRoute = "/search/"

export const PostAdminProduct = async (data) => {
  const formData = new FormData()
  formData.append("model", data.model)
  formData.append("available_quantity", data.available_quantity)
  if (data?.manufacturer_id)
    formData.append("manufacturer_id", data.manufacturer_id)
  formData.append("description", JSON.stringify(data.description))
  formData.append("price", data.price)
  formData.append("weight", data.weight)
  formData.append("length", data.length)
  formData.append("width", data.width)
  formData.append("height", data.height)
  formData.append("status", data.status)
  formData.append("attributes", JSON.stringify(data.attributes))

  // for (let i = 0; i < data.images.length; i++) {
  //   formData.append("images[]", data.images[i]);
  // }

  if (data?.images?.length > 0)
    data.images.forEach((file) => {
      formData.append("images", file)
    })

  formData.append("categories", JSON.stringify(data.categories))
  // formData.append("categories", data.categories);

  if (data?.discounted_price)
    formData.append("discounted_price", data.discounted_price)
  formData.append("discount_start_date", data.discount_start_date)
  formData.append("discount_expiry_date", data.discount_expiry_date)
  formData.append("points", data.points)

  try {
    const response = await axiosInstance.post(productsRoute, formData, {
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

export const FetchAdminProducts = async (
  searchKeyObject = {},
  page = productsRoute
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

export const SearchAdminProducts = async (
  searchKeyObject,
  page = SearchProductsRoute
) => {
  try {
    const response = await axiosInstance.get(page, {
      params: searchKeyObject,
      paramsSerializer: (params) => qs.stringify(params, { encode: false }),
    })

    return response
    // ...
  } catch (error) {
    // Handle the error
    return error
  }
}

export const FetchAdminProductById = async (productId) => {
  try {
    const response = await axiosInstance.get(`${productsRoute}${productId}`)

    return response
    // ...
  } catch (error) {
    // Handle the error
    return error
  }
}

export const DeleteAdminProduct = async (productId) => {
  try {
    const response = await axiosInstance.delete(`${productsRoute}${productId}`)

    return response
    // ...
  } catch (error) {
    // Handle the error
    return error
  }
}
export const DeleteAdminProductWithBulk = async (arrayOfIds) => {
  try {
    const response = await axiosInstance.delete(`products_admin/bulk-delete/`, {
      data: { product_ids: arrayOfIds },
    })

    return response
    // ...
  } catch (error) {
    // Handle the error
    return error
  }
}

export const EditAdminProduct = async (productId, data) => {
  const formData = new FormData()
  formData.append("model", data.model)
  formData.append("available_quantity", data.available_quantity)
  formData.append("manufacturer_id", data.manufacturer_id)
  formData.append("description", JSON.stringify(data.description))
  formData.append("price", data.price)

  formData.append("weight", data.weight)
  formData.append("length", data.length)
  formData.append("width", data.width)
  formData.append("height", data.height)

  formData.append("status", data.status)
  formData.append("attributes", JSON.stringify(data.attributes))

  // add categories to the formData

  formData.append("categories", JSON.stringify(data.categories))

  formData.append("discounted_price", data.discounted_price)

  formData.append("discount_start_date", data.discount_start_date)
  formData.append("discount_expiry_date", data.discount_expiry_date)
  formData.append("points", data.points)

  try {
    const response = await axiosInstance.put(
      `${productsRoute}${productId}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )

    return response
    // ...
  } catch (error) {
    // Handle the error
    return error
  }
}

export const FetchAdminProductImageById = async (productId) => {
  try {
    const response = await axiosInstance.get(`${productImagesRoute}`, {
      params: {
        product_id: productId,
      },
    })

    return response
    // ...
  } catch (error) {
    // Handle the error
    return error
  }
}

export const AddImageToProduct = async (imageData) => {
  const formData = new FormData()
  formData.append("product_id", imageData.product_id)
  formData.append("sort_id", JSON.stringify([...imageData.sort_id]))
  // formData.append("images", JSON.stringify(imageData.images));
  if (imageData.images?.length > 0)
    imageData.images.forEach((file) => {
      formData.append("images", file)
    })

  try {
    const response = await axiosInstance.post(productImagesRoute, formData, {
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

export const updateImageSort = async (productImageId, data) => {
  try {
    const response = await axiosInstance.put(
      `${productImagesRoute}${productImageId}/`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    return response
    // ...
  } catch (error) {
    return error
  }
}

export const DeleteImageFromProduct = async (imageId) => {
  try {
    const response = await axiosInstance.delete(
      `${productImagesRoute}${imageId}`
    )

    return response
    // ...
  } catch (error) {
    // Handle the error
    return error
  }
}

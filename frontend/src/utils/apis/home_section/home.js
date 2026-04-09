import axiosInstance from "@/utils/axiosInstance"
const homeSectionRoute = "home_section_admin/"

export const FetchHomeSections = async (page = homeSectionRoute) => {
  try {
    const response = await axiosInstance.get(page)

    return response.data
    // ...
  } catch (error) {
    // Handle the error
    return error
  }
}

export const FetchHomeSectionById = async (id) => {
  try {
    const response = await axiosInstance.get(`${homeSectionRoute}${id}/`)

    return response
    // ...
  } catch (error) {
    // Handle the error
    return error
  }
}

export const PostHomeSection = async (data) => {
  const formData = new FormData()
  if (data?.section_background)
    formData.append("section_background", data.section_background)
  formData.append("type", data.type)
  formData.append("section_products_limit", data.section_products_limit)
  formData.append("order_id", data.order_id)
  formData.append("filter_id", data.filter_id)
  formData.append("title", JSON.stringify(data.title))

  try {
    const response = await axiosInstance.post(homeSectionRoute, formData, {
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

export const EditHomeSection = async (id, data) => {
  const formData = new FormData()
  if (data?.section_background instanceof File)
    formData.append("section_background", data.section_background)
  formData.append("type", data.type)
  formData.append("section_products_limit", data.section_products_limit)
  formData.append("order_id", data.order_id)
  formData.append("filter_id", data.filter_id)
  formData.append("title", JSON.stringify(data.title))

  try {
    const response = await axiosInstance.put(
      `${homeSectionRoute}${id}/`,
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

export const DeleteAdminSection = async (id) => {
  try {
    const response = await axiosInstance.delete(`${homeSectionRoute}${id}/`)

    return response
    // ...
  } catch (error) {
    // Handle the error
    return error
  }
}

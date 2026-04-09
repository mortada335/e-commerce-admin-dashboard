import axiosInstance from "@/utils/axiosInstance"
const brandsRoute = "brands_admin/"
import qs from "qs"
import { giveMeDefaultFile } from "@/utils/methods"

// export const FetchAdminBrands = async (page = brandsRoute) => {
//   try {
//     const response = await axiosInstance.get(page);

//     return response;
//   } catch (error) {
//     // Handle the error
//     return error;
//   }
// };

export const GetAndSearchAdminBrands = async (
  searchKeyObject = {},
  page = brandsRoute
) => {
  try {
    // const response = await axiosInstance.get(searchURL, { params: { search: searchKey } });
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

export const PostAdminBrand = async (data) => {
  const formData = new FormData()
  formData.append("name", data.name)
  if (data?.image && data.image instanceof File)
    formData.append("image", data.image)
  else {
    const defaultImageFile = await giveMeDefaultFile()
    formData.append("image", defaultImageFile)
  }
  formData.append("sort_order", data.sortOrder)
  formData.append("enabled", data.enabled)

  // for (var pair of formData.entries()) {

  // }

  try {
    const response = await axiosInstance.post(brandsRoute, formData, {
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

export const DeleteAdminBrand = async (id) => {
  try {
    const response = await axiosInstance.delete(`${brandsRoute}${id}/`)

    return response
    // ...
  } catch (error) {
    // Handle the error
    return error
  }
}

export const EditAdminBrand = async (id, newBrand) => {
  const formData = new FormData()
  formData.append("name", newBrand.name)
  if (newBrand?.image instanceof File) formData.append("image", newBrand.image)
  formData.append("sort_order", newBrand.sortOrder)
  formData.append("enabled", newBrand.enabled)
  try {
    const response = await axiosInstance.put(`${brandsRoute}${id}/`, formData, {
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

export const GetAdminBrandById = async (id) => {
  try {
    const response = await axiosInstance.get(`${brandsRoute}${id}/`)

    return response
    // ...
  } catch (error) {
    // Handle the error
    return error
  }
}

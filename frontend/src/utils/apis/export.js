import { axiosPrivate } from "@/api/axios"
import qs from "qs"

export const getExportedCsv = async (
  // Search Key Object for params.
  searchKeyObject = {},

  // Items per page.
  itemsPerPage = 25,

  // Current page.
  page = 1,

  // Page route.
  url
) => {
  try {
    const response = await axiosPrivate.get(
      `${url}?page=${page}&page_size=${itemsPerPage}`,
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

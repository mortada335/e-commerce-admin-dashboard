import axiosInstance from "@/utils/axiosInstance";
import { DELETED_USERS_URL } from "@/utils/constants/urls";
import qs from "qs";

export const getExportedCsv = async (
  // Search key for params.
  searchKeyObject = {},

  // Number of items.
  itemsPerPage,

  // Current page.
  currentPage,

  page = DELETED_USERS_URL
) => {
  try {
    const response = await axiosInstance.get(
      `${page}?page=${currentPage}&page_size=${itemsPerPage}`,
      {
        params: { ...searchKeyObject, response_type: "csv" },
        paramsSerializer: (params) => qs.stringify(params, { encode: false }),
      }
    );

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

import axiosInstance from "@/utils/axiosInstance";
import { POINT_COUPONS_URL } from "@/utils/constants/urls";

import qs from "qs";

// Export orders list as CSV file.
export const getExportedCsv = async (
  // Search Key Object for params.
  searchKeyObject = {},

  // Number of items.
  itemsPerPage,

  // Current page.
  currentPage,

  // Page route.
  page = POINT_COUPONS_URL
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

    // Space Purposes.
  } catch (error) {
    // Erorr Handling.
    return error;
  }
};

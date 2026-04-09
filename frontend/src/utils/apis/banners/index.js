import axiosInstance from "@/utils/axiosInstance";
import { BANNER_URL } from "@/utils/constants/urls";

import qs from "qs";

// Export orders list as CSV file.
export const getExportedCsv = async (
  // Search Key Object for params.
  searchKeyObject = {},

  // Page route.
  page = BANNER_URL
) => {
  try {
    const response = await axiosInstance.get(page, {
      params: { ...searchKeyObject, response_type: "csv" },
      paramsSerializer: (params) => qs.stringify(params, { encode: false }),
    });

    return response;

    // Space Purposes.
  } catch (error) {
    // Erorr Handling.
    return error;
  }
};

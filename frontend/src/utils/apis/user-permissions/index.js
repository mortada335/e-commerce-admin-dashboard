import axiosInstance from "@/utils/axiosInstance";

import qs from "qs";

import { USERS_URL } from "@/utils/constants/urls";

export const getExportedCsv = async (
  searchKeyObject = {},
  page = USERS_URL
) => {
  try {
    const response = await axiosInstance.get(page, {
      params: { ...searchKeyObject, response_type: "csv" },
      paramsSerializer: (params) => qs.stringify(params, { encode: false }),
    });

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

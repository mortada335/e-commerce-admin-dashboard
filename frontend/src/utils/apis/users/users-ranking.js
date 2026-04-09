import axiosInstance from "@/utils/axiosInstance";
import qs from "qs";

const userRankingRoute = "user-ranks/";

export const FetchRanks = async (searchKeyObject = {}, page = userRankingRoute) => {
  try {
    const response = await axiosInstance.get(page, {
      params: { ...searchKeyObject },
      paramsSerializer: (params) => qs.stringify(params, { encode: false }),
    });

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const AddRankRequest = async (data) => {
  try {
    const response = await axiosInstance.post(userRankingRoute, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const DeleteRankRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(`${userRankingRoute}${id}/`);

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

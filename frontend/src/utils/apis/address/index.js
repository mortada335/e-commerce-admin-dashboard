import axiosInstance from "@/utils/axiosInstance";
const addressRoute = "address_admin/";
import qs from "qs";

export const FetchUserAddress = async (id) => {
  try {
    const response = await axiosInstance.get(addressRoute, {
      params: { user_id: id },
      paramsSerializer: (params) => qs.stringify(params, { encode: false }),
    });

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

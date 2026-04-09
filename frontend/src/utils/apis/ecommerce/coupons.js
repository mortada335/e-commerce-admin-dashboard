import axiosInstance from "@/utils/axiosInstance";
import qs from "qs";

const generalCouponsRoute = "admin_coupons/";

export const FetchAdminCoupons = async (searchKeyObject = {}, page = generalCouponsRoute) => {
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

export const PostAdminCoupon = async (data) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("code", data.code);
  formData.append("discount", data.discount);
  formData.append("type", data.type);
  formData.append("status", data.status);
  if (data.total_max) formData.append("total_max", data.total_max);
  if (data.for_customer_id) formData.append("for_customer_id", data.for_customer_id);
  if (data.uses_total) formData.append("uses_total", data.uses_total);
  if (data.uses_customer) formData.append("uses_customer", data.uses_customer);
  formData.append("date_start", data.date_start);
  formData.append("date_end", data.date_end);
  try {
    const response = await axiosInstance.post(generalCouponsRoute, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const DeleteAdminCoupon = async (id) => {
  try {
    const response = await axiosInstance.delete(`${generalCouponsRoute}${id}/`);

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const EditAdminCoupon = async (id, newCoupon) => {

  const formData = new FormData();
  formData.append("name", newCoupon.name);
  formData.append("code", newCoupon.code);
  formData.append("discount", newCoupon.discount);
  formData.append("status", newCoupon.status);
  if (newCoupon.total_max) formData.append("total_max", newCoupon.total_max);
  if (newCoupon.for_customer_id) formData.append("for_customer_id", newCoupon.newCoupon);
  if (newCoupon.uses_total) formData.append("uses_total", newCoupon.uses_total);
  if (newCoupon.uses_customer) formData.append("uses_customer", newCoupon.uses_customer);
  formData.append("date_start", newCoupon.date_start);
  formData.append("date_end", newCoupon.date_end);
  // added as come from Get methode because Ezz can not make it not required
  formData.append("type", newCoupon.type);
  try {
    const response = await axiosInstance.put(
      `${generalCouponsRoute}${id}/`,

      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const GetAdminCouponById = async (id) => {
  try {
    const response = await axiosInstance.get(`${generalCouponsRoute}${id}/`);

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

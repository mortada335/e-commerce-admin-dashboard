import { axiosPrivate } from "@/api/axios";
import axiosInstance from "@/utils/axiosInstance";

const pointsCouponsRoute = "points_coupons/";

export const FetchAdminPointsCoupons = async (user, page = pointsCouponsRoute) => {
  try {
    const response = await axiosInstance.get(page, {
      headers: {
        Authorization: `Token ${user.token}`,
      },
    });

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const PostAdminPointsCoupon = async (user, data) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("points_needed", data.points_needed);
  formData.append("discount", data.discount);
  if (data.days_to_expire_after_added)
    formData.append("days_to_expire_after_added", data.days_to_expire_after_added);
  try {
    const response = await axiosInstance.post(pointsCouponsRoute, formData, {
      headers: {
        Authorization: `Token ${user.token}`,
      },
    });

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const DeleteAdminPointsCoupon = async (user, id) => {
  try {
    const response = await axiosInstance.delete(`${pointsCouponsRoute}${id}/`, {
      headers: {
        Authorization: `Token ${user.token}`,
      },
    });

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const EditAdminPointsCoupon = async (user, id, newPointsCoupon) => {
  const formData = new FormData();
  formData.append("name", newPointsCoupon.name);
  formData.append("points_needed", newPointsCoupon.points_needed);
  formData.append("discount", newPointsCoupon.discount);
  formData.append("days_to_expire_after_added", newPointsCoupon.days_to_expire_after_added);
  try {
    const response = await axiosInstance.put(
      `${pointsCouponsRoute}${id}/`,

      formData,
      {
        headers: {
          Authorization: `Token ${user.token}`,
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

export const GetAdminPointsCouponById = async ( id) => {
  try {
    const response = await axiosPrivate.get(`${pointsCouponsRoute}${id}/`, );

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

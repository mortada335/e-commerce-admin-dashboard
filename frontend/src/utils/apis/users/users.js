import axiosInstance from "@/utils/axiosInstance";
import qs from "qs";

import { USERS_URL } from "@/utils/constants/urls";

const usersRoute = "users/";
const customersFilterRoute = "users/";
// const exportCsvRoute = "export-users-csv/";
const changePasswordRoute = "change-password/";
const customerMembershipRoute = "customer-memberships/";
const changeUserStatusRoute = "change-user-status/";
const referralCodesRoute = "referral_codes/";

export const fetchAdminUsers = async (
  searchKeyObject = {},
  page = usersRoute
) => {
  try {
    const response = await axiosInstance.get(page, {
      params: { is_superuser: 1, ...searchKeyObject },
      paramsSerializer: (params) => qs.stringify(params, { encode: false }),
    });

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const AddUser = async (data) => {
  try {
    const response = await axiosInstance.post(usersRoute, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const fetchCustomersUsers = async (
  searchKeyObject = {},
  page = customersFilterRoute
) => {
  try {
    const response = await axiosInstance.get(page, {
      params: searchKeyObject,
      paramsSerializer: (params) => qs.stringify(params, { encode: false }),
    });

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const fetchAdminUsersDetails = async (id) => {
  try {
    const response = await axiosInstance.get(`${usersRoute}${id}/`);

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const getExportedCsv = async (
  // Search key for params.
  searchKeyObject = {},

  // Number of items.
  itemsPerPage,

  // Current page.
  currentPage,

  page = USERS_URL
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

export const ChangePasswordRequest = async (data) => {
  const formData = new FormData();
  formData.append("user_id", data.user_id);
  formData.append("new_password", data.new_password);

  try {
    const response = await axiosInstance.post(changePasswordRoute, formData, {
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

export const EditCustomerRequest = async (id, editData) => {
  try {
    const response = await axiosInstance.put(`${usersRoute}${id}/`, {
      first_name: editData.first_name,
      last_name: editData.last_name,
      username: editData.username,
      // is_active: editData.is_active,
    });

    return response;
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const EditCustomerStatusRequest = async (id, newIsActiveValue) => {
  try {
    const response = await axiosInstance.post(`${changeUserStatusRoute}/`, {
      user_id: id,
      is_active: newIsActiveValue,
    });

    return response;
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const EditCustomerMarketerCode = async (id, new_code) => {
  try {
    const response = await axiosInstance.put(`${referralCodesRoute}${id}/`, {
      code: new_code,
    });

    return response;
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const fetchCustomersMembership = async (
  searchKeyObject = {},
  page = customerMembershipRoute
) => {
  try {
    const response = await axiosInstance.get(page, {
      params: searchKeyObject,
      paramsSerializer: (params) => qs.stringify(params, { encode: false }),
    });

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const EditCustomersMembershipCurrentRewardPoints = async (
  customerMembershipId,
  customerId,
  newPointsValue
) => {
  try {
    const response = await axiosInstance.patch(
      `${customerMembershipRoute}${customerMembershipId}/`,
      {
        customer_id: customerId,
        current_reward_points: newPointsValue,
      }
    );

    return response;
  } catch (error) {
    // Handle the error
    return error;
  }
};

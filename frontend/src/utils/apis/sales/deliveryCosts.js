import axiosInstance from "@/utils/axiosInstance";

const deliveryCostsRoute = "delivery_costs/";

export const FetchDeliveryCosts = async (user, page = deliveryCostsRoute) => {
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

export const UpdateAdminDeliveryCost = async (user, id, data) => {
  const formData = new FormData();
  formData.append("zone", data.zone);
  formData.append("cost", data.cost);

  data.special_cost && formData.append("special_cost", data.special_cost);
  data.special_cost_total_order &&
    formData.append("special_cost_total_order", data.special_cost_total_order);
  data.date_start && formData.append("date_start", data.date_start);
  data.date_end && formData.append("date_end", data.date_end);
  try {
    const response = await axiosInstance.put(`${deliveryCostsRoute}${id}/`, formData, {
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

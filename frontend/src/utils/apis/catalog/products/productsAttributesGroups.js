import axiosInstance from "@/utils/axiosInstance";

const productsAttributesGroupsRoute = "product_attributes_group/";

export const FetchAdminProductsAttributesGroups = async (page = productsAttributesGroupsRoute) => {
  try {
    const response = await axiosInstance.get(page);

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const PostAdminProductsAttributesGroup = async (data) => {
  const formData = new FormData();

  formData.append("attributes", JSON.stringify(data));

  try {
    const response = await axiosInstance.post(productsAttributesGroupsRoute, formData, {
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

export const DeleteAdminProductsAttributesGroup = async (user, id) => {
  try {
    const response = await axiosInstance.delete(`${productsAttributesGroupsRoute}${id}/`, {
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

export const GetAdminAttributesGroupById = async (user, id) => {
  try {
    const response = await axiosInstance.get(`${productsAttributesGroupsRoute}?group_id=${id}`, {
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

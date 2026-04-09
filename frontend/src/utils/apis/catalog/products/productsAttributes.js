import axiosInstance from "@/utils/axiosInstance";
import qs from "qs";

const attributesRoute = "admin-attributes/";
const productAttributesRoute = "admin-product-attributes/";

export const FetchAdminAttributes = async (searchKeyObject = {}, page = attributesRoute) => {
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

export const PostAdminAttributes = async (data) => {
  try {
    const response = await axiosInstance.post(attributesRoute, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
    // ...
  } catch (error) {
    return error;
  }
};

export const DeleteAdminAttributes = async (id) => {
  try {
    const response = await axiosInstance.delete(`${attributesRoute}${id}/`);

    return response;
    // ...
  } catch (error) {
    return error;
  }
};

export const AddProductAttribute = async (data, page = productAttributesRoute) => {
  const formData = new FormData();
  formData.append("product_id", data.productId);
  formData.append("attribute_id", data.attributeId);
  formData.append("text", data.text);
  formData.append("language_id", data.language_id);

  try {
    const response = await axiosInstance.post(page, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
    // ...
  } catch (error) {
    return error;
  }
};

export const AddProductAttributes = async (dataArray, page = productAttributesRoute) => {
  try {
    const response = await axiosInstance.post(page, dataArray, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (error) {
    return error;
  }
};

import axiosInstance from "@/utils/axiosInstance";
const categoriesRoute = "categories_admin/";
import qs from "qs";
import { giveMeDefaultFile } from "@/utils/methods";

// Just for fetching the main (parents) categories

// export const FetchAdminCategories = async (page = categoriesRoute) => {
//   try {
//     const response = await axiosInstance.get(page);

//     return response;
//     // ...
//   } catch (error) {
//     // Handle the error
//     return error;
//   }
// };

export const FetchAdminCategories = async (searchKeyObject = {}, page = categoriesRoute) => {
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

export const PostAdminCategory = async (data) => {
  const formData = new FormData();
  if (data.image instanceof File) formData.append("image", data.image);
  else {
    const defaultImageFile = await giveMeDefaultFile();
    formData.append("image", defaultImageFile);
  }
  formData.append("parent_id", data.parent_id);
  formData.append("category_transparency", data.category_transparency);
  formData.append("category_color", data.category_color);
  formData.append("description", JSON.stringify(data.description));
  formData.append("sort_order", Number(data.sort_order));
  formData.append("status", Number(data.status));
  try {
    const response = await axiosInstance.post(categoriesRoute, formData, {
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

export const FetchAdminCategoryById = async (id) => {
  try {
    const response = await axiosInstance.get(`${categoriesRoute}${id}/`);

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const FetchSubCategories = async (parentCategoryId) => {
  try {
    const response = await axiosInstance.get(`${categoriesRoute}?parent_id=${parentCategoryId}`);

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const EditAdminCategory = async (categoryId, newCategory) => {
  const formData = new FormData();
  if (newCategory?.image instanceof File) formData.append("image", newCategory.image);
  formData.append("parent_id", newCategory.parent_id);
  formData.append("category_transparency", newCategory.category_transparency);
  formData.append("category_color", newCategory.category_color);
  formData.append("description", JSON.stringify(newCategory.description));
  formData.append("sort_order", Number(newCategory.sort_order));
  formData.append("status", Number(newCategory.status));
  try {
    const response = await axiosInstance.put(`${categoriesRoute}${categoryId}/`, formData, {
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

export const DeleteAdminCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`${categoriesRoute}${id}/`);

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

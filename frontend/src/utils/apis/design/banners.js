import axiosInstance from "@/utils/axiosInstance";
const bannersRoute = "banner_admin/";

export const FetchAdminBanners = async (page = bannersRoute) => {
  try {
    const response = await axiosInstance.get(page);

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const PostAdminBanner = async (data) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("sort_order", data.sort_order);
  formData.append("image", data.image);
  formData.append("language_id", data.language_id);
  formData.append("banner_type", data.banner_type);
  formData.append("banner_type_id", data.banner_type_id);

  try {
    const response = await axiosInstance.post(bannersRoute, formData, {
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

export const DeleteAdminBanner = async (id) => {
  try {
    const response = await axiosInstance.delete(`${bannersRoute}${id}/`);

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const GetAdminBannerById = async (id) => {
  try {
    const response = await axiosInstance.get(`${bannersRoute}${id}/`);

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const EditAdminBanner = async (id, newBanner) => {
  const formData = new FormData();
  formData.append("title", newBanner.title);
  formData.append("sort_order", newBanner.sort_order);
  if (newBanner.image instanceof File) formData.append("image", newBanner.image);
  formData.append("language_id", newBanner.language_id);
  formData.append("banner_type", newBanner.banner_type);
  formData.append("banner_type_id", newBanner.banner_type_id);
  try {
    const response = await axiosInstance.put(
      `${bannersRoute}${id}/`,

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

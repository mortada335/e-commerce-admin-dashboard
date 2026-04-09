import axiosInstance from "@/utils/axiosInstance";
const notesRoute = "notes_admin/";

export const FetchAdminNotes = async (page = notesRoute) => {
  try {
    const response = await axiosInstance.get(page);

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const PostAdminNotes = async (data) => {
  const formData = new FormData();
  formData.append("important_notes_icon", data.icon);
  formData.append("important_notes_title", data.title);
  formData.append("important_notes_type", data.type);
  formData.append("language_id", data.language_id);
  formData.append("important_notes_status", data.status);
  formData.append("important_notes_bkcolor", data.bgColor);
  formData.append("important_notes_title_color", data.color);
  formData.append("category_id", data.category_id);
  formData.append("category_name", data.category_name);

  try {
    const response = await axiosInstance.post(notesRoute, formData, {
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

export const EditAdminNotes = async (id, data) => {
  const formData = new FormData();
  formData.append("important_notes_icon", data.icon);
  formData.append("important_notes_title", data.title);
  formData.append("important_notes_type", data.type);
  formData.append("language_id", data.language_id);
  formData.append("important_notes_status", data.status);
  formData.append("important_notes_bkcolor", data.bgColor);
  formData.append("important_notes_title_color", data.color);
  formData.append("category_id", data.category_id);
  formData.append("category_name", data.category_name);

  try {
    const response = await axiosInstance.put(`${notesRoute}${id}/`, formData, {
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

export const DeleteAdminNote = async (id) => {
  try {
    const response = await axiosInstance.delete(`${notesRoute}${id}/`);

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const GetAdminNoteById = async (id) => {
  try {
    const response = await axiosInstance.get(`${notesRoute}${id}/`);

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

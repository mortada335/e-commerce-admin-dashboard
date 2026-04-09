import axiosInstance from "@/utils/axiosInstance";
import qs from "qs";

const notificationRoute = "firebase_notifications/";
const sendNotifictaionToAllRoute = "send-notification-to-all/";

export const FetchNotifications = async (page = notificationRoute) => {
  try {
    const response = await axiosInstance.get(page);

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

export const SendNotificationRequest = async (dataForsend, page = sendNotifictaionToAllRoute) => {
  const formData = new FormData();
  formData.append("title", dataForsend.title);
  formData.append("body", dataForsend.body);
  if (dataForsend.productId) formData.append("product_id", dataForsend.productId);
  
  if (dataForsend.categoryId) formData.append("category_id", dataForsend.categoryId);
  try {
    const response = await axiosInstance.post(page, formData, {
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

import axiosInstance from "@/utils/axiosInstance";

const DashboardStatisticsRoute = "dashboard_statistics/";

export const fetchDashboardStatistics = async (page = DashboardStatisticsRoute) => {
  try {
    const response = await axiosInstance.get(page);

    return response;
    // ...
  } catch (error) {
    // Handle the error
    return error;
  }
};

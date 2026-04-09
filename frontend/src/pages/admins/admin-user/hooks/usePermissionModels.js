// import { axiosPrivate } from "@/api/axios";
// import { MODELS_PERMISSIONS } from "@/utils/constants/urls";
// import { useQuery } from "@tanstack/react-query";

// const fetchUserModels = async () => {
//   const { data } = await axiosPrivate.get(MODELS_PERMISSIONS);
//   return data;
// };

// export const useModels = () => {
//   return useQuery({
//     queryKey: ["Models"],
//     queryFn: () => fetchUserModels(),
//   });
// };

// PAST EDIT

// import { axiosPrivate } from "@/api/axios";
// import { MODELS_PERMISSIONS } from "@/utils/constants/urls";
// import { useQuery } from "@tanstack/react-query";

// const fetchUserModels = async (page, itemPerPage, searchValue) => {
//   const params = {
//     page,
//     // page_size: itemPerPage,
//   };

//   if (searchValue) params.search = searchValue;

//   const { data } = await axiosPrivate.get(MODELS_PERMISSIONS, { params });
//   return data;
// };

// export const useModels = (page,  searchValue) => {
//   return useQuery({
//     queryKey: ["Models", page,  searchValue],
//     queryFn: () => fetchUserModels(page, searchValue),
//     keepPreviousData: true,
//   });
// };

import { axiosPrivate } from "@/api/axios";
import { MODELS_PERMISSIONS } from "@/utils/constants/urls";
import { useQuery } from "@tanstack/react-query";

/**
 * Fetch user models with pagination and search (based on Swagger schema)
 * Swagger parameters: page, page_size, search, ordering, enabled
 */
const fetchUserModels = async ({ page = 1, pageSize = 10, search = "", ordering, enabled }) => {
  const params = {
    page,
    page_size: pageSize,
  };

  if (search) params.search = search;
  if (ordering) params.ordering = ordering;
  if (enabled !== undefined) params.enabled = enabled;

  const { data } = await axiosPrivate.get(MODELS_PERMISSIONS, { params });
  return data;
};

/**
 * useModels React Query hook
 */
export const useModels = ({ page = 1, pageSize = 10, search = "", ordering, enabled } = {}) => {
  return useQuery({
    queryKey: ["Models", page, pageSize, search, ordering, enabled],
    queryFn: () => fetchUserModels({ page, pageSize, search, ordering, enabled }),
    keepPreviousData: true,
  });
};

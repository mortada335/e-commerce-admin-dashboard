import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosPrivate } from "@/api/axios"
import { useToast } from "@/components/ui/use-toast";
import { handleError } from "@/utils/methods";


export default function useDelete ({ queryKey, ...options })  {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  // Function to perform a delete request to the specified endpoint with the given body
  const deleteEndpoint = async (endpoint, body, id, headers) => {
    return axiosPrivate.delete(`${endpoint}/${id}`, { headers,data:body, });
  };

  // Function to handle successful mutation
  const handleSuccess = () => {

    toast({
      title: "Success!!!",
      description: "Delete successfully",
    })
  };




  return useMutation({
    ...options, // Spread any additional options passed to the mutation
    mutationFn: ({ endpoint, body, id, headers }) =>
      options.mutationFn // If a custom mutation function is provided, use it
        ? options.mutationFn()
        : deleteEndpoint(endpoint, body, id, headers), // Otherwise, use the default deleteEndpoint function
    onError: (...params) =>
      options.onError // If a custom onError handler is provided, use it
        ? options.onError(...params)
        : handleError(...params), // Otherwise, use the default handleError function
    onSuccess: (...params) =>
      options.onSuccess // If a custom onSuccess handler is provided, use it
        ? (async function (...params) {
            options.onSuccess(...params); // Call the default handleSuccess function
            handleSuccess(...params); // Call the default handleSuccess function
            await queryClient.invalidateQueries({ queryKey: [queryKey] }); // Invalidate queries to refresh data
          })(...params)
        : (async function (...params) {
            handleSuccess(...params); // Call the default handleSuccess function
            await queryClient.invalidateQueries({ queryKey: [queryKey] }); // Invalidate queries to refresh data
          })(...params),
  });
}



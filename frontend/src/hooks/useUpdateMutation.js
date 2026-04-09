import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosPrivate } from "@/api/axios"
import { useToast } from "@/components/ui/use-toast"
const useQueryMutation = (name) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: async ({ url, id, headers, onFinish, ...props }) => {
      try {
        const response = await axiosPrivate.patch(
          `${url}${id}/`,

          props.formData,
          {
            headers: headers,
          }
        )

        if (response.status === 200 || response.status === 201) {
          toast({
            title: "Success",
            description: "Updated successfully",
          })
          queryClient.invalidateQueries({ queryKey: [name] })
          onFinish()
        }

        return response
      } catch (error) {
        // Handle the error

        if (error?.response?.status && error?.response?.status !== 500) {
          toast({
            variant: "destructive",
            title: "Failed!!!",
            description: error.response?.data?.error,
          })
        } else if (error.code === "ERR_NETWORK") {
          toast({
            variant: "destructive",
            title: "Failed!!!",
            description: "Network error, please try again",
          })
        } else {
          toast({
            variant: "destructive",
            title: "Failed!!!",
            description: "An unknown error occurred. Please try again later",
          })
        }
        return error
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
    },
  })
}

export default useQueryMutation

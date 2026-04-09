import { useMutation, useQueryClient } from "@tanstack/react-query"
import { axiosPrivate } from "@/api/axios"
import { useToast } from "@/components/ui/use-toast"
import { handleError } from "@/utils/methods"

const useQueryMutation = (name) => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: async ({
      url,
      id = "",
      headers,
      isAddProduct = false,
      setRes = () => {},
      onFinish,
      ...props
    }) => {
      try {
        if (!!id && id !== null && id !== undefined) {
          const response = await axiosPrivate.put(
            `${url}${id}/`,

            props.formData,

            {
              headers: headers,
            }
          )

          if (response.status === 201 || response.status === 200) {
            queryClient.invalidateQueries({ queryKey: [name] })
            toast({
              title: "Success",
              description: "Updated successfully",
            })
            onFinish(response.data)
          }

          return response
        } else {
          const response = await axiosPrivate.post(
            `${url}`,

            props.formData,

            {
              headers: headers,
            }
          )

          if (response.status === 201 || response.status === 200) {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: [name] })
            toast({
              title: "Success",
              description: "Saved successfully",
            })

            if (isAddProduct) {
              setRes(response)
              // navigate(
              //   `/catalog/products/details/${response?.data?.product_id}`
              // )
              // toast({
              //   title: "Success",
              //   description:
              //     "Now you can add Images and attributes to this product",
              // })
            }
            onFinish()
          }

          return response
        }
      } catch (error) {
        // Handle the error
        handleError(error)
        return error
      }
    },

    onSuccess: () => {
      // Invalidate and refetch
      // queryClient.invalidateQueries({ queryKey: [name] })
    },
  })
}

export default useQueryMutation

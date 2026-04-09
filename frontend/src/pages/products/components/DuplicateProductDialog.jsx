import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { setIsDuplicateProductDialog, useProductStore } from "../store"
import useMutation from "@/hooks/useMutation"
import { AddProductAttributes } from "@/utils/apis/catalog/products/productsAttributes"
import { PostAdminProduct } from "@/utils/apis/catalog/products/products"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { PRODUCTS_URL } from "@/utils/constants/urls"

function DuplicateProductDialog() {
  const { isDuplicateProductDialog, selectedProduct } = useProductStore()

  const { toast } = useToast()
  const onClose = () => {
    setIsDuplicateProductDialog(false)
  }

  const {
    mutate,

    isPending: isAction,
  } = useMutation("Products")
  const queryClient = useQueryClient()

  const handleDuplicate = async () => {
    const {
      // eslint-disable-next-line no-unused-vars
      product_id,
      description,
      manufacturer_id,
      model,
      price,
      discounted_price,
      available_quantity,
      weight,
      width,
      height,
      length,
      status,
      categories,
      product_attributes,
      discount_start_date,
      discount_expiry_date,
      points,
    } = selectedProduct.productData

    const formData = {
      model,
      available_quantity,
      price,
      discounted_price,
      discount_start_date,
      discount_expiry_date,
      points,
      weight,
      length,
      width,
      height,
      status,
      categories: categories.map((category) => category.category_id),
      manufacturer_id,
      product_attributes,
      description: [
        {
          name: description?.[0]?.name,
          description: description?.[0]?.description,
          language_id: 1,
        },
        {
          name: description?.[1]?.name,
          description: description?.[1]?.description,
          language_id: 2,
        },
      ],
    }

    mutate({
      url: PRODUCTS_URL,

      headers: {
        "Content-Type": "multipart/form-data",
      },
      onFinish: onClose,
      formData,
    })

    // const result = await PostAdminProduct(formData)

    // if (result.status === 201) {
    //   const reformedAttributes = product_attributes.map(
    //     (attributeWithGroup) => ({
    //       text: attributeWithGroup?.attributes_data?.value,
    //       product_id: result?.data?.product_id,
    //       attribute_id: attributeWithGroup?.attribute_id,
    //       language_id: 1,
    //     })
    //   )

    //   const addAttributesResult = await AddProductAttributes(reformedAttributes)

    //   if (addAttributesResult?.status === 201) {
    //     queryClient.invalidateQueries({ queryKey: ["Products"] })
    //     onClose()
    //     toast({
    //       title: "Success!!!",
    //       description: "Product Duplicated  successfully",
    //     })
    //   }
    //   setIsAction(false)
    // } else {
    //   toast({
    //     variant: "destructive",
    //     title: "Failed!!!",
    //     description: "Something went wrong",
    //   })
    //   setIsAction(false)
    // }
  }

  return (
    <Dialog
      open={isDuplicateProductDialog}
      onOpenChange={setIsDuplicateProductDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent className="max-w-[350px] sm:max-w-[500px] md:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>{`This action will duplicate ${selectedProduct?.model}.`}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="destructive" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isAction} onClick={handleDuplicate} type="button">
            {isAction ? (
              <p className="flex justify-center items-center space-x-2">
                <Loader2 className=" h-5 w-5 animate-spin" />
                <span>Please wait</span>
              </p>
            ) : (
              <span>Continue</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DuplicateProductDialog

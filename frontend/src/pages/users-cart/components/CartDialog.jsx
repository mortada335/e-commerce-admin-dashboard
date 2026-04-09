import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"

import {  USERS_CART_URL } from "@/utils/constants/urls"
import useMutation from "@/hooks/useUpdateMutation"

import { ScrollArea } from "@/components/ui/scroll-area"


import { cartSchema } from "@/utils/validation/user"
import { setIsCartDialogOpen,  } from "../store"

import { UsersCartStore } from "@/pages/users-cart/store"
import ProductAutocomplete from "@/components/ProductAutocomplete"
import { Label } from "@/components/ui/label"
import { useTranslation } from "react-i18next"

const defaultFormFields = {
  option: "",
  quantity: 0,

}

export default function CartDialog() {
  const { isCartDialogOpen, selectedCart } = UsersCartStore()
  const { toast } = useToast()
  const [formFields, setFormFields] = useState(defaultFormFields)
  const [selectedProduct, setSelectedProduct] = useState({ filter_name: "", filter_id: "" });
  const {t} = useTranslation()

  const form = useForm({
    resolver: yupResolver(cartSchema),
    defaultValues: defaultFormFields,
  })
  const [isSubmit, setIsSubmit] = useState(false)

  const {
    mutate,

    isPending: isAction,
  } = useMutation("UsersCart")

  useEffect(() => {
    if (formFields.quantity>0 && selectedProduct.filter_id) {
      setIsSubmit(true)
    } else {
      setIsSubmit(false)
    }
  }, [formFields])

  useEffect(() => {
    if (
      selectedCart !== null &&
      selectedCart !== undefined &&
      isCartDialogOpen
    ) {
      setFormFields({
        option: selectedCart.option,
        quantity: selectedCart.quantity,
        
      })
      setSelectedProduct(
        {
          filter_name: selectedCart?.model, filter_id:selectedCart?.product_id
        }
      )
      form.setValue("option", selectedCart.option)
      form.setValue("quantity", selectedCart.quantity)
    
    } else {
      // this is server error or other erro that could happen
      setFormFields(defaultFormFields)
    }
  }, [selectedCart])



  const onClose = () => {
    setIsCartDialogOpen(false)
    form.reset()

    setFormFields(defaultFormFields)
  }

  const onSubmit = async () => {
    // Validate currency Change
    if (!formFields.quantity > 0 || !selectedProduct.filter_id) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      })
    }

    const formData = new FormData()
    formData.append("option", formFields.option)
    formData.append("quantity", formFields.quantity)
    formData.append("product_id", selectedProduct?.filter_id)
    

    mutate({
      url: USERS_CART_URL,
      id: selectedCart?.id,
      headers: {
        "Content-Type": "application/json",
      },
      onFinish: onClose,
      formData,
    })
  }

  return (
    <Dialog open={isCartDialogOpen} onOpenChange={setIsCartDialogOpen}>
      <DialogContent className="sm:max-w-[700px]">
        <ScrollArea className=" h-[400px] pr-4 w-full ">
          <DialogHeader className="rtl:items-end">
            <DialogTitle>
              {t("Update Cart")}
            </DialogTitle>
            <DialogDescription>
              {t("Make changes to user cart here. Click save when you are done.")}
            </DialogDescription>
          </DialogHeader>

          <Form {...form} className="h-full bg-black">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 pt-2">
            <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="w-full px-1">
                    <FormLabel><span className="text-red-500 text-xl">*</span>{t("Quantity")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t("Enter Quantity")}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value)
                          setFormFields({
                            ...formFields,
                            quantity: e.target.value,
                          })
                        }}
                        autoComplete="quantity"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="option"
                render={({ field }) => (
                  <FormItem className="w-full px-1 pt-0">
                    <FormLabel>
                      {" "}
                      {t("Option")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("Cart option")}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value)

                          setFormFields({
                            ...formFields,
                            option: e.target.value,
                          })
                        }}
                        autoComplete="option"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
      <div className="flex flex-col justify-start items-start gap-2 w-full py-1 px-1">
      <Label>
                  
                      <span className="text-red-500 text-xl">*</span> {t("Product")}
                    </Label>
                <ProductAutocomplete
                  formFields={selectedProduct}
                  setFormFields={(val)=>{
                    setSelectedProduct(val) 
                    }}
                    productId={selectedProduct?.filter_id}
                  isFetchProduct={selectedProduct?.filter_id?true:false}
                />
                </div>



              <div className="flex justify-end items-center w-full py-2 gap-4">
                <Button variant="secondary" onClick={onClose}>
                  {t("Cancel")}
                </Button>
                <Button disabled={!isSubmit || isAction} type="submit">
                  {isAction ? (
                    <p className="flex justify-center items-center gap-2">
                      <Loader2 className=" h-5 w-5 animate-spin" />
                      <span>{t("Please wait")}</span>
                    </p>
                  ) : (
                    <span>{t("Save")}</span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

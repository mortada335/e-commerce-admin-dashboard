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
import { imageSchema } from "@/utils/validation/product"

import { PRODUCT_IMAGE_URL } from "@/utils/constants/urls"
import useUpdateMutation from "@/hooks/useUpdateMutation";
import { ScrollArea } from "@/components/ui/scroll-area"

import { isNumber } from "@/utils/methods"
import Can from "@/components/Can"
import { setIsEditImageDialogOpen, useProductStore } from "../../store"
import { useTranslation } from "react-i18next"

const defaultFormFields = {

  sort_order: 0,
}

export default function EditImageDialog() {
  const { toast } = useToast()
  const {t} = useTranslation()
  const [formFields, setFormFields] = useState(defaultFormFields)
  const { currentSelectedImage,isEditImageDialogOpen } = useProductStore();
  const form = useForm({
    resolver: yupResolver(imageSchema),
    defaultValues: defaultFormFields,
  })
  const [isSubmit, setIsSubmit] = useState(false)

  const {
    mutate,

    isPending: isAction,
  } = useUpdateMutation("Product")


  useEffect(() => {
  
    
    if (currentSelectedImage !== null && currentSelectedImage !== undefined && isEditImageDialogOpen) {
   
      form.setValue("sort_order", currentSelectedImage.sort_order || 0)
     

      setFormFields({

        sort_order: currentSelectedImage.sort_order || 0,

      })
    } else {
      // this is server error or other erro that could happen
      setFormFields(defaultFormFields)
      form.reset()

    }
  }, [currentSelectedImage])



    useEffect(() => {
      if (
        formFields.sort_order &&  formFields.sort_order >= 0 && isNumber(formFields.sort_order) 
      ) {
        setIsSubmit(true)
      } else {
        setIsSubmit(false)
      }
    }, [formFields])
  

  const onClose = () => {
    setIsEditImageDialogOpen(false)
    form.reset()

    setFormFields(defaultFormFields)
  }

  const onSubmit = async () => {
    // Validate currency Change
    if (

      !formFields.sort_order
    ) {
      toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      })
    }


    const formData = {

      sort_order: formFields.sort_order,
     
    }

    mutate({
      url: PRODUCT_IMAGE_URL,
      id: currentSelectedImage?.product_image_id,
      headers: {
        "Content-Type": "application/json",
      },
      onFinish: onClose,
      formData,
    })
  }

  return (
    <Can permissions={["app_api.change_ocoptionvalue"]}>

    <Dialog open={isEditImageDialogOpen} onOpenChange={setIsEditImageDialogOpen}>
      <DialogContent className="sm:max-w-[700px]">
        <ScrollArea className="h-[200px] pr-4 w-full ">
          <DialogHeader>
            <DialogTitle>{t("Update Product Image")}</DialogTitle>
            <DialogDescription>
              {t("Make changes to your Image here. Click save when you are done.")}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 ">
   

                                <FormField
                                  control={form.control}
                                  name="sort_order"
                                  render={({ field }) => (
                                    <FormItem className="w-full px-1">
                                      <FormLabel>
                                        {" "}
                                        <span className="text-red-500 text-xl">*</span>
                                        {t("Sort Order")}
                                      </FormLabel>
                                      <FormControl>
                                        <Input
                                          type="text"
                                          placeholder={t("Sort Order")}
                                          className={!isNumber(formFields?.sort_order)&&'!ring-red-500'}
                                          value={field.value}
                                          onChange={(e) => {
                                            field.onChange(e.target.value);
                                            setFormFields({
                                              ...formFields,
                                              sort_order: e.target.value,
                                            });
                                          }}
                                          autoComplete="sort_order"
                                        />
                                      </FormControl>
              
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

              <div className="flex justify-end items-center w-full py-2 gap-3 space-x-4">
                <Button variant="secondary" onClick={onClose}>
                  {t("Cancel")}
                </Button>
                <Button disabled={!isSubmit || isAction} type="submit">
                  {isAction ? (
                    <p className="flex justify-center items-center space-x-2">
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
    </Can>
  )
}

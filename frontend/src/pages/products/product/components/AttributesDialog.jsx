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

import useMutation from "@/hooks/useMutation"

import { useEffect, useState } from "react"

import { setIsAttributesDialog, useProductStore } from "../../store"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import AttributesList from "../../components/AttributesList"
import { PRODUCT_ATTRIBUTES_URL } from "@/utils/constants/urls"
import { useTranslation } from "react-i18next"

function AttributesDialog({ product }) {
  const { toast } = useToast()
  const {t} = useTranslation()
  const { isAttributesDialog } = useProductStore()
  const [attributesFormFields, setAttributesFormFields] = useState([
    {
      productId: "",
      attributeId: "",
      attributeName: "",
      englishText: "",
      arabicText: "",
      
    },
  ])

  const {
    mutate,

    isPending: isAction,
  } = useMutation("Product")

  const onClose = () => {
    setIsAttributesDialog(false)
    setAttributesFormFields([
      {
        productId: "",
        attributeId: "",
        attributeName: "",
        englishText: "",
        arabicText: "",
        
      },
    ])
  }




  const onSave = async () => {
    const validAttributes = attributesFormFields.filter(
      (attribute) => attribute.englishText &&attribute.arabicText && attribute.attributeId
    )
    if (!validAttributes.length) {
       return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      })
    }

    // const formData = attributesFormFields.map((attribute) => ({
    //   text: attribute.text,
    //   product_id: product?.data?.product_id,
    //   attribute_id: attribute.attributeId,
    //   language_id: 1,
    // }))


    const formData = validAttributes.flatMap((attribute) => [
      {
        text: attribute.englishText,
        product_id: product?.data?.product_id,
        attribute_id: attribute.attributeId,
        language_id: 1,
      },
      {
        text: attribute.arabicText,
        product_id: product?.data?.product_id,
        attribute_id: attribute.attributeId,
        language_id: 2,
      },
    ]);

   
    mutate({
      url: PRODUCT_ATTRIBUTES_URL,

      headers: {
        "Content-Type": "application/json",
      },
      onFinish: onClose,
      formData,
    })
  }

  return (
    <Dialog
      open={isAttributesDialog}
      onOpenChange={setIsAttributesDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent className="max-w-[375px] sm:max-w-[500px] md:max-w-[800px]  flex flex-col justify-between items-start pt-10">
        <DialogHeader>
          <DialogTitle>{t("Add Attributes")}</DialogTitle>
         
        </DialogHeader>
        <ScrollArea className=" border rounded-md h-[300px] px-4 w-full flex flex-col justify-start items-center space-y-4 pb-6">
          <AttributesList
            setAttributes={setAttributesFormFields}
            attributes={
              attributesFormFields?.length ? attributesFormFields : []
            }
          />
        </ScrollArea>

        <DialogFooter className={"w-full gap-3 rtl:flex-row-reverse"}>
          <Button variant="destructive" onClick={onClose}>
            {t("Cancel")}
          </Button>
          <Button
            disabled={!attributesFormFields.length || isAction}
            onClick={onSave}
            type="button"
          >
            {isAction ? (
              <p className="flex justify-center items-center space-x-2">
                <Loader2 className=" h-5 w-5 animate-spin" />
                <span>{t("Please wait")}</span>
              </p>
            ) : (
              <span>{t("Save")}</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AttributesDialog

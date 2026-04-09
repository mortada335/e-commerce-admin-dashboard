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

import { ATTRIBUTES_URL } from "@/utils/constants/urls"
import useMutation from "@/hooks/useMutation"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { setIsAttributeDialogOpen, useAttributeStore } from "../store"
import { attributesSchema } from "@/utils/validation/attributes"
import AttributesGroupAutocomplete from "@/components/AttributesGroupAutocomplete"
import CanSection from "@/components/CanSection"
import { useTranslation } from "react-i18next"

const defaultFormFields = {
  nameEn: "",
  nameAr: "",
  attributeGroupId: "",
}

export default function AttributeDialog() {
  const { isAttributeDialogOpen, selectedAttribute } = useAttributeStore()
  const { toast } = useToast()
  const [formFields, setFormFields] = useState(defaultFormFields)
  const {t} = useTranslation()

  const form = useForm({
    resolver: yupResolver(attributesSchema),
    defaultValues: defaultFormFields,
  })
  const [isSubmit, setIsSubmit] = useState(false)

  const {
    mutate,

    isPending: isAction,
  } = useMutation("Attributes")

  useEffect(() => {
    if (formFields.nameEn && formFields.nameAr && formFields.attributeGroupId) {
      setIsSubmit(true)
    } else {
      setIsSubmit(false)
    }
  }, [formFields])

  useEffect(() => {
    if (
      selectedAttribute !== null &&
      selectedAttribute !== undefined &&
      isAttributeDialogOpen
    ) {
      setFormFields({
        nameEn: selectedAttribute.nameEnglish,
        nameAr: selectedAttribute.nameArabic,
        attributeGroupId: selectedAttribute.attribute_group_id,
      })

      form.setValue("nameEn", selectedAttribute.nameEnglish)

      form.setValue("nameAr", selectedAttribute.nameArabic)
    } else {
      // this is server error or other error that could happen
      setFormFields(defaultFormFields)
      form.reset()
    }
  }, [selectedAttribute])

  const onClose = () => {
    setIsAttributeDialogOpen(false)
    form.reset()

    setFormFields(defaultFormFields)
  }

  const onSubmit = async () => {
    // Validate currency Change
    if (
      !formFields.nameEn ||
      !formFields.nameAr ||
      !formFields.attributeGroupId
    ) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      })
    }
    const formData = new FormData()

    let sendingData = {}
    if (selectedAttribute?.id !== null && selectedAttribute?.id !== undefined) {
      const attributes = [
        {
          language_id: 1,
          name: formFields.nameEn,
          attribute_id: selectedAttribute.id,
        },
        {
          language_id: 2,
          name: formFields.nameAr,
          attribute_id: selectedAttribute.id,
        },
      ]
      const attribute_group_id = Number(formFields.attributeGroupId)
      formData.append("attributes", JSON.stringify(attributes))
      formData.append("attribute_group_id", JSON.stringify(attribute_group_id))
    } else {
      sendingData = {
        attributes: [
          { language_id: 1, name: formFields.nameEn },
          { language_id: 2, name: formFields.nameAr },
        ],
        attribute_group_id: Number(formFields.attributeGroupId),
      }
    }

    mutate({
      url: ATTRIBUTES_URL,
      id: selectedAttribute?.id,
      headers: {
        "Content-Type": "application/json",
      },
      onFinish: onClose,
      formData:
        selectedAttribute?.id === null || selectedAttribute?.id === undefined
          ? sendingData
          : formData,
    })
  }

  return (
    <CanSection permissions={[ "app_api.view_ocattribute"]}>

    <Dialog
      open={isAttributeDialogOpen}
      onOpenChange={setIsAttributeDialogOpen}
    >
      <DialogContent className="w-[95%] sm:max-w-[700px] px-4 ">
      <ScrollArea className=" w-[99%] md:w-full border-none">

        <ScrollArea className=" h-[350px]  pr-4 w-full ">
          <DialogHeader className={"rtl:items-end"}>
            <DialogTitle>
              {selectedAttribute?.id ? t("Edit") : t("Create")} {t("Attribute")}
            </DialogTitle>
            <DialogDescription>
              {selectedAttribute?.id ? t("Make changes to your") : t("Create")}{" "} {t("Attribute")}
            {""}   {t("here. Click save when you are done.")}
            </DialogDescription>
          </DialogHeader>

          <Form {...form} className="h-full bg-black">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 ">
              <FormField
                control={form.control}
                name="nameEn"
                render={({ field }) => (
                  <FormItem className="w-full px-1 pt-0">
                    <FormLabel>
                      <span className="text-red-500 text-xl">*</span> {t("Name In English")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("Group name in english")}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value)

                          setFormFields({
                            ...formFields,
                            nameEn: e.target.value,
                          })
                        }}
                        autoComplete="nameEn"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nameAr"
                render={({ field }) => (
                  <FormItem className="w-full px-1 pt-0">
                    <FormLabel>
                      <span className="text-red-500 text-xl">*</span>{t("Name In Arabic")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("Group name in arabic")}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value)

                          setFormFields({
                            ...formFields,
                            nameAr: e.target.value,
                          })
                        }}
                        autoComplete="nameAr"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem className="w-full px-1 ">
                <FormLabel>
                  <span className="text-red-500 text-xl">*</span>{t("Attributes Group")}
                </FormLabel>
                <AttributesGroupAutocomplete
                  formFields={formFields}
                  setFormFields={setFormFields}
                  attributeGroupId={selectedAttribute?.attribute_group_id}
                  isFetchAttributesGroup={
                    selectedAttribute?.attribute_group_id >= 0 ? true : false
                  }
                />
              </FormItem>

              <div className="flex justify-end items-center w-full py-2 space-x-4">
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
         <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
    </CanSection>
  )
}

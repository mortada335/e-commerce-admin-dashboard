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

import { ATTRIBUTES_GROUPS_URL } from "@/utils/constants/urls"
import useMutation from "@/hooks/useMutation"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import {
  setIsAttributesGroupDialogOpen,
  useAttributesGroupStore,
} from "../store"
import { attributesSchema } from "@/utils/validation/attributes"
import Can from "@/components/Can"
import CanSection from "@/components/CanSection"
import { useTranslation } from "react-i18next"

const defaultFormFields = {
  nameEn: "",
  nameAr: "",
}

export default function AttributesGroupDialog() {
  const { isAttributesGroupDialogOpen, selectedAttributesGroup } =
    useAttributesGroupStore()
  const { toast } = useToast()
  const [formFields, setFormFields] = useState(defaultFormFields)

  const form = useForm({
    resolver: yupResolver(attributesSchema),
    defaultValues: defaultFormFields,
  })
  const [isSubmit, setIsSubmit] = useState(false)
  const {t} = useTranslation()

  const {
    mutate,

    isPending: isAction,
  } = useMutation("AttributesGroups")

  useEffect(() => {
    if (formFields.nameEn && formFields.nameAr) {
      setIsSubmit(true)
    } else {
      setIsSubmit(false)
    }
  }, [formFields])

  useEffect(() => {
    if (
      selectedAttributesGroup !== null &&
      selectedAttributesGroup !== undefined &&
      isAttributesGroupDialogOpen
    ) {
      setFormFields({
        nameEn: selectedAttributesGroup.nameEnglish,
        nameAr: selectedAttributesGroup.nameArabic,
      })

      form.setValue("nameEn", selectedAttributesGroup.nameEnglish)

      form.setValue("nameAr", selectedAttributesGroup.nameArabic)
    } else {
      // this is server error or other erro that could happen
      setFormFields(defaultFormFields)
      form.reset()
    }
  }, [selectedAttributesGroup])

  const onClose = () => {
    setIsAttributesGroupDialogOpen(false)
    form.reset()

    setFormFields(defaultFormFields)
  }

  const onSubmit = async () => {
    // Validate currency Change
    if (!formFields.nameEn || !formFields.nameAr) {
      return toast({
        variant: "destructive",
        title: t("Failed!!!"),
        description: t("Please fill all the fields"),
      })
    }

    const data = [
      { language_id: 1, name: formFields.nameEn },
      { language_id: 2, name: formFields.nameAr },
    ]

    const formData = new FormData()

    formData.append("attributes", JSON.stringify(data))

    mutate({
      url: ATTRIBUTES_GROUPS_URL,
      id: selectedAttributesGroup?.id,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onFinish: onClose,
      formData,
    })
  }

  return (
    <CanSection permissions={[ "app_api.change_ocattributegroup"]}>

    <Dialog
      open={isAttributesGroupDialogOpen}
      onOpenChange={setIsAttributesGroupDialogOpen}
    >
      <DialogContent className="w-[95%] sm:max-w-[700px] px-4 ">
      <ScrollArea className=" w-[99%] md:w-full border-none">

        <ScrollArea className=" h-[300px]  pr-4 w-full ">
          <DialogHeader className={"rtl:items-end"}>
            <DialogTitle>
              {selectedAttributesGroup?.id ? t("Edit") : t("Create")} {t("Group")}
            </DialogTitle>
            <DialogDescription>
              {selectedAttributesGroup?.id ? t("Make changes to your") : t("Create")}{" "}
              {t("Group here. Click save when you are done.")}
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
                      <span className="text-red-500 text-xl">*</span>{t("Name In English")}
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

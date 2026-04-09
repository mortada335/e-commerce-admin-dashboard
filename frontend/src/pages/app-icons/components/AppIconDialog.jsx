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

import { APP_ICON_URL } from "@/utils/constants/urls"
import useMutation from "@/hooks/useMutation"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { appIconSchema } from "@/utils/validation/app-icon"
import { setIsAppIconDialogOpen, useAppIconStore } from "../store"
import FileInput from "@/components/ui/custom-file-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { appIconPlatforms } from "@/utils/methods"
import { useTranslation } from "react-i18next"

const defaultFormFields = {
  name: "",

  
  platform: "3",
  enabled: "enabled",


}

export default function AppIconDialog() {
  const { isAppIconDialogOpen, selectedAppIcon } = useAppIconStore()
  const { toast } = useToast()
  const [formFields, setFormFields] = useState(defaultFormFields)
  const {t} = useTranslation()

  const form = useForm({
    resolver: yupResolver(appIconSchema),
    defaultValues: defaultFormFields,
  })
  const [isSubmit, setIsSubmit] = useState(false)

  const {
    mutate,

    isPending: isAction,
  } = useMutation("AppIcons")

  useEffect(() => {
    if (formFields.name) {
      setIsSubmit(true)
    } else {
      setIsSubmit(false)
    }
  }, [formFields])

  useEffect(() => {
    if (
      selectedAppIcon !== null &&
      selectedAppIcon !== undefined &&
      isAppIconDialogOpen
    ) {
      setFormFields({
        name: selectedAppIcon.name,
        platform: String(selectedAppIcon.platform),
        enabled: selectedAppIcon.is_active ? "enabled" : "disable",

      })
      form.setValue("name", selectedAppIcon.name)
      form.setValue("platform", String(selectedAppIcon.platform))
      form.setValue("enabled", selectedAppIcon.is_active ? "enabled" : "disable")
    } else {
      // this is server error or other erro that could happen
      setFormFields(defaultFormFields)
    }
  }, [selectedAppIcon])



  const onClose = () => {
    setIsAppIconDialogOpen(false)
    form.reset()

    setFormFields(defaultFormFields)
  }

   const onSubmit = (values) => {
   if (!values.name) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      })
    }

    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("platform", values.platform)
    formData.append("is_active", values.enabled === "enabled" ? "true" : "false")

    mutate({
      url: APP_ICON_URL,
      id: selectedAppIcon?.id,

      onFinish: onClose,
      formData,
    })
  }

  return (
    <Dialog open={isAppIconDialogOpen} onOpenChange={setIsAppIconDialogOpen}>
      <DialogContent className="w-[95%] sm:max-w-[700px] px-4 ">
      <ScrollArea className=" w-[99%] md:w-full border-none">

        <ScrollArea className=" h-[350px]  pr-4 w-full ">
          <DialogHeader className={"rtl:items-end"}>
            <DialogTitle>
              {selectedAppIcon?.manufacturer_id ? t("Edit") : t("Create")} {t("App Icon")}
            </DialogTitle>
            <DialogDescription>
              {selectedAppIcon?.manufacturer_id
                ? t("Make changes to your")
                : t("Create")}{" "}
              {t("App Icon here. Click save when you are done.")}
            </DialogDescription>
          </DialogHeader>

          <Form {...form} className="h-full bg-black">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 ">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full px-1 pt-0">
                    <FormLabel>
                                            {t("Name")}
                      <span className="text-red-500 text-xl">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("Icon name")}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value)

                          setFormFields({
                            ...formFields,
                            name: e.target.value,
                          })
                        }}
                        autoComplete="name"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Platform")}</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange} 
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select a platform")} />
                          </SelectTrigger>
                          <SelectContent>
                            {appIconPlatforms.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <FormField
                control={form.control}
                name="enabled"
                render={({ field }) => (
                  <FormItem className="space-y-3 px-1">
                    <FormLabel>{t("Status")}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value)

                          setFormFields({
                            ...formFields,
                            enabled: value,
                          })
                        }}
                        autoComplete="enabled"
                        defaultValue={field.value}
                        className="flex rtl:flex-row-reverse space-x-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="enabled" />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {t("Enabled")}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="disable" />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {t("Disable")}
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-start items-center w-full py-2 space-x-4">
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
                <Button variant="secondary" onClick={onClose}>
                  {t("Cancel")}
                </Button>
              </div>
            </form>
          </Form>
        </ScrollArea>
        <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

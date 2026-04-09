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

import { CHANGE_PASSWORD_URL } from "@/utils/constants/urls"
import useMutation from "@/hooks/useMutation"

import { ScrollArea } from "@/components/ui/scroll-area"

import { changeUserPasswordSchema } from "@/utils/validation/user"

import { setIsChangePasswordDialogOpen, useUserStore } from "../../store"
import CanSection from "@/components/CanSection"
import Can from "@/components/Can"
import { useTranslation } from "react-i18next"

const defaultFormFields = {
  confirm_password: "",
  password: "",
}

export default function ChangePasswordDialog({ id }) {
  const { isChangePasswordDialogOpen } = useUserStore()
  const { toast } = useToast()
  const {t} = useTranslation()
  const [formFields, setFormFields] = useState(defaultFormFields)

  const form = useForm({
    resolver: yupResolver(changeUserPasswordSchema),
    defaultValues: defaultFormFields,
  })
  const [isSubmit, setIsSubmit] = useState(false)

  const {
    mutate,

    isPending: isAction,
  } = useMutation("UserDetails")

  useEffect(() => {
    if (formFields.password && formFields.confirm_password) {
      setIsSubmit(true)
    } else {
      setIsSubmit(false)
    }
  }, [formFields])

  const onClose = () => {
    setIsChangePasswordDialogOpen(false)
    form.reset()

    setFormFields(defaultFormFields)
  }

  const onSubmit = async () => {
    // Validate currency Change
    if (!formFields.password) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      })
    }

    const formData = new FormData()
    formData.append("user_id", id)
    formData.append("new_password", formFields.password)

    mutate({
      url: CHANGE_PASSWORD_URL,

      headers: {
        "Content-Type": "application/json",
      },
      onFinish: onClose,

      formData,
    })
  }

  return (
    <Can permissions={["app_api.change_userlogin"]}>

    <Dialog
      open={isChangePasswordDialogOpen}
      onOpenChange={setIsChangePasswordDialogOpen}
    >
      <DialogContent className="sm:max-w-[700px]">
        <ScrollArea className=" h-fit pr-4 w-full ">
          <DialogHeader className="rtl:items-end">
            <DialogTitle>{t("Update User Password")}</DialogTitle>
            <DialogDescription>
              {t("Make changes to User Password here. Click save when you are done.")}
            </DialogDescription>
          </DialogHeader>

          <Form {...form} className="h-full bg-black">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 ">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full px-1 pt-0">
                    <FormLabel className="capitalize">{t("Password")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("Enter Password")}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value)

                          setFormFields({
                            ...formFields,
                            password: e.target.value,
                          })
                        }}
                        autoComplete="password"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem className="w-full px-1 pt-0">
                    <FormLabel className="capitalize">
                      {t("Confirm Password")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("Confirm Password")}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value)

                          setFormFields({
                            ...formFields,
                            confirm_password: e.target.value,
                          })
                        }}
                        autoComplete="confirm_password"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end items-center w-full py-2 space-x-4">
                <Button type="button" variant="secondary" onClick={onClose}>
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

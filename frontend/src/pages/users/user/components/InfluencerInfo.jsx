import HeaderText from "@/components/layout/header-text"
import Text from "@/components/layout/text"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

import { REFERRAL_CODE_URL } from "@/utils/constants/urls"
import { referralCodeSchema } from "@/utils/validation/user"
import { yupResolver } from "@hookform/resolvers/yup"
import useMutation from "@/hooks/useMutation"

import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

const defaultFormFields = {
  code: "",
}

const InfluencerInfo = ({
  referralCode,
  refferalsMade,
  // eslint-disable-next-line no-unused-vars
  refferalsReceived,
}) => {
  const { toast } = useToast()
  const [codeFields, setCodeFields] = useState("")
  const {t} = useTranslation()

  const form = useForm({
    resolver: yupResolver(referralCodeSchema),
    defaultValues: defaultFormFields,
  })
  const [isSubmit, setIsSubmit] = useState(false)

  const {
    mutate,

    isPending: isAction,
  } = useMutation("UserDetails")

  useEffect(() => {
    if (codeFields && codeFields !== referralCode?.code) {
      setIsSubmit(true)
    } else {
      setIsSubmit(false)
    }
  }, [codeFields])

  useEffect(() => {
    if (referralCode?.code !== null && referralCode?.code !== undefined) {
      setCodeFields(referralCode?.code)

      form.setValue("code", referralCode?.code || "")
    } else {
      // this is server error or other error that could happen
      setCodeFields("")
      form.reset()
    }
  }, [referralCode])

  const onSubmit = async () => {
    // Validate currency Change
    if (!codeFields) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      })
    }
    const formData = {
      code: codeFields,
    }

    mutate({
      url: REFERRAL_CODE_URL,
      id: referralCode?.id,
      headers: {
        "Content-Type": "application/json",
      },
      onFinish: () => {},

      formData,
    })
  }
  return (
    <Card className="flex flex-col justify-start items-center w-full h-full px-4 py-4 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-fit place-content-center place-items-start gap-8 ">
        <Card className="w-full ">
          <CardHeader className="py-2 ">
            <HeaderText className={"lg:text-lg"} text={t("Influencer Code")} />
            <Text text={referralCode?.code} />
          </CardHeader>
        </Card>
        <Card className="w-full ">
          <CardHeader className="py-2 ">
            <HeaderText
              className={"lg:text-lg"}
              text={t("The number of registered by this influencer")}
            />
            <Text text={refferalsMade?.length} />
          </CardHeader>
        </Card>
      </div>

      <Card className="flex flex-col justify-start items-start rtl:items-end w-full h-full px-4 py-4 space-y-4">
        <CardHeader className="py-2 ">
          <CardTitle className={"text-lg"}>{t("Update Marketer Code")}</CardTitle>
          <CardDescription className="text-sm">
            {t("Make changes to Marketer Code here. Click save when you are done.")}
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <Form {...form} className="h-full ">
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-2 w-full"
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="w-[300px] md:w-fit px-1 pt-0">
                    <FormLabel className="capitalize">{t("Code")}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("Code")}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value)

                          setCodeFields(e.target.value)
                        }}
                        autoComplete="code"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-start items-center w-full py-2 space-x-4 px-1">
                <Button disabled={!isSubmit || isAction} type="submit">
                  {isAction ? (
                    <p className="flex justify-center items-center space-x-2">
                      <Loader2 className=" h-5 w-5 animate-spin" />
                      <span>{t("Please wait")}</span>
                    </p>
                  ) : (
                    <span>{t("Save Changes")}</span>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </Card>
  )
}

export default InfluencerInfo

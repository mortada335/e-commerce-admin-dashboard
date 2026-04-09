import { useState } from "react"

import {  Loader2 } from "lucide-react"

// User context

import { useEffect } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { currencyExchangeSchema } from "@/utils/validation/currency-exchange"
import { CURRENCY_EXCHANGE_URL } from "@/utils/constants/urls"
import { axiosPrivate } from "@/api/axios"
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate"
import { formatNumberWithCurrency } from "@/utils/methods"
import { Skeleton } from "@/components/ui/skeleton"
import WrapperComponent from "@/components/layout/WrapperComponent"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Link } from "react-router-dom"

import Section from "@/components/layout/Section"
import CanSection from "@/components/CanSection"
import Can from "@/components/Can"
import { useTranslation } from "react-i18next"

function CurrencyExchange() {
  const { toast } = useToast()
  const axiosPrivateForFetch = useAxiosPrivate()

  const form = useForm({
    resolver: yupResolver(currencyExchangeSchema),
    defaultValues: {
      iqd_to_dollars_exchange: "",
    },
  })
  const [oldCurrencyExchange, setOldCurrencyExchange] = useState()
  const [currencyExchange, setCurrencyExchange] = useState()
  const [isSubmit, setIsSubmit] = useState(false)
  const [isAction, setIsAction] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState(false)
  const {t} = useTranslation()

  useEffect(() => {
    if (currencyExchange && currencyExchange !== oldCurrencyExchange) {
      setIsSubmit(true)
    } else {
      setIsSubmit(false)
    }
  }, [currencyExchange])

  useEffect(() => {
    const getCurrencyExchange = async () => {
      try {
        setIsLoading(true)
        const response = await axiosPrivateForFetch.get(CURRENCY_EXCHANGE_URL)

        if (response.status === 200 && response.data) {
          const { iqd_to_dollars_exchange } = response.data
          form.setValue("iqd_to_dollars_exchange", iqd_to_dollars_exchange)

          setCurrencyExchange(iqd_to_dollars_exchange)
          setOldCurrencyExchange(iqd_to_dollars_exchange)
        }
        // ...
      } catch (error) {
        setError(error)
        setIsError(true)
        setIsLoading(false)
        // Handle the error
        if (error.code === "ERR_NETWORK") {
          toast({
            variant: "destructive",
            title: "Failed!!!",
            description: "Network error, please try again",
          })
        } else {
          toast({
            variant: "destructive",
            title: "Failed!!!",
            description: "An unknown error occurred. Please try again later",
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    getCurrencyExchange()
  }, [])

  // handle create delivery cost submit button
  const onSubmit = async () => {
    // Validate currency Change
    if (!currencyExchange || currencyExchange === oldCurrencyExchange) {
      toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      })
    }

    const formData = new FormData()
    formData.append("iqd_to_dollars_exchange", currencyExchange)

    try {
      setIsAction(true)
      const response = await axiosPrivate.put(
        `${CURRENCY_EXCHANGE_URL}${1}/`,

        formData
      )

      if (response.status === 200) {
        // show success notification
        toast({
          title: "Success",
          description: "Currency exchange updated successfully",
        })
      }
      // ...
    } catch (error) {
      // Handle the error
      setIsAction(false)
      // Handle the error
      if (error.code === "ERR_BAD_REQUEST") {
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: "Something went wrong",
        })
      } else if (error.code === "ERR_NETWORK") {
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: "Network error, please try again",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: "An unknown error occurred. Please try again later",
        })
      }
    } finally {
      setIsAction(false)
    }
  }

  return (
    <CanSection permissions={["app_api.view_currencyexchange"]}>

    <Section className="space-y-20 w-full h-screen items-center justify-start">
    <Breadcrumb className="w-full ">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link to="/">{t("Home")}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage>{t("Currency Exchange")}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
   
    <WrapperComponent
      isEmpty={false}
      isError={isError}
      error={error}
      isLoading={isLoading}
      loadingUI={
        <div className="flex flex-col justify-start items-center w-full h-full py-4">
          <Skeleton className="w-full lg:w-[50%] h-[300px] rounded-xl" />
        </div>
      }
      emptyStateMessage={t("You don't have any orders by this filter")}
    >
      <Card className="w-full lg:w-[50%]">
        <CardHeader>
          <CardTitle>{t("Update Currency Exchange")}</CardTitle>
          <CardDescription>
            {t("1 Dollar")} ={" "}
            {formatNumberWithCurrency(String(currencyExchange), "IQD")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="iqd_to_dollars_exchange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {" "}
                      <span className="text-red-500 text-xl">*</span>{t("Currency Exchange")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1450.000"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value)
                          setCurrencyExchange(e.target.value)
                        }}
                        autoComplete="iqd_to_dollars_exchange"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
    <Can permissions={["app_api.change_currencyexchange"]}>

              <Button
                className="w-full"
                disabled={!isSubmit || isAction}
                type="submit"
              >
                {isAction ? (
                  <p className="flex justify-center items-center space-x-2">
                    <Loader2 className=" h-5 w-5 animate-spin" />
                    <span>{t("Please wait")}</span>
                  </p>
                ) : (
                  <span>{t("Update")}</span>
                )}
              </Button>
    </Can>
            </form>
          </Form>
        </CardContent>
      </Card>
    </WrapperComponent>
    </Section>
    </CanSection>
  )
}

export default CurrencyExchange

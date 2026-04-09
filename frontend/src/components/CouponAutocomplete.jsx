import {  useState } from "react"

import { useQuery } from "@tanstack/react-query"

import qs from "qs"
import { Input } from "@/components/ui/input"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Button } from "@/components/ui/button"
import { Separator } from "./ui/separator"
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate"
import { ScrollArea } from "./ui/scroll-area"
import useDebounce from "@/hooks/useDebounce"
import { useToast } from "./ui/use-toast"
import { GENERAL_COUPONS_URL } from "@/utils/constants/urls"

export default function CouponAutocomplete({
  formFields,
  setFormFields,
  coupon = null,

  className,
}) {
  const axiosPrivate = useAxiosPrivate()
  const { toast } = useToast()
  const [search, setSearch] = useState(coupon||null)
  const [isOpen, setIsOpen] = useState(false)

  

  const debouncedSearchValue = useDebounce(search, 1500)

  const GetAndSearchAdminCoupons = async (
    searchKeyObject = {},
    page = GENERAL_COUPONS_URL
  ) => {
    try {
      // const response = await axiosInstance.get(searchURL, { params: { search: searchKey } });
      const response = await axiosPrivate.get(page, {
        params: { ...searchKeyObject },
        paramsSerializer: (params) => qs.stringify(params, { encode: false }),
      })
      return response
      // ...
    } catch (error) {
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
      return error
    }
  }

  const {
    data: coupons,

    isLoading,
  } = useQuery({
    queryKey: ["coupons", debouncedSearchValue],
    queryFn: () =>
      GetAndSearchAdminCoupons({
        search: debouncedSearchValue?debouncedSearchValue:coupon,
      }),
    enabled: !!debouncedSearchValue || isOpen,
  })

  // const GetAdminCouponById = async (couponId) => {
  //   try {
  //     const response = await axiosPrivate.get(`${coupon_URL}${couponId}/`)

  //     return response
  //     // ...
  //   } catch (error) {
  //     // Handle the error
  //     return error
  //   }
  // }

  // const { data: coupon } = useQuery({
  //   queryKey: ["coupon", couponId],
  //   queryFn: () => GetAdminCouponById(couponId),
  //   enabled: !!couponId && isFetchCoupon,
  // })

  const selectCoupon= formFields.coupon&& coupons?.data.results?.find((item)=>item.code===coupon)?.code

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="" asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full  justify-between px-4",
            className,
            !formFields.coupon && "text-muted-foreground", // Conditionally apply class based on formFields.filter_name
            coupon?.data?.code && "text-muted-foreground" // Conditionally apply class based on category?.description[0].name
          )}
        >
          {selectCoupon?
            selectCoupon
            : "Select coupon"
            
            }

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-none  border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0  focus-visible:ring-offset-0"
          placeholder="Search coupon..."
        />
        <Separator />
        <ScrollArea className="h-[250px] pr-4 w-full ">
          {isLoading && (
            <div className="flex justify-center items-center space-x-2 h-[200px] ">
              <Loader2 className=" h-5 w-5 animate-spin" />
              <span className="text-sm">Please wait</span>
            </div>
          )}
          {!isLoading &&
            coupons?.data.results?.length > 0 &&
            coupons?.data?.results.map((item) => (
              <Button
                variant="ghost"
                className="w-full rounded-none flex justify-between px-3 font-normal"
                key={item.coupon_id}
                onClick={() => {
                  setFormFields({
                    ...formFields,
                    coupon_id: item.coupon_id,
                    coupon: item.code,
                    coupon_discount_value: item.discount,
                  })
                  
                  setIsOpen(false)
                }}
              >
                {item.code}
                <Check
                  size={16}
                  className={cn(
                    "ml-2",
                    item.code === formFields.coupon
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </Button>
            ))}
          {!isLoading &&
            (!coupons?.data?.results || coupons?.data?.results?.length === 0) && (
              <p className="w-full py-2 text-center text-sm font-medium">
                No coupons found!!!
              </p>
            )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

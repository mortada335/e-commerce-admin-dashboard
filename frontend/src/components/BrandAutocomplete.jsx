import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import qs from "qs";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown, CircleX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Separator } from "./ui/separator";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { ScrollArea } from "./ui/scroll-area";
import useDebounce from "@/hooks/useDebounce";
import { useToast } from "./ui/use-toast";
import { BRAND_URL } from "@/utils/constants/urls";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function BrandAutocomplete({
  formFields,
  setFormFields,
  brandId = null,
  isFetchBrand = false,
  className,
  triggerClassName,
  disabled=false
}) {
  const axiosPrivate = useAxiosPrivate();
  const { toast } = useToast();
  const [search, setSearch] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedSearchValue = useDebounce(search, 1500);

  const GetAndSearchAdminBrands = async (
    searchKeyObject = {},
    page = BRAND_URL
  ) => {
    try {
      // const response = await axiosInstance.get(searchURL, { params: { search: searchKey } });
      const response = await axiosPrivate.get(page, {
        params: { ...searchKeyObject },
        paramsSerializer: (params) => qs.stringify(params, { encode: false }),
      });
      return response;
      // ...
    } catch (error) {
      // Handle the error

      if (error.code === "ERR_BAD_REQUEST") {
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: "Something went wrong",
        });
      } else if (error.code === "ERR_NETWORK") {
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: "Network error, please try again",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: "An unknown error occurred. Please try again later",
        });
      }
      return error;
    }
  };

  const {
    data: brands,

    isLoading,
  } = useQuery({
    queryKey: ["Brands", debouncedSearchValue],
    queryFn: () =>
      GetAndSearchAdminBrands({
        search: debouncedSearchValue,
      }),
    enabled: !!debouncedSearchValue || isOpen,
  });

  const GetAdminBrandById = async (brandId) => {
    try {
      const response = await axiosPrivate.get(`${BRAND_URL}${brandId}/`);

      return response;
      // ...
    } catch (error) {
      // Handle the error
      return error;
    }
  };

  const { data: brand } = useQuery({
    queryKey: ["Brand", brandId],
    queryFn: () => GetAdminBrandById(brandId),
    enabled: !!brandId && isFetchBrand,
  });

  return (
    <Popover disabled={disabled} open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger disabled={disabled} type="button" className={cn("relative",triggerClassName)} >
        <div className=" w-full flex items-center justify-start gap-2  ">
          <Button
           disabled={disabled}
            type="button"
            variant="outline"
            role="combobox"
            className={cn(
              "w-full  justify-between px-4",
              className,
              !formFields.filter_name && "text-muted-foreground", // Conditionally apply class based on formFields.filter_name
              brand?.data?.name && "text-muted-foreground" // Conditionally apply class based on category?.description[0].name
            )}
          >
            {formFields.filter_name
              ? formFields.filter_name
              : formFields.filter_id
              ? brand?.data?.name
              : "Select Brand"}

            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
          {!!formFields.filter_id && (
            <TooltipProvider >
              <Tooltip>
                <TooltipTrigger disabled={disabled} type="button">
                  {" "}
                  <Button
                  disabled={disabled}
                    type="button"
                    variant="outline"
                    className={cn(
                      "ml-1  flex items-center justify-center",
                      className
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormFields({
                        ...formFields,
                        filter_id: null,
                        filter_name: null,
                      });
                    }}
                  >
                    <CircleX size={16} color="crimson" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-none  border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0  focus-visible:ring-offset-0"
          placeholder="Search brand..."
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
            brands?.data.results?.length > 0 &&
            brands?.data?.results.map((item) => (
              <Button
                variant="ghost"
                className="w-full rounded-none flex justify-between px-3 font-normal"
                key={item.manufacturer_id}
                onClick={() => {
                  setFormFields({
                    ...formFields,
                    filter_id: item.manufacturer_id,
                    filter_name: item.name,
                  });
                  setIsOpen(false);
                }}
              >
                {item.name}
                <Check
                  size={16}
                  className={cn(
                    "ml-2",
                    item.manufacturer_id === formFields.filter_id
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </Button>
            ))}
          {!isLoading &&
            (!brands?.data?.results || brands?.data?.results?.length === 0) && (
              <p className="w-full py-2 text-center text-sm font-medium">
                No brands found!!!
              </p>
            )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

import { useMemo, useState } from "react";

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
import {  DELIVERY_SERVICE_CITIES } from "@/utils/constants/urls";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DeliveryServiceCitiesAutocomplete({
  formFields,
  setFormFields,
  orderShippingCity = null,
 
  className,
}) {
  const axiosPrivate = useAxiosPrivate();
  const { toast } = useToast();
  const [search, setSearch] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedSearchValue = useDebounce(search, 1500);

  

  const GetAndSearchAdmin = async (
    searchKeyObject = {},
    
  ) => {
    try {
      // const response = await axiosInstance.get(searchURL, { params: { search: searchKey } });
      const response = await axiosPrivate.get(DELIVERY_SERVICE_CITIES, {
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
    data: cities,

    isLoading,
  } = useQuery({
    queryKey: ["DeliveryServiceCities"],
    queryFn: () =>
      GetAndSearchAdmin({
     
      }),
    enabled: isOpen,
  });

  const filteredCities = useMemo(() => {

    
    if (search) {
      return cities?.data?.filter((item) =>
        item.val?.toLowerCase()?.includes(search?.toLowerCase())
      )||[];
    }else{
      return cities?.data||[];
    }
    
  
  }, [cities,search]);



  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger type="button" className="relative" asChild>
        <div className="flex items-center justify-between w-full">
          <Button
            type="button"
            variant="outline"
            role="combobox"
            className={cn(
              "w-full  justify-between px-4",
              className,
              !formFields.stateName && "text-muted-foreground", // Conditionally apply class based on formFields.filter_name
             
            )}
          >
            {formFields.stateName
              ? formFields.stateName
              
              : "Select City"}

            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
          {!!formFields.stateKey && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger type="button">
                  {" "}
                  <Button
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
                        stateName: null,
                        stateKey: null,
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
          placeholder="Search city..."
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
            filteredCities?.length > 0 &&
            filteredCities?.map((item) => (
              <Button
                variant="ghost"
                className="w-full rounded-none flex justify-between px-3 font-normal"
                key={item.key}
                onClick={() => {
                  setFormFields({
                    ...formFields,
                    stateKey: item.key,
                    stateName: item.val,
                  });
                  setIsOpen(false);
                }}
              >
                {item.val}
                <Check
                  size={16}
                  className={cn(
                    "ml-2",
                    item.key === formFields.stateKey
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </Button>
            ))}
          {!isLoading &&
            (filteredCities?.length === 0) && (
              <p className="w-full py-2 text-center text-sm font-medium">
                No city found!!!
              </p>
            )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

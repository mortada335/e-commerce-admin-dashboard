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
import {  DELIVERY_SERVICE_AREAS } from "@/utils/constants/urls";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DeliveryServiceAreasAutocomplete({
  formFields,
  setFormFields,
  stateKey = null,
 
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
      const response = await axiosPrivate.get(DELIVERY_SERVICE_AREAS, {
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
    data: areas,

    isLoading,
  } = useQuery({
    queryKey: ["DeliveryServiceAREAS", stateKey],
    queryFn: () =>
      GetAndSearchAdmin({
        
        st_code: stateKey,
      }),
    enabled: isOpen && !!stateKey,
  });

  const filteredAreas = useMemo(() => {

    if (search) {
      return areas?.data?.filter((item) =>
        item.districtName?.toLowerCase()?.includes(search?.toLowerCase())
      )||[];
    }else{
      return areas?.data||[];
    }

   
  }, [areas,stateKey,search]);


  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} >
      <PopoverTrigger  disabled={!stateKey} type="button" className="relative" asChild>
        <div className="flex items-center justify-between w-full">
          <Button
           disabled={!stateKey}
            type="button"
            variant="outline"
            role="combobox"
            className={cn(
              "w-full  justify-between px-4",
              className,
              !formFields.districtName && "text-muted-foreground", // Conditionally apply class based on formFields.filter_name
             
            )}
          >
            {formFields.districtName
              ? formFields.districtName
              
              : "Select Area"}

            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
          {!!formFields.districtId && (
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
                        districtName: null,
                        districtId: null,
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
          placeholder="Search area..."
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
            filteredAreas?.length > 0 &&
            filteredAreas?.map((item) => (
              <Button
                variant="ghost"
                className="w-full rounded-none flex justify-between px-3 font-normal"
                key={item.districtId}
                onClick={() => {
                  setFormFields({
                    ...formFields,
                    districtId: item.districtId,
                    districtName: item.districtName,
                  });
                  setIsOpen(false);
                }}
              >
                {item.districtName}
                <Check
                  size={16}
                  className={cn(
                    "ml-2",
                    item.districtId === formFields.districtId
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </Button>
            ))}
          {!isLoading &&
            (!filteredAreas || filteredAreas?.length === 0) && (
              <p className="w-full py-2 text-center text-sm font-medium">
               {!stateKey?'Please Select City':'No area found!!!'} 
              </p>
            )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

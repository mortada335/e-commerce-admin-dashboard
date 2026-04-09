import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import qs from "qs";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Separator } from "./ui/separator";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { ScrollArea } from "./ui/scroll-area";
import useDebounce from "@/hooks/useDebounce";
import { useToast } from "./ui/use-toast";
import { ATTRIBUTES_URL } from "@/utils/constants/urls";

export default function AttributeAutocomplete({
  formFields,
  setFormFields,
  attributeId = null,
  isFetchAttribute = false,
}) {
  const axiosPrivate = useAxiosPrivate();
  const { toast } = useToast();
  const [search, setSearch] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedSearchValue = useDebounce(search, 1500);

  const GetAndSearchAdminAttributes = async (
    searchKeyObject = {},
    page = ATTRIBUTES_URL
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
    data: attributes,

    isLoading,
  } = useQuery({
    queryKey: ["Attributes", debouncedSearchValue],
    queryFn: () =>
      GetAndSearchAdminAttributes({
        search: debouncedSearchValue,
      }),
    enabled: !!debouncedSearchValue || isOpen,
  });

  const GetAdminAttributeById = async (attributeId) => {
    try {
      const response = await axiosPrivate.get(
        `${ATTRIBUTES_URL}${attributeId}/`
      );

      return response;
      // ...
    } catch (error) {
      // Handle the error
      return error;
    }
  };

  const { data: attribute } = useQuery({
    queryKey: ["Attribute"],
    queryFn: () => GetAdminAttributeById(attributeId),
    enabled: !!attributeId && isFetchAttribute,
  });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="" asChild>
        <FormControl className="px-1">
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full  justify-between px-4",

              !formFields?.attributeName && "text-muted-foreground", // Conditionally apply class based on formFields.filter_name
              attribute?.data?.name?.at(0)?.name && "text-muted-foreground" // Conditionally apply class based on category?.description[0].name
            )}
          >
            {formFields.attributeName
              ? formFields.attributeName
              : formFields.attributeId
              ? attribute?.data?.name?.at(0)?.name
              : "Select Attributes "}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-none  border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0  focus-visible:ring-offset-0"
          placeholder="Search Attribute..."
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
            attributes?.data.results?.length > 0 &&
            attributes?.data?.results.map((item) => (
              <Button
                variant="ghost"
                className="w-full rounded-none flex justify-between px-3 font-normal"
                key={item.attribute_id}
                onClick={() => {
                  setFormFields({
                    ...formFields,
                    attributeId: item.attribute_id,
                    attributeName: item?.text?.at(0)?.name,
                  });
                  setIsOpen(false);
                }}
              >
                {item?.text?.at(0)?.name}
                <Check
                  size={16}
                  className={cn(
                    "ml-2",
                    item.attribute_id === formFields.attributeId
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </Button>
            ))}
          {!isLoading &&
            (!attributes?.data?.results ||
              attributes?.data?.results?.length === 0) && (
              <p className="w-full py-2 text-center text-sm font-medium">
                No Attributes found!!!
              </p>
            )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

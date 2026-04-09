import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown, Loader2, Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import Text from "@/components/layout/text";


import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
export default function CustomsCombobox({
  item = null,
  filters = [],
  setItem,
  className = "",
  clearClassName = "",
  containerClassName = "",
  clearButtonClassName = "",
  buttonClassName = "",
  itemTitle = "name",
  itemValue = "id",
  placeholder = "Select Item",
  endpoint,
  queryKey = "combobox-items",
  searchQueryKey = "filter[name]",
  disabled = false,
  required = false,
  hideIcon = false,
  label = "",
  children,
}) {
  const axiosPrivate = useAxiosPrivate();

  const [search, setSearch] = useState(null);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOnOpenChange = (val) => {
    if (!disabled) {
      setIsOpen(val);
    }
  };

  const getData = async () => {
    // Create a new URLSearchParams object
    const params = new URLSearchParams();

    params.append("page_size", 25);

    params.append("ordering", "-created_at");

    if (filters?.length) {
      filters?.forEach((filter) => {
        if (filter?.value) {
          params.append(filter?.key, filter?.value);
        }
      });
    }

    if (debouncedSearchValue) {
      params.append(searchQueryKey, debouncedSearchValue);
    }

    return axiosPrivate.get(`${endpoint}?${params.toString()}`);
  };

  const { isLoading, isError, data, error } = useQuery({
    queryKey: [queryKey, filters, debouncedSearchValue, isOpen],
    queryFn: () => getData(),
    enabled: isOpen,
  });
  const selectItem = (value) => {
    setItem(value);
    setIsOpen(false);
  };

  const removeItem = () => {
    setItem(null);
  };

  const onSubmit = (event) => {
    // Prevent default form behavior.
    event.preventDefault();

    setDebouncedSearchValue(search);
  };


  const results = data?.data?.results?.length?data?.data?.results:data?.data?.length?data?.data:[]

  return (
    <div
      className={cn(
        "flex flex-col justify-start items-start rtl:items-end gap-2 w-full h-fit",
        containerClassName
      )}
    >
      {label && (
        <Label className={disabled && "text-gray-500"}>
          {" "}
          {label}
          {
            <span
              className={cn("text-red-500 text-lg", !required && "opacity-0")}
            >
              *
            </span>
          }
        </Label>
      )}
      <Popover
        disabled={disabled}
        open={isOpen}
        onOpenChange={handleOnOpenChange}
      >
        <PopoverTrigger disabled={disabled} asChild>
          <div
            className={cn(
              "flex rtl:flex-row-reverse justify-start items-center w-full border rounded-md" ,
              className
            )}
          >
            <Button
              type="button"
              disabled={disabled}
              onClick={() => setIsOpen(!isOpen)}
              variant="ghost"
              className={cn(
                "flex rtl:flex-row-reverse justify-between items-center my-0 gap-1 w-full min-h-10 h-fit max-h-fit  rounded-none px-2",
                !(item && item[itemValue]) && "h-9",
                buttonClassName
              )}
            >
        
              {item ?children ? children(item) :   item[itemTitle]
              :
              <span className="flex items-center !font-normal text-sm justify-center h-full text-gray-500">
                  {placeholder}
                </span>
              }
              
              {!hideIcon && (
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              )}
            </Button>
            {item && item[itemValue] && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className={cn("", clearClassName)}>
                    {" "}
                    <Button
                      disabled={disabled}
                      variant={"ghost"}
                      size="icon"
                      className={cn("rounded-none", clearButtonClassName)}
                      onClick={() => {
                        setIsOpen(false);
                        removeItem();
                        setSearch("");
                      }}
                    >
                      <X className=" h-4 w-4 opacity-50" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <Text text={"Clear"} />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          {/* Form for custom filter_name search. */}
          <form
            onSubmit={onSubmit}
            className="flex items-center justify-between"
          >
            <Input
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-none border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0 focus-visible:ring-offset-0"
              placeholder={`${"Search by"} ${itemTitle || ""}...`}
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    type="submit"
                    className="text-muted-foreground rounded-none bg-slate-100 hover:bg-slate-200"
                    disabled={
                      // Eliminate unneccessary request by disable the form submission when filters options already 0, or no search value provided.
         
                      !debouncedSearchValue &&
                      search?.trim().length === 0
                    }
                  >
                    <Search size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span>{"apply"}</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </form>

          <Separator />
          <ScrollArea className="h-[250px] pr-2 w-full">
            {isLoading && (
              <div className="flex justify-center items-center gap-2 h-[200px]">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">Please wait</span>
              </div>
            )}
            {!isLoading &&
              results?.length > 0 &&
              results?.map((value, index) => (
                <Button
                  variant="ghost"
                  className="w-full rounded-none flex ltr:flex-row rtl:flex-row-reverse justify-between px-3 font-normal"
                  key={value[itemValue]}
                  onClick={() => selectItem(value)}
                >

                  {value ? children ? children(value) : value[itemTitle]:''}

                  <Check
                    size={16}
                    className={cn(
                      "ml-2",
                      item && value[itemValue] === item[itemValue]
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </Button>
              ))}
            {!isLoading && results?.length === 0 && (
              <p className="w-full py-2 text-center text-sm font-medium">
                {"No data found!!!"}
              </p>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}

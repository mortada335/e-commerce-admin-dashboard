import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Check, ChevronRight, Loader2, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "./separator";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { ScrollArea } from "./scroll-area";
import useDebounce from "@/hooks/useDebounce";

import { Badge } from "./badge";

import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
export default function CustomsMultiCombobox({
  items = [],
  filters = [],
  setItems,
  className = "",
  itemTitle = "name",
  itemKey = "id",
  placeholder = "Select Item",
  endpoint,
  queryKey = "combobox-items",
  searchQueryKey = "filter[name]",
  sortBy = "-date_added",
  disabled = false,
  required = false,
  label = "",
  children,
}) {
  const axiosPrivate = useAxiosPrivate();

  const [search, setSearch] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const {t} = useTranslation()

  const debouncedSearchValue = useDebounce(search, 1500);

  const getData = async () => {
    // Create a new URLSearchParams object
    const params = new URLSearchParams();

    

    params.append("ordering", sortBy);

    if (filters?.length) {
      filters?.forEach((filter) => {
        if (filter?.value !==null && filter?.value !==undefined) {
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
  // const selectItem = (value) => {
  //   setItems((prevItems) => {
  //     const currentItems = [...(prevItems || [])];
  //     const index = currentItems.findIndex(
  //       (item) => item[itemKey] === value[itemKey]
  //     );

  //     if (index === -1) {
  //       currentItems.push(value);
  //     } else {
  //       currentItems.splice(index, 1);
  //     }
  //     return currentItems;
  //   });
  // };
  const selectItem = (value) => {
  const currentItems = [...(items || [])];
  const index = currentItems.findIndex(
    (item) => item[itemKey] === value[itemKey]
  );

  if (index === -1) {
    currentItems.push(value); // add new item
  } else {
    currentItems.splice(index, 1); // remove if already selected
  }
  setItems(currentItems);
};


  const removeItem = (value) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item[itemKey] !== value[itemKey])
    );
  };

  return (
    <div className="flex flex-col justify-start items-start rtl:items-end gap-2 w-full h-fit">
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
      <div
        className={cn(
          "w-full flex space-x-0 justify-between py-1",
          !items?.length && "text-muted-foreground",
          className
        )}
      >
        <div className="flex text-sm justify-start items-center flex-wrap gap-4">
          {!!items?.length && (
            <>
              {items.map((item) => (
                <Badge
                  variant="outline"
                  key={item[itemKey]}
                  className="rounded-md justify-between gap-2 py-2 !font-medium flex group"
                >
                  <span>  {children ? children(item) : item[itemTitle] || "NO NAME"}</span>
                  <Button
                    disabled={disabled}
                    onClick={() => removeItem(item)}
                    variant="ghost"
                    size="icon"
                    className="opacity-0 ml-2 w-4 h-4 rounded-full group-hover:opacity-100"
                  >
                    <X className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </Badge>
              ))}
            </>
          )}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                disabled={disabled}
                onClick={() => setIsOpen(!isOpen)}
                variant="outline"
                className={cn(
                  "w-10 h-8",
                  !items?.length &&
                    "flex justify-start items-center gap-1 w-fit h-fit"
                )}
              >
                <Plus className="h-4 w-4 shrink-0 opacity-50" />
                {!items?.length && (
                  <span className="flex items-center !font-normal text-xs justify-center h-full text-gray-500">
                    {t(placeholder)}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Input
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-none border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0 focus-visible:ring-offset-0"
                placeholder={`${"Search by"} ${itemTitle || ""}...`}
              />
              <Separator />
              <ScrollArea className="h-[250px] pr-2 w-full">
                {isLoading && (
                  <div className="flex justify-center items-center gap-2 h-[200px]">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm">Please wait</span>
                  </div>
                )}
                {!isLoading &&
                  data?.data?.results?.length > 0 &&
                  data.data?.results?.map((item, index) => (
                    <Button
                      variant="ghost"
                      className="w-full rounded-none flex ltr:flex-row rtl:flex-row-reverse justify-between px-3 font-normal"
                      key={item[itemKey]}
                      onClick={() => selectItem(item)}
                    >
                      {/* Use children function if provided */}
                        {children ? children(item) : item[itemTitle] || "NO NAME"}

                      <Check
                        size={16}
                        className={cn(
                          "ml-2",
                          items.some((i) => i[itemKey] === item[itemKey])
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </Button>
                  ))}
                {!isLoading &&
                  (!data?.data?.results || data.data?.results?.length === 0) && (
                    <p className="w-full py-2 text-center text-sm font-medium">
                      No types found!!!
                    </p>
                  )}
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}

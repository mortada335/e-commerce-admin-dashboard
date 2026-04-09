import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { Input } from "@/components/ui/input";
import {
  Check,
  ChevronRight,
  ChevronsUpDown,
  CircleX,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Separator } from "./ui/separator";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import useDebounce from "@/hooks/useDebounce";

import { CATEGORIES_URL } from "@/utils/constants/urls";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { useTranslation } from "react-i18next";

export default function CategoryAutocomplete({
  formFields,
  setFormFields,
  categoryId = null,
  isFetchCategory = false,
  onlyMainCategories = false,
  isDisabled = false,
  className = "",
  activatorClassName = "",
  label = "Select Category",
}) {
  const axiosPrivate = useAxiosPrivate();

  const [search, setSearch] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const {t} = useTranslation()

  const debouncedSearchValue = useDebounce(search, 1500);

  // Function to fetch categories.
  const fetchAdminCategories = async (searchKeyObject = {}) => {
    try {
      const response = await axiosPrivate.get(CATEGORIES_URL, {
        params: searchKeyObject,
        paramsSerializer: (params) => qs.stringify(params, { encode: false }),
      });

      return response;
    } catch (error) {
      // Handle errors
      return error;
    }
  };

  // Fetching categories with react-query.
  const { data: categories, isLoading } = useQuery({
    queryKey: ["Categories", debouncedSearchValue],
    queryFn: () =>
      fetchAdminCategories({
        name: debouncedSearchValue,
        parent_id: onlyMainCategories ? 0 : null,
      }),
    enabled: !!debouncedSearchValue || isOpen,
  });

  // Function to construct category path.
  const getCategoryPath = (category) => {
    if (!category) return "";

    const pathElements = [];
    const parentCategoryName =
      category?.parent_category_name?.[0]?.name || "Unknown Parent";
    const descriptionName =
      category?.description?.[0]?.name || "Unknown Description";

    if (parentCategoryName !== "Unknown Parent") {
      pathElements.push(<div key="parent">{parentCategoryName}</div>);
      if (descriptionName !== "Unknown Description") {
        pathElements.push(<ChevronRight key="chevron" size={14} />);
        pathElements.push(<div key="description">{descriptionName}</div>);
      }
    } else {
      pathElements.push(<div key="description">{descriptionName}</div>);
    }

    return pathElements;
  };

  // Function to fetch category by ID
  const FetchAdminCategoryById = async (id) => {
    try {
      const response = await axiosPrivate.get(`${CATEGORIES_URL}${id}/`);
      return response;
    } catch (error) {
      // Handle errors
      return error;
    }
  };

  // Fetching category by ID using useQuery.
  const { data: category } = useQuery({
    queryKey: ["Category"],
    queryFn: () => FetchAdminCategoryById(Number(categoryId)),
    enabled: !!categoryId && isFetchCategory,
  });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="" asChild>
        <div
          className={cn(
            " w-full flex items-center justify-start gap-2 ",
            activatorClassName
          )}
        >
          <Button
            disabled={isDisabled}
            type="button"
            variant="outline"
            role="combobox"
            className={cn(
              "w-full  justify-between px-4",
              !formFields?.filter_name && "text-muted-foreground", // Conditionally apply class based on formFields.filter_name
              category?.data?.description?.at(0)?.name &&
                "text-muted-foreground" // Conditionally apply class based on category?.description[0].name
            )}
          >
            <div className="flex items-center gap-2">
              {formFields?.filter_name
                ? formFields?.filter_name
                : formFields?.filter_id
                ? getCategoryPath(category?.data)
                : t(label)||""}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
          {!!formFields.filter_id && (
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
                        filter_id: null,
                        filter_name: null,
                      });
                    }}
                  >
                    <CircleX size={16} color="crimson" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("Clear")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
      <ScrollArea className=" w-[99%] md:w-full border-none">

        <Input
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-none  border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0  focus-visible:ring-offset-0"
          placeholder={t("Search category...")}
        />
        <Separator />
        <ScrollArea className="h-[250px] pr-4 w-full">
          {isLoading && (
            <div className="flex justify-center items-center space-x-2 h-[200px] w-full">
              <Loader2 className=" h-5 w-5 animate-spin" />
              <span className="text-sm">{t("Please wait")}</span>
            </div>
          )}
          {!isLoading &&
            categories?.data?.results?.length > 0 &&
            categories?.data?.results.map((item) => (
              <Button
                variant="ghost"
                className="w-full rounded-none flex items-center gap-2 justify-between font-normal "
                key={item.category_id}
                onClick={() => {
                  setFormFields({
                    ...formFields,
                    filter_id: item.category_id,
                    filter_name: getCategoryPath(item),
                  });
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  {getCategoryPath(item)}
                </div>
                <Check
                  size={16}
                  className={cn(
                    "ml-2",
                    item.category_id === formFields.filter_id
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </Button>
            ))}
          {!isLoading &&
            (!categories?.data.results ||
              categories.data.results.length === 0) && (
              <p className="w-full py-2 text-center text-sm font-medium">
                {t("No types found!!!")}
              </p>
              
            )}
            
        </ScrollArea>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

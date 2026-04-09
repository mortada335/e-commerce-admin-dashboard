import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import qs from "qs";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown, Loader2, Search, X } from "lucide-react";
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
import { PRODUCTS_URL } from "@/utils/constants/urls";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";
import { setClearFilterBtn } from "@/pages/products/store";
import Text from "./layout/text";
import { useTranslation } from "react-i18next";

export default function ProductAutocomplete({
  formFields,
  setFormFields,
  productId = null,
  isFetchProduct = false,
}) {
  const axiosPrivate = useAxiosPrivate();
  const { toast } = useToast();
  const {t} = useTranslation()
  const [search, setSearch] = useState(formFields?.filter_name||'');
  const [isOpen, setIsOpen] = useState(false);

  const debouncedSearchValue = useDebounce(search, 500);

  const GetAndSearchAdminProducts = async (
    searchKeyObject = {},
    page = PRODUCTS_URL
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
    data: products,

    isLoading,
  } = useQuery({
    queryKey: ["Products", debouncedSearchValue],
    queryFn: () =>
      GetAndSearchAdminProducts({
        model: debouncedSearchValue,
      }),
    enabled: !!debouncedSearchValue || isOpen,
  });

  const GetAdminProductById = async () => {
    try {
      const response = await axiosPrivate.get(`${PRODUCTS_URL}${productId}/`);

      return response;
      // ...
    } catch (error) {
      // Handle the error
      return error;
    }
  };

  const { data: product } = useQuery({
    queryKey: ["Product"],
    queryFn: () => GetAdminProductById(),
    enabled: !!productId && isFetchProduct,
  });

  // Submit any filter name handler.
  const customSearchSubmissionHandler = (event) => {
    // Prevent default form behavior.
    event.preventDefault();

    // Disable the form submission when the filter results already 0.
    if (products?.data?.results?.length === 0) return;
    if (products?.data?.results?.length === 1) {
      
      // Set form field with new entered search value.
      setFormFields({
        ...formFields,
        filter_name: products?.data?.results?.at(0).model,
        filter_id: products?.data?.results?.at(0).product_id,
      });
    } else {
      // Set form field with new entered search value.
      setFormFields({
        ...formFields,
        filter_name: search?.toLowerCase(),
      });
      
    }

    // Close the date picker after submission.
    setIsOpen(false);

    // Trigger clear filter button.
    setClearFilterBtn(true);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="" asChild>
      <div  className="flex justify-start items-center min-w-fit  w-full max-w-fit border rounded-md">

        <Button
          variant="ghost"
          type="button"
          role="combobox"
          className={cn(
            " min-w-fit  w-full max-w-fit  justify-between px-4 text-xs rounded-sm",

            !formFields.filter_name && "text-muted-foreground", // Conditionally apply class based on formFields.filter_name
            product?.data?.name && "text-muted-foreground", // Conditionally apply class based on category?.description[0].name
            formFields?.filter_id&&' rounded-none rounded-l-sm'
          )}
        >
          {formFields.filter_name
            ? formFields.filter_name
            : formFields.filter_id
            ? product?.data?.model
            : t("Select Product")}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
        {formFields?.filter_id&&
        <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {" "}
                            <Button
                              variant={"ghost"}
                              size="icon"
                              className="rounded-none"
                              onClick={() => {
                                setIsOpen(false)
                                setFormFields({
                                     ...formFields,
                                     filter_id: null,
                                     filter_name:null,
                                });
                                setSearch('')
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
        }
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        {/* Form for custom filter_name search. */}
        <form
          onSubmit={customSearchSubmissionHandler}
          className="flex items-center justify-between"
        >
          <Input
            onChange={(e) => setSearch(e.target.value)}
            value={search || ""}
            className="rounded-none  border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0  focus-visible:ring-offset-0"
            placeholder="Search Product..."
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-muted-foreground rounded-none bg-slate-100 hover:bg-slate-200"
                  disabled={
                    // Eliminate unneccessary request by disable the form submission when filters options already 0, or no search value provided.
                    products?.data?.results?.length === 0 ||
                    !search ||
                    search?.trim().length === 0
                  }
                >
                  <Search size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span>{t("Apply Search")}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </form>
        <Separator />
        <ScrollArea className="h-[250px] pr-4 w-full ">
          {isLoading && (
            <div className="flex justify-center items-center space-x-2 h-[200px] ">
              <Loader2 className=" h-5 w-5 animate-spin" />
              <span className="text-sm">{t("Please wait")}</span>
            </div>
          )}
          {!isLoading &&
            products?.data.results?.length > 0 &&
            products?.data?.results.map((item) => (
              <Button
                variant="ghost"
                className="w-full rounded-none flex justify-between px-3 font-normal"
                key={item.product_id}
                onClick={() => {


                  setFormFields({
                    ...formFields,
                    filter_id: item.product_id,
                    filter_name: item.model,
                  });
                  setSearch(item.model)
                  setIsOpen(false);
                }}
              >
                {item.model}
                <Check
                  size={16}
                  className={cn(
                    "ml-2",
                    item.product_id === formFields.filter_id
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </Button>
            ))}
          {!isLoading &&
            (!products?.data?.results ||
              products?.data?.results?.length === 0) && (
              <p className="w-full py-2 text-center text-sm font-medium">
                {t("No product found!!!")}
              </p>
            )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

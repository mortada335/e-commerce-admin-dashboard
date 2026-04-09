import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { Input } from "@/components/ui/input";
import { Check,  ChevronsUpDown, Loader2 } from "lucide-react";
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

import {  USERS_URL } from "@/utils/constants/urls";
import { useTranslation } from "react-i18next";

export default function CustomerAutocomplete({
  formFields,
  setFormFields,
  customerId = null,
  isFetchCustomer = false,

  isDisabled = false
}) {
  const axiosPrivate = useAxiosPrivate();

  const [search, setSearch] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const {t} = useTranslation()

  const debouncedSearchValue = useDebounce(search, 1500);

  // Function to fetch customers.
  const fetchAdminCustomers = async (searchKeyObject = {}) => {
    try {
      const response = await axiosPrivate.get(USERS_URL, {
        params: searchKeyObject,
        paramsSerializer: (params) => qs.stringify(params, { encode: false }),
      });

      return response;
    } catch (error) {
      // Handle errors
      return error;
    }
  };

  // Fetching customers with react-query.
  const { data: customers, isLoading } = useQuery({
    queryKey: ["Customers", debouncedSearchValue],
    queryFn: () =>
      fetchAdminCustomers({
        username:debouncedSearchValue? `%2B964${debouncedSearchValue}`:null,
    
      }),
    enabled: !!debouncedSearchValue || isOpen,
  });



  // Function to fetch customer by ID
  const FetchAdminCustomerById = async (id) => {
    try {
      const response = await axiosPrivate.get(`${USERS_URL}${id}/`);
      return response;
    } catch (error) {
      // Handle errors
      return error;
    }
  };

  // Fetching customer by ID using useQuery.
  const { data: customer } = useQuery({
    queryKey: ["Customer"],
    queryFn: () => FetchAdminCustomerById(Number(customerId)),
    enabled: !!customerId && isFetchCustomer,
  });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="" asChild>
        <div className="px-1">
          <Button
            disabled={isDisabled}
            type="button"
            variant="outline"
            role="combobox"
            className={cn(
              "w-full  justify-between px-4",
              !formFields?.filter_name && "text-muted-foreground", // Conditionally apply class based on formFields.filter_name
              customer?.data?.description?.at(0)?.name &&
                "text-muted-foreground" // Conditionally apply class based on customer?.description[0].name
            )}
          >
            <div className="flex items-center gap-2">
              {formFields?.filter_name
                ? formFields?.filter_name
                : formFields?.filter_id
                ? `${customer?.data?.first_name} ${customer?.data?.last_name}`
                : t("Select customer")}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-none  border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0  focus-visible:ring-offset-0"
          placeholder="Search customer..."
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
            customers?.data?.results?.length > 0 &&
            customers?.data?.results?.map((item) => (
              <Button
                variant="ghost"
                className="w-full rounded-none flex items-center gap-2 justify-between font-normal "
                key={item.id}
                onClick={() => {
                  setFormFields({
                    ...formFields,
                    filter_id: item.id,
                    filter_name: `${item?.first_name} ${item?.last_name}`,
                  });
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  {`${item?.first_name} ${item?.last_name}`}
                </div>
                <Check
                  size={16}
                  className={cn(
                    "ml-2",
                    item.id === formFields.filter_id
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </Button>
            ))}
          {!isLoading &&
            (!customers?.data?.results ||
              customers.data?.results.length === 0) && (
              <p className="w-full py-2 text-center text-sm font-medium">
                {t("No types found!!!")}
              </p>
            )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

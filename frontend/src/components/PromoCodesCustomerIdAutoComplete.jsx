import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { Input } from "@/components/ui/input";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
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
import { USERS_URL } from "@/utils/constants/urls";

const CustomerIdAutocomplete = ({ formFields, setFormFields, className }) => {
  const axiosPrivate = useAxiosPrivate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const debouncedSearchValue = useDebounce(search, 1500);

  const GetAndSearchCustomers = async (searchKeyObject = {}) => {
    try {
      const response = await axiosPrivate.get(USERS_URL, {
        params: { ...searchKeyObject },
        paramsSerializer: (params) => qs.stringify(params, { encode: false }),
      });
      return response;
    } catch (error) {
      // Handle errors
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

  const { data: customers, isLoading } = useQuery({
    queryKey: ["Users", debouncedSearchValue],
    queryFn: () =>
      GetAndSearchCustomers({
        username: debouncedSearchValue,
      }),
    enabled: !!debouncedSearchValue || isOpen,
  });

  const selectCustomer =
    formFields.for_customer_id &&
    customers?.data?.results?.find(
      (item) => item.id === formFields.for_customer_id
    )?.username;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="" asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between px-4",
            className,
            !formFields.for_customer_id ? "text-muted-foreground" : "text-black"
          )}
        >
          {selectCustomer ? selectCustomer : "Select customer"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-none border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0 focus-visible:ring-offset-0"
          placeholder="Search customer..."
        />
        <Separator />
        <ScrollArea className="h-[250px] pr-4 w-full !overflow-auto">
          {isLoading && (
            <div className="flex justify-center items-center space-x-2 h-[200px]">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Please wait</span>
            </div>
          )}
          {!isLoading &&
            customers?.data?.results?.length > 0 &&
            customers?.data.results?.map((item) => (
              <Button
                variant="ghost"
                className="w-full rounded-none flex justify-between px-3 font-normal"
                key={item.id}
                onClick={() => {
                  setFormFields({
                    ...formFields,
                    for_customer_id: item.id,
                  });
                  setIsOpen(false);
                }}
              >
                     {item.first_name} {item.last_name}
                {/* <Check
                  size={16}
                  className={cn(
                    "ml-2",
                    item.id === formFields.for_customer_id
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                /> */}
              </Button>
            ))}
          {!isLoading &&
            (!customers?.data?.results ||
              customers?.data?.results?.length === 0) && (
              <p className="w-full py-6 text-center text-sm font-medium">
                No customers found!
              </p>
            )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default CustomerIdAutocomplete;

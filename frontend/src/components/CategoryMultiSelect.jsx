import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { Input } from "@/components/ui/input";
import { Check, ChevronRight, Loader2, Plus, X } from "lucide-react";
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
import { CATEGORIES_URL } from "@/utils/constants/urls";
import { Badge } from "./ui/badge";

export default function CategoryMultiSelect({
  selectedCategories = [],
  setSelectedCategories,
  onlyMainCategories = false,
  disabled = false,
  className = "",
}) {
  const axiosPrivate = useAxiosPrivate();
  const { toast } = useToast();
  const [search, setSearch] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const debouncedSearchValue = useDebounce(search, 1500);

  const fetchAdminCategories = async () => {
    let searchKeyObject = {};
    const parent_id = onlyMainCategories ? 0 : null;
    searchKeyObject = Object.fromEntries(
      Object.entries({
        name: debouncedSearchValue,
        parent_id: parent_id,
        // eslint-disable-next-line no-unused-vars
        ordering: "-date_added",
        // eslint-disable-next-line no-unused-vars
      }).filter(([_, value]) => value !== undefined && value !== null)
    );

    try {
      const response = await axiosPrivate.get(CATEGORIES_URL, {
        params: { ...searchKeyObject },
        paramsSerializer: (params) => qs.stringify(params, { encode: false }),
      });

      return response;
    } catch (error) {
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

  const { data: categories, isLoading } = useQuery({
    queryKey: ["Categories", debouncedSearchValue],
    queryFn: () => fetchAdminCategories(),
    enabled: !!debouncedSearchValue || isOpen,
  });

  const toggleCategorySelection = (category) => {
    const index = selectedCategories.findIndex(
      (item) => item.category_id === category.category_id
    );

    if (index === -1) {
      setSelectedCategories([
        ...selectedCategories,
        {
          ...category,
          name: (
            <div className="flex items-center gap-2">
              {!!category?.parents?.length &&
                category?.parents?.map((parent, index) => (
                  <>
                    <span>
                      {(parent.name?.[0]?.name || "Unknown Parent") + " "}
                    </span>
                    {index !== category?.parents.length && (
                      <ChevronRight className="" size={14} />
                    )}
                  </>
                ))}

              <span>
                {category.description?.[0]?.name || "Unknown Description"}
              </span>
            </div>
          ),
        },
      ]);
    } else {
      const updatedSelection = [...selectedCategories];
      updatedSelection.splice(index, 1);
      setSelectedCategories(updatedSelection);
    }
  };

  const removeCategory = (category) => {
    const updatedSelection = selectedCategories.filter(
      (item) => item.category_id !== category.category_id
    );
    setSelectedCategories(updatedSelection);
  };

  return (
    <div
      className={cn(
        "w-full flex space-x-0 justify-between py-2",
        !selectedCategories?.length && "text-muted-foreground",
        className
      )}
    >
      <div className="flex text-sm justify-start items-center flex-wrap gap-4">
        {!!selectedCategories?.length && (
          <>
            {selectedCategories.map((category) => (
              <Badge
                variant="outline"
                key={category.category_id}
                className="rounded-md justify-between space-x-1 py-2 !font-medium flex group"
              >
                <span>
                  {(category?.description?.[0]?.name ||
                    category?.name?.[0]?.name ||
                    category?.name ||
                    "NO NAME") + " "}
                </span>
                {!disabled && (
                  <Button
                    disabled={disabled}
                    onClick={() => removeCategory(category)}
                    variant="ghost"
                    size="icon"
                    className="opacity-0 ml-2 w-4 h-4 rounded-full group-hover:opacity-100"
                  >
                    <X className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                )}
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
                !selectedCategories?.length && "space-x-1 w-fit h-fit"
              )}
            >
              <Plus className="h-4 w-4 shrink-0 opacity-50" />
              {!selectedCategories?.length && (
                <span className="flex items-center !font-medium text-xs justify-center h-full">
                  Select category
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Input
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-none border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0 focus-visible:ring-offset-0"
              placeholder="Search Category..."
            />
            <Separator />
            <ScrollArea className="h-[250px] pr-4 w-full">
              {isLoading && (
                <div className="flex justify-center items-center space-x-2 h-[200px]">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">Please wait</span>
                </div>
              )}
              {!isLoading &&
                categories?.data?.results?.length > 0 &&
                categories.data.results.map((item, index) => (
                  <Button
                    variant="ghost"
                    className="w-full rounded-none flex justify-start px-3 font-normal gap-2"
                    key={item.category_id}
                    onClick={() => toggleCategorySelection(item)}
                  >
                    {!!item?.parents?.length &&
                      item?.parents?.map((parent, index) => (
                        <>
                          <span>
                            {(parent.name?.[0]?.name || "Unknown Parent") + " "}
                          </span>
                          {index !== item?.parents.length && (
                            <ChevronRight className="" size={14} />
                          )}
                        </>
                      ))}

                    <span>
                      {item.description?.[0]?.name || "Unknown Description"}
                    </span>
                    <Check
                      size={16}
                      className={cn(
                        "ml-2",
                        selectedCategories.some(
                          (i) => i.category_id === item.category_id
                        )
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
                    No types found!!!
                  </p>
                )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

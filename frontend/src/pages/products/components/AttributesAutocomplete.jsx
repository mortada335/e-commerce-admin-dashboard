import { useState } from "react";

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
import { Separator } from "@/components/ui/separator";

import { ScrollArea } from "@/components/ui/scroll-area"
import { useTranslation } from "react-i18next"

export default function AttributeAutocomplete({
  search,
  setSearch,
  attributeId,
  attributeName,
  isLoading,
  attributes,
  onSelect,
  index,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const {t} = useTranslation() 

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="" asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-10/12 md:w-5/12 lg:w-3/12 justify-between px-4",

            !attributeName && "text-muted-foreground" // Conditionally apply class based on formFields.filter_name
          )}
        >
          {attributeName ? attributeName : t("Select Attributes")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-none  border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0  focus-visible:ring-offset-0"
          placeholder={t("Search Attribute...")}
        />
        <Separator />
        <ScrollArea className="h-[250px] pr-4 w-full ">
          {isLoading && (
            <div className="flex justify-center items-center space-x-2 h-[200px] ">
              <Loader2 className=" h-5 w-5 animate-spin" />
              <span className="text-sm">{t("Please wait")}</span>
            </div>
          )}
          {!isLoading &&
            attributes?.length > 0 &&
            attributes?.map((item) => (
              <Button
                variant="ghost"
                className="w-full rounded-none flex justify-between px-3"
                key={item.attribute_id}
                onClick={() => {
                  onSelect(
                    index,
                    "attributeId",
                    item.attribute_id,
                    "attributeName",
                    item?.text?.at(0)?.name
                  );
                  setIsOpen(false);
                }}
              >
                {item?.text?.at(0)?.name}
                <Check
                  size={16}
                  className={cn(
                    "ml-2",
                    item.attribute_id === attributeId
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </Button>
            ))}
          {!isLoading && (!attributes || attributes?.length === 0) && (
            <p className="w-full py-2 text-center text-sm font-medium">
              {t("No Attributes found!!!")}
            </p>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

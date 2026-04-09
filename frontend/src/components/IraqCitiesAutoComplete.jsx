import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Separator } from "@/components/ui/separator";

import { Button } from "@/components/ui/button";
import { iraqCities } from "@/pages/orders/store";
import { ScrollArea } from "./ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Text from "./layout/text";
import { useTranslation } from "react-i18next";
export default function IraqCitiesAutoComplete({
  selectedCity,
  setSelectedCity,
  setPage,
}) {
  const {t} = useTranslation()
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const filteredCity = useMemo(() => {
    return iraqCities.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="" asChild>
      <div  className="flex justify-start items-center w-full border rounded-md">

        <Button
          variant="ghost"
          role="combobox"
          className={cn(
            "w-full  justify-between px-4 capitalize rounded-sm font-medium text-black",
            !selectedCity?.postcode >= 0 && "text-muted-foreground",
            selectedCity&&' rounded-none rounded-l-sm'

          )}
        >
          {selectedCity?.postcode ? selectedCity?.name : t("Select city")}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
        {selectedCity&&
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
                                setSelectedCity(null);
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
        <Input
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-none  border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0  focus-visible:ring-offset-0"
          placeholder="Search city..."
        />
        <Separator />
        <ScrollArea className="h-[250px] pr-4 w-full ">
          {filteredCity.length ? (
            filteredCity?.map((item) => (
              <Button
                variant="ghost"
                className="w-full rounded-none flex justify-between px-3 font-normal"
                key={item.postcode}
                onClick={() => {
                  // form.setValue("section_type", item)
                  setSelectedCity(item);
                  if (setPage) {

                    setPage(1)
                    
                  }
                  setIsOpen(false);
                }}
              >
                {item.name} / {item.name_ar}
                <Check
                  size={"16"}
                  className={cn(
                    "ml-2 ",
                    item.postcode === selectedCity?.postcode
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </Button>
            ))
          ) : (
            <p className="w-full py-2  text-center text-sm font-medium">
              {t("No city found!!!")}
            </p>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

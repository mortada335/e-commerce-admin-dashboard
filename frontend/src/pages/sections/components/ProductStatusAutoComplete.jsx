import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Separator } from "@/components/ui/separator";
import { convertProductStatusIdToString } from "@/utils/methods";
import { convertProductStatusStringToId } from "@/utils/methods";

import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function ProductStatusAutoComplete({
  formFields,
  setFormFields,
  disabled=false
}) {
  const [search, setSearch] = useState("");
  const {t} = useTranslation()
  const [isOpen, setIsOpen] = useState(false);
  const filteredStatus = useMemo(() => {
    //"NEW", 
    const status = ["FEATURED", "PROMOTED", "DISCOUNT", "NONE"];

    return status.filter((item) => item.toLowerCase().includes(search));
  }, [search]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="" asChild>
        <Button
          disabled={disabled}
          variant="outline"
          role="combobox"
          className={cn(
            "w-full  justify-between px-4",
            !formFields.filter_id >= 0 && "text-muted-foreground"
          )}
        >
          {formFields.filter_id >= 0
            ? filteredStatus?.find(
                (item) =>
                  item === convertProductStatusIdToString(formFields.filter_id)
              )
            : "Select status"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Input
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-none  border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0  focus-visible:ring-offset-0"
          placeholder={t("Search status...")}
        />
        <Separator />

        {filteredStatus.length ? (
          filteredStatus?.map((item) => (
            <Button
              variant="ghost"
              className="w-full rounded-none flex justify-between px-3"
              key={item}
              onClick={() => {
                // form.setValue("section_type", item)
                if(formFields.filter_id >= 0&&formFields?.filter_id === convertProductStatusStringToId(item)){

                setFormFields({
                  ...formFields,
                  filter_id: -1,
                });
                }else{

                setFormFields({
                  ...formFields,
                  filter_id: convertProductStatusStringToId(item),
                });
                }
                setIsOpen(false);
              }}
            >
              {item}
              <Check
                size={"16"}
                className={cn(
                  "ml-2 ",
                  formFields.filter_id >= 0 &&item === convertProductStatusIdToString(formFields.filter_id)
                    ? "opacity-100"
                    : "opacity-0"
                )}
              />
            </Button>
          ))
        ) : (
          <p className="w-full py-2  text-center text-sm font-medium">
            {t("No type found!!!")}
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}

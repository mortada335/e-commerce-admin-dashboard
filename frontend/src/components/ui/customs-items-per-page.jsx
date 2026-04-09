import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import {  Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { ScrollArea } from "@/components/ui/scroll-area"
import useDebounce from "@/hooks/useDebounce"
import { useTranslation } from "react-i18next"


export default function CustomsItemsPerPage({
  items = [10,15,20,25,50],
  itemPerPage,
  setItemPerPage,
 
}) {
  const { t } = useTranslation()
  const [input, setInput] = useState(null)
  const [isOpen, setIsOpen] = useState(false)

  const debouncedInputValue = useDebounce(input, 1500)

  useEffect(() => {
    if (debouncedInputValue !== null && debouncedInputValue !== undefined) {
      const value = Number(debouncedInputValue);
      if (!isNaN(value)) {
        if (value > 0 && value <= 1000) {
          setItemPerPage(value);
        } else {
          toast("Please enter a number between 1 and 1000.");
        }
      } else {
        toast("Invalid number entered.");
      }
    }
  }, [debouncedInputValue]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} >
      <PopoverTrigger className="" asChild>

      <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-fit  justify-between px-4",

              !itemPerPage&& "text-muted-foreground", // Conditionally apply class based on formFields.filter_name
              itemPerPage && "text-muted-foreground" // Conditionally apply class based on category?.description[0].name
            )}
          >
            {itemPerPage
              ? itemPerPage
            
              : "Select Items per page"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
       
      </PopoverTrigger>
      <PopoverContent className="w-[150px] max-w-fit p-0 mx-4">
        <p className="px-3 py-2 text-sm font-semibold">{t("Items per page")}</p>
      <Separator />
        <ScrollArea className="h-[250px] w-full ">
             {
              !!items.length&&
              items.map((item,index) => (

              <Button
                key={index}
                variant="ghost"
                className="w-full rounded-none flex justify-start gap-2 px-3 font-normal"
                
                onClick={() => {
                  setItemPerPage(item)
                }}
              >
                <Check
                  size={16}
                  className={cn(
                    "ml-2",
                    item === itemPerPage
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {item}
                
              </Button>
              ))
             }
              <Separator />
        <Input
        value={input}
        type="number"
        max={1000}
          onChange={(e) => setInput(e.target.value)}
          className="rounded-none   border-0 outline-none ring-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none focus-visible:border-0  focus-visible:ring-offset-0"
          placeholder={t("Custom Value...")}
        />
          
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

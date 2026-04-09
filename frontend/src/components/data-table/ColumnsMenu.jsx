import React, { useState } from 'react'
import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useTranslation } from 'react-i18next'
 

const ColumnsMenu = ({columns=[], columnVisibility, setColumnVisibility, disabledColumnVisibility=()=>{return true} }) => {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)
    const handleToggle = (accessorKey) => {
        
      localStorage.setItem(accessorKey, !columnVisibility[accessorKey]);
        setColumnVisibility((prev) => ({
          ...prev,
          [accessorKey]: !prev[accessorKey],
        }));
      };

      function formatText(text) {
        return text
            .replace(/_/g, ' ')                   // Replace underscores with spaces
            .replace(/([a-z])([A-Z])/g, '$1 $2')  // Add space before uppercase letters
            .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize each word
    }
    
   
  return (

 <Popover open={open} onOpenChange={setOpen}>
 <PopoverTrigger asChild>
   <Button
     variant="outline"
     role="combobox"
     aria-expanded={open}
     className="w-fit justify-between text-xs md:text-sm"
     
   >
     {t("Columns")}
     <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
   </Button>
 </PopoverTrigger>
 <PopoverContent className="w-[200px] p-0">
 <ScrollArea className={cn("h-72 w-48 py-2 flex ltr:flex-row rtl:flex-row-reverse pl-1  pr-4",)}>
 

         {columns.map((column) => (
           <Button
            variant="ghost"
             disabled={!disabledColumnVisibility(column) }
             key={column.accessorKey}
             value={column.accessorKey}
             className="px-2 w-full flex justify-start items-center"
             onClick={() => {

                if (disabledColumnVisibility(column)) {
                    
                    handleToggle(column.accessorKey)
                }
              
             }}
           >
             <Check
               className={cn(
                 "mr-2 h-4 w-4",
                 columnVisibility[column.accessorKey] ? "opacity-100" : "opacity-0"
               )}
             />
             {t(formatText(column.accessorKey))}
           </Button>
         ))}

 <ScrollBar />
 </ScrollArea>
       
 </PopoverContent>
</Popover>
  )
}

export default ColumnsMenu

import { formatDate } from "@/utils/methods";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Text from "@/components/layout/text";
import {
    Card,

  } from "@/components/ui/card";

  
const DatePicker = ({date,setDate,disabled=new Date("1900-01-01"),title='Pick Date',initialFocus=false}) => {
   

    const disabledDate = disabled?disabled:new Date("1900-01-01")
  return (
    <Popover>
    <PopoverTrigger asChild>
      <Card className="flex justify-between items-center">
      <Button
                  variant={"ghost"}
                  type="button"
                  className={cn(
                    " w-fit text-left font-normal rounded-none gap-2 flex justify-start items-center",
                    !date && "text-muted-foreground w-fit"
                  )}
                >
                  {date ? (
                    <p className="space-x-2 flex">
                      <span>{formatDate(date)}</span>
                    </p>
                  ) : (
                    <>
                      {title||'Pick Date'}
                      <CalendarIcon className=" h-4 w-4 opacity-50" />
                    </>
                  )}
                </Button>
        {date && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {" "}
                <Button
                  variant={"ghost"}
                  size="icon"
                  className="rounded-none"
                  onClick={() => {
                    setDate(null);
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
        )}
      </Card>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
       mode="single"
        selected={date}
        onSelect={(value) => {
          setDate(value);
   
        }}
        disabled={(date) => date < disabledDate}
        initialFocus={initialFocus}
      />
    </PopoverContent>
  </Popover>
          
  )
}

export default DatePicker
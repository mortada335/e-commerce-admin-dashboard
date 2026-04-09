import  { useEffect, useRef, useState } from 'react'

import {  isValidDate } from "@/utils/methods";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, X } from "lucide-react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Text from "@/components/layout/text";
import {
    Card,

  } from "@/components/ui/card";
import { Input } from './input';
import FlatDatePicker from './custom-flat-date-picker';


  
const CustomDatePicker = ({value=new Date("1900-01-01"),onChange,disabled=new Date("1900-01-01"),placeholder='Pick Date',initialFocus=false,  isTimePicker = false,}) => {
   const [isOpen, setIsOpen] = useState(false)

    const disabledDate = disabled?disabled:new Date("1900-01-01")
    const containerRef = useRef(null); // Ref for the entire component
    const inputRef = useRef(null);



    const handleFocus = () => {
      console.log(isOpen,'handleFocus');
      inputRef.current?.focus(); // Focus the input field
      setIsOpen(true)
    
    };
    
    const handleBlur = () => {
      
      setIsOpen(false)
    };

      const [error, setError] = useState('');
    
      useEffect(() => {
        if (initialFocus) {
          inputRef.current?.focus(); // Focus the input field
        }
     
         
      }, []);
      useEffect(() => {
        
     
        validateDate(value);
      }, [value]);

    
      const validateDate = (date) => {

        if (date&&!isValidDate(date)) {
          setError('Invalid date format')
        }else{
          setError('')
        }
        
      };

        // Handle clicks outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

      
  return (
    <div className="relative"  ref={containerRef}>



                            <Input
                                 ref={inputRef}
                              type={"text"}
                              placeholder={placeholder}
                              value={value}
                              onFocus={handleFocus}
                              // onBlur={handleBlur}
                              onChange={(e) => {
                                // field.onChange(e.target.value);
                                onChange(e.target.value);
                              }}
                              
                        
                              
                              className={cn("pr-10 ",value&&'pr-20',!isValidDate(value)&&'!ring-red-500')}
                            />
                            
                            <div className="absolute right-0 top-0 flex justify-end items-center gap-0 ">
                            {value && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild >
     
                <Button
                type="button"
                  variant={"ghost"}
                  size="icon"
                  className="rounded-none"
                  onClick={() => {
                    onChange(null);
                    setIsOpen(false)
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
                            <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
             
                <Button
                  type="button"
                  variant={"ghost"}
                  size="icon"
                  className="rounded-none !rounded-r-sm"
                  onClick={() => {
                    setIsOpen((prev)=>!prev)
                  }}
                >
                               <CalendarIcon  size="16" aria-hidden="true" />
                               </Button>
              </TooltipTrigger>
              <TooltipContent>
                <Text text={"Show Calendar"} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
     
                            </div>
                       

                            {error&&<Text text={error} className={'text-red-500 text-start'}/>}

 {
  isOpen&&
    <Card className="z-50 mt-2 absolute" >
      <FlatDatePicker   setIsOpen={setIsOpen} value={value} onChange={(value)=>{
        
      
        onChange(value)
        }}
        isTimePicker={isTimePicker}

        />
    </Card>
 }
  </div>
          
  )
}

export default CustomDatePicker
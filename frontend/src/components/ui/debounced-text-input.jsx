import useDebounce from "@/hooks/useDebounce";
import { useEffect } from "react";
import { useState } from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function DebouncedTextInput ({ title,value, onChange=()=>{},className }) {
  const [localValue, setLocalValue] = useState(value || "");
    const debouncedValue = useDebounce(localValue, 500);
    const {t} = useTranslation()
  
    useEffect(() => {
     
       
      if (!debouncedValue||debouncedValue !== value) {
        onChange(debouncedValue);
      }
    }, [debouncedValue]);
  
    return (
      <Input
        placeholder={`${t("enter")} ${title||''}`}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        className={cn("w-full",className)}
      />
    );
  };
  
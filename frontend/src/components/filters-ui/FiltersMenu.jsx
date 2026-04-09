import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {

  X,
} from "lucide-react";

import Text from "@/components/layout/text";

import DatePicker from "@/components/ui/date-picker";

import { DebouncedTextInput } from "@/components/ui/debounced-text-input";

import CustomsCombobox from "@/components/ui/customs-combobox";
import { customFormatDate } from "@/utils/methods";
import { useTranslation } from "react-i18next";



const FiltersMenu = ({
  values = [],
  onChange = () => {},
  defaultsFilters = [],
  setPage = () => {},
  setIsMenuOpen = () => {},
  isMenuOpen = false,
  isLoading = false,
}) => {

  
   const {t} = useTranslation();

  const updateCustomFilterValue = (index, value,itemValue) => {
    
    const updated = [...defaultsFilters];
    updated[index] = { ...updated[index], value };

    const currentItems = [...(values || [])];
    const existingIndex = currentItems.findIndex(
      (item) => item.key === updated[index].key
    );
    if (existingIndex !== -1) {
      currentItems[existingIndex].value = value;
    } else {
      if (value) {
        
        currentItems.push({ key: updated[index].key, value,itemValue:itemValue });
      }
    }

   
    

    onChange(currentItems);
    setPage(1);
  };

  function renderFilterInput(filter, index) {
      const currentValue = values.find(v => v.key === filter.key)?.value ?? null;
    switch (filter.type) {
      case "date":
        return (
          <DatePicker
            title={filter.title}
            className={filter.className}
            buttonClassName={filter.buttonClassName}
            clearClassName={filter.clearClassName}
            clearButtonClassName={filter.clearButtonClassName}
            isTimePicker={filter.isTimePicker}
            disabled={filter.disabled}
            hideIcon={filter.hideIcon}
            date={currentValue}
            setDate={(value) =>
              updateCustomFilterValue(index, customFormatDate(value))
            }
          />
        );
      case "text":
        return (
          <DebouncedTextInput
            title={filter.title}
            value={currentValue}
            onChange={(value) => updateCustomFilterValue(index, value)}
            className={filter.className}
          />
        );
      case "select":
        return (
          <Select
            onValueChange={(val) => {
      
      
              updateCustomFilterValue(index, val)
              }}
                      
            value={currentValue || ""}
            defaultValue={filter.defaultValue || ""}
          >
            <SelectTrigger className="w-full h-full">
              <SelectValue placeholder={`${t("Select")} ${filter.title||''}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {filter.options?.map((opt) => (
                  <SelectItem
                    key={`${filter.key}-${opt.value}`}
                    value={opt.value}
                    
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      case "combobox":
        return (
          <CustomsCombobox
          item={currentValue}
          setItem={(value) => {
                      updateCustomFilterValue(index, value,filter?.itemValue)               
                   }}
          endpoint={filter?.endpoint}
          queryKey={filter?.queryKey || filter?.itemValue}
          filters={filter?.filters||[]}
          itemTitle={filter?.itemTitle || 'name'}
          itemValue={filter?.itemValue || 'id'}
          placeholder={`${t("Select")} ${t(filter.title) || t('Item')}`}
          searchQueryKey={filter?.searchQueryKey || 'filter[name]'}
          disabled={filter?.disabled}
          className={filter?.className}
          buttonClassName={filter?.buttonClassName}
          clearButtonClassName={filter?.clearButtonClassName}
          clearClassName={filter?.clearClassName}
          containerClassName={filter?.containerClassName}
          hideIcon={filter?.hideIcon}
          label={filter?.label}
          required={filter?.required}
          
        />
        );
      default:
        return null;
    }
  }
return (
<AnimatePresence>
    {isMenuOpen && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full"
      >
        <Card className="w-full">
          <CardHeader className="relative p-0 px-4 py-2">
            <CardTitle className="flex justify-between items-center w-full text-lg font-medium">{t("Filter By")}
            {/* <div className="absolute top-4 right-4"> */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <X className="h-4 w-4 opacity-50" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <Text text="Close filters menu" />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            {/* </div> */}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4  gap-4 px-4">
            {defaultsFilters.length === 0 ? (
              <Text text={"No filters available"} className="text-muted-foreground" />
            ) : (
              defaultsFilters.map((filter, index) => (
                <div key={index}>
                  {filter.type && renderFilterInput(filter, index)}
                </div>
              ))
            )}
          </CardContent>
          {/* <FiltersFooter
            isLoading={isLoading}
            onApply={() => {}}
            onReset={() => {
              setPage(1);
              onChange([]);
            }}
          /> */}
        </Card>
      </motion.div>
    )}
  </AnimatePresence>
)};

export default FiltersMenu;

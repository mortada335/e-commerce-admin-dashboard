import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import {
  Card,

} from "@/components/ui/card";
import {

  RotateCcw,
  FilterIcon,
  SearchIcon,
} from "lucide-react";

import Text from "@/components/layout/text";

import useDebounce from "@/hooks/useDebounce";
import { useTranslation } from "react-i18next";

const FiltersSection = ({
  value = [],
  onChange = () => {},
  isMenuOpen = false,
  setIsMenuOpen = () => {},
  setPage = () => {},
  isLoading = false,
  searchQueryKey='name',
  className="",
  isFilterMenu,
  ...props

}) => {
  const [input, setInput] = useState(null);
  const isFilter = value?.length > 0 ? true : false;
  const debouncedInputValue = useDebounce(input, 500);
  const {t} = useTranslation()


  const clearFilters= ()=>{
    onChange([])
    setInput('')
  }


  const onFiltersChange=(inputValue)=>{
    
    const currentItems = [...(value||[])]
    const index = currentItems.findIndex((item)=>item?.key===searchQueryKey)
    if (index === -1) {
      if (inputValue) {
        
        currentItems.push({key: searchQueryKey, value: inputValue})
      }
      
    } else {
      currentItems[index].value=inputValue
    }
    onChange(currentItems)
    setPage(1)
  }

  useEffect(() => {
  
    onFiltersChange(debouncedInputValue)
  
  }, [debouncedInputValue,searchQueryKey])



  

  return (
    <form
    onSubmit={(e) => {
      e.preventDefault();
      onFiltersChange(input);
      
    }}
  >

    <Card   {...props} className={cn("flex justify-between items-center rounded-sm min-w-[350px]",className)}>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={input ? "secondary" : "ghost"}
            size="icon"
            type="submit"
            className="rounded-none border-r rtl:border-l"
      
          >
              <SearchIcon className="h-4 w-4 opacity-50" />
           
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <Text text="Search" />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <Input
      onChange={(e) => setInput(e.target.value)}
      type="text"
      placeholder={t("Search about") + ` ${t(searchQueryKey)}`}
      disabled={isLoading}
      className="w-full rounded-none border-none !outline-none ring-0 focus-visible:ring-0"
      value={input ?? ""}
    />
        {isFilterMenu !== false && ( // show only if true
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isMenuOpen ? "secondary" : "ghost"}
                  size="icon"
                  type="button"
                  className="rounded-none border-l rtl:border-r"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <FilterIcon className="h-4 w-4 opacity-50" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <Text text="Toggle filters menu" />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
    {isFilter && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={clearFilters}
                      size="icon"
                      variant={"outline"}
                       type="button"
                      className="rounded-none border-l rtl:border-r"
                    >
                      <RotateCcw size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{"Clear Filters"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
  </Card>
  </form>
  );
};

export default FiltersSection;

import { SquarePen, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { setIsDeleteOptionDialogOpen, setIsOptionDialogOpen, setSelectedOption } from "../store"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import Can from "@/components/Can"
import { useTranslation } from "react-i18next"

const ActionsCell = ({ item }) => {
  // Edit  Action
  const handleEditOption = () => {
    setSelectedOption(item)
    setIsOptionDialogOpen(true)
  }
  const handleDeleteOption = () => {
    setSelectedOption(item)
    setIsDeleteOptionDialogOpen(true)
  }
  const {t} = useTranslation()

  return (
    <div className="flex justify-start items-center w-full">

<Can permissions={["app_api.change_ocoptionvalue"]}>
        
               <TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>  
      <Button onClick={handleEditOption} variant="ghost" className="h-8 w-8 px-0 py-0">
        
      <SquarePen size={16} />
      </Button>
      </TooltipTrigger>
    <TooltipContent>
    <span>{t("Edit")}</span>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
</Can>
<Can permissions={["app_api.delete_ocoptionvalue"]}>
        
               <TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>  
      <Button onClick={handleDeleteOption} variant="ghost" className="h-8 w-8 px-0 py-0 text-red-500 
            hover:!text-red-600 hover:!bg-red-50   ">
        
      <Trash size={16} />
      </Button>
      </TooltipTrigger>
    <TooltipContent>
    <span>{t("Delete")}</span>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
</Can>
    </div>
  )
}

export default ActionsCell

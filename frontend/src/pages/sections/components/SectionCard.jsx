import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { EllipsisVertical, Languages, SquarePen, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"
import { useSortable } from "@dnd-kit/sortable"

import { CSS } from "@dnd-kit/utilities";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Can from "@/components/Can"
import { useTranslation } from "react-i18next"


const SectionCard = ({
  section,
  setIsDeleteDialogOpen,
  setSelectedSection,
  setIsSectionDialogOpen,
  setIsArabic,
  isArabic,
}) => {

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({id:section.id });
    
  const {t} = useTranslation()
  const style = {
    transition,
    transform: CSS.Transform?.toString(transform),
  };
  const onDelete = () => {
    setSelectedSection(section)
    setIsDeleteDialogOpen(true)
  }
  const onUpdate = () => {
    setSelectedSection(section)
    setIsSectionDialogOpen(true)
  }
  return (
    <Card  
    ref={setNodeRef}
    style={style}
    {...attributes}
   
    className="w-full h-full ">
      <CardContent  className="px-3 py-3 relative">
        {section?.section_background ? (
          <img
        
          {...listeners}
            src={section?.section_background}
            alt={""}
            className="w-full h-40 object-cover rounded-sm"
          />
        ) : (
          <div className="size-40 w-full bg-accent rounded-sm"></div>
        )}
 <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
        <Can permissions={["app_api.change_homepagesections"]}>

          <Button size="icon" variant="ghost" className="py-0 px-0 opacity-70 rounded-full absolute top-5 left-5">

        <Badge className="py-2 px-3 opacity-70 rounded-full " {...listeners}  >
          {section.order_id}
        </Badge>
          </Button>
        </Can>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("Hold to Drag")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
     
 

        <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button size="icon" className="h-8 w-8 p-0 absolute top-5 right-5">
      <span className="sr-only">{t("Open menu")}</span>
      <EllipsisVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>

    <DropdownMenuSeparator />

    <DropdownMenuItem
    type="submit"
      className="space-x-2 "
      onClick={() => {
        setIsArabic(!isArabic);
      }}

    >
      {" "}
      <Languages size={16} />{" "}
      <span>{isArabic ? t("English") : t("Arabic")}</span>
    </DropdownMenuItem>
    <Can permissions={["app_api.change_homepagesections"]}>
    <DropdownMenuItem
      className="space-x-2 "
      onClick={onUpdate}
    >
      {" "}
      <SquarePen size={16} /> <span>{t("Edit")}</span>{" "}
    </DropdownMenuItem>
    </Can>
    <Can permissions={["app_api.delete_homepagesections"]}>
    <DropdownMenuItem
      className="space-x-2 text-red-500"
      onClick={onDelete}
    >
      {" "}
      <Trash size={16} className="" /> <span>{t("Delete")}</span>
    </DropdownMenuItem>
    </Can>
  </DropdownMenuContent>
</DropdownMenu>
  

      </CardContent>

      <CardHeader className="py-2 px-3">
        <CardTitle className="!text-[#333333] !font-semibold !text-2xl">
          {" "}
          {
            section.section_title?.find(
              (item) => item.language_id === (isArabic ? 2 : 1)
            )?.title
          }
        </CardTitle>
        <CardDescription>
          {" "}
          {
            section.section_title?.find(
              (item) => item.language_id === (isArabic ? 2 : 1)
            )?.sub_title
          }
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

export default SectionCard

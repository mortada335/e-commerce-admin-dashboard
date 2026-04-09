import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  setIsBannerDialogOpen,
  setIsDeleteDialogOpen,
  setSelectedBanner,
} from "../store"
import { useTranslation } from "react-i18next"

const ActionsCell = ({ item }) => {
    const {t} = useTranslation()
  // Edit Banner Action
  const handleEditBanner = () => {
    setSelectedBanner(item)
    setIsBannerDialogOpen(true)
  }
  // Delete Banner Action
  const handleDeleteBanner = async () => {
    setSelectedBanner(item)
    setIsDeleteDialogOpen(true)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">{t("Open menu")}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(item.banner_image_id)}
          >
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex justify-start items-center space-x-2 cursor-pointer"
            onClick={handleEditBanner}
          >
            <SquarePen size={16} /> <span>Edit</span>{" "}
          </DropdownMenuItem>
         
          <DropdownMenuItem  className="flex justify-start items-center space-x-2 cursor-pointer text-red-500" onClick={handleDeleteBanner}>
            
            <Trash2 size={16} /> <span>Delete</span>{" "}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default ActionsCell

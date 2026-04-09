import { MoreHorizontal, SquarePen, Trash } from "lucide-react"
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
  setIsNoteDialogOpen,
  setSelectedNote,
  setIsDeleteNoteDialogOpen,
} from "../store"
import { useTranslation } from "react-i18next"

const ActionsCell = ({ item }) => {
    const {t} = useTranslation()
  // Edit Note Action
  const handleEditNote = () => {
    setSelectedNote(item)
    setIsNoteDialogOpen(true)
  }
  // Delete Note Action
  const handleDeleteNote = async () => {
    setSelectedNote(item)
    setIsDeleteNoteDialogOpen(true)
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
            onClick={() => navigator.clipboard.writeText(item.id)}
          >
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem   className="flex justify-start items-center space-x-2" onClick={handleEditNote}><SquarePen size={16} /> <span>Edit</span>{" "}</DropdownMenuItem>
          <DropdownMenuItem className="flex justify-start items-center space-x-2 text-red-500" onClick={handleDeleteNote}> <Trash size={16} className="" /> <span>Delete</span></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default ActionsCell

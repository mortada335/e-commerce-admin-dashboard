import { MoreHorizontal, SquarePen, Trash, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  setIsAttributeDialogOpen,
  setIsDeleteAttributeDialogOpen,
  setSelectedAttribute,
} from "../store";
import Can from "@/components/Can";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

const ActionsCell = ({ item }) => {
  const {t} = useTranslation()
  // Toast for notification.
  const { toast } = useToast();

  // Edit Attribute Action
  const handleEditAttribute = () => {
    setSelectedAttribute(item);
    setIsAttributeDialogOpen(true);
  };
  // Delete Attribute Action
  const handleDeleteAttribute = async () => {
    setSelectedAttribute(item);
    setIsDeleteAttributeDialogOpen(true);
  };

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
          <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(item.id);
              toast({
                title: "Copied!",
                description: `${item.id} copied to clipboard successfully.`,
              });
            }}
          >
            {t("Copy Id")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Can permissions={["app_api.change_ocattribute"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2 cursor-pointer"
              onClick={handleEditAttribute}
            >
              <SquarePen size={16} /> <span>{t("Edit")}</span>{" "}
            </DropdownMenuItem>
          </Can>
          <Can permissions={["app_api.delete_ocattribute"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2 text-red-500
              hover:!bg-red-50 hover:!text-red-600 cursor-pointer"
              onClick={handleDeleteAttribute}
            >
              <Trash2 size={16} className="" /> <span>{t("Delete")}</span>
            </DropdownMenuItem>
          </Can>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ActionsCell;

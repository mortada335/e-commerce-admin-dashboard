import {
  Eye,
  MoreHorizontal,
  ShieldBan,
  ShieldCheck,
  SquarePen,
  Trash2,
} from "lucide-react";
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
  setIsAppIconDialogOpen,
  setIsChangeStatusAppIconDialogOpen,
  setIsDeleteDialogOpen,
  setSelectedAppIcon,
} from "../store";
import { Link } from "react-router-dom";
import Can from "@/components/Can";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

const ActionsCell = ({ item }) => {
  // Toast for notification.
  const { toast } = useToast();

  // Edit AppIcon Action
  const handleEditAppIcon = () => {
    setSelectedAppIcon(item);
    setIsAppIconDialogOpen(true);
  };

  // Delete AppIcon Action
  const handleDeleteAppIcon = async () => {
    setSelectedAppIcon(item);
    setIsDeleteDialogOpen(true);
  };
  const handleStatusAppIcon = async () => {
    setSelectedAppIcon(item);
    setIsChangeStatusAppIconDialogOpen(true);
  };
  const {t} = useTranslation()

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
            onClick={() => {
              navigator.clipboard.writeText(item.id);
              toast({
                title: "Copied",
                description: `${item?.id} copied to clipboard successfully.`,
              });
            }}
            className="cursor-pointer"
          >
            {t("Copy Id")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <Can permissions={["app_api.change_appicon"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2 cursor-pointer"
              onClick={handleEditAppIcon}
            >
              <SquarePen size={16} /> <span>{t("Edit")}</span>{" "}
            </DropdownMenuItem>
          </Can>
          <Can permissions={["app_api.change_appicon"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2 cursor-pointer"
              onClick={handleStatusAppIcon}
            >
              {item.enabled ? (
                <ShieldBan size={16} />
              ) : (
                <ShieldCheck size={16} />
              )}
              <span>{item.is_active ? t("Disable") : t("Enabled")}</span>
            </DropdownMenuItem>
          </Can>
          <Can permissions={["app_api.delete_appicon"]}>

          <DropdownMenuItem
            className="flex justify-start items-center space-x-2 text-red-500 cursor-pointer
            hover:!text-red-600 hover:!bg-red-50"
            onClick={handleDeleteAppIcon}
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

import {
  Eye,
  Key,
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
  setSelectedRole,
  setIsDeleteRoleDialogOpen,
  setIsRoleDialogOpen,
  setIsEditRoleDialogOpen,
  setIsAssignRoleDialogOpen,
} from "../store";
import { Link } from "react-router-dom";
import Can from "@/components/Can";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

const ActionsCell = ({ item }) => {
  // Toast for notification.
  const { toast } = useToast();
    const {t} = useTranslation()

    const handleAssignRole =()=>{
      setIsAssignRoleDialogOpen(true)
      setSelectedRole(item)
    }

  // Edit User Action
  const handleEditRole = () => {
    setSelectedRole(item);
    setIsEditRoleDialogOpen(true);
  };
  //Delete User Action
  const handleDeleteRole = async () => {
    setSelectedRole(item);
    setIsDeleteRoleDialogOpen(true);
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
          <Can permissions={["app_api.change_userrank"]}>
            <Link to={`/roles/${item.id}/`}>
              <DropdownMenuItem className="flex justify-start items-center space-x-2 cursor-pointer">
                {" "}
                <Eye size={16} /> <span>{t("View")}</span>{" "}
              </DropdownMenuItem>
            </Link>
          </Can>
          <Can permissions={["app_api.change_userrank"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2 cursor-pointer"
              onClick={handleAssignRole}
            >
              <SquarePen size={16} /> <span>{t("assign_permission")}</span>{" "}
            </DropdownMenuItem>
          </Can>
          <Can permissions={["app_api.delete_ocuser"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2 text-red-500
              hover:!text-red-600 hover:!bg-red-50 cursor-pointer"
              onClick={handleDeleteRole}
            >
              <Trash2 size={16} /> <span>{t("Delete")}</span>{" "}
            </DropdownMenuItem>
          </Can>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ActionsCell;

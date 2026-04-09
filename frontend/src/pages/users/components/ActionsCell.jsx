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
  setSelectedUser,
  setIsChangeStatusDialogOpen,
  setIsDeleteUserDialogOpen,
  setIsChangePasswordDialogOpen,
  setIsUserEditDialogOpen,
  setIsWarhouseDialogOpen,
  setIsAssignRolesDialogOpen,
} from "../store";
import { Link } from "react-router-dom";
import Can from "@/components/Can";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

const ActionsCell = ({ item }) => {
  // Toast for notification.
  const { toast } = useToast();
  const { t } = useTranslation()

  // Edit User Action
  const handleEditUser = () => {
    setSelectedUser(item);
    setIsUserEditDialogOpen(true);
  };
  //Delete User Action
  const handleDeleteUser = async () => {
    setSelectedUser(item);
    setIsDeleteUserDialogOpen(true);
  };
  const handleStatus = async () => {
    setSelectedUser(item);
    setIsChangeStatusDialogOpen(true);
  };
  const handleChangePassword = async () => {
    setSelectedUser(item);
    setIsChangePasswordDialogOpen(true);
  };
  const handleAddWarehouse = () => {
    setSelectedUser(item);
    setIsWarhouseDialogOpen(true);
  };
  const handleAssignRoles = () => {
    setSelectedUser(item);
    setIsAssignRolesDialogOpen(true);
  };

  return (
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

        {/* View User */}
        <Can permissions={["auth.view_user"]}>
          <Link to={`/users/details/${item.id}`}>
            <DropdownMenuItem className="flex justify-start items-center space-x-2 cursor-pointer">
              <Eye size={16} />
              <span>{t("View")}</span>
            </DropdownMenuItem>
          </Link>
        </Can>

        {/* Assign Roles */}
        <Can permissions={["app_api.change_ocuser"]}>
          <DropdownMenuItem
            className="flex justify-start items-center space-x-2 cursor-pointer"
            onClick={handleAssignRoles}
          >
            <SquarePen size={16} />
            <span>{t("Assign Roles")}</span>
          </DropdownMenuItem>
        </Can>

        {/* Edit User */}
        {/* <Can permissions={["auth.change_user"]}>
          <DropdownMenuItem
            className="flex justify-start items-center space-x-2 cursor-pointer"
            onClick={handleEditUser}
          >
            <SquarePen size={16} />
            <span>{t("Edit")}</span>
          </DropdownMenuItem>
        </Can> */}

        {/* Change Password */}
        <Can permissions={["app_api.change_userlogin"]}>
          <DropdownMenuItem
            className="flex justify-start items-center space-x-2 cursor-pointer"
            onClick={handleChangePassword}
          >
            <Key size={16} />
            <span>{t("Change Password")}</span>
          </DropdownMenuItem>
        </Can>

        {/* Enable / Disable User */}
        <Can permissions={["auth.change_user"]}>
          <DropdownMenuItem
            className="flex justify-start items-center space-x-2 cursor-pointer"
            onClick={handleStatus}
          >
            {item?.is_active ? <ShieldBan size={16} /> : <ShieldCheck size={16} />}
            <span>{item?.is_active ? t("Disable") : t("Enable")}</span>
          </DropdownMenuItem>
        </Can>

        {/* Delete User */}
        <Can permissions={["auth.delete_user"]}>
          <DropdownMenuItem
            className="flex justify-start items-center space-x-2 text-red-500
            hover:!text-red-600 hover:!bg-red-50 cursor-pointer"
            onClick={handleDeleteUser}
          >
            <Trash2 size={16} />
            <span>{t("Delete")}</span>
          </DropdownMenuItem>
        </Can>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsCell;

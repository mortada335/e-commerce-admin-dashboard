import {
  Eye,
  MoreHorizontal,
  ShieldBan,
  ShieldCheck,
  SquarePen,
  Trash,
  UserSearch,
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
  setIsUserDialogOpen,
  setSelectedUser,
  setIsChangeStatusDialogOpen,
  setIsDeleteUserDialogOpen,
  setIsWarhouseDialogOpen,
  setIsAssignRoleToUserDialogOpen,
} from "../store";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Can from "@/components/Can";
import { useTranslation } from "react-i18next";

const ActionsCell = ({ item }) => {
  const { toast } = useToast();
  // Edit User Action
  const handleEditUser = () => {
    setSelectedUser(item);
    setIsUserDialogOpen(true);
  };
  const handleAddWarehouse = () => {
    setSelectedUser(item);
    setIsWarhouseDialogOpen(true);
  };

  const handleAssignRole =()=>{
    setIsAssignRoleToUserDialogOpen(true)
    setSelectedUser(item)
  }
  // Delete User Action
  // const handleDeleteUser = async () => {
  //   setSelectedUser(item)
  //   setIsDeleteUserDialogOpen(true)
  // }
  const handleStatus = async () => {
    setSelectedUser(item);
    setIsChangeStatusDialogOpen(true);
  };
  const {t} = useTranslation()

  //Delete User Action
  const handleDeleteUser = async () => {
    setSelectedUser(item);
    setIsDeleteUserDialogOpen(true);
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
            onClick={() => {
              navigator.clipboard.writeText(item.id);
              toast({
                title: "Success",
                description: "User id copied to clipboard.",
              });
            }}
          >
            {t("Copy Id")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Can permissions={["app_api.change_userrank"]}>
            <Link to={`/settings/admins/${item.id}`}>
              <DropdownMenuItem className="flex justify-start items-center space-x-2">
                {" "}
                <Eye size={16} /> <span>{t("View")}</span>{" "}
              </DropdownMenuItem>
            </Link>
          </Can>
          <Can permissions={["app_api.change_userrank"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2"
              onClick={handleEditUser}
            >
              <SquarePen size={16} /> <span>{t("Edit")}</span>{" "}
            </DropdownMenuItem>
          </Can>{" "}
          <Can permissions={["app_api.change_userrank"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2"
              onClick={handleAssignRole}
            >
              <UserSearch size={16} /> <span>{t("Assign Roles")}</span>{" "}
            </DropdownMenuItem>
          </Can>{" "}
          <Can permissions={["app_api.change_userrank"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2"
              onClick={handleAddWarehouse}
            >
              <SquarePen size={16} /> <span>{t("Add Warehouse")}</span>{" "}
            </DropdownMenuItem>
          </Can>
          {/* <DropdownMenuItem onClick={handleDeleteUser}>Delete</DropdownMenuItem> */}
          <Can permissions={["app_api.change_userrank"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2"
              onClick={handleStatus}
            >
              {item?.is_active ? (
                <ShieldBan size={16} />
              ) : (
                <ShieldCheck size={16} />
              )}
              <span>{item?.is_active ? t("Disable") : t("Enabled")}</span>
            </DropdownMenuItem>
          </Can>
          <Can permissions={["app_api.delete_ocuser"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2 text-red-500"
              onClick={handleDeleteUser}
            >
              <Trash size={16} /> <span>{t("Delete")}</span>{" "}
            </DropdownMenuItem>
          </Can>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ActionsCell;

import {
  Eye,
  // EyeIcon,
  // Key,
  // MoreHorizontal,
  // ShieldBan,
  // ShieldCheck,
  // SquarePen,
  // Trash2,
} from "lucide-react";
// import {
// DropdownMenu,
// DropdownMenuContent,
// DropdownMenuItem,
// DropdownMenuLabel,
// DropdownMenuSeparator,
// DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import {
// setSelectedUser,
// setIsChangeStatusDialogOpen,
// setIsDeleteUserDialogOpen,
// setIsChangePasswordDialogOpen,
// setIsUserEditDialogOpen,
// } from "../store";
import { Link } from "react-router-dom";
import Can from "@/components/Can";
// import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Text from "@/components/layout/text";
import { useTranslation } from "react-i18next";

const ActionsCell = ({ item }) => {
  const {t} = useTranslation()
  // Toast for notification.
  // const { toast } = useToast();

  // // Edit User Action
  // const handleEditUser = () => {
  //   setSelectedUser(item);
  //   setIsUserEditDialogOpen(true);
  // };
  // //Delete User Action
  // const handleDeleteUser = async () => {
  //   setSelectedUser(item);
  //   setIsDeleteUserDialogOpen(true);
  // };
  // const handleStatus = async () => {
  //   setSelectedUser(item);
  //   setIsChangeStatusDialogOpen(true);
  // };
  // const handleChangePassword = async () => {
  //   setSelectedUser(item);
  //   setIsChangePasswordDialogOpen(true);
  // };

  return (
    <>
      <Can permissions={["app_api.view_deleteduser"]}>
        <div className="flex justify-center items-center space-x-2 w-full">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                {" "}
                <Link
                  className="flex justify-start items-center space-x-2"
                  to={`/deleted-users/details/${item.id}`}
                >
                  {" "}
                  <Eye size={20} />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <Text text={t("View")} />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Can>
    </>
  );
};

export default ActionsCell;

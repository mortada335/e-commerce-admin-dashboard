import { Check, MoreHorizontal, SquarePen, Trash2, X } from "lucide-react";
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
  setIsScheduledNotificationDialogOpen,
  setIsDeleteNotificationDialogOpen,
  setSelectedNotification,
  setIsChangeStatusDialogOpen,
} from "../store";
import Can from "@/components/Can";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

const ActionsCell = ({ item }) => {
  // Toast for notificaiton.
  const { toast } = useToast();
    const {t} = useTranslation()

  // Edit Notification Action
  const handleEditNotification = () => {
    setSelectedNotification(item);
    setIsScheduledNotificationDialogOpen(true);
  };
  // Approve Notification Action
  const handleApproveNotification = () => {
    setSelectedNotification(item);
    setIsChangeStatusDialogOpen(true);
  };
  // Delete Notification Action
  const handleDeleteNotification = async () => {
    setSelectedNotification(item);
    setIsDeleteNotificationDialogOpen(true);
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
              navigator.clipboard.writeText(item.Notification_image_id);
              toast({
                title: t("Copied"),
                description: `${item.Notification_image_id} ${t("copied to clipboard successfully.")}`,
              });
            }}
          >
            {t("Copy Id")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Can permissions={["app_api.change_schedulednotifications"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2 cursor-pointer"
              onClick={handleApproveNotification}
            >
            {
!item?.is_approved_by_admin?<>

              <Check size={16} /> 
              <span>{t("Approve")}</span>
</>:<>

              <X size={16} /> 
              <span>{t("Rejected")}</span>
</>
            }
            </DropdownMenuItem>
          </Can>
          
          <Can permissions={["app_api.change_schedulednotifications"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2 cursor-pointer"
              onClick={handleEditNotification}
            >
              <SquarePen size={16} /> <span>{t("Edit")}</span>{" "}
            </DropdownMenuItem>
          </Can>
          <Can permissions={["app_api.delete_schedulednotifications"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2 cursor-pointer text-red-500
              hover:!bg-red-50 hover:!text-red-600"
              onClick={handleDeleteNotification}
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

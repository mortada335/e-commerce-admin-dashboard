import { Eye, Trash, Trash2, Edit, UserSearch } from "lucide-react";

import {
  setIsDeleteOrderDialogOpen,
  setIsOrderDialogOpen,
  setSelectedOrder,
  setIsAssignUsersDialog,
} from "../store";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Text from "@/components/layout/text";
import Can from "@/components/Can";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const ActionsCell = ({ item }) => {
  // Toast for notification.
  const { toast } = useToast();
    const {t} = useTranslation()

  // Edit Order Action
  const handleEditOrder = () => {
    setSelectedOrder(item?.orderData);
    setIsOrderDialogOpen(true);
  };
  // Delete Order Action
  const handleDeleteOrder = async () => {
    setSelectedOrder(item);
    setIsDeleteOrderDialogOpen(true);
  };
  const handleAssignUsers = async () => {
    setSelectedOrder(item);
    setIsAssignUsersDialog(true);
  };

  return (
    <Can permissions={["app_api.view_ocorder"]}>
      <div className="flex gap-2  w-full">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="none" onClick={handleAssignUsers}>
                <UserSearch size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <Text text={t("assign user")} />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {" "}
              <Link
                className="  "
                to={`/sales/orders/details/${item.orderId}`}
                onClick={() => {
                  setSelectedOrder(item?.orderData);
                }}
              >
                <Eye size={20} />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <Text text={t("View")} />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* <Can permissions={["app_api.delete_ocorder"]}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="none"
                  className="text-red-500"
                  onClick={handleDeleteOrder}
                >
                  <Trash2 size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <Text text="Delete Order" />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Can> */}
      </div>
    </Can>
  );
};

export default ActionsCell;
{
  /* <DropdownMenu>
<DropdownMenuTrigger asChild>
  <Button variant="ghost" className="h-8 w-8 p-0">
    <span className="sr-only">{t("Open menu")}</span>
    <MoreHorizontal className="h-4 w-4" />
  </Button>
</DropdownMenuTrigger>
<DropdownMenuContent align="end">
  <DropdownMenuLabel>Actions</DropdownMenuLabel>
  <DropdownMenuItem
    onClick={() => navigator.clipboard.writeText(item.orderId)}
  >
    Copy Id
  </DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuItem>
    {" "}
   
  </DropdownMenuItem>
  <DropdownMenuItem
    className="flex justify-start items-center space-x-2"
    onClick={handleEditOrder}
  >
    {" "}
    <SquarePen size={16} /> <span>Edit</span>{" "}
  </DropdownMenuItem>

  {/* <DropdownMenuItem onClick={handleDeleteOrder}>
    Delete
  </DropdownMenuItem> */
}
// </DropdownMenuContent>
// </DropdownMenu> */}

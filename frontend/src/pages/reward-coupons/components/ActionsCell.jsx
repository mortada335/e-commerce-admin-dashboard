import { MoreHorizontal, SquarePen, Trash2, View } from "lucide-react";
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
  setIsGeneralCouponDialogOpen,
  setIsDeleteDialogOpen,
  setSelectedGeneralCoupon,
} from "../store";
import { Link } from "react-router-dom";
import Can from "@/components/Can";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

const ActionsCell = ({ item }) => {
  // Toast for notification.
  const { toast } = useToast();
  const {t} = useTranslation()

  // Edit GeneralCoupon Action
  const handleEditGeneralCoupon = () => {
    setSelectedGeneralCoupon(item);
    setIsGeneralCouponDialogOpen(true);
  };
  // Delete GeneralCoupon Action
  const handleDeleteGeneralCoupon = async () => {
    setSelectedGeneralCoupon(item);
    setIsDeleteDialogOpen(true);
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
                title: "Copied",
                description: `${item.id} copied to clipboard sucessfully.`,
              });
            }}
          >
            {t("Copy Id")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Can permissions={["app_api.view_occoupon"]}>
            <DropdownMenuItem>
              <Link
                className="flex justify-start items-center space-x-2 w-full cursor-pointer"
                to={`/ecommerce/reward-promo-codes/details/${item.id}`}
              >
                {" "}
                <View size={16} /> <span>{t("View")}</span>{" "}
              </Link>
            </DropdownMenuItem>
          </Can>
          {/* <Can permissions={["app_api.change_occoupon"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2 cursor-pointer"
              onClick={handleEditGeneralCoupon}
            >
              <SquarePen size={16} /> <span>Edit</span>{" "}
            </DropdownMenuItem>
          </Can> */}
          <Can permissions={["app_api.delete_occoupon"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2 text-red-500
              hover:!text-red-600 hover:!bg-red-50 cursor-pointer"
              onClick={handleDeleteGeneralCoupon}
            >
              <Trash2 size={16} /> <span>{t("Delete")}</span>
            </DropdownMenuItem>
          </Can>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ActionsCell;

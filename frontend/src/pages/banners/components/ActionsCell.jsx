import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
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
  setIsBannerDialogOpen,
  setIsDeleteDialogOpen,
  setSelectedBanner,
} from "../store";
import Can from "@/components/Can";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

const ActionsCell = ({ item }) => {
  const {t} = useTranslation()
  // Toast for notificaiton.
  const { toast } = useToast();

  // Edit Banner Action
  const handleEditBanner = () => {
    setSelectedBanner(item);
    setIsBannerDialogOpen(true);
  };
  // Delete Banner Action
  const handleDeleteBanner = async () => {
    setSelectedBanner(item);
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
            onClick={() => {
              navigator.clipboard.writeText(item.banner_image_id);
              toast({
                title: "Copied",
                description: `${item.banner_image_id} copied to clipboard successfully.`,
              });
            }}
          >
            {t("Copy Id")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Can permissions={["app_api.change_ocbannerimage"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2 cursor-pointer"
              onClick={handleEditBanner}
            >
              <SquarePen size={16} /> <span>{t("Edit")}</span>{" "}
            </DropdownMenuItem>
          </Can>
          <Can permissions={["app_api.delete_ocbannerimage"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2 cursor-pointer text-red-500
              hover:!bg-red-50 hover:!text-red-600"
              onClick={handleDeleteBanner}
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

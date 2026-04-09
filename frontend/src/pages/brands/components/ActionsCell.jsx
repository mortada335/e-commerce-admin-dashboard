import {
  Eye,
  MoreHorizontal,
  Share,
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
  setIsBrandDialogOpen,
  setIsChangeStatusBrandDialogOpen,
  setIsDeleteDialogOpen,
  setSelectedBrand,
} from "../store";
import { Link } from "react-router-dom";
import Can from "@/components/Can";
import { useToast } from "@/components/ui/use-toast";
import { handleShare } from "@/utils/methods";
import { useTranslation } from "react-i18next";

const ActionsCell = ({ item }) => {
  // Toast for notification.
  const { toast } = useToast();
  const {t} = useTranslation()
  // Edit Brand Action
  const handleEditBrand = () => {
    setSelectedBrand(item);
    setIsBrandDialogOpen(true);
  };

  // Delete Brand Action
  const handleDeleteBrand = async () => {
    setSelectedBrand(item);
    setIsDeleteDialogOpen(true);
  };
  const handleStatusBrand = async () => {
    setSelectedBrand(item);
    setIsChangeStatusBrandDialogOpen(true);
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
              navigator.clipboard.writeText(item.manufacturer_id);
              toast({
                title: t("Copied"),
                description: `${item?.manufacturer_id} ${t("copied to clipboard successfully.")}`,
              });
            }}
            className="cursor-pointer"
          >
            Copy Id
          </DropdownMenuItem>
                    <DropdownMenuItem
          className="flex justify-start items-center gap-2 w-full"
            onClick={()=>handleShare(item?.manufacturer_id,`manufacturer/manufacturer&manufacturer_id`)}
          >
            <Share size={16} />{t("Share")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Can permissions={["app_api.add_ocmanufacturer"]}>
            <DropdownMenuItem className="cursor-pointer">
              {" "}
              <Link
                className="flex justify-start items-center space-x-2"
                to={`/catalog/brands/details/${item.manufacturer_id}`}
              >
                {" "}
                <Eye size={16} /> <span>{t("View")}</span>{" "}
              </Link>
            </DropdownMenuItem>
          </Can>
          <Can permissions={["app_api.change_ocmanufacturer"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2 cursor-pointer"
              onClick={handleEditBrand}
            >
              <SquarePen size={16} /> <span>{t("Edit")}</span>{" "}
            </DropdownMenuItem>
          </Can>
          <Can permissions={["app_api.change_ocmanufacturer"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2 cursor-pointer"
              onClick={handleStatusBrand}
            >
              {item.enabled ? (
                <ShieldBan size={16} />
              ) : (
                <ShieldCheck size={16} />
              )}
              <span>{item.enabled ? t("Disable") : t("Enabled")}</span>
            </DropdownMenuItem>
          </Can>
          <Can permissions={["app_api.delete_ocmanufacturer"]}>

          <DropdownMenuItem
            className="flex justify-start items-center space-x-2 text-red-500 cursor-pointer
            hover:!text-red-600 hover:!bg-red-50"
            onClick={handleDeleteBrand}
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

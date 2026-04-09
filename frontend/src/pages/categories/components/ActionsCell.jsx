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
  setIsCategoryDialogOpen,
  setSelectedCategory,
  setIsChangeStatusCategoryDialogOpen,
  setIsDeleteCategoryDialogOpen,
} from "../store";
import { Link } from "react-router-dom";
import Can from "@/components/Can";
import { handleShare } from "@/utils/methods";
import { useTranslation } from "react-i18next";

const ActionsCell = ({ item }) => {
  const {t} = useTranslation()
  // Edit Category Action
  const handleEditCategory = () => {
    setSelectedCategory(item);
    setIsCategoryDialogOpen(true);
  };
  // Delete Category Action
  const handleDeleteCategory = async () => {
    setSelectedCategory(item);
    setIsDeleteCategoryDialogOpen(true);
  };
  const handleStatusCategory = async () => {
    setSelectedCategory(item);
    setIsChangeStatusCategoryDialogOpen(true);
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
            onClick={() => navigator.clipboard.writeText(item?.id)}
          >
            {t("Copy Id")}
          </DropdownMenuItem>
          <DropdownMenuItem
          className="flex justify-start items-center gap-2 w-full"
            onClick={()=>handleShare(item?.id)}
          >
            <Share size={16} />{t("Share")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Can permissions={["app_api.add_occategory"]}>
            <DropdownMenuItem>
              {" "}
              <Link
                className="flex justify-start items-center space-x-2 w-full"
                to={`/catalog/categories/details/${item?.id}`}
              >
                {" "}
                <Eye size={16} /> <span>{t("view")}</span>{" "}
              </Link>
            </DropdownMenuItem>
          </Can>
          <Can permissions={["app_api.change_occategory"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2 cursor-pointer"
              onClick={handleEditCategory}
            >
              <SquarePen size={16} /> <span>{t("Edit")}</span>{" "}
            </DropdownMenuItem>
          </Can>
          {/* <DropdownMenuItem onClick={handleDeleteCategory}>
            Delete
          </DropdownMenuItem> */}
          <Can permissions={["app_api.change_occategory"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2 cursor-pointer"
              onClick={handleStatusCategory}
            >
              {item.status === 1 ? (
                <ShieldBan size={16} />
              ) : (
                <ShieldCheck size={16} />
              )}
              <span>{item.status === 1 ? t("Disable") : t("Enabled")}</span>
            </DropdownMenuItem>

            </Can>
            <Can permissions={["app_api.delete_occategory"]}>

            <DropdownMenuItem
              className="flex items-center justify-start space-x-2 cursor-pointer text-red-500 hover:!bg-red-50 hover:!text-red-500"
              onClick={handleDeleteCategory}
            >
              <Trash2 size={16} />
              <span>{t("Delete")}</span>
            </DropdownMenuItem>
            </Can>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ActionsCell;

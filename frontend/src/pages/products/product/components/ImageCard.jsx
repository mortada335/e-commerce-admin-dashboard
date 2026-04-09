import { setCurrentSelectedImage, setIsDeleteImageDialogOpen, setIsEditImageDialogOpen, setSelectedImageId } from "../../store";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, SquarePen, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import Can from "@/components/Can";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useCan from "@/hooks/useCan";
import { useTranslation } from "react-i18next";


const ImageCard = ({ className, item, setSelectedImage }) => {
  const sortable = useSortable({ id: item.product_image_id });
  const canUpdateAction = useCan(["app_api.change_ocproductimage"]);
  const {
    attributes,
    listeners,

    setNodeRef,
    transform,
    transition,
  } = sortable;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const {t} = useTranslation()
  return (
    <div
      ref={setNodeRef}
      onClick={() => {
        setSelectedImage(item);
      }}
      style={style}
      {...attributes}
      className={cn("relative w-40  h-40 ", className)}
    >
      <img
        {...listeners}
        disabled={canUpdateAction}
        src={item.image}
        alt=""
        className={cn(
          "w-40 h-40 object-contain rounded-sm border cursor-pointer"
        )}
      />
      <Button
        {...listeners}
        disabled={canUpdateAction}
        size="icon"
   
        className="h-6 w-6 py-0 px-0 opacity-70 rounded-full absolute top-2 left-1.5"
      >
       
          {item.sort_order}
      
      </Button>

    <Can permissions={["app_api.change_ocproductimage","app_api.delete_ocproductimage"]}>

      <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button size="icon"  className="h-6 w-6 p-0 absolute top-2 right-1.5 rounded-full ">
      <span className="sr-only">{t("Open menu")}</span>
      <EllipsisVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>

    <DropdownMenuSeparator />
    <Can permissions={["app_api.change_ocproductimage"]}>

    <DropdownMenuItem
      className="space-x-2 "
      onClick={() => {
        setCurrentSelectedImage(item);
            setIsEditImageDialogOpen(true);
          }}
    >
      {" "}
      <SquarePen size={16} /> <span>{t("Edit")}</span>{" "}
    </DropdownMenuItem>
    </Can>
    <Can permissions={["app_api.delete_ocproductimage"]}>
    <DropdownMenuItem
      className="space-x-2 text-red-500"
      onClick={() => {
            setSelectedImageId(item.product_image_id);
            setIsDeleteImageDialogOpen(true);
          }}
    >
      {" "}
      <Trash2 size={16} className="" /> <span>{t("Delete")}</span>
    </DropdownMenuItem>
    </Can>
  </DropdownMenuContent>
</DropdownMenu>
    </Can>

    </div>
  );
};

export default ImageCard;
{
  /* <img
                  src={
                    selectedImage?.image
                      ? selectedImage?.image
                      : images?.at(0)
                  }
                  alt=""
                  className="w-[75%] h-[400px] object-center rounded-sm "
                /> */
}

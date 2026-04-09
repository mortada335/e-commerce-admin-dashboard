import {setCurrentSelectedVideo, setIsDeleteVideoDialogOpen, setIsEditVideoDialogOpen, setSelectedVideoId } from "../../store";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, SquarePen, Trash2 } from "lucide-react";

import Can from "@/components/Can";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslation } from "react-i18next";


const VideoCard = ({ className, item }) => {
  const {t} = useTranslation()
  return (
    <div


      className={cn("relative w-full  h-fit py-2 px-2", className)}
    >
      <video src={item?.video} controls className="w-full h-[500px] rounded-md" />


      <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button size="icon"  className="h-6 w-6 p-0 absolute top-2 right-7 rounded-full ">
      <span className="sr-only">{t("Open menu")}</span>
      <EllipsisVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Actions</DropdownMenuLabel>

    <DropdownMenuSeparator />

    <Can permissions={["app_api.change_ocproductimage"]}>
    <DropdownMenuItem
      className="space-x-2 "
      onClick={() => {
        setCurrentSelectedVideo(item);
            setIsEditVideoDialogOpen(true);
          }}
    >
      {" "}
      <SquarePen size={16} /> <span>Edit</span>{" "}
    </DropdownMenuItem>
    </Can>
    <Can permissions={["app_api.delete_ocproductimage"]}>
    <DropdownMenuItem
      className="space-x-2 text-red-500"
      onClick={() => {
        setSelectedVideoId(item.id);
            setIsDeleteVideoDialogOpen(true);
          }}
    >
      {" "}
      <Trash2 size={16} className="" /> <span>Delete</span>
    </DropdownMenuItem>
    </Can>
  </DropdownMenuContent>
</DropdownMenu>

    </div>
  );
};

export default VideoCard;

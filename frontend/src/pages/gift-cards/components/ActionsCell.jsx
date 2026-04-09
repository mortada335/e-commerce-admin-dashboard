// Importing icons from lucide-react library
import { Eye, SquarePen, Trash2 } from "lucide-react";

// Importing tooltip components from the custom UI library
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Importing state management actions for dialog visibility and selected GiftCard item
import {
  setIsGiftCardDialogOpen,
  setIsDeleteGiftCardDialogOpen,
  setSelectedGiftCard,
} from "../store";


// Importing permission-checking component to conditionally render elements based on user roles or permissions
import Can from "@/components/Can";


// Utility function for conditionally combining class names
import { cn } from "@/lib/utils";

// Importing Link component from react-router-dom for client-side routing
import { Link,  } from "react-router-dom";
import { useTranslation } from "react-i18next";


const ActionsCell = ({ item, className }) => {


  // Edit GiftCard Action
  const handleEditGiftCard = () => {
    setSelectedGiftCard(item);
    setIsGiftCardDialogOpen(true);
  };
  const {t} = useTranslation()

  // Delete GiftCard Action
  const handleDeleteGiftCard = async () => {
    setSelectedGiftCard(item);
    setIsDeleteGiftCardDialogOpen(true);
  };


  return (
    <div
      className={cn("flex justify-center items-center w-full gap-4", className)}
    >
      <Can permissions={["app_api.change_giftcard"]}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              variant="ghost"
              size="icon"
              onClick={handleEditGiftCard}
              className="cursor-pointer space-x-2  rounded-full"
            >
              <SquarePen size={16} />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("edit")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Can>

      <Can permissions={["app_api.delete_giftcard"]}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              variant="ghost"
              size="icon"
              onClick={handleDeleteGiftCard}
              className="cursor-pointer space-x-2  rounded-full text-red-500"
            >
              <Trash2 size={16} />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("delete")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Can>
    </div>
  );
};

export default ActionsCell;

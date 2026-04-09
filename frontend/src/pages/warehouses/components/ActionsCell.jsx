// Importing icons from lucide-react library
import { Eye, SquarePen, Trash2 } from "lucide-react";

// Importing tooltip components from the custom UI library
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Importing state management actions for dialog visibility and selected Warehouse item
import {
  setIsWarehouseDialogOpen,
  setIsDeleteWarehouseDialogOpen,
  setSelectedWarehouse,
} from "../store";


// Importing permission-checking component to conditionally render elements based on user roles or permissions
import Can from "@/components/Can";


// Utility function for conditionally combining class names
import { cn } from "@/lib/utils";

// Importing Link component from react-router-dom for client-side routing
import { Link,  } from "react-router-dom";
import { useTranslation } from "react-i18next";



const ActionsCell = ({ item, className }) => {

  const {t} = useTranslation()

  // Edit Warehouse Action
  const handleEditWarehouse = () => {
    setSelectedWarehouse(item);
    setIsWarehouseDialogOpen(true);
  };

  // Delete Warehouse Action
  const handleDeleteWarehouse = async () => {
    setSelectedWarehouse(item);
    setIsDeleteWarehouseDialogOpen(true);
  };


  return (
    <div
      className={cn("flex justify-center items-center w-full gap-4", className)}
    >
              <Can permissions={["app_api.view_ocwarehouse"]}>
               <Link

                to={`/catalog/warehouses/details/${item?.id}`}
              >

               <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              variant="ghost"
              size="icon"
     
              className="cursor-pointer space-x-2  rounded-full "
            >
              <Eye size={16} />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("view")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
              </Link>
           
          </Can>
       <Can permissions={["app_api.change_ocwarehouse"]}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              variant="ghost"
              size="icon"
              onClick={handleEditWarehouse}
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

    {/*  <Can permissions={["app_api.delete_ocwarehouse"]}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              variant="ghost"
              size="icon"
              onClick={handleDeleteWarehouse}
              className="cursor-pointer space-x-2  rounded-full text-red-500"
            >
              <Trash2 size={16} />
            </TooltipTrigger>
            <TooltipContent>
              <p>{"delete"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Can> */}
    </div>
  );
};

export default ActionsCell;

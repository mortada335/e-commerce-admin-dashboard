import { BookMarked, Eye, SquarePen, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";



import Can from "@/components/Can";
import { Link } from "react-router-dom";

const ActionsCell = ({ item }) => {



  return (
    <div className="flex justify-center items-center w-full gap-4">
      {/* customer.view? must be related to bills */}
      <Can permissions={["bill.view"]}>
      <Link  className="flex justify-center items-center" to={`/bills/bill-details/${item?.id}`}>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              variant="ghost"
              size="icon"
             
              className="cursor-pointer space-x-2  rounded-full"
            >
              <Eye size={16} />
            </TooltipTrigger>
            <TooltipContent>
              <p>{"view"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Link>
      </Can>

    </div>
  );
};

export default ActionsCell;

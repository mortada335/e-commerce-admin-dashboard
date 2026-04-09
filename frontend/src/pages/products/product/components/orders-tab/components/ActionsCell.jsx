import { Eye, MoreHorizontal, SquarePen } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { setIsOrderDialogOpen, setSelectedOrder } from "../store"
import { Link } from "react-router-dom"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Text from "@/components/layout/text"
import { useTranslation } from "react-i18next"

const ActionsCell = ({ item }) => {
    const {t} = useTranslation()
  // Edit Order Action
  const handleEditOrder = () => {
    setSelectedOrder(item?.orderData)
    setIsOrderDialogOpen(true)
  }
  // Delete Order Action
  // const handleDeleteOrder = async () => {
  //   setSelectedOrder(item)
  //   setIsDeleteOrderDialogOpen(true)
  // }

  return (
    <div className="flex justify-center items-center w-full">
    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {" "}
                          <Link
              className="flex justify-start items-center space-x-2"
              to={`/sales/orders/details/${item.orderId}`}
              onClick={()=>{

                setSelectedOrder(item?.orderData)
              }}

            >
              {" "}
              <Eye size={20} />
            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <Text text={"View"} />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
     
    </div>
  )
}

export default ActionsCell
{/* <DropdownMenu>
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
  </DropdownMenuItem> */}
// </DropdownMenuContent>
// </DropdownMenu> */}
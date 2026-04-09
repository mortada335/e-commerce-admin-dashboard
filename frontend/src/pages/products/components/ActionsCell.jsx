import {
  ClipboardPlus,
  Eye,
  Loader2,
  MoreHorizontal,
  ShieldBan,
  ShieldCheck,
  SquarePen,
  Trash,
  Trash2,
  View,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Button } from "@/components/ui/button";
import {
  setIsProductDialogOpen,
  setSelectedProduct,
  setIsDeleteProductDialogOpen,
  setIsDuplicateProductDialog,
  setIsChangeStatusDialogOpen,
} from "../store";
import { Link } from "react-router-dom";
import Can from "@/components/Can";
import { useToast } from "@/components/ui/use-toast";
import usePatch from "@/hooks/usePatch";
import { PRODUCTS_URL } from "@/utils/constants/urls";
import { useTranslation } from "react-i18next";

const ActionsCell = ({ item }) => {
  // Toast for notification.
  const { toast } = useToast();
  const {t} = useTranslation()
  const {
    mutate: mutate,

    isPending: isAction,
  } = usePatch({
    queryKey: "Products",

  });
  // Edit Product Action
  const handleEditProduct = () => {
    setSelectedProduct(item);
    setIsProductDialogOpen(true);
  };
  // Delete Product Action
  const handleDeleteProduct = async () => {
    setSelectedProduct(item);
    setIsDeleteProductDialogOpen(true);
  };
  const handleDuplicateProduct = async () => {
    setSelectedProduct(item);
    setIsDuplicateProductDialog(true);
  };
  const handleStatus = async () => {
    console.log(item.productData?.product_id,item.productData?.enabled);
    
    // setSelectedProduct(item);
    // setIsChangeStatusDialogOpen(true);

    mutate({
      endpoint: PRODUCTS_URL,
      id: item.productData?.product_id,

      body: {
           
        enabled: item.productData?.enabled ? false : true,
      },
    })
  };

  return (
    <div className="flex justify-start items-start gap-2 ">
       <Can permissions={["app_api.view_ocproduct"]}>
              <Link
                
                to={`/catalog/products/details/${item.id}`}
              >
               <TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>  
      <Button variant="ghost" className="h-8 w-8 px-0 py-0">
        
      <Eye size={16} /> 
      </Button>
      </TooltipTrigger>
    <TooltipContent>
    <span>{t("view")}</span>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

                
              
     
              </Link>
          </Can>
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
              navigator.clipboard.writeText(item.model);
              toast({
                title: t("Copied!"),
                description: `${item.model} ${" : "} ${t("copied to clipboard successfully.")}`,
              });
            }}
          >
            {t("Copy Model")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
         
          {/* <DropdownMenuItem>
            <Link
              className="flex justify-start items-center space-x-2"
              to={`/catalog/products/edit/${item.id}`}
            >
              {" "}
              <SquarePen size={16} /> <span>Edit</span>{" "}
            </Link>
          </DropdownMenuItem> */}
          {/* <Can permissions={["app_api.add_ocproduct"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2 cursor-pointer"
              onClick={handleDuplicateProduct}
            >
              <ClipboardPlus size={16} />

              <span>{t("Duplicate")}</span>
            </DropdownMenuItem>
          </Can> */}
          <Can permissions={["app_api.change_ocproduct"]}>
            <DropdownMenuItem
              className="flex justify-start items-center space-x-2  cursor-pointer"
              onClick={handleStatus}
              disabled={isAction}
            >
               {isAction ? (
        <p className="flex justify-center items-center space-x-2">
          <Loader2 className=" h-5 w-5 animate-spin" />
        </p>
      ) : (
        <>

        {item.enabled ? (
                <ShieldBan size={16} />
              ) : (
                <ShieldCheck size={16} />
              )}
              <span>{item.enabled ? t("Disable") : t("Enabled")}</span>
        </>
      )}
            
            </DropdownMenuItem>
          </Can>
          <Can permissions={["app_api.delete_ocproduct"]}>

          <DropdownMenuItem
            className="flex justify-start items-center space-x-2 text-red-500 
            hover:!text-red-600 hover:!bg-red-50   cursor-pointer"
            onClick={handleDeleteProduct}
          >
            <Trash2 size={16} /> <span>{t("Delete")}</span>
          </DropdownMenuItem>
          </Can>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ActionsCell;

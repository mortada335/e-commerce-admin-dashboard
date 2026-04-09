import { Badge } from "@/components/ui/badge";
import ActionsCell from "./ActionsCell";
import { cn } from "@/lib/utils";
import Text from "@/components/layout/text";
import {

  formatNumberWithCurrency,
} from "@/utils/methods";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DataTableColumnHeader from "./data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImagePreviewer } from "@/components/ui/image-previewer";
import i18n from "@/locales/i18n";
// import { toast } from "@/components/ui/use-toast";

export default [
  // {
  //   // header: () => <div className="text-left uppercase w-fit">order</div>, *This is the old version of it.

  //   // Modified to meet the other columns structure. - Muammar.jsx
  //   header: ({ column }) => (
  //     <TooltipProvider>
  //       <Tooltip>
  //         <TooltipTrigger className="text-left uppercase">
  //           <DataTableColumnHeader
  //             column={column}
  //             title={"Option"}
  //             accessorKey={"option_value_id"}
  //           />
  //         </TooltipTrigger>
  //         <TooltipContent>
  //           <p className="text-left uppercase">Option</p>
  //         </TooltipContent>
  //       </Tooltip>
  //     </TooltipProvider>
  //   ),
  //   accessorKey: "option_value_id",
  //   cell: ({ row }) => <Text text={row?.original?.option_value_id} />,
  // },
  {
    header: () => <div className="text-start uppercase">{i18n.t("Option Image")}</div>,
    accessorKey: "product",
    cell: ({ row }) => {
      const item = row.original;

      return (
                <Avatar>
          <ImagePreviewer altSrc={item?.option_image}>
          <AvatarImage src={item?.option_image} alt={item?.product_option_value_id} />
          </ImagePreviewer>
          <AvatarFallback className="text-xs">
            {item?.product_option_value_id}
            {/* {avatarText(item?.index)} */}
          </AvatarFallback>
        </Avatar>
       
      );
    },
  },
  {
    header: ({ column }) => (

            <DataTableColumnHeader
              column={column}
              title={i18n.t("Option")}
              accessorKey={"option"}
            />

    ),

    accessorKey: "option",
    cell: ({ row }) => <Text text={row?.original?.option} />,
  },
  {
    header: ({ column }) => (
   
            <DataTableColumnHeader
              column={column}
              title={i18n.t("Quantity")}
              accessorKey={"quantity"}
            />

    ),

    accessorKey: "quantity",
    cell: ({ row }) => <Text text={row?.original?.quantity} />,
  },

  {
    header: () => <div className="text-left uppercase">{i18n.t("points")}</div>,

    accessorKey: "points",
    cell: ({ row }) => <Text text={row?.original?.points} />,
  },


  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Price")}
          accessorKey={"price"}
        />
      );
    },
    accessorKey: "price",
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Text
          className="flex-1"
          text={formatNumberWithCurrency(String(row?.original?.price), "IQD")}
        />
      </div>
    ),
  },





  {
    header: () => <div className="text-left uppercase">{i18n.t("Actions")}</div>,
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
];

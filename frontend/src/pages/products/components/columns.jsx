import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ActionsCell from "./ActionsCell";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Text from "@/components/layout/text";
import {
  convertProductStatusIdToString,
  formatNumberWithCurrency,
} from "@/utils/methods";
import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label"
import { isProductSelected, setSelectedProducts } from "../store";
import DataTableColumnHeader from "./data-table-column-header";
import i18n from "@/locales/i18n";

export default [
  {
    header: () => <div className="text-start capitalize">#</div>,
    accessorKey: "id",
    cell: ({ row }) => {
      const item = row.original;
      const isProduct = isProductSelected(item.id);

      const handleSelectProduct = () => {
        setSelectedProducts(item);
      };

      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={item.id}
            checked={isProduct}
            onCheckedChange={handleSelectProduct}
          />
        </div>
      );
    },
  },

  {
    header: () => (
      <div className="text-start uppercase">{i18n.t("Product")}</div>
    ),
    accessorKey: "product",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Avatar>
          <AvatarImage src={item.product} alt={item?.id} />
          <AvatarFallback className="text-xs">{item?.id}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("product_id")}
        accessorKey={"product_id"}
      />
    ),
    accessorKey: "product_id",
    cell: ({row}) => row?.original?.productData?.product_id,
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Model")}
        accessorKey={"model"}
      />
    ),
    accessorKey: "model",
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("description")}
        accessorKey={"description"}
      />
    ),
    accessorKey: "description",
    cell:({row})=> {
      const item = row?.original?.productData?.description[0]?.name;
      return (
        <p className="text-muted-foreground w-full h-full">{item}</p>
        )
  }
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Quantity")}
        accessorKey={"quantity_avilable"}
      />
    ),
    accessorKey: "quantity_avilable",
    cell: ({ row }) => (
      <p className={row?.original?.quantity_avilable === 0 && "text-red-500"}>
        {row?.original?.quantity_avilable}
      </p>
    ),
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Price")}
        accessorKey={"price"}
      />
    ),
    accessorKey: "price",
    cell: ({ row }) => {
      const hasDiscount =
        row?.original?.discounted_price &&
        Number(row?.original?.discounted_price) > 0;

      return (
        <div className="flex flex-col justify-start items-start gap-2">
          <Text
            className={cn("", hasDiscount && "line-through")}
            text={formatNumberWithCurrency(
              String(row?.original?.price),
              "IQD"
            )}
          />
          {!!hasDiscount && (
            <Text
              className={"text-red-500"}
              text={formatNumberWithCurrency(
                String(row?.original?.discounted_price),
                "IQD"
              )}
            />
          )}
        </div>
      );
    },
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Discounted")}
        accessorKey={"discounted_price"}
      />
    ),
    accessorKey: "discounted",
    cell: ({ row }) => {
      const hasDiscount =
        row?.original?.discounted_price &&
        Number(row?.original?.discounted_price) > 0;
      return (
        <Badge
          className={cn(
            " rounded-sm",
            hasDiscount ? "bg-blue-500 text-white" : "bg-red-500 text-white "
          )}
          variant={hasDiscount ? "success" : "destructive"}
        >
          {hasDiscount ? i18n.t("Yes") : i18n.t("No")}
        </Badge>
      );
    },
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Status")}
        accessorKey={"enabled"}
      />
    ),
    accessorKey: "enabled",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Badge
          className={cn(
            " rounded-sm",
            item.enabled
              ? "bg-[#A1FFEE] text-[#127462]"
              : "bg-red-500 text-white "
          )}
          variant={item.enabled ? "success" : "destructive"}
        >
          {item.enabled ? i18n.t("Enabled") : i18n.t("Disable")}
        </Badge>
      );
    },
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Label")}
        accessorKey={"status"}
      />
    ),
    accessorKey: "status",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Badge
          className={cn(
            " rounded-sm bg-blue-500 text-white w-[100px] justify-center"
          )}
        >
          {i18n.t(convertProductStatusIdToString(item.status))}
        </Badge>
      );
    },
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("New")}
        accessorKey={"new_product"}
      />
    ),
    accessorKey: "new_product",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Badge
          className={cn(
            " rounded-sm",
            item?.new_product
              ? "bg-blue-500 text-white"
              : "bg-red-500 text-white "
          )}
          variant={item?.new_product ? "success" : "destructive"}
        >
          {item?.new_product ? i18n.t("Yes") : i18n.t("No")}
        </Badge>
      );
    },
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("has_points")}
        accessorKey={"has_points"}
      />
    ),
    accessorKey: "has_points",
    cell: ({ row }) => {
      const item = row.original?.productData;
      return (
        <Badge
          className={cn(
            " rounded-sm",
            item?.has_points
              ? "bg-blue-500 text-white"
              : "bg-red-500 text-white "
          )}
          variant={item?.has_points  ? "success" : "destructive"}
        >
          {item?.has_points ? i18n.t("Yes") : i18n.t("No")}
        </Badge>
      );
    },
  },

  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Created")}
        accessorKey={"date_added"}
      />
    ),
    accessorKey: "date_added",
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Modified")}
        accessorKey={"date_modified"}
      />
    ),
    accessorKey: "date_modified",
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Discount Start Date")}
        accessorKey={"discount_start_date"}
      />
    ),
    accessorKey: "discount_start_date",
  },
  {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={i18n.t("Discount Expiry Date")}
        accessorKey={"discount_expiry_date"}
      />
    ),
    accessorKey: "discount_expiry_date",
  },

  {
    header: () => (
      <div className="text-left uppercase">{i18n.t("Actions")}</div>
    ),
    accessorKey: "actions",
    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
];

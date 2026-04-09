import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ActionsCell from "./ActionsCell";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import DataTableColumnHeader from "./data-table-column-header";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CategoryBadge from "./CategoryBadge";
import i18n from "@/locales/i18n";

export default [
  // {
  //   header: () => <div className="text-left capitalize">#id</div>,
  //   accessorKey: "id",
  // },
  {
    header: () => <div className="text-right uppercase">{i18n.t("image")}</div>,
    accessorKey: "image",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <Avatar>
          <AvatarImage src={item.image} alt={item.name} />
          <AvatarFallback>{item.id}</AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Arabic")}
          accessorKey={"description"}
        />
      );
    },
    accessorKey: "nameArabic",
    cell: ({ row }) => (
      <p>
        {row.original.nameArabic
          ? row.original.nameArabic
          : row.original.descriptionArabic}
      </p>
    ),
  },
  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("English")}
          accessorKey={"description"}
        />
      );
    },
    accessorKey: "nameEnglish",
    cell: ({ row }) => (
      <p>
        {row.original.nameEnglish
          ? row.original.nameEnglish
          : row.original.descriptionEnglish}
      </p>
    ),
  },

  {
    accessorKey: "sortOrder",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Index")}
          accessorKey={"sort_order"}
        />
      );
    },
  },
  {
    accessorKey: "num_of_products",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Products count")}
          accessorKey={"num_of_products"}
        />
      );
    },
  },

  {
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          title={i18n.t("Status")}
          accessorKey={"status"}
        />
      );
    },
    accessorKey: "status",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <Badge
          className={cn(
            " rounded-sm",
            item.status === 1
              ? "bg-[#A1FFEE] text-[#127462]"
              : "bg-red-500 text-white "
          )}
          variant={item.status === 1 ? "success" : "destructive"}
        >
          {item.status === 1 ? i18n.t("Enabled") : i18n.t("Disable")}
        </Badge>
      );
    },
  },

  {
    header: () => <div className="text-left uppercase">{i18n.t("parent")}</div>,
    accessorKey: "parent_category_name",
    cell: ({ row }) => (
      <CategoryBadge item={row.original}/>
      
    ),
  },
  // {
  //   header: () => <div className="text-left uppercase">Color</div>,
  //   accessorKey: "color",
  //   cell: ({ row }) => (
  //     <div
  //       className="w-full py-[2px] rounded-sm text-center text-xs px-1"
  //       style={{ backgroundColor: row.original.color }}
  //     >
  //       {row.original.color}
  //     </div>
  //   ),
  // },
  {
    header: () => <div className="text-left uppercase">{i18n.t("Transparency")}</div>,
    accessorKey: "transparency",
    cell: ({ row }) => (
      <p className="space-x-1">
        {row.original.transparency !== null &&
          row.original.transparency !== undefined && <span>%</span>}

        <span>{row.original.transparency}</span>
      </p>
    ),
  },

  {
    header: () => <div className="text-left uppercase">{i18n.t("Actions")}</div>,
    accessorKey: "actions",

    cell: ({ row }) => <ActionsCell item={row.original} />,
  },
];

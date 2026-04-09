import { Editor } from "@/components/ui/editor";
import i18n from "@/locales/i18n";
import { Link } from "react-router-dom";

export default [
  {
    header: () => <div className="text-left capitalize">{i18n.t("Modify")}</div>,
    accessorKey: "modify",
    cell:({row}) => { 
      return i18n.t(row.original?.modify)
    }

  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("Old")}</div>,
    accessorKey: "old",
    cell: ({ row }) => {

     
      return row?.original.modify==="notes"?        
                             <Editor
                               editable={false} 
                               initialContent={i18n.t(row?.original?.old)} 
                               />
                              : 
                              <p>{i18n.t(row?.original?.old)}</p>
      
    },
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("New")}</div>,

    accessorKey: "new",
    cell: ({ row }) => {

   
      return row?.original.modify==="notes"?        
                             <Editor
                               editable={false} 
                               initialContent={i18n.t(row?.original?.new)} 
                               />
                              : 
                              <p>{i18n.t(row?.original?.new)}</p>
      
    },
  },
  {
    header: () => <div className="text-left uppercase">{i18n.t("Modify By")}</div>,

    accessorKey: "modify_by",
    cell: ({ row }) => {
      return (
        <Link
          to={`/users/details/${row?.original?.actor_id}`}
          className="text-left capitalize cursor-pointer hover:text-blue-500 transition"
        >
          {row?.original?.modify_by}
        </Link>
      );
    },
  },
];

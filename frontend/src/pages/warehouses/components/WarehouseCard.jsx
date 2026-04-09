import { Card } from "@/components/ui/card";
import ActionsCell from "./ActionsCell";


import { ArrowRightLeft } from "lucide-react";
import { customFormatDate, formatNumberWithCurrency } from "@/utils/methods";
import { Link } from "react-router-dom";




const WarehouseCard = ({ data }) => {
  return (
        //        <Link
        // key={data?.id}
        //             to={`/catalog/warehouses/details/${data?.id}`}
        //           >

    <Card
  
      className="relative  w-full flex justify-start items-start rtl:flex-row-reverse gap-2 px-3 py-2 hover:border-blue-500"
    >


      <div className="flex flex-col justify-start items-start w-full h-full">
      <div className=" py-2 w-full flex justify-start items-center gap-4  rtl:flex-row-reverse ">
        <p className="font-medium text-start rtl:text-end text-base  text-slate-800 dark:text-slate-100  w-[99%] truncate">
          {data?.name}
        </p>
        <ActionsCell item={data} className="w-fit" />
      </div>
        <p className="text-sm font-normal w-full text-start rtl:text-end  text-slate-500 h-4">
          {data?.code}
        </p>
        <div className=" py-2 w-full flex justify-start items-center gap-4  rtl:flex-row-reverse ">
      <p className=" text-xs font-normal text-slate-500 h-4 w-fit">
       {data?.latitude&&data?.latitude}
      </p>
      {data?.longitude&&<span>-</span>}

      <p className=" text-xs font-normal text-slate-500 h-4 w-fit">
       {data?.longitude&&data?.longitude}
      </p>

      </div>
     
      </div>
      
    </Card>
                  // </Link>
  );
};

export default WarehouseCard;

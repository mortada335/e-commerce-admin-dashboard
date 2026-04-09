import { Card } from "@/components/ui/card";
import ActionsCell from "./ActionsCell";


import { ArrowRightLeft } from "lucide-react";
import { customFormatDate, formatNumberWithCurrency } from "@/utils/methods";




const GiftCard = ({ data }) => {
  return (
    <Card
      key={data?.id}
      className="relative  w-full flex justify-start items-start rtl:flex-row-reverse gap-2 px-3 py-2 "
    >


      <div className="flex flex-col justify-start items-start w-full h-full">
      <div className=" py-2 w-full flex justify-start items-center gap-4  rtl:flex-row-reverse ">
        <p className="font-medium text-start rtl:text-end text-sm  text-slate-800 dark:text-slate-100  w-[99%] truncate">
          {data?.code}
        </p>
        <ActionsCell item={data} className="w-fit" />
      </div>
        {/* <p className="text-xs font-normal w-full text-start rtl:text-end  text-slate-500 h-4">
          {data?.sub_title}
        </p> */}
        <div className=" py-2 w-full flex justify-start items-center gap-4  rtl:flex-row-reverse ">
      <p className=" text-xs font-normal text-slate-500 h-4 w-fit">
       {data?.created_at&&customFormatDate(data?.created_at,true)}
      </p>
      {data?.redeemed_at&&<ArrowRightLeft size={14}/>}

      <p className=" text-xs font-normal text-slate-500 h-4 w-fit">
       {data?.redeemed_at&&customFormatDate(data?.redeemed_at,true)}
      </p>

      </div>
      <p className="text-xs font-normal w-full text-start rtl:text-end  text-slate-500 h-4">
          {formatNumberWithCurrency(data?.amount_iqd,'IQD')}
        </p>
      </div>
      
    </Card>
  );
};

export default GiftCard;

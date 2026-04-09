
import {  formatNumberWithCurrency } from "@/utils/methods";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";


const OrderProducts = ({products}) => {
  const {t} =useTranslation()



  return (

        <Table containerClassName="!rounded-none" className="w-full min-h-fit h-fit max-h-fit">
          <TableHeader className="bg-slate-100 ">
            <TableRow className="divide-x-2 ">
              <TableHead className="w-[20px] !font-normal  uppercase text-black h-8">
                <span className="text-xs">#</span>
              </TableHead>
              <TableHead className="w-[150px] !font-normal uppercase text-black h-8">
                <span className="text-xs">{t("Product")} </span>
              </TableHead>
              <TableHead className="w-[100px] !font-normal uppercase text-black h-8">
                <span className="text-xs">{t("Product Image")}</span>
              </TableHead>
              <TableHead className="w-[150px] !font-normal uppercase text-black h-8">
                <span className="text-xs">{t("Model")}</span>
              </TableHead>
              <TableHead className=" w-[100px] !font-normal uppercase text-black h-8">
                <span className="text-xs">{t("Quantity")}</span>
              </TableHead>
              <TableHead className="w-[100px] !font-normal uppercase text-black h-8">
                <span className="text-xs">{t("Unit Price")}</span>
              </TableHead>
              <TableHead className=" w-[150px] !font-normal uppercase text-black h-8">
                <span className="text-xs">{t("Total")}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="min-h-fit h-fit max-h-fit">
            {products?.data?.results?.length &&
              products?.data?.results?.map((product, index) => (
                <TableRow key={product.product_id} className="">
                  <TableCell className=" py-2">
                    {" "}
                    <span className="text-xs text-black">{index + 1}</span>
                  </TableCell>
                  <TableCell className=" py-2">
                    {" "}
                    <div className="flex flex-col justify-start items-start gap-2">
                    <span className="text-xs text-black">{product?.product?.description?.name}</span>
                    {product?.option&& <span className="text-xs text-black">-{product?.option}</span>}
                    
                    </div>
                  </TableCell>

                  <TableCell className=" py-2">
                    {/* If image url exist render a figure. */}
                    {product?.option_image ? (
                      <figure className="max-w-24 max-h-24 rounded-sm overflow-hidden">
                        <img
                          src={product?.option_image}
                          // alt={`productID #${product?.product_option_id}`}
                          className="w-full h-full object-cover"
                        />
                      </figure>
                    ):
                    <div className="flex items-center justify-center w-24 h-24 px-4 py-2 rounded-sm bg-slate-100 text-slate-800 text-sm font-semibold">
                        {/* #{product?.product_id} */}
                      </div>
                    }

             

                  </TableCell>
         
                  <TableCell className="py-2">
                    {" "}
                    <span className="text-xs text-black">{product?.model?product?.model:product?.product?.model?product?.product?.model:''}</span>
                  </TableCell>
                  <TableCell className="py-2 text-xs text-black">
                    {" "}
                    <span className={product?.quantity>1?"font-bold text-red-500":""}>
                      {product?.quantity}{" "}
                      
                    </span>
                    <span>{` (${product?.product?.available_quantity})`}</span>
                  </TableCell>
                  <TableCell className="py-2">
                    <span className="text-xs text-black">
                      {formatNumberWithCurrency(String(product?.price), "IQD")}
                    </span>
                  </TableCell>
                  <TableCell className="py-2">
                    {" "}
                    <span className="text-xs text-black">
                      {/* {formatNumberWithCurrency(String(product?.product?.price * product?.quantity), "IQD")} */}
                      {formatNumberWithCurrency(String(product?.total), "IQD")}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

  );
};

export default OrderProducts;

import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import altawoonBrand from "@/assets/images/altawoon.svg";
import HeaderText from "@/components/layout/header-text";
import Text from "@/components/layout/text";
import { formatFullDate, formatNumberWithCurrency } from "@/utils/methods";
import { Separator } from "@/components/ui/separator";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  Printer,
  Tags,
  Ticket,
  TicketMinus,
  Truck,
} from "lucide-react";
const PrintOrder = ({ order = {}, products = [] }) => {
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Invoice(V1) #${order?.order_id}`,
  });

  const paymentInfo = [
    {
      title: "Customer Name :",
      value: order?.customer_data?.customer_name,
    },
    {
      title: "Phone NO :",
      value: order?.customer_number,
    },
    {
      title: "Payment Method :",
      value: order?.payment_method,
    },
    {
      title: "Created Date :",
      value: formatFullDate(order?.date_added || ""),
    },
    {
      title: "Conformation Date :",
      value: formatFullDate(order?.date_modified || ""),
    },
  ];

  const shippingInfo = [
    {
      title: "Name :",
      value: `${order?.payment_firstname} ${order?.shipping_lastname}`,
    },
    {
      title: "City :",
      value: order?.shipping_city,
    },
    {
      title: "Address 1 :",
      value: order?.shipping_address_1,
    },
    {
      title: "Address 2 :",
      value: order?.shipping_address_2,
    },
    {
      title: "Alternate Phone :",
      value: order?.shipping_custom_field,
    },
  ];
  // const priceInfo = [

  //   {
  //     title: "Sub Total :",
  //     value: formatNumberWithCurrency(String(10000000), "IQD"),
  //     icon: <Tags size={18} />,
  //   },
  //   {
  //     title: "Delivery Price :",
  //     value: formatNumberWithCurrency(String(10000), "IQD"),
  //     icon: <Truck size={18} />,
  //   },
  //   {
  //     title: "Promo Code :",
  //     value: `-${formatNumberWithCurrency(String(100000), "IQD")}`,
  //     icon: <Ticket size={18} />,
  //   },
  //   {
  //     title: "Total :",
  //     value: formatNumberWithCurrency(String(10000000), "IQD"),
  //     icon: <TicketMinus size={18} />,
  //   },
  // ];

  const isCash = order?.payment_method !== "Cash On Delivery" ? true : false;
  //
  return (
    <>
      <Button
         variant={"default"}
        onClick={handlePrint}
        className="flex items-center gap-2 text-white"
      >
        {/* Large screen and above. */}
        <span className="hidden md:block">
          <Printer size={16} />
        </span>
        {/* Small screen. */}
        <span className="md:hidden">
          <Printer size={12} />
        </span>
        Print Order
      </Button>
      <div
        ref={printRef}
        className="hidden print:flex  flex-col justify-start items-center w-full h-full  "
      >
        <header className="bg-white flex justify-end items-start w-full h-[90px] px-0 md:px-8 pt-4 relative ">
          <img
            src={altawoonBrand}
            alt="Brand"
            className="w-[180px] h-[40px] object-contain mx-4"
          />

          <div className="flex w-fit flex-col justify-center items-start bg-slate-200 space-y-2 rounded-b-md px-8 py-4 absolute top-0 left-0 md:left-10 ">
            {/* <HeaderText
            className={"!text-white text-base font-normal"}
            text={"INVOICE"}
          /> */}

            <HeaderText
              className={"!text-black text-lg  xl:text-4xl capitalize"}
              text={`INVOICE V1 #${order.order_id}`}
            />
          </div>
        </header>

        <article className="flex bg-slate-100  justify-between items-start mb-8 mt-4   space-x-4 px-8 h-fit py-6  w-full">
          <div className="flex flex-col justify-center items-start gap-1 w-2/4">
            <Text className={""} text={"Customer INFORMATION"} />
            {paymentInfo.map((item, index) => (
              <div
                key={item.title + index}
                className="flex justify-between items-start   w-full"
              >
                <Text
                  className={"w-full text-xs xl:text-sm"}
                  text={item.title}
                />
                <Text
                  className={"text-black text-xs xl:text-sm text-start w-full"}
                  text={item.value}
                />
              </div>
            ))}
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col justify-center items-start gap-1 w-2/4">
            <Text className={""} text={"SHIPPING INFORMATION"} />

            {shippingInfo.map((item, index) => (
              <div
                key={item.title + index}
                className="flex justify-between items-start  w-full"
              >
                <Text
                  className={"w-full text-xs xl:text-sm"}
                  text={item.title}
                />
                <Text
                  className={"text-black text-xs  xl:text-sm text-start w-full"}
                  text={item.value}
                />
              </div>
            ))}
          </div>
        </article>
        {/* <div className="flex justify-between items-center bg-slate-100  text-muted-foreground px-4 w-full gap-1 py-4 mb-8">
        {
              priceInfo.map((item,index)=>(
                item.value&&
            <div key={item.title+index} className="flex justify-center items-center gap-1 w-full text-sm">
              {item.icon}
              <Text className={"w-fit"} text={item.title} />
              <Text
                className={"text-black text-start w-fit"}
                text={item.value}
              />
            </div>

              ))
            }
        </div> */}
        <Table containerClassName="!rounded-none" className="w-full">
          <TableHeader className="bg-slate-100 ">
            <TableRow className="divide-x-2 ">
              <TableHead className="w-[20px] !font-normal  uppercase text-black h-8">
                <span className="text-xs">#</span>
              </TableHead>
              <TableHead className="w-[150px] !font-normal uppercase text-black h-8">
                <span className="text-xs">Product</span>
              </TableHead>
              <TableHead className="w-[150px] !font-normal uppercase text-black h-8">
                <span className="text-xs">Model</span>
              </TableHead>
              <TableHead className=" w-[100px] !font-normal uppercase text-black h-8">
                <span className="text-xs">Quantity</span>
              </TableHead>
              <TableHead className="w-[100px] !font-normal uppercase text-black h-8">
                <span className="text-xs">Unit Price</span>
              </TableHead>
              <TableHead className=" w-[150px] !font-normal uppercase text-black h-8">
                <span className="text-xs">Total</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.data?.length &&
              products?.data?.map((product, index) => (
                <TableRow key={product.product_id} className="divide-x-2">
                  <TableCell className="space-x-4 py-2">
                    {" "}
                    <span className="text-xs">{index + 1}</span>
                  </TableCell>
                  <TableCell className="space-x-4 flex justify-start items-center py-2">
                    {/* If image url exist render a figure. */}
                    {product?.product?.image && (
                      <figure className="max-w-24 max-h-24 rounded-sm overflow-hidden">
                        <img
                          src={product?.product?.image}
                          alt={`OrderID #${product?.product?.product_id}`}
                          className="w-full h-full object-cover"
                        />
                      </figure>
                    )}

                    {/* If image url doesn't exist render a fallback avatar with product id. */}
                    {!product?.product?.image && (
                      <div className="flex items-center justify-center px-4 py-2 rounded-sm bg-slate-100 text-slate-800 text-sm font-semibold">
                        #{product?.product?.product_id}
                      </div>
                    )}

                    <span className="text-xs">{product.product?.name}</span>
                  </TableCell>
                  <TableCell className="py-2">
                    {" "}
                    <span className="text-xs">{product?.product?.model}</span>
                  </TableCell>
                  <TableCell className="py-2">
                    {" "}
                    <span className="text-xs">
                      {product?.quantity}{" "}
                      {` (${product?.product?.available_quantity})`}
                    </span>
                  </TableCell>
                  <TableCell className="py-2">
                    <span className="text-xs">
                      {formatNumberWithCurrency(String(product?.price), "IQD")}
                    </span>
                  </TableCell>
                  <TableCell className="py-2">
                    {" "}
                    <span className="text-xs">
                      {/* {formatNumberWithCurrency(String(product?.product?.price * product?.quantity), "IQD")} */}
                      {formatNumberWithCurrency(String(product?.total), "IQD")}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <div className="w-full h-fit flex  justify-end items-center  mt-2">
          <div className="w-[60%] lg:w-[50%] flex flex-col justify-start items-start divide-y-2">
            {/* SUB TOTAL */}
            <div className="flex justify-between items-center  py-2 px-4 w-full">
              <div className="flex justify-start items-center text-muted-foreground space-x-2">
                <Tags size={18} />
                <Text className={""} text={"Sub Total"} />
              </div>
              <Text
                className={"text-black text-start  w-[150px] px-3"}
                text={formatNumberWithCurrency(String(order?.sub_total), "IQD")}
              />
            </div>

            {/* DELIVERY COST */}
            <div className="flex justify-between items-center  py-2 px-4 w-full">
              <div className="flex justify-start items-center text-muted-foreground space-x-2">
                <Truck size={18} />
                <Text className={""} text={"Delivery Price"} />
              </div>

              <Text
                className={"text-black text-start w-[150px] px-3"}
                text={formatNumberWithCurrency(
                  String(order?.delivery_costs),
                  "IQD"
                )}
              />
            </div>

            {!!order?.coupon_discount_value && (
              <>
                {/* COUPON NAME */}
                <div className="flex justify-between items-center  py-2 px-4 w-full">
                  <div className="flex justify-start items-center text-muted-foreground space-x-2">
                    <Ticket size={18} />
                    <Text className={""} text={"Coupon"} />
                  </div>

                  <Text
                    className={"text-black text-start w-[150px] px-3"}
                    text={order?.coupon}
                  />
                </div>

                {/* COUPON DISCOUNT */}
                <div className="flex justify-between items-center  py-2 px-4 w-full">
                  <div className="flex justify-start items-center text-muted-foreground space-x-2">
                    <Ticket size={18} />
                    <Text className={""} text={"Discount"} />
                  </div>

                  <Text
                    className={"text-black text-start w-[150px] px-3"}
                    text={`-${formatNumberWithCurrency(
                      String(order?.coupon_discount_value),
                      "IQD"
                    )}`}
                  />
                </div>
              </>
            )}

            {/* TOTAL PRICE */}
            <div className="flex justify-between items-center  py-2 px-4 w-full">
              <div className="flex justify-start items-center text-muted-foreground space-x-2">
                <TicketMinus size={18} />

                <Text className={""} text={"Total "} />
              </div>

              <Text
                className={"text-black text-start w-[150px] px-3"}
                text={formatNumberWithCurrency(String(order?.total), "IQD")}
              />
            </div>
          </div>
        </div>
        {isCash && (
          <div className="flex justify-end items-center w-[90%] border mt-4 rounded-md  py-4 px-4 gap-2">
            <Text
              className={"text-black font-bold text-base"}
              text={
                "تم الدفع بواسطة البطاقة الأتمانية, يمنع استلام المبلغ من الزبون"
              }
            />
            <AlertTriangle className="text-yellow-400" size={30} />
          </div>
        )}
      </div>
    </>
  );
};

export default PrintOrder;

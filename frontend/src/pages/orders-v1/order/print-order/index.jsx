import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import altawoonBrand from "@/assets/images/altawoon.svg";
import HeaderText from "@/components/layout/header-text";
import Text from "@/components/layout/text";
import { formatFullDate, formatNumberWithCurrency, resolveArea, resolveCity } from "@/utils/methods";
import { Separator } from "@/components/ui/separator";


import {
  AlertTriangle,
  Printer,
  Tags,
  Ticket,
  TicketMinus,
  Truck,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { ORDERS_URL, ORDERS_V1_URL } from "@/utils/constants/urls";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import WrapperComponent from "@/components/layout/WrapperComponent";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import CanSection from "@/components/CanSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import OrderProducts from "../OrderProducts";


const PrintOrder = () => {
  const { id } = useParams();
  const printRef = useRef();

  const axiosPrivate = useAxiosPrivate();
  const GetOrderById = async (id) => {
    return axiosPrivate.get(`${ORDERS_V1_URL}${id}/`);
  };
  const GetOrderDetails = async (id) => {
    return axiosPrivate.post(
      `get_order_details/`,
      { id },
      {
        headers: {
          'Accept-Language': 'ar',
        },
      }
    );
  };
  

  const {
    data: order,
    isLoading,
    error,
    isError,
    isRefetching,
  } = useQuery({
    queryKey: ["OrderV1", id],
    queryFn: () => GetOrderById(id),
    enabled: !!id,
  });

  const {
    data: products,
    isLoading: OrderDetailsIsLoading,
    error: OrderDetailsError,
    isError: OrderDetailsIsError,
  } = useQuery({
    queryKey: ["OrderV1Details", id],
    queryFn: () => GetOrderDetails(id),
    enabled: !isLoading,
  });

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Invoice(V1) #${id}`,
    onBeforeGetContent: () => {
      if (!printRef.current) {
        console.error("printRef is undefined or null");
        return;
      }

      // Dynamically calculate total pages (assuming content height is known)
      const totalHeight = printRef.current.offsetHeight;
      const pageHeight = window.innerHeight; // or any known height for a page
      const totalPages = Math.ceil(totalHeight / pageHeight);

      const pageNumbers = document.querySelectorAll('.pageNumber');
      const totalPageElements = document.querySelectorAll('.totalPages');
  
      pageNumbers.forEach((element, index) => {
        element.textContent = index + 1;
      });

      
  
      totalPageElements.forEach((element) => {
        element.textContent = totalPages;
      });
    },
  });

  useEffect(() => {

    if (order?.data?.order_id) {
      
      handlePrint()
          // Set the document title when the component mounts
    document.title = `Invoice(V1) ${order?.data?.order_id}`;

    // Optional: Cleanup or reset the title when the component unmounts

    }
    return () => {
      document.title = "Dashmerce Dashboard"; 
    };

  }, [order,products,id])

    const shippingGovernorate = useMemo(() => {
   return resolveCity(order?.data?.shipping_postcode)
    }, [order]);
    const paymentGovernorate = useMemo(() => {
      return resolveCity(order?.data?.payment_postcode)
    }, [order]);

    const baghdadAreaShippingAddress1 = useMemo(() => {
     return resolveArea(order?.data?.shipping_address_1)
     
    }, [order]);


    const baghdadAreaPaymentAddress1 = useMemo(() => {
        return resolveArea(order?.data?.payment_address_1)
    }, [order]);


const paymentMessage= "يمنع استلام المبلغ من الزبون , "+ order?.data?.payment_method+" تم الدفع بواسطة "
  

  const paymentInfo = [
    {
      title: "Customer Name:",
      value: order?.data?.customer_data?.customer_name,
    },
    {
      title: "Phone NO:",
      value: order?.data?.customer_data?.customer_number,
    },
    {
      title: "Payment Method:",
      value: order?.data?.payment_method,
    },
    {
      title: "Created Date:",
      value: formatFullDate(order?.data?.date_added || ""),
    },
    {
      title: "Conformation Date:",
      value: formatFullDate(order?.data?.date_modified || ""),
    },

  ];

  const shippingInfo = [
    {
      title: "Name:",
      value: `${order?.data?.payment_firstname} ${order?.data?.shipping_lastname}`,
    },
    {
      title: "Governorate:",
      value: shippingGovernorate?.name_ar||'',
    },
    {
      title: "City:",
      value: order?.data?.shipping_city,
    },
    {
      title: "Address 1:",
      value: baghdadAreaShippingAddress1,
    },
    {
      title: "Address 2:",
      value: order?.data?.shipping_address_2,
    },
    {
      title: "Alternate Phone:",
      value: order?.data?.shipping_custom_field,
    },
        {
      title: "Whatsapp Feedback:",
      value: order?.data?.whatsapp_response || "",
    },
  ];


  const isCash = order?.data?.payment_method !== "Cash On Delivery" ? true: false;
  //
  return (
    <section
    className={" font-roboto layout bg-white "}
  >

\
    <div className="layout-container bg-white ">

    <CanSection
    permissions={[

      "app_api.view_ocorder",

    ]}
  >
  <div className="min-h-fit h-fit max-h-fit w-full  flex justify-start  items-start bg-white ">

    <WrapperComponent
    isEmpty={isError}
    isError={isError || OrderDetailsIsError}
    error={error}
    isLoading={isLoading || OrderDetailsIsLoading}
    loadingUI={
      <div className="grid grid-cols-1 gap-8 place-content-center place-items-center w-full h-full py-4">
        {[1].map((item) => (
          <Skeleton key={item} className="h-[500px] w-[80%] rounded-xl" />
        ))}
      </div>
    }
    emptyStateMessage={"You don't have any orders by this id"}
  >
    <div className="flex justify-center items-center w-full min-h-fit h-fit max-h-fit ">
      <div
        ref={printRef}
        className="flex  flex-col justify-start items-center  print:w-full max-w-7xl  w-full lg:w-[75%]   min-h-fit h-fit max-h-fit mb-20"
      >
        <header className="bg-white flex justify-end items-start w-full h-[90px] px-0  pt-4 relative ">
          <img
            src={altawoonBrand}
            alt="Brand"
            className="w-[180px] h-[40px] object-contain mx-4"
          />

          <div className="flex w-fit flex-row justify-center items-start bg-slate-200 gap-2 rounded-b-md px-8 py-4 absolute top-0 left-0  ">
            {/* <HeaderText
            className={"!text-white text-base font-normal"}
            text={"INVOICE"}
          /> */}

      <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
        <Button
         variant={"default"}
        onClick={handlePrint}
        size="icon"
        className="flex items-center gap-2 text-white print:hidden"
      >
        {/* Large screen and above. */}
        <span className="hidden md:block">
          <Printer size={16} />
        </span>
        {/* Small screen. */}
        <span className="md:hidden">
          <Printer size={12} />
        </span>

        
  
      </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Print Order</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
            <HeaderText
              className={"!text-black text-lg  xl:text-4xl capitalize"}
              text={`INVOICE(V1) #${id}`}
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
        {/* <ScrollArea className="h-fit w-full print:hidden border">

            <OrderProducts products={products}/>
        </ScrollArea> */}
        {/* <div className="hidden min-h-fit w-full print:block border" >  */}

        <OrderProducts products={products}/>
        {/* </div> */}
        <div className="w-full min-h-fit h-fit max-fit flex  justify-end items-center  mt-2">
          <div className="w-[60%] lg:w-[50%] flex flex-col justify-start items-start divide-y-2">
            {/* SUB TOTAL */}
            <div className="flex justify-between items-center  py-2 px-4 w-full">
              <div className="flex justify-start items-center text-muted-foreground space-x-2">
                <Tags size={18} />
                <Text className={""} text={"Sub Total"} />
              </div>
              <Text
                className={"text-black text-start  min-w-[55%] max-w-fit  px-3"}
                text={formatNumberWithCurrency(String(order?.data?.sub_total), "IQD")}
              />
            </div>

            {/* DELIVERY COST */}
            <div className="flex justify-between items-center  py-2 px-4 w-full">
              <div className="flex justify-start items-center text-muted-foreground space-x-2">
                <Truck size={18} />
                <Text className={""} text={"Delivery Price"} />
              </div>

              <Text
                className={"text-black text-start min-w-[55%] max-w-fit  px-3"}
                text={formatNumberWithCurrency(
                  String(order?.data?.delivery_costs),
                  "IQD"
                )}
              />
            </div>

            {!!order?.data?.coupon_discount_value && (
              <>
                {/* COUPON NAME */}
                <div className="flex justify-between items-center  py-2 px-4 min-w-full w-full max-w-fit ">
                  <div className="flex justify-start items-center text-muted-foreground space-x-2">
                    <Ticket size={18} />
                    <Text className={""} text={"Coupon"} />
                  </div>

                  <Text
                    className={"text-black text-start min-w-[55%] max-w-fit  whitespace-nowrap px-3"}
                    text={order?.data?.coupon}
                  />
                </div>

                {/* COUPON DISCOUNT */}
                <div className="flex justify-between items-center  py-2 px-4 w-full">
                  <div className="flex justify-start items-center text-muted-foreground space-x-2">
                    <Ticket size={18} />
                    <Text className={""} text={"Discount"} />
                  </div>

                  <Text
                    className={"text-black text-start min-w-[55%] max-w-fit  px-3"}
                    text={`-${formatNumberWithCurrency(
                      String(order?.data?.coupon_discount_value),
                      "IQD"
                    )}`}
                  />
                </div>
              </>
            )}

            {/* TOTAL PRICE */}
            <div className="flex justify-between items-center  py-2 px-4  w-full">
              <div className="flex justify-start items-center text-muted-foreground space-x-2">
                <TicketMinus size={18} />

                <Text className={""} text={"Total "} />
              </div>

              <Text
                className={"text-black text-start min-w-[55%] max-w-fit  px-3"}
                text={formatNumberWithCurrency(String(order?.data?.total), "IQD")}
              />
            </div>
          </div>
        </div>
        {isCash && (
          <div className="flex justify-end items-center w-[90%] border mt-4 rounded-md  py-4 px-4 gap-2">
            <Text
              className={"text-black font-bold text-base"}
              text={
                paymentMessage
              }
            />
            <AlertTriangle className="text-yellow-400" size={30} />
          </div>
        )}
      {/* Footer with page numbers */}
      <footer>
        {/* <p className="flex justify-start gap-1 items-center"><span className="pageNumber"></span> of <span className="totalPages"></span></p>  */}
         <span>{formatFullDate(new Date() || "")}</span>
      </footer>
        
      </div>

    </div>

  </WrapperComponent>
  
  </div>

  </CanSection>
    </div>
  </section>
  );
};

export default PrintOrder;

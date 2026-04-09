import Section from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import WrapperComponent from "@/components/layout/WrapperComponent";
import { addDays, differenceInDays } from "date-fns";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Link, useNavigate, useParams } from "react-router-dom";
import { BookPlus, Loader2, Pencil, Printer, UserRound } from "lucide-react";
import {  ORDERS_V1_URL } from "@/utils/constants/urls";
import { Skeleton } from "@/components/ui/skeleton";
import {
  convertStatusIdToString,
  displayBasicDate,
  formatFullDate,
  formatNumberWithCurrency,
  resolveArea,
  resolveCity,
} from "@/utils/methods";
import HeaderText from "@/components/layout/header-text";
import Text from "@/components/layout/text";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UpdateOrderProductDialog from "./UpdateOrderProductDialog";
import {
  setIsPublishShipmentDialogOpenDialogOpen,
  setIsUpdateOrderProductDialogOpen,
  setIsUpdateOrderStatusDialogOpen,
  setOrderDetails,
  setProductsOrder,
} from "../store";
import UpdateOrderStatusDialog from "./UpdateOrderStatusDialog";
import { useEffect, useMemo, useRef } from "react";

import OrderHistory from "./OrderHistory";
import PrintOrder from "./PrintOrder";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import CanSection from "@/components/CanSection";
import Can from "@/components/Can";
import { Badge } from "@/components/ui/badge";
import PublishShipmentDialog from "./PublishShipmentDialog";
import CheckZainCashStatus from "./CheckZainCashStatus";
import OrderPaymentMethod from "../components/OrderPaymentMethod";
import { Separator } from "@/components/ui/separator";

const Order = () => {
  const { id } = useParams();
  const printRef = useRef();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
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




    useEffect(() => {
  
      if (order?.data?.order_id) {
        
  
            // Set the document title when the component mounts
      document.title = `Order(V1) ${order?.data?.order_id}`;
  
      // Optional: Cleanup or reset the title when the component unmounts
  
      }
      return () => {
        document.title = "Dashmerce Dashboard"; 
      };
  
    }, [order,id])

  const {
    data: orderDetails,
    isLoading: OrderDetailsIsLoading,
    error: OrderDetailsError,
    isError: OrderDetailsIsError,
  } = useQuery({
    queryKey: ["OrderV1Details", id],
    queryFn: () => GetOrderDetails(id),
    enabled: !isLoading,
  });

  const handleChangeProducts = () => {
    setIsUpdateOrderProductDialogOpen(true);
    setProductsOrder(orderDetails?.data);
    setOrderDetails(order?.data);
  };
  const handleUpdateOrder = () => {
    setIsUpdateOrderStatusDialogOpen(true);
    setOrderDetails(order?.data);
  };
  const handlePublishShipmentOrder = () => {
    setIsPublishShipmentDialogOpenDialogOpen(true);
    setOrderDetails(order?.data);
  };

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

  return (
    <CanSection
      permissions={[

        "app_api.view_ocorder",

      ]}
    >
      <Section className="space-y-4 h-fit items-start">

        {/* <HeaderText
          className={"w-full text-start "}
          text={`Order Details #${
            order?.data?.order_id ? order?.data?.order_id : ""
          }`}
        /> */}
        {order?.data?.order_id && (
          <Card className="flex justify-between items-center w-full px-4 gap-4 py-2 flex-wrap">
              <div className="flex justify-end items-center flex-wrap gap-2 md:gap-4">

                  <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>
                          <Link to="/sales/orders-v1">Orders V1</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Order(V1) #{ order?.data?.order_id ? order?.data?.order_id : ""} </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
         <Separator orientation="vertical" className="h-10"/>

            <Can permissions={["app_api.view_ocuser"]}>
              <Link to={`/users/details/${order?.data?.customer_id}`}>
                <Button variant="outline" className="flex items-center gap-1">
                  {/* Large screen and above. */}
                  <span className="hidden md:block">
                    <UserRound size={18} />
                  </span>
                  {/* Small screen. */}
                  <span className="md:hidden">
                    <UserRound size={14} />
                  </span>
                  Customer Page
                </Button>
              </Link>
            </Can>
              </div>
            <div className="flex justify-end items-center flex-wrap gap-2 md:gap-4">
              <Can permissions={["app_api.change_ocorder"]}>
                <Button
                  variant={"default"}
                  onClick={handleUpdateOrder}
                  className="flex items-center gap-2 text-white"
                  size="sm"
                >
                  {/* Large screen and above. */}
                  <span className="hidden md:block">
                    <Pencil size={16} />
                  </span>
                  {/* Small screen. */}
                  <span className="md:hidden">
                    <Pencil size={12} />
                  </span>
                  Update Order
                </Button>
              </Can>
              <Can permissions={["app_api.change_ocorder"]}>

                <Button
                  variant={"default"}
                  onClick={handlePublishShipmentOrder}
                  className="flex items-center gap-2 text-white"
                   size="sm"
                >
                  {/* Large screen and above. */}
                  <span className="hidden md:block">
                    <BookPlus size={16} />
                  </span>
                  {/* Small screen. */}
                  <span className="md:hidden">
                    <BookPlus size={12} />
                  </span>
                  Publish Shipment
                </Button>
              </Can>
                <a
                href={`/sales/orders-v1/details/${id}/print-order`}
                target="_blank"
                >

                <Button
         variant={"default"}
         size="sm"
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
                </a>

              {/* <PrintOrder order={order?.data} products={orderDetails} /> */}
            </div>
          </Card>
        )}
        <WrapperComponent
          isEmpty={isError}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={
            <div className="grid grid-cols-1 gap-4 place-content-center place-items-center w-full h-full py-4">
              {[1, 2].map((item) => (
                <Skeleton key={item} className="h-[500px] w-[80%] rounded-xl" />
              ))}
            </div>
          }
          emptyStateMessage={"You don't have any orders by this id"}
        >
          <div
            ref={printRef}
            className="flex flex-col justify-start items-center w-full h-fit space-y-4"
          >
            {/* Order Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 w-full h-full place-content-center place-items-start gap-4 ">
              <Card className="w-full ">
                <CardHeader className="py-3 px-4">
                  <HeaderText className={"lg:text-lg"} text="Order Status" />
                  <Text
                    text={convertStatusIdToString(order?.data?.order_status_id)}
                  />
                </CardHeader>
              </Card>
              <Card className="w-full">
                <CardHeader className="py-3 px-4 ">
                  <HeaderText className={"lg:text-lg"} text="Created" />
                  <Text
                    text={
                      order?.data?.date_added
                        ? displayBasicDate(order?.data?.date_added)
                        : "no date"
                    }
                  />
                </CardHeader>
              </Card>
              <Card className="w-full ">
                <CardHeader className="py-3 px-4 ">
                  <HeaderText className={"lg:text-lg"} text="Modified" />
                  <Text
                    text={
                      order?.data?.date_modified
                        ? displayBasicDate(order?.data?.date_modified)
                        : "no date"
                    }
                  />
                </CardHeader>
              </Card>
              <Card className="w-full h-full">
                <CardHeader className="py-3 px-4 ">
                  {/* SUB TOTAL */}
                  <HeaderText className={"lg:text-lg"} text="Sub Total" />
                  <Text
                    text={formatNumberWithCurrency(
                      String(order?.data?.sub_total),
                      "IQD"
                    )}
                  />

                  {/* PROMO CODE NAME */}
                  <HeaderText className={"lg:text-lg"} text="Promo Code" />
                  <Text text={order?.data?.coupon || "No promo code."} />

                  {/* PROMO CODE DISCOUNT */}
                  <HeaderText
                    className={"lg:text-lg"}
                    text="Promo Code Discount"
                  />

                  {/* PROMO CODE DISCOUNT VALUE */}
                  <Text
                    text={`${formatNumberWithCurrency(
                      String(order?.data?.coupon_discount_value),
                      "IQD"
                    )}`}
                  />

                  {/* TOTAL AFTER DISCOUNT */}
                  {/* <HeaderText
                    className={"lg:text-lg"}
                    text="Total After Discount"
                  />
                  <Text
                    text={formatNumberWithCurrency(
                      String(order?.data?.total_after_discount),
                      "IQD"
                    )}
                  /> */}

                  {/* DELIVERY COST */}
                  <HeaderText className={"lg:text-lg"} text="Delivery Costs" />
                  <Text
                    text={formatNumberWithCurrency(
                      String(order?.data?.delivery_costs),
                      "IQD"
                    )}
                  />

                  {/* TOTAL PRICE */}
                  <HeaderText className={"lg:text-lg"} text="Total" />
                  <Text
                    text={formatNumberWithCurrency(
                      String(order?.data?.total),
                      "IQD"
                    )}
                    className="text-slate-700 dark:text-slate-100 text-base font-semibold"
                  />

                  {/* <HeaderText className={"lg:text-lg"} text="Total USD" />
                <Text
                  text={formatNumberWithCurrency(
                    String(order?.data?.total_usd),
                    "USD"
                  )}
                /> */}
                {
                <>

                  <HeaderText className={"lg:text-lg"} text="Whatsapp Feedback" />
                <Text
                  text={order?.data?.whatsapp_response || "Customer has not provided WhatsApp feedback."}
                />
                </>
                }
                </CardHeader>
              </Card>

              <Card className="w-full h-full">
                <CardHeader className="py-3 px-4">
                  <HeaderText className={"lg:text-lg"} text="Customer Name" />
                  <Text text={order?.data?.customer_data?.customer_name} />
                  <HeaderText
                    className={"lg:text-lg"}
                    text="Payment Full Name"
                  />
                  <Text
                    text={`${order?.data?.payment_firstname} ${order?.data?.payment_lastname}`}
                  />
                  <HeaderText className={"lg:text-lg"} text="Payment Method" />
                  <OrderPaymentMethod method={order?.data?.payment_method}/>
                  <HeaderText className={"lg:text-lg"} text="Governorate" />
                  <Text text={paymentGovernorate?.name_ar||''} />
                  <HeaderText className={"lg:text-lg"} text="City" />
                  <Text text={order?.data?.payment_city} />
                                    <HeaderText className={"lg:text-lg"} text="Area" />
                  <Text text={baghdadAreaPaymentAddress1} />
                  <HeaderText className={"lg:text-lg"} text="Address" />
                  <Text
                    text={`${baghdadAreaPaymentAddress1} ${order?.data?.payment_address_2}`}
                  />
                </CardHeader>
              </Card>
              <Card className="w-full h-full">
                <CardHeader className="py-3 px-4">
                  <HeaderText
                    className={"lg:text-lg"}
                    text="Shipping Full Name"
                  />
                  <Text
                    text={`${order?.data?.shipping_firstname} ${order?.data?.shipping_lastname}`}
                  />
                  <HeaderText className={"lg:text-lg"} text="Phone Number" />
                  <Text text={order?.data?.customer_data?.customer_number} />
                  {order?.data?.shipping_custom_field && (
                    <>
                      <HeaderText
                        className={"lg:text-lg"}
                        text="Second Phone Number"
                      />
                      <Text text={order?.data?.shipping_custom_field} />
                    </>
                  )}
                  <HeaderText className={"lg:text-lg"} text="Shipping City" />
                  <Text text={order?.data?.shipping_city} />
                         <HeaderText
                    className={"lg:text-lg"}
                    text="Shipping Area"
                  />
                  <Text
                    text={`${baghdadAreaShippingAddress1}`}
                  />
                  <HeaderText
                    className={"lg:text-lg"}
                    text="Shipping Address"
                  />
                  <Text
                    text={`${order?.data?.shipping_address_2}`}
                  />
                  <HeaderText
                    className={"lg:text-lg"}
                    text="Device Type"
                  />
                  <Text
                    text={order?.data?.device_type || 'Unknown'}
                  />
                </CardHeader>
              </Card>
            </div>
            {/* Product */}
            <div className="grid grid-cols-1 w-full h-full place-content-center place-items-start gap-4 ">
              <Card className="flex justify-between items-center w-full px-4  py-2 print:hidden">
                <HeaderText
                  className={"w-fit text-start text-lg"}
                  text={"Products"}
                />
                <Can permissions={["app_api.change_ocorder"]}>
                  <Button variant="outline" onClick={handleChangeProducts}>
                    Update Product
                  </Button>
                </Can>
              </Card>
              <WrapperComponent
                isEmpty={!orderDetails?.data?.length}
                isError={OrderDetailsIsError}
                error={OrderDetailsError}
                isLoading={OrderDetailsIsLoading}
                loadingUI={
                  <div className="flex justify-center items-center space-x-2 h-[450px] w-full">
                    <Loader2 className=" h-5 w-5 animate-spin" />
                    <span>Please wait</span>
                  </div>
                }
                emptyStateMessage={"There is no product in this order"}
              >
                <ScrollArea className="h-full pb-4 min-w-[250px] w-full ">
                  <Table className="w-full">
                    <TableHeader className=" w-full">
                      <TableRow className="divide-x-2 w-full">
                        <TableHead className="w-[150px] !font-semibold">
                          Product
                        </TableHead>
                        <TableHead className="w-[150px] !font-semibold">
                          Model
                        </TableHead>
                        <TableHead className="w-[100px] !font-semibold">
                          Price
                        </TableHead>
                        <TableHead className=" w-[100px] !font-semibold">
                          Quantity
                        </TableHead>
                        <TableHead className=" w-[150px] !font-semibold">
                          Total
                        </TableHead>
                        <TableHead className=" !w-[150px] !font-semibold">
                          Image
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderDetails?.data?.length &&
                        orderDetails?.data?.map((product) => (
                          <TableRow
                            key={product?.product_id}
                            className={cn("divide-x-2 w-full", product?.product?.enabled!==undefined&& !product?.product?.enabled&&'text-red-500')}
                          >
                            <TableCell className="w-[150px]">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Link
                                      className="hover:text-blue-500"
                                      to={`/catalog/products/details/${product?.product_id}`}
                                    >
                                     
                                      <div className="flex flex-col justify-start items-start gap-2">
                    <span className="text-sm ">{product?.product?.description?.name}</span>
                    {product?.option&& <span className="text-sm ">-{product?.option}</span>}
                    
                    </div>
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">
                                      Go to product page
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    {" "}
                                    <Link
                                      className=" hover:text-blue-500"
                                      to={`/catalog/products/details/${product?.product_id}`}
                                    >
                                      {product?.model?product?.model:product?.product?.model?product?.product?.model:''}
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">
                                      Go to product page
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>
                              {formatNumberWithCurrency(
                                String(product?.price),
                                "IQD"
                              )}
                            </TableCell>
                            <TableCell>
                             <p  className={cn(
                                  "",
                                  product?.product?.available_quantity <=0 && "text-red-500"
                                )}>

                              <span
                                className={cn(
                                  "",
                                  product?.quantity > 1 && "text-red-500"
                                )}
                              >
                                {product?.quantity}
                              </span>{" "}
                              {` (${product?.product?.available_quantity})`}
                             </p>
                            </TableCell>
                            <TableCell>
                              {formatNumberWithCurrency(
                                String(product?.total),
                                "IQD"
                              )}
                              {/* {formatNumberWithCurrency(
                            String(product?.product?.price * product?.quantity),
                            "IQD"
                          )}   */}
                            </TableCell>
                            <TableCell className="p-1 lg:p-2 overflow-hidden">
                              <img
                                src={product?.option_image}
                                alt={product?.product_id}
                                className="w-full h-24 lg:h-52 object-contain"
                              />
                              {/* {product.option_image} */}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </WrapperComponent>
            </div>

            {order?.data?.scheduled_points_tasks && (
              <div className="grid grid-cols-1 w-full h-full place-content-center place-items-start gap-4 ">
                <Card className="flex justify-between items-center w-full px-4  py-2 print:hidden">
                  <HeaderText
                    className={"w-fit text-start text-lg"}
                    text={"Points"}
                  />
                </Card>

                <ScrollArea className="h-full pb-4 min-w-[250px] w-full ">
                  <Table className="w-full">
                    <TableHeader className=" w-full">
                      <TableRow className="divide-x-2 w-full">
                        <TableHead className="w-[150px] !font-semibold">
                          Customer
                        </TableHead>
                        <TableHead className="w-[150px] !font-semibold">
                          Points
                        </TableHead>

                        <TableHead className=" w-[50px] !font-semibold">
                          Status
                        </TableHead>
                        <TableHead className=" w-[150px] !font-semibold">
                          Apply
                        </TableHead>
                        {/* <TableHead className=" !w-[150px] !font-semibold">
                      Extras
                      </TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="divide-x-2 w-full">
                        <TableCell className="w-[150px]">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Link
                                  className="hover:text-blue-500"
                                  to={`/users/details/${order?.data?.scheduled_points_tasks?.customer_id}`}
                                >
                                  {order?.data?.customer_data?.customer_name}
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Go to user page</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          {order?.data?.scheduled_points_tasks?.points}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={cn(
                              " rounded-sm",
                              order?.data?.scheduled_points_tasks?.is_active
                                ? "bg-red-500 text-white hover:bg-red-400"
                                : "bg-[#A1FFEE] text-[#127462] hover:bg-emerald-200"
                            )}
                            variant={
                              !order?.data?.scheduled_points_tasks?.is_active
                                ? "destructive"
                                : "success"
                            }
                          >
                            {order?.data?.scheduled_points_tasks?.is_active
                              ? "Not Added Yet"
                              : "Added"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {order?.data?.scheduled_points_tasks?.date_added
                            ? differenceInDays(
                                addDays(
                                  new Date(
                                    order.data.scheduled_points_tasks.date_added
                                  ),
                                  7
                                ),
                                new Date()
                              ) > 0
                              ? `${differenceInDays(
                                  addDays(
                                    new Date(
                                      order.data.scheduled_points_tasks.date_added
                                    ),
                                    7
                                  ),
                                  new Date()
                                )} days remaining`
                              : formatFullDate(
                                  addDays(
                                    new Date(
                                      order.data.scheduled_points_tasks.date_added
                                    ),
                                    7
                                  )
                                )
                            : ""}
                        </TableCell>
                        {/* <TableCell>
                          {order?.data?.scheduled_points_tasks?.extras}
                          </TableCell> */}
                      </TableRow>
                    </TableBody>
                  </Table>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            )}

            <div className="grid grid-cols-1 w-full h-full place-content-center place-items-start gap-4 ">
    <Card className="flex justify-between items-center w-full px-4  py-2 print:hidden">
      <HeaderText
        className={"w-fit text-start text-lg"}
        text={"Order History"}
      />
    </Card>

            <OrderHistory
              order={order}
              orderId={id}
              reRender={isRefetching}
              messageInfo={{
                customer_number: order?.data?.customer_data?.customer_number,
                customerId: order?.data?.customer_id,
                orderId: order?.data?.order_id,
              }}
              userNotifiedArray={order?.data?.customer_notified_id}
            />
            </div>
            {
              order?.data?.payment_method === "Zain cash" && 
            <CheckZainCashStatus order={order}/>
            }
          </div>
        </WrapperComponent>
        <UpdateOrderProductDialog />
        <UpdateOrderStatusDialog />
        <PublishShipmentDialog  order={order?.data} products={orderDetails}/>
        {/* <PrintOrder order={order?.data} products={orderDetails} /> */}
      </Section>
    </CanSection>
  );
};

export default Order;

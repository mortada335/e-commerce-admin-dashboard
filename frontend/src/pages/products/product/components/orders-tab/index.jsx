import Section from "@/components/layout/Section";
import DataTable from "@/components/ui/DataTable";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import WrapperComponent from "@/components/layout/WrapperComponent";
import HeaderText from "@/components/layout/header-text";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import Pagination from "@/components/layout/Pagination";
import columns from "./components/columns";
import { ORDERS_URL, PRODUCT_ORDERS_URL } from "@/utils/constants/urls";

import OnDeleteDialog from "@/components/Dialogs/OnDelete";
import {
  useOrderStore,
  setIsDeleteOrderDialogOpen,
  // setPaymentType,
  setStatus,
  // setDebouncedSearchValue,
  // setSearch,
  setSearchBy,
  // setItemPerPage,
  setIsFilterMenu,
  // setPage,
  // setRangeDate,
  // ClearFilters,
  setSelectedCity,
  // iraqCities,
} from "./store";

import qs from "qs";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CalendarIcon, Loader2, RotateCcw, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";

import { convertStatusIdToString, displayBasicDate, exportToExcel, formatDate, formatNumberWithCurrency } from "@/utils/methods";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { Calendar } from "@/components/ui/calendar";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Text from "@/components/layout/text";
import IraqCitiesAutoComplete from "@/components/IraqCitiesAutoComplete";
import { useState } from "react";

import { toast } from "@/components/ui/use-toast";

import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";
import ExportButton from "@/components/ui/export-button";
import { useTranslation } from "react-i18next";

const ProductOrders = ({ byProduct = null }) => {
  const axiosPrivate = useAxiosPrivate();
  const {
    isDeleteOrderDialogOpen,
    selectedOrder,

    searchBy,

    selectedCity,
    status,

    sortType,
    sortBy,
    isFilterMenu,
  } = useOrderStore();

  const [search, setSearch] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(null);
  const [paymentType, setPaymentType] = useState(null);
  const [rangeDate, setRangeDate] = useState(null);

  // CSV download State
  const [csvDownload, setCsvDownload] = useState(null);

  const [itemPerPage, setItemPerPage] = useState("25");
  const [page, setPage] = useState(1);
  const {t} = useTranslation()

  const clearFilters = () => {
    setStatus(null);
    setSelectedCity(null);
    setIsFilterMenu(false);
    setPage(1);
    setItemPerPage("25");
    setRangeDate(null);
    setPaymentType(null);
    setDebouncedSearchValue(null);
    setSearch(null);
    setSearchBy("customer_phone_number");
  };

  const GetAdminOrder = async (page) => {
    // Initialize an object to store search params fro API request.
    let searchKeyObject = {};

    // Convert object to [key, value] array and filter it, then reconvert to a valid {key: value} object.
    searchKeyObject = Object.fromEntries(
      Object.entries({
        [searchBy]:debouncedSearchValue
        ? searchBy === "customer_phone_number"
          ? `%2B964${debouncedSearchValue}`
          : debouncedSearchValue
        : null,
        payment_type: paymentType ? paymentType : null,
        date_added_after: rangeDate?.from ? formatDate(rangeDate?.from) : null, // Lower Bound
        date_added_before: rangeDate?.to ? formatDate(rangeDate?.to) : null, // Upper Bound
        shipping_city: selectedCity ? selectedCity : null,
        order_status_id: status >= 0 ? status : null,
        deleted: false,
        product_id: byProduct,
        ordering: sortBy
          ? `${sortType === "asc" ? "" : "-"}${sortBy}`
          : "-order_id",
        // eslint-disable-next-line no-unused-vars
      }).filter(([_, value]) => value !== undefined && value !== null)
    );

    return axiosPrivate.get(
      `${PRODUCT_ORDERS_URL}?page=${page}&page_size=${itemPerPage}`,
      {
        params: { ...searchKeyObject },
        paramsSerializer: (params) => qs.stringify(params, { encode: false }),
      }
    );
  };

  const {
    data: orders,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "ProductOrders",
      page,
      debouncedSearchValue,
      selectedCity,
      status,
      sortBy,
      sortType,
      itemPerPage,
      paymentType,
      byProduct,

      rangeDate,
    ],
    queryFn: () => GetAdminOrder(page),
  });
  const totalPages = Math.ceil(orders?.data?.count / itemPerPage); // Assuming 25 items per page
  const isChild = byProduct === null ? true : false;
  const isFilter =
    selectedCity || debouncedSearchValue || paymentType || rangeDate || status
      ? true
      : false;

  // Handler for exporting the orders list as a CSV file.
  const exportCsvHandler = async () => {
    // Set the state to indicate loading and disable the button.
    setCsvDownload(true);



    try {


      if (orders.data?.results?.length) {

        const currentData = orders.data?.results?.map((order)=> { 

          
          

          return {
            

              orderId: order?.order_id,
              customerName: order?.user_info?.customer_name,
              
              customerNumber: order?.user_info?.customer_number,
              coupon: order?.coupon,
              quantity: order?.quantity,
              status:convertStatusIdToString(order.order_status_id) ,
              total: formatNumberWithCurrency(String(order?.total), "IQD"),
              paymentMethod: order?.payment_method,
              dateAdded: order?.date_added
                ? displayBasicDate(order?.date_added)
                : "",
              dateModified: order?.date_modified
                ? displayBasicDate(order?.date_modified)
                : "",
            
           
          }
        })

        // Reset the state and initiate the CSV file download.
        setCsvDownload(false);
        exportToExcel(currentData, "Orders.xlsx");
        // downloadCsv(response.data, undefined, "Orders List.csv");
      }
    } catch (error) {
      // Reset the state and notify the user about the error.
      setCsvDownload(false);
      toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };
  return (
    <Section className="space-y-6 h-fit items-start px-0">
      {isChild && (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/">{t("Home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>{t("Orders")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <HeaderText className={"w-full text-start rtl:text-end "} text={t("Orders List")} />
      {isFilterMenu && (
        <Card className="w-full">
          <CardHeader>
            <CardDescription>{t("Filter By")}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-start flex-wrap w-full gap-2">
 


            
            <Select
              onValueChange={setStatus}
              defaultValue={status}
              value={status}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t("Select Order Status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("Orders Status")}</SelectLabel>
                  <SelectItem value={null}>{t("All Status")}</SelectItem>
                  <SelectItem value={1}>{t("Pending")}</SelectItem>
                  <SelectItem value={5}>{t("Completed")}</SelectItem>
                  <SelectItem value={7}>{t("Cancelled Order")}</SelectItem>
                  <SelectItem value={11}>{t("Refunded")}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* <Popover>
              <PopoverTrigger asChild>
                <Card className="flex justify-between items-center space-y-0 space-x-0">
                  <Button
                    variant={"ghost"}
                    className={cn(
                      " w-fit text-left font-normal rounded-none flex justify-start items-center",
                      !rangeDate && "text-muted-foreground w-[180px]"
                    )}
                  >
                    {rangeDate ? (
                      <p className="space-x-2 flex">
                        <span>{formatDate(rangeDate?.from)}</span>
                        {rangeDate?.to && <span>/</span>}

                        {rangeDate?.to && (
                          <span>{formatDate(rangeDate?.to)}</span>
                        )}
                      </p>
                    ) : (
                      <>
                        Pick Range Date
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </>
                    )}
                  </Button>
                  {rangeDate && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {" "}
                          <Button
                            variant={"ghost"}
                            size="icon"
                            className="rounded-none"
                            onClick={() => {
                              setRangeDate(null);
                            }}
                          >
                            <X className=" h-4 w-4 opacity-50" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <Text text={"Clear"} />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Card>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={rangeDate}
                  onSelect={(value) => {
                    setRangeDate(value);
                  }}
                  disabled={(date) => date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover> */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();

                    
                      setDebouncedSearchValue(search);
                }}
                className="relative"
              >
                <Input
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                       placeholder={
                      searchBy === "customer_phone_number"
                        ? "e.g 7710000000"
                        : `${t("Search by")} ${searchBy?.replace(/[_\s]/g, " ")}...`
                    }
                  disabled={isLoading}
                  className={"w-[300px]"}
                  value={search}
                />
                <Button
                  className="absolute right-0 top-0 rounded-l-none rounded-r-md"
                  variant="secondary"
                  size={"icon"}
                  type="submit"
                >
                  <Search size={16} />
                </Button>
              </form>
              <Select
                onValueChange={setSearchBy}
                defaultValue={searchBy}
                value={searchBy}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder={t("Search By")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("Order Field")}</SelectLabel>


                    <SelectItem
                      value={"order_id"}
                      className="capitalize"
                    >
                      {t("Order Id")}
                    </SelectItem>
                    
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="flex justify-between items-center w-full px-2  py-2 space-x-2">
           <ExportButton initSortBy="-order_id" itemPerPage={orders?.data?.count} url={PRODUCT_ORDERS_URL} 
           isCustomObject={true}
           exportObject={(order)=>{
            return {
            

              orderId: order?.order_id,
              customerName: order?.user_info?.customer_name,
              
              customerNumber: order?.user_info?.customer_number,
              coupon: order?.coupon,
              quantity: order?.quantity,
              status:convertStatusIdToString(order.order_status_id) ,
              total: formatNumberWithCurrency(String(order?.total), "IQD"),
              paymentMethod: order?.payment_method,
              dateAdded: order?.date_added
                ? displayBasicDate(order?.date_added)
                : "",
              dateModified: order?.date_modified
                ? displayBasicDate(order?.date_modified)
                : "",
            
           
          }
        
           }}
           fileName={`Orders(${byProduct}).xlsx`}
           filters={
            [
              {
            key:searchBy,
            value: debouncedSearchValue
        ? searchBy === "customer_phone_number"
          ? `%2B964${debouncedSearchValue}`
          : debouncedSearchValue
        : null,
           },
              {
            key:'payment_type',
            value: paymentType ? paymentType : null,
           },
              {
            key:'date_added_after',
            value: rangeDate?.from ? formatDate(rangeDate?.from) : null,
           },
              {
            key:'date_added_before',
            value: rangeDate?.to ? formatDate(rangeDate?.to) : null,
           },
     
              {
            key:'shipping_city',
            value: selectedCity ? selectedCity.postcode : null,
           },
              {
            key:'order_status_id',
            value: status >= 0 ? status : null,
           },
              {
            key:'deleted',
            value: false,
           },
              {
            key:'product_id',
            value: byProduct,
           },
             
           ]
           }

           sortBy={sortBy}
           sortType={sortType}
           page={page}

           />
        <div className="flex items-center space-x-2">
        <CustomsItemsPerPage setItemPerPage={setItemPerPage} itemPerPage={itemPerPage}/>
          <Button
            variant={isFilterMenu ? "default" : "outline"}
            onClick={() => {
              setIsFilterMenu(!isFilterMenu);
            }}
          >
            {t("Filter Menu")}
          </Button>
          {isFilter && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={clearFilters}
                    size="icon"
                    variant={"outline"}
                  >
                    <RotateCcw size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{t("Clear Filters")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </Card>

      <WrapperComponent
        isEmpty={!orders?.data?.results?.length > 0}
        isError={isError}
        error={error}
        isLoading={isLoading}
        loadingUI={<DataTableSkeleton columnCount={5} />}
        emptyStateMessage={
          isFilter
            ? t("You don't have any orders by this filter")
            : t("You don't have any orders")
        }
      >
        <DataTable
          canView={true}
          to={"/sales/orders/details/"}
          columns={columns}
          data={orders?.data?.results?.map((order) => ({
            orderData: order,
            id: order.order_id,
            orderId: order.order_id,

            model: order.model,
            price: order.price ? parseFloat(order.price) : "/",
            quantity: order.quantity,
            customer: order?.user_info?.customer_name,
            customerNumber: order?.user_info?.customer_number,

            coupon: order.coupon,
            status: order.order_status_id,
            total: order.total ? parseFloat(order.total) : "/",
            dateAdded: order?.date_added
              ? displayBasicDate(order?.date_added)
              : "",
            dateModified: order?.date_modified
              ? displayBasicDate(order?.date_modified)
              : "",

            actions: order.order_id,
          }))}
        />
        <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
          <Pagination
            itemPerPage={itemPerPage}
            next={orders?.data?.next}
            previous={orders?.data?.previous}
            totalPages={totalPages}
            totalCount={orders?.data?.count}
            page={page}
            setPage={setPage}
          />
        </Card>
      </WrapperComponent>

      {/* <OnDeleteDialog
        name={"Orders"}
        heading={"Are you absolutely sure?"}
        description={`This action cannot be undone. This will permanently delete this  "${selectedOrder?.customer}".`}
        url={ORDERS_URL}
        id={selectedOrder?.orderId}
        isDialogOpen={isDeleteOrderDialogOpen}
        setIsDialogOpen={setIsDeleteOrderDialogOpen}
      /> */}
    </Section>
  );
};

export default ProductOrders;

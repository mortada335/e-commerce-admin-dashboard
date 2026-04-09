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
import {
  CATEGORIES_URL,
  ORDERS_V1_URL,
  PRODUCTS_URL,
} from "@/utils/constants/urls";

import OnDeleteDialog from "@/components/Dialogs/OnDelete";
import {
  useOrderStore,
  setIsDeleteOrderDialogOpen,
  setStatus,
  setSearchBy,
  setIsFilterMenu,
  setSelectedCity,
} from "./store";

import OrderDialog from "./components/OrderDialog";
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

import {
  CalendarIcon,
  ChevronRight,
  Loader2,
  RotateCcw,
  Search,
  Upload,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/input";

import {
  convertStatusIdToString,
  displayBasicDate,
  exportToExcel,
  formatDate,
  formatNumberWithCurrency,
  parseCsvStringToJson,
} from "@/utils/methods";
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

import CanSection from "@/components/CanSection";
import ColumnsMenu from "@/components/data-table/ColumnsMenu";
import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";
import ExportButton from "@/components/ui/export-button";
import CustomsCombobox from "@/components/ui/customs-combobox";
import { Separator } from "@/components/ui/separator";

// Function to construct category path.
const getCategoryPath = (category) => {
  console.log(category?.parents);

  const currentCategoryName = (
    <p>
      {" "}
      {category?.description?.[0]?.name
        ? category.description[0].name
        : "Unknown Description"}
    </p>
  );

  if (category?.parents.length) {
    const categoryParents = category?.parents.map((parent) => (
      <p
        key={parent?.category_id}
        className="flex justify-start items-center w-fit gap-2"
      >
        <span>{parent?.name?.[0]?.name || "Unknown Parent"}</span>
        <span>
          <ChevronRight key="chevron" size={14} />
        </span>
      </p>
    ));

    const categoryPath = (
      <div className="flex justify-start items-start w-fit gap-2">
        {categoryParents}
        {currentCategoryName}
      </div>
    );

    return categoryPath;
  }

  return currentCategoryName;
};

const Orders = ({
  byProduct = null,
  customer_id = null,
  isUserPage = false,
  isOrdersPaymentPage = false,
  queryKey = "OrdersV1",
}) => {
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
  const [modifiedRangeDate, setModifiedRangeDate] = useState(null);
  const [categoryFormFields, setCategoryFormFields] = useState(null);
  const [productFormFields, setProductFormFields] = useState(null);
  // CSV download State
  const [csvDownload, setCsvDownload] = useState(null);

  const [itemPerPage, setItemPerPage] = useState("25");
  const [page, setPage] = useState(1);

  const clearFilters = () => {
    setStatus(null);
    setSelectedCity(null);
    setIsFilterMenu(false);
    setPage(1);
    setItemPerPage("25");
    setRangeDate(null);
    setModifiedRangeDate(null);
    setPaymentType(null);
    setDebouncedSearchValue(null);
    setSearch(null);
    setSearchBy("filter_by_order_id");
  };

  const GetAdminOrder = async (page) => {
    // Initialize an object to store search params fro API request.
    let searchKeyObject = {};

    // Convert object to [key, value] array and filter it, then reconvert to a valid {key: value} object.
    searchKeyObject = Object.fromEntries(
      Object.entries({
        [searchBy]: debouncedSearchValue
          ? searchBy === "customer_phone_number"
            ? `%2B964${debouncedSearchValue}`
            : debouncedSearchValue
          : null,
        payment_type: paymentType ? paymentType : null,
        date_added_after: rangeDate?.from ? formatDate(rangeDate?.from) : null, // Lower Bound
        date_added_before: rangeDate?.to ? formatDate(rangeDate?.to) : null, // Upper Bound
        date_modified_after: modifiedRangeDate?.from
          ? formatDate(modifiedRangeDate?.from)
          : null, // Lower Bound.
        date_modified_before: modifiedRangeDate?.to
          ? formatDate(modifiedRangeDate?.to)
          : null, // Upper Bound.
        // Filter orders base on the area psotcode.
        shipping_postcode: selectedCity ? selectedCity.postcode : null,
        orders_in_category: categoryFormFields?.category_id
          ? categoryFormFields?.category_id
          : null,

        order_status_id: isOrdersPaymentPage ? 20 : status >= 0 ? status : null,
        customer_id: customer_id,
        by_product: byProduct
          ? byProduct
          : productFormFields?.product_id
          ? productFormFields?.product_id
          : null,

        slim: true,
        deleted: isOrdersPaymentPage ? isOrdersPaymentPage : false,
        ordering: sortBy
          ? `${sortType === "asc" ? "" : "-"}${sortBy}`
          : "-date_added",
        // eslint-disable-next-line no-unused-vars
      }).filter(([_, value]) => value !== undefined && value !== null)
    );

    return axiosPrivate.get(
      `${ORDERS_V1_URL}?page=${page}&page_size=${itemPerPage}`,
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
      queryKey,
      page,
      debouncedSearchValue,
      selectedCity,
      status,
      sortBy,
      sortType,
      itemPerPage,
      paymentType,
      byProduct,
      customer_id,
      rangeDate,
      modifiedRangeDate,
      categoryFormFields,
      productFormFields,
    ],
    queryFn: () => GetAdminOrder(page),
  });
  const totalPages = Math.ceil(orders?.data?.count / itemPerPage); // Assuming 25 items per page
  const isChild = byProduct === null || customer_id === null ? true : false;
  const isFilter =
    selectedCity ||
    debouncedSearchValue ||
    paymentType ||
    rangeDate ||
    modifiedRangeDate ||
    status ||
    categoryFormFields?.category_id ||
    productFormFields?.product_id
      ? true
      : false;

  // Handler for exporting the orders list as a CSV file.
  const exportCsvHandler = async () => {
    // Set the state to indicate loading and disable the button.
    setCsvDownload(true);

    try {
      if (orders.data?.results?.length) {
        const currentData = orders.data?.results?.map((order) => {
          return {
            orderId: order.order_id,
            customerName: order.customer_data?.customer_name,
            shipmentName:
              order.shipping_firstname + " " + order.shipping_lastname,
            customerNumber: order?.customer_data?.customer_number,
            coupon: order.coupon,
            status: convertStatusIdToString(order.order_status_id),
            total: formatNumberWithCurrency(String(order?.total), "IQD"),
            paymentMethod: order.payment_method,
            dateAdded: order.date_added
              ? displayBasicDate(order.date_added)
              : "",
            dateModified: order.date_modified
              ? displayBasicDate(order.date_modified)
              : "",
          };
        });

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

  const [columnVisibility, setColumnVisibility] = useState({
    orderId: true,
    shipmentName: JSON.parse(localStorage.getItem("shipmentName")) ?? true,
    customerName: JSON.parse(localStorage.getItem("customerName")) ?? true,
    customerNumber: JSON.parse(localStorage.getItem("customerNumber")) ?? true, // Hidden by default
    status: JSON.parse(localStorage.getItem("status")) ?? false, // Hidden by default
    total: JSON.parse(localStorage.getItem("total")) ?? true,
    paymentMethod: JSON.parse(localStorage.getItem("paymentMethod")) ?? true,
    date_added: JSON.parse(localStorage.getItem("date_added")) ?? true,
    dateModified: JSON.parse(localStorage.getItem("dateModified")) ?? true,
    coupon: JSON.parse(localStorage.getItem("coupon")) ?? true,

    actions: true,
  });

  const disabledColumnVisibility = (column) => {
    if (column) {
      return (
        column?.accessorKey !== "orderId" && column?.accessorKey !== "actions"
      );
    } else {
      return true;
    }
  };

  return (
    <CanSection permissions={["app_api.view_ocorder"]}>
      <Section className="space-y-6 h-fit py-0 pb-4 items-start">
        {isFilterMenu && (
          <Card className="w-full">
            <CardHeader>
              <CardDescription>Filter By</CardDescription>
            </CardHeader>
            <CardContent className="flex items-start justify-start flex-wrap w-full gap-2">
              <CustomsCombobox
                endpoint={CATEGORIES_URL}
                itemValue={"category_id"}
                setItem={setCategoryFormFields}
                item={categoryFormFields}
                itemTitle="name"
                containerClassName="w-fit"
                searchQueryKey="name"
                queryKey="categories"
                className=""
                placeholder={"Select Category"}
              >
                {(item) => <>{getCategoryPath(item)}</>}
              </CustomsCombobox>
              <CustomsCombobox
                endpoint={PRODUCTS_URL}
                itemValue={"product_id"}
                setItem={setProductFormFields}
                item={productFormFields}
                itemTitle="model"
                containerClassName="w-fit"
                searchQueryKey="model"
                queryKey="products"
                className=""
                placeholder={"Select Product"}
              />

              <div className="min-w-[150px] w-fit">
                <IraqCitiesAutoComplete
                  setSelectedCity={setSelectedCity}
                  selectedCity={selectedCity}
                  setPage={setPage}
                />
              </div>

              <Select
                onValueChange={(val) => {
                  setPaymentType(val);
                  setPage(1);
                }}
                defaultValue={paymentType}
                value={paymentType}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select Payment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Payment Type</SelectLabel>
                    <SelectItem value={null}>All Types</SelectItem>
                    <SelectItem value={"cash"}>Cash</SelectItem>
                    <SelectItem value={"aps"}>APS</SelectItem>
                    <SelectItem value={"paytabs"}>Paytabs</SelectItem>
                    <SelectItem value={"zain_cash"}>Zain Cash</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {!isOrdersPaymentPage && (
                <Select
                  onValueChange={(val) => {
                    setStatus(val);
                    setPage(1);
                  }}
                  defaultValue={status}
                  value={status}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Select Order Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Orders Status</SelectLabel>
                      <SelectItem value={null}>All Status</SelectItem>
                      <SelectItem value={1}>Pending</SelectItem>
                      <SelectItem value={5}>Completed</SelectItem>
                      <SelectItem value={25}>Whatsapp Completed</SelectItem>
                      <SelectItem value={7}>Cancelled Order</SelectItem>
                      <SelectItem value={11}>Refunded</SelectItem>
                      <SelectItem value={20}>Cashless Pending</SelectItem>
                      <SelectItem value={21}>Failed Payment</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
              <Popover>
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
                          <span className="w-[95%] truncate">
                            Pick Range Date
                          </span>
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
                      setPage(1);
                    }}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Card className="flex justify-between items-center space-y-0 space-x-0">
                    <Button
                      variant={"ghost"}
                      className={cn(
                        " w-fit text-left font-normal rounded-none flex justify-start items-center",
                        !modifiedRangeDate && "text-muted-foreground w-[250px]"
                      )}
                    >
                      {modifiedRangeDate ? (
                        <p className="space-x-2 flex">
                          <span>{formatDate(modifiedRangeDate?.from)}</span>
                          {modifiedRangeDate?.to && <span>/</span>}

                          {modifiedRangeDate?.to && (
                            <span>{formatDate(modifiedRangeDate?.to)}</span>
                          )}
                        </p>
                      ) : (
                        <>
                          <span className="w-[95%] truncate">
                            Pick Modified Range Date
                          </span>
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </>
                      )}
                    </Button>
                    {modifiedRangeDate && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {" "}
                            <Button
                              variant={"ghost"}
                              size="icon"
                              className="rounded-none"
                              onClick={() => {
                                setModifiedRangeDate(null);
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
                    selected={modifiedRangeDate}
                    onSelect={(value) => {
                      setModifiedRangeDate(value);
                      setPage(1);
                    }}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    setDebouncedSearchValue(search);

                    setPage(1);
                  }}
                  className="relative"
                >
                  <Input
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    placeholder={
                      searchBy === "customer_phone_number"
                        ? "e.g 7710000000"
                        : `Search by ${searchBy?.replace(/[_\s]/g, " ")}...`
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
                    <SelectValue placeholder="Search By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Order Field</SelectLabel>

                      <SelectItem
                        value={"customer_phone_number"}
                        className="capitalize"
                      >
                        Phone Number
                      </SelectItem>
                      <SelectItem
                        value={"filter_by_order_id"}
                        className="capitalize"
                      >
                        order id
                      </SelectItem>
                      <SelectItem
                        value={"payment_firstname"}
                        className="capitalize"
                      >
                        Customer First Name
                      </SelectItem>
                      <SelectItem
                        value={"payment_lastname"}
                        className="capitalize"
                      >
                        Customer Last Name
                      </SelectItem>
                      <SelectItem
                        value={"shipping_firstname"}
                        className="capitalize"
                      >
                        Shipping First Name
                      </SelectItem>
                      <SelectItem
                        value={"shipping_lastname"}
                        className="capitalize"
                      >
                        Shipping Last Name
                      </SelectItem>
                      <SelectItem value={"coupon"} className="capitalize">
                        Coupon
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="flex justify-between items-center w-full px-2  py-2 space-x-2">
          <div className="flex justify-end items-center flex-wrap gap-2 md:gap-4">
            {isChild && !isUserPage && (
              <>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink>
                        <Link to="/">Home</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {" "}
                        <span>Orders(V1)</span>
                        {isOrdersPaymentPage && <span> Payment</span>}{" "}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <Separator orientation="vertical" className="h-10" />
              </>
            )}
            <ExportButton
              itemPerPage={orders?.data?.count}
              url={ORDERS_V1_URL}
              isCustomObject={true}
              exportObject={(order) => {
                return {
                  orderId: order.order_id,
                  total: formatNumberWithCurrency(String(order?.total), "IQD"),
                  customerId: order?.customer_id,
                  customerName: order?.customer_name,
                  customerNumber: order?.customer_number,
                  shipmentName:
                    order.shipping_firstname + " " + order.shipping_lastname,
                  coupon: order.coupon,
                  status: convertStatusIdToString(order.order_status_id),
                  paymentMethod: order.payment_method,
                  dateAdded: order.date_added
                    ? displayBasicDate(order.date_added)
                    : "",
                  dateModified: order.date_modified
                    ? displayBasicDate(order.date_modified)
                    : "",
                };
              }}
              fileName="Orders.xlsx"
              filters={[
                {
                  key: "slim",
                  value: true,
                },
                {
                  key: searchBy,
                  value: debouncedSearchValue
                    ? searchBy === "customer_phone_number"
                      ? `%2B964${debouncedSearchValue}`
                      : debouncedSearchValue
                    : null,
                },
                {
                  key: "payment_type",
                  value: paymentType ? paymentType : null,
                },
                {
                  key: "date_added_after",
                  value: rangeDate?.from ? formatDate(rangeDate?.from) : null,
                },
                {
                  key: "date_added_before",
                  value: rangeDate?.to ? formatDate(rangeDate?.to) : null,
                },
                {
                  key: "date_modified_after",
                  value: modifiedRangeDate?.from
                    ? formatDate(modifiedRangeDate?.from)
                    : null,
                },
                {
                  key: "date_modified_before",
                  value: modifiedRangeDate?.to
                    ? formatDate(modifiedRangeDate?.to)
                    : null,
                },
                {
                  key: "shipping_postcode",
                  value: selectedCity ? selectedCity.postcode : null,
                },
                {
                  key: "orders_in_category",
                  value: categoryFormFields?.category_id
                    ? categoryFormFields?.category_id
                    : null,
                },
                {
                  key: "order_status_id",
                  value: isOrdersPaymentPage ? 20 : status >= 0 ? status : null,
                },
                {
                  key: "customer_id",
                  value: customer_id,
                },
                {
                  key: "by_product",
                  value: byProduct,
                },
                {
                  key: "deleted",
                  value: isOrdersPaymentPage ? isOrdersPaymentPage : false,
                },
              ]}
              sortBy={sortBy}
              sortType={sortType}
              page={page}
            />
          </div>
          <div className="flex items-center space-x-2">
            <CustomsItemsPerPage
              setItemPerPage={setItemPerPage}
              itemPerPage={itemPerPage}
            />
            <ColumnsMenu
              columns={columns}
              columnVisibility={columnVisibility}
              setColumnVisibility={setColumnVisibility}
              disabledColumnVisibility={disabledColumnVisibility}
            />
            <Button
              variant={isFilterMenu ? "default" : "outline"}
              onClick={() => {
                setIsFilterMenu(!isFilterMenu);
              }}
            >
              Filter Menu
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
                    <p className="text-xs">Clear Filters</p>
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
              ? "You don't have any orders by this filter"
              : "You don't have any orders"
          }
        >
          <DataTable
            canView={true}
            to={"/sales/orders-v1/details/"}
            columns={columns}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            data={orders?.data?.results?.map((order) => ({
              orderData: order,
              id: order.order_id,
              orderId: order.order_id,
              customerName: order?.customer_name,
              shipmentName:
                order.shipping_firstname + " " + order.shipping_lastname,
              customerNumber: order?.customer_number,
              coupon: order.coupon,
              status: order.order_status_id,
              total: order.total ? parseFloat(order.total) : "/",
              paymentMethod: order.payment_method,
              dateAdded: order.date_added
                ? displayBasicDate(order.date_added)
                : "",
              dateModified: order.date_modified
                ? displayBasicDate(order.date_modified)
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
        <OrderDialog />
        <OnDeleteDialog
          name={"OrdersV1"}
          heading={"Are you absolutely sure?"}
          description={`This action cannot be undone. This will permanently delete this  "${selectedOrder?.customerName}'s" order.`}
          url={ORDERS_V1_URL}
          id={selectedOrder?.id}
          isDialogOpen={isDeleteOrderDialogOpen}
          setIsDialogOpen={setIsDeleteOrderDialogOpen}
        />
      </Section>
    </CanSection>
  );
};

export default Orders;

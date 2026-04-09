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
  ORDERS_URL,
  PRODUCTS_URL,
  USERS_URL,
  WAREHOUSES_URL,
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
import AssignUsersDialog from "./components/AssignUsersDialog";
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
import FiltersSection from "@/components/filters-ui/FiltersSection";
import FiltersMenu from "@/components/filters-ui/FiltersMenu";
import { useTranslation } from "react-i18next";

// Function to construct category path.
const getCategoryPath = (category) => {
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
  queryKey = "Orders",
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
  const [filters, setFilters] = useState([]);
  const { t } = useTranslation();

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
    setSearchBy(t("filter_by_order_id"));
  };

  const defaultsFilters = [
    {
      title: t("Category"),
      type: "combobox",
      key: "orders_in_category",
      value: null,
      queryKey: "categories",
      endpoint: CATEGORIES_URL,
      itemTitle: "category_id",
      itemValue: "category_id",
    },
      {
        title: t("Customer"),
        key: "customer_id",
        type: "combobox",
        endpoint: USERS_URL,
        itemTitle: "first_name",
        itemValue: "id",
        value: null,
      },
    {
      title: t("Product"),
      type: "combobox",
      key: "by_product",
      value: null,
      queryKey: "products",
      endpoint: PRODUCTS_URL,
      itemTitle: "model",
      itemValue: "product_id",
    },
    {
      title: t("warehouses"),
      type: "combobox",
      key: "warehouse_id",
      value: null,
      queryKey: "warehouses",
      endpoint: WAREHOUSES_URL,
      itemTitle: "name",
      itemValue: "id",
    },
    {
      title: t("City"),
      type: "text",
      key: "shipping_postcode",
      value: null,
    },
    {
      title: t("payment_method"),
      type: "select",
      key: "paymentMethod",
      value: null,
      options: [
        { label: t("All Types"), value: null },
        { label: t("Cash"), value: "cash" },
        { label: t("APS"), value: "aps" },
        { label: t("Paytabs"), value: "paytabs" },
        { label: t("Zain Cash"), value: "zain_cash" },
      ],
    },
    {
      title: t("Order Status"),
      type: "select",
      key: "order_status_id",
      value: null,
      options: [
        { label: t("All Status"), value: null },
        { label: t("Pending"), value: 1 },
        { label: t("Completed"), value: 5 },
        { label: t("Cancelled Order"), value: 7 },
        { label: t("Refunded"), value: 11 },
        { label: t("Cashless Pending"), value: 20 },
        { label: t("Failed Payment"), value: 21 },
        { label: t("Whatsapp Completed"), value: 25 },
        { label: t("Preparing"), value: 30 },
        { label: t("Ready To Pickup"), value: 31 },
      ],
    },
    {
      title: t("Created Date"),
      type: "date",
      key: "date_added",
      value: null,
    },
    {
      title: t("Updated Date"),
      type: "date",
      key: "date_modified",
      value: null,
    },
    {
      title: t("Search"),
      type: "text",
      key: "search",
      value: null,
    },
  ];

  // const GetAdminOrder = async (page) => {
  //   // Initialize an object to store search params fro API request.
  //   let searchKeyObject = {};
  //   const params = new URLSearchParams()

  //       if (filters?.length) {
  //     filters?.forEach((filter) => {
  //       if (filter?.value) {
  //         params.append(filter?.key, filter?.value);
  //       }
  //     });
  //   }

  //   // Convert object to [key, value] array and filter it, then reconvert to a valid {key: value} object.
  //   searchKeyObject = Object.fromEntries(
  //     Object.entries({
  //       [searchBy]: debouncedSearchValue
  //       ? searchBy === "customer_phone_number"
  //         ? `%2B964${debouncedSearchValue}`
  //         : debouncedSearchValue
  //       : null,
  //       payment_type: paymentType ? paymentType : null,
  //       date_added_after: rangeDate?.from ? formatDate(rangeDate?.from) : null, // Lower Bound
  //       date_added_before: rangeDate?.to ? formatDate(rangeDate?.to) : null, // Upper Bound
  //       date_modified_after: modifiedRangeDate?.from ? formatDate(modifiedRangeDate?.from) : null, // Lower Bound.
  //       date_modified_before: modifiedRangeDate?.to ? formatDate(modifiedRangeDate?.to) : null, // Upper Bound.
  //       // Filter orders base on the area psotcode.
  //       shipping_postcode: selectedCity ? selectedCity.postcode : null,
  //       orders_in_category: categoryFormFields?.category_id ? categoryFormFields?.category_id : null,

  //       order_status_id: isOrdersPaymentPage?20 : status >= 0 ? status : null,
  //       customer_id: customer_id,
  //               by_product: byProduct?byProduct:productFormFields?.product_id ? productFormFields?.product_id : null,

  //       slim: true,
  //       deleted: isOrdersPaymentPage?isOrdersPaymentPage:false,
  //       ordering: sortBy
  //         ? `${sortType === "asc" ? "" : "-"}${sortBy}`
  //         : "-date_added",
  //       // eslint-disable-next-line no-unused-vars
  //     }).filter(([_, value]) => value !== undefined && value !== null)
  //   );

  //   return axiosPrivate.get(
  //     `${ORDERS_URL}?page=${page}&page_size=${itemPerPage}}`,
  //     {
  //       params: { ...searchKeyObject },
  //       paramsSerializer: (params) => qs.stringify(params, { encode: false }),
  //     }
  //   );
  // };

  const GetAdminOrder = async () => {
    const params = new URLSearchParams();

    params.append("page", page);
    params.append("page_size", itemPerPage);

    params.append(
      "ordering",
      sortBy ? `${sortType === "asc" ? "" : "-"}${sortBy}` : "-created_at"
    );

    if (filters?.length) {
      filters.forEach((filter) => {
        if (!filter?.value) return;

        let valueToSend = filter.value;

        if (filter.type === "daterange" && typeof valueToSend === "object") {
          if (valueToSend?.from)
            params.append(`${filter.key}_after`, formatDate(valueToSend.from));
          if (valueToSend?.to)
            params.append(`${filter.key}_before`, formatDate(valueToSend.to));
          return;
        }

        if (typeof valueToSend === "object") {
          valueToSend =
            valueToSend?.id ??
            valueToSend?.value ??
            valueToSend?.category_id ??
            valueToSend?.product_id ??
            null;
        }

        if (valueToSend === null || valueToSend === undefined) return;

        params.append(filter.key, valueToSend);
      });
    }
    if(customer_id){
      params.append("customer_id", customer_id)
    }

    return axiosPrivate.get(`${ORDERS_URL}?${params.toString()}`);
  };

  const {
    data: orders,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      queryKey,
      filters,
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
        <Card className="flex justify-between items-center w-full px-2  py-2 space-x-2">
          <div className="flex  items-center flex-wrap gap-2 md:gap-4">
            {isChild && !isUserPage && (
              <>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink>
                        <Link to="/">{t("Home")}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {" "}
                        <span>{t("Orders")}(V2)</span>
                        {isOrdersPaymentPage && (
                          <span> {t("Payment")}</span>
                        )}{" "}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <Separator orientation="vertical" className="h-10" />
              </>
            )}
          </div>
          <FiltersSection
            setPage={setPage}
            value={filters}
            onChange={setFilters}
            isLoading={isLoading}
            isMenuOpen={isFilterMenu}
            className=" lg:w-[400px] xl:w-[500px]"
            searchQueryKey="name"
            setIsMenuOpen={setIsFilterMenu}
          />
          <div className="flex items-center space-x-2">
            <ExportButton
              itemPerPage={orders?.data?.count}
              url={ORDERS_URL}
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
            {/* <Button
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
            )} */}
          </div>
        </Card>
        <FiltersMenu
          isLoading={isLoading}
          values={filters}
          onChange={setFilters}
          defaultsFilters={defaultsFilters}
          isMenuOpen={isFilterMenu}
          setIsMenuOpen={setIsFilterMenu}
          setPage={setPage}
        />
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
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            data={orders?.data?.results?.map((order) => ({
              orderData: order,
              id: order.order_id,
              orderId: order.order_id,
              customerName: order?.customer_data?.customer_name,
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
        <AssignUsersDialog queryKey={"Orders"} />
        <OnDeleteDialog
          name={"Orders"}
          heading={t("Are you absolutely sure?")}
          description={`${t(
            "This action cannot be undone. This will permanently delete order of"
          )}  "${selectedOrder?.shipmentName}`}
          url={ORDERS_URL}
          id={selectedOrder?.id + "/"}
          isDialogOpen={isDeleteOrderDialogOpen}
          setIsDialogOpen={setIsDeleteOrderDialogOpen}
        />
      </Section>
    </CanSection>
  );
};

export default Orders;

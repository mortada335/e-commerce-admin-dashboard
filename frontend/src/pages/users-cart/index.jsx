import DataTable from "@/components/ui/DataTable";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import WrapperComponent from "@/components/layout/WrapperComponent";
import CustomsCombobox from "@/components/ui/customs-combobox";

import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import Pagination from "@/components/layout/Pagination";
import columns from "./components/columns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  CalendarIcon,
  Loader2,
  RotateCcw,
  Search,
  Upload,
  X,
} from "lucide-react";

import qs from "qs";

import {
  convertProductStatusIdToString,
  displayBasicDate,
  exportToExcel,
  formatDate,
} from "@/utils/methods";

import { Button } from "@/components/ui/button"
import { setIsDeleteCartDialogOpen, setIsFilterMenu, setSearchBy, UsersCartStore } from "./store"
import { CUSTOMER_MEMBERSHIP_URL, PRODUCTS_URL, USERS_CART_URL } from "@/utils/constants/urls"
import ProductAutocomplete from "@/components/ProductAutocomplete"
import HeaderText from "@/components/layout/header-text"
import Section from "@/components/layout/Section"
import { Link } from "react-router-dom"
import CustomerAutocomplete from "@/components/CustomerAutocomplete"

import CustomsItemsPerPage from "@/components/ui/customs-items-per-page"
import ColumnsMenu from "@/components/data-table/ColumnsMenu"
import OnDeleteDialog from "@/components/Dialogs/OnDelete"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import Text from "@/components/layout/text"
import { cn } from "@/lib/utils"
import CartDialog from "./components/CartDialog"
import { useTranslation } from "react-i18next"
import FiltersSection from "@/components/filters-ui/FiltersSection"
import FiltersMenu from "@/components/filters-ui/FiltersMenu"
const UsersCart = ({ userId=null  }) => {
  const axiosPrivate = useAxiosPrivate()
  const { 
    sortBy, sortType,
    isCartDialogOpen,
    isDeleteCartDialogOpen,
    selectedCart,
    isFilterMenu,
    searchBy,
  } = UsersCartStore();
  const [search, setSearch] = useState(null);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(null);

  const [page, setPage] = useState(1);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(false);
  // CSV download State
  const [csvDownload, setCsvDownload] = useState(null);
  const [rangeDate, setRangeDate] = useState(null);
  const [warehouseFormFields, setWarehouseFormFields] = useState(null);

  const [model, setModel] = useState({ filter_name: "", filter_id: "" });

  const [itemPerPage, setItemPerPage] = useState("25")
  const {t} = useTranslation()
  const [filters, setFilters] = useState([])

  const [selectedCustomer, setSelectedCustomer] = useState({
    filter_id: "",
    filter_name: "",
  });

  const clearFilters = () => {
    setPage(1);
    setItemPerPage("25");

    setSelectedCustomer({
      filter_id: "",
      filter_name: "",
    });

    setIsFilterMenu(false);
    setRangeDate(null);
    setDebouncedSearchValue(null);
    setSearch(null);
    setSearchBy("quantity");
    setWarehouseFormFields(null);

    setModel({ filter_name: "", filter_id: "" });
  };

  const defaultsFilters = [
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
    title: t("Search Field"),
    key: "search_by",
    type: "select",
    value: "quantity",
    options: [
      { label: t("Quantity"), value: "quantity" },
      { label: t("Option"), value: "option" },
    ],
  },
  {
    title: t("Search"),
    key: "search_value",
    type: "text",
    value: "",
  },
];

  
  // const fetchUsersCart = async (page) => {
     
  //   let searchKeyObject = {};

    
    

  //   searchKeyObject = Object.fromEntries(
  //     Object.entries({
  //       [searchBy]: debouncedSearchValue?debouncedSearchValue:null,
  //       customer_id: userId?userId:selectedCustomer.filter_id !== null ? selectedCustomer.filter_id  : null,
  //       product_id: model.filter_id !== null ? model.filter_id : null,
  //       date_joined_before: rangeDate?.to ? formatDate(rangeDate?.to) : null,
  //       date_joined_after: rangeDate?.from ? formatDate(rangeDate?.from) : null,
  //       ordering: sortBy
  //         ? `${sortType === "asc" ? "" : "-"}${sortBy}`
  //         : "-date_added",
  //       // eslint-disable-next-line no-unused-vars
  //     }).filter(
  //       // eslint-disable-next-line no-unused-vars
  //       ([_, value]) => value !== "" && value !== undefined && value !== null
  //     )
  //   )
  //   try {
  //     return axiosPrivate.get(
  //       `${USERS_CART_URL}?page=${page}&page_size=${itemPerPage}`,
  //       {
  //         params: { ...searchKeyObject },
  //         paramsSerializer: (params) => qs.stringify(params, { encode: false }),
  //       }
  //     )

     

  //     // ...
  //   } catch (error) {
  //     // Handle the error
  //     setIsError(true)
  //     setError(error)
  //     return error
  //   }
  // }
  const fetchUsersCart = async () => {
    const params = new URLSearchParams();

    // Pagination and sorting
    params.append("page", page);
    params.append("page_size", itemPerPage);
    params.append(
      "ordering",
      sortBy ? `${sortType === "asc" ? "" : "-"}${sortBy}` : "-date_added"
    );

    // Apply filters from FiltersMenu
    filters?.forEach((filter) => {
      if (
        filter.value !== null &&
        filter.value !== undefined &&
        filter.value !== "" &&
        filter.key
      ) {
        // Handle date filters (range or single)
        if (filter.type === "date") {
          if (filter.value?.from)
            params.append(`${filter.key}_after`, formatDate(filter.value.from));
          if (filter.value?.to)
            params.append(`${filter.key}_before`, formatDate(filter.value.to));
        } else {
          params.append(filter.key, filter.value);
        }
      }
    });

    if (debouncedSearchValue)
      params.append(searchBy, debouncedSearchValue);

    if (userId || selectedCustomer?.filter_id)
      params.append("customer_id", userId || selectedCustomer.filter_id);

    if (model?.filter_id)
      params.append("product_id", model.filter_id);

    if (rangeDate?.from)
      params.append("date_joined_after", formatDate(rangeDate.from));

    if (rangeDate?.to)
      params.append("date_joined_before", formatDate(rangeDate.to));

    return axiosPrivate.get(
      `${USERS_CART_URL}?${params.toString()}`)
  };

  const { data: UsersCart, isLoading } = useQuery({
    queryKey: [
      "UsersCart",
      page,
      filters,
      model,
      itemPerPage,
      userId,
      sortBy,
      sortType,
      selectedCustomer,
      debouncedSearchValue,
      rangeDate,
      warehouseFormFields,
    ],
    queryFn: () => fetchUsersCart(page),
  });
  const totalPages = Math.ceil(UsersCart?.data?.count / itemPerPage); // Assuming 25 items per page

  const isFilter =
    model.filter_id ||
    selectedCustomer.filter_id ||
    warehouseFormFields ||
    rangeDate ||
    debouncedSearchValue
      ? true
      : false;

  // Handler for exporting the orders list as a CSV file.
  const exportCsvHandler = async () => {
    // Set the state to indicate loading and disable the button.
    setCsvDownload(true);

    try {
      if (UsersCart?.data?.results?.length) {
        const currentData = UsersCart?.data?.results?.map((item) => {
          return {
            customer_id: item?.customer_id,
            product_id: item?.product?.product_id,
            quantity: item?.quantity,
            option: item?.option,
            model: item?.product?.model,
            quantity_available: item?.product?.available_quantity,
            price: item?.product?.price,
            status: item?.product?.enabled ? "Enabled" : "Disable",
            label: convertProductStatusIdToString(item?.product?.status),
            new_item: item?.product?.new_item ? "Yes" : "No",
            image: item?.product?.image,
          };
        });

        // Reset the state and initiate the CSV file download.
        setCsvDownload(false);
        exportToExcel(currentData, "Users Carts.xlsx");
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
    product_id: true,
    customer_id: true,
    quantity: true,
    model: JSON.parse(localStorage.getItem("model")) ?? true,
    image: JSON.parse(localStorage.getItem("image")) ?? false,
    quantity_avilable:
      JSON.parse(localStorage.getItem("quantity_avilable")) ?? false, // Hidden by default
    price: JSON.parse(localStorage.getItem("price")) ?? true,
    label: JSON.parse(localStorage.getItem("label")) ?? true,
    status: JSON.parse(localStorage.getItem("status")) ?? true,
    new_product: JSON.parse(localStorage.getItem("new_product")) ?? true,
    option: JSON.parse(localStorage.getItem("option")) ?? true,
    date_added: JSON.parse(localStorage.getItem("date_added")) ?? true,

    actions: true,
  });

  const disabledColumnVisibility = (column) => {
    if (column) {
      return (
        column?.accessorKey !== "product_id" &&
        column?.accessorKey !== "customer_id" &&
        column?.accessorKey !== "quantity" &&
        column?.accessorKey !== "actions"
      );
    } else {
      return true;
    }
  };

  return (
    <Section className="gap-6 h-fit items-start">
      {userId === null && (
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
          <BreadcrumbPage>{t("Customers Carts")}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <HeaderText className={"w-full text-start "} text={t("Customers Carts")} />
        </>
      )}

{/* {isFilterMenu && (
          <Card className="w-full">
            <CardHeader>
              {t("Filter By")}
            </CardHeader>
            <CardContent className="flex items-center justify-start flex-wrap w-full gap-4">

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
                          {t("Pick Range Date")}
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
                      setPage(1)
                    }}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {
         userId === null && <CustomerAutocomplete 
               formFields={selectedCustomer}
               setFormFields={setSelectedCustomer}
               isFetchCategory={ false }
              />
              }
      <div className="flex items-center min-w-fit  w-[200px]  max-w-fit ">
                <ProductAutocomplete
                  formFields={model}
                  setFormFields={(val)=>{
                    setModel(val) 
                    setPage(1)}}
                  isFetchProduct={false}
                />
                </div>
              <div className="flex items-center space-x-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setDebouncedSearchValue(search);
                    setPage(1)
                  }}
                  className="relative"
                >
                  <Input
                    onChange={(e) => setSearch(e.target.value)}
                    type={searchBy === "quantity" ? "number" : "text"}
                    placeholder={`Search by ${searchBy?.replace(
                      /[_\s]/g,
                      " "
                    )}...`}
                    disabled={isLoading}
                    className={"w-[200px] h-10"}
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
                <Select onValueChange={setSearchBy} defaultValue={searchBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder={t("Search By")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("Cart Fields")}</SelectLabel>
                      <SelectItem value={"quantity"} className="capitalize">
                      {t("quantity")}
                      </SelectItem>
                      <SelectItem value={"option"} className="capitalize">
                      {t("option")}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )} */}

  
    <Card className="flex justify-between items-center w-full px-2  py-2 flex-wrap gap-4">
           <FiltersSection
              setPage={setPage} 
              value={filters}
              onChange={setFilters}  
              isLoading={isLoading}
              isMenuOpen={isFilterMenu}
              searchQueryKey="name"
              setIsMenuOpen={setIsFilterMenu}
             />
    <Button disabled={csvDownload} onClick={exportCsvHandler}>
            {csvDownload ? (
              <p className="flex justify-center items-center space-x-2">
                <Loader2 className=" h-5 w-5 animate-spin" />
                <span>{t("Please wait")}</span>
              </p>
            ) : (
              <p className="flex items-center gap-2">
                {/* Medium screen and above. */}
                <span className="hidden md:block">
                  <Upload size={16} />
                </span>
                {/* Small screen. */}
                <span className="md:hidden">
                  <Upload size={12} />
                </span>
                {t("Export")}
              </p>
            )}
          </Button>

          <div className="flex flex-wrap justify-end items-start gap-4">

                <ColumnsMenu columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} disabledColumnVisibility={disabledColumnVisibility}/>
                <CustomsItemsPerPage setItemPerPage={setItemPerPage} itemPerPage={itemPerPage}/>
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
    isEmpty={!UsersCart?.data?.results?.length > 0}
    isError={isError}
    error={error}
    isLoading={isLoading}
    loadingUI={<DataTableSkeleton columnCount={5} />}
     emptyStateMessage="There is no products for this user"
  >
    <DataTable
      columns={columns}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      data={UsersCart?.data?.results?.map((cart) => ({
        id: cart?.cart_id,
        productData: cart?.product,
        product_id: cart?.product?.product_id,
        image: cart?.product?.image || '',
        model: cart?.product?.model,
        quantity_avilable: cart?.product?.available_quantity,
        quantity: cart?.quantity,
        price: cart?.product?.price,
        status: cart?.product?.enabled,
        label: cart?.product?.status,
        new_product: cart?.product?.new_product,
        option: cart?.option,
        customer_id: cart?.customer_id,
        date_added: cart?.product?.date_added
          ? displayBasicDate(cart?.product?.date_added)
          : "",
          actions: cart?.id,
      }))}
    />
    <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
      <Pagination
        itemPerPage={itemPerPage}
        next={UsersCart?.data?.next}
        previous={UsersCart?.data?.previous}
        totalPages={totalPages}
        totalCount={UsersCart?.data?.count}
        page={page}
        setPage={setPage}
      />
    </Card>
  <CartDialog/>
  </WrapperComponent>
  
  <OnDeleteDialog
          name={"UsersCart"}
          heading={t("Are you absolutely sure?")}
          description={`${t("This action cannot be undone. This will permanently delete this")}  "${selectedCart?.id}".`}
          url={USERS_CART_URL}
          id={selectedCart?.id}
          isDialogOpen={isDeleteCartDialogOpen}
          setIsDialogOpen={setIsDeleteCartDialogOpen}
        />
    </Section>
  );
};

export default UsersCart;

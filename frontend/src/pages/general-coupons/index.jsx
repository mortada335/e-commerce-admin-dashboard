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
import { GENERAL_COUPONS_URL, PRODUCTS_URL } from "@/utils/constants/urls";

import {
  CalendarIcon,
  Loader2,
  Plus,
  RotateCcw,
  Search,
  Upload,
  X,
} from "lucide-react";

import OnDeleteDialog from "@/components/Dialogs/OnDelete";
import {
  setIsGeneralCouponDialogOpen,
  setIsDeleteDialogOpen,
  setSelectedGeneralCoupon,
  useGeneralCouponStore,
  setSearchBy,
  setIsFilterMenu,
  setIsChangeStatusDialogOpen,
} from "./store";
import qs from "qs";
import GeneralCouponDialog from "./components/GeneralCouponDialog";

import { Input } from "@/components/ui/input";
import { exportToExcel, formatDate, formatFullDate, formatFullDateNoTime, formatNumberWithCurrency } from "@/utils/methods";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Text from "@/components/layout/text";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

import CanSection from "@/components/CanSection";
import Can from "@/components/Can";
import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";
import OnChangeStatus from "@/components/Dialogs/OnChangeStatus";
import UpdateCouponStatus from "./components/UpdateCouponStatusDialog";
import { useTranslation } from "react-i18next";
import FiltersMenu from "@/components/filters-ui/FiltersMenu";
import FiltersSection from "@/components/filters-ui/FiltersSection";
const GeneralCoupons = () => {
  const axiosPrivate = useAxiosPrivate();
  const {
    isDeleteGeneralCouponDialogOpen,
    selectedGeneralCoupon,
    sortBy,
    sortType,
    searchBy,

    isFilterMenu,
    isChangeStatusDialogOpen,
    dateEnd,
  } = useGeneralCouponStore();

  const [search, setSearch] = useState(null);
  const [dateStart, setDateStart] = useState(null);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(null);

  const [dateAdded, setDateAdded] = useState(null);
  const [status, setStatus] = useState(null);

  const [csvDownload, setCsvDownload] = useState(false);
  const {t} = useTranslation()
  const [filters,setFilters]= useState([])

  const [itemPerPage, setItemPerPage] = useState("25");
  const [page, setPage] = useState(1);

  const clearFilters = () => {
    setDateStart(null);
    setDateAdded(null);
    setStatus(null);

    setIsFilterMenu(false);
    setPage(1);
    setItemPerPage("25");

    setDebouncedSearchValue(null);
    setSearch(null);
    setSearchBy("code");
  };

  const defaultsFilters = [
  {
    title: t("Status"),
    key: "status",
    type: "select",
    value: null,
    options: [
      { label: t("All Status"), value: null },
      { label: t("Enable"), value: "1" },
      { label: t("Expired"), value: "2" },
      { label: t("Disable"), value: "0" },
    ],
  },
  {
    title: t("Added Date"),
    type: "date",
    key: "date_added",
    value: null,
  },
  {
    title: t("Promo Code Date"),
    type: "date",
    key: "promo_code_date",
    value: null,
  },
  {
    title: t("Search Field"),
    key: "search_by",
    type: "select",
    value: "code",
    options: [
      { label: t("Code"), value: "code" },
      { label: t("Discount"), value: "discount" },
      { label: t("For Customer Id"), value: "for_customer_id" },
      { label: t("Name"), value: "name" },
      { label: t("Minimum Total Cost"), value: "total_max" },
      { label: t("Uses Total"), value: "uses_total" },
    ],
  },
  {
    title: t("Search"),
    key: "search_value",
    type: "text",
    value: null,
  },
];


  // const fetchAdminCoupons = async (page) => {
  //   let searchKeyObject = {};
  //   searchKeyObject = Object.fromEntries(
  //     Object.entries({
  //       [searchBy]: debouncedSearchValue ? debouncedSearchValue : null,
  //       // payment_type: paymentType ? paymentType : null,
  //       date_start_gte: dateStart?.from ? formatDate(dateStart?.from) : null,
  //       date_end_lte: dateStart?.to ? formatDate(dateStart?.to) : null,
  //       date_added_after: dateAdded?.from ? formatDate(dateAdded?.from) : null,
  //       date_added_before: dateAdded?.to ? formatDate(dateAdded?.to) : null,
  //       exclude_points_coupon: true,
  //       status: status >= 0 ? status : null,
  //       ordering: sortBy
  //         ? `${sortType === "asc" ? "" : "-"}${sortBy}`
  //         : "-date_added",
  //       // eslint-disable-next-line no-unused-vars
  //     }).filter(([_, value]) => value !== undefined && value !== null)
  //   );
  //   return axiosPrivate.get(
  //     `${GENERAL_COUPONS_URL}?page=${page}&page_size=${itemPerPage}`,
  //     {
  //       params: { ...searchKeyObject },
  //       paramsSerializer: (params) => qs.stringify(params, { encode: false }),
  //     }
  //   );
  // };

  const fetchAdminCoupons = async (page) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("page_size", itemPerPage);
  params.append(
    "ordering",
    sortBy ? `${sortType === "asc" ? "" : "-"}${sortBy}` : "-date_added"
  );

  if (filters?.length) {
    filters.forEach((filter) => {
      if (filter?.value === null || filter?.value === undefined) return;

      let valueToSend = filter.value;

      if (filter.type === "date" && valueToSend) {
        if (valueToSend?.from) params.append(`${filter.key}_after`, formatDate(valueToSend.from));
        if (valueToSend?.to) params.append(`${filter.key}_before`, formatDate(valueToSend.to));
        return;
      }

      if (filter.type === "text" || filter.type === "search") {
        if (valueToSend) params.append(searchBy || "name", valueToSend);
        return;
      }

      if (typeof valueToSend === "object") {
        valueToSend = valueToSend?.id ?? valueToSend?.value ?? null;
      }

      if (valueToSend !== null && valueToSend !== undefined) {
        params.append(filter.key, valueToSend);
      }
    });
  }

  if (debouncedSearchValue) params.append(searchBy, debouncedSearchValue);

  if (dateStart?.from) params.append("date_start_gte", formatDate(dateStart.from));
  if (dateStart?.to) params.append("date_end_lte", formatDate(dateStart.to));
  if (dateAdded?.from) params.append("date_added_after", formatDate(dateAdded.from));
  if (dateAdded?.to) params.append("date_added_before", formatDate(dateAdded.to));

  if (status !== null && status !== undefined) params.append("status", status);

  params.append("exclude_points_coupon", true);

  return await axiosPrivate.get(`${GENERAL_COUPONS_URL}?${params.toString()}`);
};


  const {
    data: GeneralCoupons,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "GeneralCoupons",
      page,
      filters,
      itemPerPage,
      dateAdded,
      dateStart,
      dateEnd,
      debouncedSearchValue,
      sortBy,
      sortType,
      status,
    ],
    queryFn: () => fetchAdminCoupons(page),
  });
  const totalPages = Math.ceil(GeneralCoupons?.data?.count / itemPerPage); // Assuming 25 items per page

  const handleAddGeneralCoupon = () => {
    setSelectedGeneralCoupon(null);
    setIsGeneralCouponDialogOpen(true);
  };

  const isFilter =
    debouncedSearchValue || status || dateAdded || dateStart || dateEnd
      ? true
      : false;

  // Handler for exporting the users as a CSV file.
  const exportCsvHandler = async () => {
    // Set the state to indicate loading and disable the button.
    setCsvDownload(true);


    // Try to fetch and handle the response data.
    try {


      if (GeneralCoupons.data?.results?.length) {

        const currentData = GeneralCoupons.data?.results?.map((coupon)=> { 

          const fourDigitsDiscount = Number(coupon?.discount).toFixed(4);

          const disabled = coupon?.status === 0;
          const enabled = coupon?.status === 1;
          const expired = coupon?.status === 2;

          return {
            

            coupon_id: coupon.coupon_id,
            name: coupon.name,
            code: coupon.code,
            // type: coupon.type,
            discount: coupon?.type === "P" || coupon?.type === "X"
            ? `${fourDigitsDiscount} %`
            : formatNumberWithCurrency(
                String(fourDigitsDiscount),
                "IQD",
                4,
                4
              ),
            total_max: formatNumberWithCurrency(
              String(coupon?.total_max || 0),
              "IQD"
            ),
            total_min: formatNumberWithCurrency(
              String(coupon?.total_min || 0),
              "IQD"
            ),
            status: disabled
            ? "Disabled"
            : enabled
            ? "Enabled"
            : expired
            ? "Expired"
            : "",
            for_customer_id: coupon.for_customer_id,
            uses_customer: coupon.uses_customer,
            uses_total: coupon.uses_total,
            date_added: coupon.date_added ? formatFullDateNoTime(coupon.date_added) : "",
            date_start: coupon.date_start ? formatFullDateNoTime(coupon.date_start) : "",
            date_end: coupon.date_end ? formatFullDateNoTime(coupon.date_end) : "",

            
           
          }
        })

        // Reset the state and initiate the CSV file download.
        setCsvDownload(false);
        exportToExcel(currentData, "Promo Codes.xlsx");
        
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
    <CanSection permissions={["app_api.view_occoupon"]}>
      <Section className="space-y-8 h-fit items-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/">{t("Home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("Promo Codes")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderText className={"w-full text-start "} text={t("Promo Codes")} />
        {/* {isFilterMenu && (
          <Card className="w-full">
            <CardHeader>
              <CardDescription>{t("Filter By")}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-start flex-wrap w-full gap-4">
              <Select
                onValueChange={(val)=>{
                  setStatus(val)
                  setPage(1)
                }}
                defaultValue={status}
                value={status}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder={t("Select Status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("Promo Codes Status")}</SelectLabel>
                    <SelectItem value={null}>{t("All Status")}</SelectItem>
                    <SelectItem value={1}>{t("Enable")}</SelectItem>
                    <SelectItem value={2}>{t("Expired")}</SelectItem>
                    <SelectItem value={0}>{t("Disable")}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Card className="flex justify-between items-center space-y-0 space-x-0">
                    <Button
                      variant={"ghost"}
                      className={cn(
                        " w-fit text-left font-normal rounded-none flex justify-start items-center",
                        !dateAdded && "text-muted-foreground w-[180px]"
                      )}
                    >
                      {dateAdded ? (
                        <p className="space-x-2 flex">
                          <span>{formatDate(dateAdded?.from)}</span>
                          {dateAdded?.to && <span>/</span>}

                          {dateAdded?.to && (
                            <span>{formatDate(dateAdded?.to)}</span>
                          )}
                        </p>
                      ) : (
                        <>
                          {t("Pick Added Range")}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </>
                      )}
                    </Button>
                    {dateAdded && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {" "}
                            <Button
                              variant={"ghost"}
                              size="icon"
                              className="rounded-none"
                              onClick={() => {
                                setDateAdded(null);
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
                    selected={dateEnd}
                    onSelect={(value) => {
                      setDateAdded(value);
                      setPage(1)
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
                        !dateStart && "text-muted-foreground w-[220px]"
                      )}
                    >
                      {dateStart ? (
                        <p className="space-x-2 flex">
                          <span>{formatDate(dateStart?.from)}</span>
                          {dateStart?.to && <span>/</span>}

                          {dateStart?.to && (
                            <span>{formatDate(dateStart?.to)}</span>
                          )}
                        </p>
                      ) : (
                        <>
                          {t("Pick Promo Code Range")}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </>
                      )}
                    </Button>
                    {dateStart && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {" "}
                            <Button
                              variant={"ghost"}
                              size="icon"
                              className="rounded-none"
                              onClick={() => {
                                setDateStart(null);
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
                    selected={dateStart}
                    onSelect={(value) => {
                      setDateStart(value);
                      setPage(1)
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
                    setPage(1)
                  }}
                  className="relative"
                >
                  <Input
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    placeholder={`${t("Search by")} ${
                      searchBy === "total_max"
                        ? "minimum total cost"
                        : searchBy?.replace(/[_\s]/g, " ")
                    }...`}
                    disabled={isLoading}
                    className={"w-[250px]"}
                  />
                  <Button
                    className="absolute right-0 top-0 rounded-l-none rounded-r-md"
                    variant="ghost"
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
                  <SelectTrigger className="w-full md:w-[150px]">
                    <SelectValue placeholder={t("Search By")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("Promo Codes Field")}</SelectLabel>
                      <SelectItem value={"code"} className="capitalize">
                        {t("Code")}
                      </SelectItem>
                      <SelectItem value={"discount"} className="capitalize">
                        {t("Discount")}
                      </SelectItem>
                      <SelectItem
                        value={"for_customer_id"}
                        className="capitalize"
                      >
                        {t("For Customer Id")}
                      </SelectItem>
                      <SelectItem value={"name"} className="capitalize">
                        {t("Name")}
                      </SelectItem>
                      <SelectItem value={"total_max"} className="capitalize">
                        {t("Minimum Total Cost")}
                      </SelectItem>
                      <SelectItem value={"uses total"} className="capitalize">
                        {t("Uses Total")}
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
          <div className="flex items-center gap-3">
            <Can permissions={["app_api.add_occoupon"]}>
              <Button
                onClick={handleAddGeneralCoupon}
                className="flex items-center  gap-1"
              >
                {/* Medium screen and above. */}
                <span className="hidden md:block">
                  <Plus size={18} />
                </span>
                {/* Small screen. */}
                <span className="md:hidden">
                  <Plus size={14} />
                </span>
                {t("Add New Promo Code")}
              </Button>
            </Can>
            <Button
              // variant="outline"
              onClick={exportCsvHandler}
              disabled={csvDownload}
              // className="text-slate-900 dark:text-white"
            >
              {csvDownload ? (
                <p className="flex justify-center items-center space-x-2">
                  <Loader2 className=" h-5 w-5 animate-spin" />
                  <span>{t("Please wait")}</span>
                </p>
              ) : (
                <p className="flex items-center gap-2">
                  {/* Medium screen and abov. */}
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
          </div>

          <div className="flex justify-start items-center flex-wrap gap-2">
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
          isEmpty={!GeneralCoupons?.data?.results?.length > 0}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={<DataTableSkeleton columnCount={5} />}
          emptyStateMessage={
            isFilter
              ? t("You don't have any promo codes by this filter")
              : t("You don't have any promo codes get started by creating a new one.")
          }
        >
          <DataTable
            columns={columns}
            data={GeneralCoupons?.data?.results?.map((coupon) => ({
              id: coupon.coupon_id,
              name: coupon.name,
              code: coupon.code,
              type: coupon.type,
              discount: coupon.discount,
              total_max: coupon.total_max,
              total_min: coupon.total_min,
              status: coupon.status,
              products_detail: coupon.products_detail,
              categories_detail: coupon.categories_detail,
              for_customer_id: coupon.for_customer_id,
              uses_customer: coupon.uses_customer,
              uses_total: coupon.uses_total,
              date_added: coupon.date_added ? coupon.date_added : "",
              date_start: coupon.date_start ? coupon.date_start : "",
              date_end: coupon.date_end ? coupon.date_end : "",

              actions: coupon.coupon_id,
            }))}
          />
          <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
            <Pagination
              itemPerPage={itemPerPage}
              next={GeneralCoupons?.data?.next}
              previous={GeneralCoupons?.data?.previous}
              totalPages={totalPages}
              totalCount={GeneralCoupons?.data?.count}
              page={page}
              setPage={setPage}
            />
          </Card>
        </WrapperComponent>
        <GeneralCouponDialog />
        <UpdateCouponStatus />
                   

        <OnDeleteDialog
          name={"GeneralCoupons"}
          heading={t("Are you absolutely sure?")}
          description={`${t("This action cannot be undone. This will permanently delete this")}  "${selectedGeneralCoupon?.name}".`}
          url={GENERAL_COUPONS_URL}
          id={selectedGeneralCoupon?.id}
          isDialogOpen={isDeleteGeneralCouponDialogOpen}
          setIsDialogOpen={setIsDeleteDialogOpen}
        />
      </Section>
    </CanSection>
  );
};

export default GeneralCoupons;

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
import { POINT_COUPONS_URL } from "@/utils/constants/urls";

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
  setIsPointsCouponDialogOpen,
  setIsDeleteDialogOpen,
  setSelectedPointsCoupon,
  usePointsCouponStore,
  setSearchBy,
  setIsFilterMenu,
} from "./store";
import qs from "qs";

import { Input } from "@/components/ui/input";
import { calculateEndDate, displayBasicDate, exportToExcel, formatDate } from "@/utils/methods";
import PointsCouponDialog from "./components/PointsCouponDialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Text from "@/components/layout/text";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

import CanSection from "@/components/CanSection";
import Can from "@/components/Can";

import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";
import { useTranslation } from "react-i18next";
import FiltersSection from "@/components/filters-ui/FiltersSection";
import FiltersMenu from "@/components/filters-ui/FiltersMenu";
const PointsCoupons = () => {
  const axiosPrivate = useAxiosPrivate();
  const {
    isDeletePointsCouponDialogOpen,
    selectedPointsCoupon,
    sortBy,
    sortType,

    searchBy,

    isFilterMenu,
  } = usePointsCouponStore();

  const [search, setSearch] = useState(null);
  const [createdDate, setCreatedDate] = useState(null);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(null);

  const [csvDownload, setCsvDownload] = useState(false);

  const [itemPerPage, setItemPerPage] = useState("25");
  const [page, setPage] = useState(1);
  const {t} = useTranslation()
  const [filters,setFilters] = useState([])

  const clearFilters = () => {
    setCreatedDate(null);

    setIsFilterMenu(false);
    setPage(1);
    setItemPerPage("25");

    setDebouncedSearchValue(null);
    setSearch(null);
    setSearchBy("name");
  };

const defaultsFilters = [
  {
    title: t("Created Date"),
    type: "date",
    key: "created_at",
    value: null,
  },
  {
    title: t("Search"),
    key: "search_value",
    type: "text",
    value: null,
  },
  {
    title: t("Search Field"),
    key: "search_by",
    type: "select",
    value: "name",
    options: [
      { label: t("Name"), value: "name" },
      { label: t("Points Needed"), value: "points_needed" },
      { label: t("Discount"), value: "discount" },
    ],
  },
];

  // const fetchAdminPointsCoupons = async (page) => {
  //   let searchKeyObject = {};

  //   searchKeyObject = Object.fromEntries(
  //     Object.entries({
  //       [searchBy]: debouncedSearchValue,
  //       ordering: sortBy
  //         ? `${sortType === "asc" ? "" : "-"}${sortBy}`
  //         : "-created_at",
  //       created_at: createdDate ? formatDate(createdDate) : null,
  //       // eslint-disable-next-line no-unused-vars
  //     }).filter(([_, value]) => value !== undefined && value !== null)
  //   );

  //   return axiosPrivate.get(
  //     `${POINT_COUPONS_URL}?page=${page}&page_size=${itemPerPage}`,
  //     {
  //       params: { ...searchKeyObject },
  //       paramsSerializer: (params) => qs.stringify(params, { encode: false }),
  //     }
  //   );
  // };

  const fetchAdminPointsCoupons = async () => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("page_size", itemPerPage);

  params.append(
    "ordering",
    sortBy ? `${sortType === "asc" ? "" : "-"}${sortBy}` : "-created_at"
  );

  filters.forEach((filter) => {
    if (filter.value !== null && filter.value !== undefined && filter.value !== "") {
      if (filter.type === "date") {
        if (filter.value.from) params.append(`${filter.key}_gte`, formatDate(filter.value.from));
        if (filter.value.to) params.append(`${filter.key}_lte`, formatDate(filter.value.to));
      } else {
        params.append(filter.key, filter.value);
      }
    }
  });

  if (debouncedSearchValue) {
    params.append(searchBy, debouncedSearchValue);
  }

  return axiosPrivate.get(`${POINT_COUPONS_URL}?${params.toString()}`);
};

  const {
    data: PointsCoupons,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "PointsCoupons",
      page,
      filters,
      debouncedSearchValue,
      itemPerPage,
      createdDate,
      sortBy,
      sortType,
    ],
    queryFn: () => fetchAdminPointsCoupons(page),
  });
  const totalPages = Math.ceil(PointsCoupons?.data?.count / itemPerPage); // Assuming 25 items per page

  const handleAddPointsCoupon = () => {
    setSelectedPointsCoupon(null);
    setIsPointsCouponDialogOpen(true);
  };
  const isFilter = debouncedSearchValue || createdDate ? true : false;

  // Handler for exporting the users as a CSV file.
  const exportCsvHandler = async () => {
    // Set the state to indicate loading and disable the button.
    setCsvDownload(true);

    // // Initialize an object to store search params fro API request..
    // let searchKeyObject = {};

    // // Convert an object into an array of [key, value] pairs, filter it, then convert it back to an object.
    // searchKeyObject = Object.fromEntries(
    //   Object.entries({
    //     [searchBy]: debouncedSearchValue,
    //     ordering: sortBy
    //       ? `${sortType === "asc" ? "" : "-"}${sortBy}`
    //       : "-created_at",
    //     created_at: createdDate ? formatDate(createdDate) : null,
    //     columns:
    //       "id,name,points_needed,discount,days_to_expire_after_added,created_at",
    //     // eslint-disable-next-line no-unused-vars
    //   }).filter(([_, value]) => value !== undefined && value !== null)
    // );

    // Try to fetch and handle the response data.
    try {
      // const response = await getExportedCsv(searchKeyObject, itemPerPage, page);

      // // Handle cases where the response status is not 200.
      // if (response.status !== 200) {
      //   // Reset the state and notify the user about the export failure.
      //   setCsvDownload(false);
      //   toast({
      //     variant: "destructive",
      //     title: "Failed!!!",
      //     description: `Failed to export due, ${response.message}`,
      //   });
      // }

      // // Succesfull request and handle the data.
      // if (response.data) {
      //   // Reset the state and initiate the CSV file download.
      //   setCsvDownload(false);
      //   downloadCsv(response.data, undefined, "Promo Codes Points.csv");
      // }

      if (PointsCoupons.data?.results?.length) {

        const currentData = PointsCoupons.data?.results?.map((pointsCoupon)=> { 

          return {
            

            id: pointsCoupon.id,
            name: pointsCoupon.name,
            points_needed: pointsCoupon.points_needed,
            discount: pointsCoupon.discount,
            created_at: pointsCoupon.created_at
              ? displayBasicDate(pointsCoupon.created_at)
              : "/",
            days_to_expire: pointsCoupon.days_to_expire_after_added,
            end_date:calculateEndDate(pointsCoupon.created_at||'',pointsCoupon.days_to_expire_after_added ||''),

            
           
          }
        })

        // Reset the state and initiate the CSV file download.
        setCsvDownload(false);
        exportToExcel(currentData, "Points Promo Codes.xlsx");
        
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
    <CanSection permissions={["app_api.view_couponoffer"]}>
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
              <BreadcrumbPage>{t("Promo Code Points")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderText
          className={"w-full text-start "}
          text={t("Promo Code Points")}
        />
        {/* {isFilterMenu && (
          <Card className="w-full">
            <CardHeader>
              <CardDescription>{t("Filter By")}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-start flex-wrap w-full gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Card className="flex justify-between items-center space-y-0 space-x-0">
                    <Button
                      variant={"ghost"}
                      className={cn(
                        " w-fit text-left !text-xs font-normal rounded-none flex justify-start items-center",
                        !createdDate && "text-muted-foreground w-[150px]"
                      )}
                    >
                      {createdDate ? (
                        formatDate(createdDate)
                      ) : (
                        <>
                          {t("Created Date")}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </>
                      )}
                    </Button>
                    {createdDate && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {" "}
                            <Button
                              variant={"ghost"}
                              size="icon"
                              className="rounded-none"
                              onClick={() => {
                                setCreatedDate(null);
                              }}
                            >
                              <X className=" h-4 w-4 opacity-50" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <Text text={t("Clear")} />
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </Card>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={createdDate}
                    onSelect={(value) => {
                      setCreatedDate(value);
                      setPage(1)
                    }}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

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
                    type={searchBy === "name" ? "text" : "number"}
                    placeholder={`${t("Search by")} ${searchBy?.replace(
                      /[_\s]/g,
                      " "
                    )}...`}
                    disabled={isLoading}
                    className={"w-[250px]"}
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
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder={t("Search By")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("Fields")}</SelectLabel>
                      <SelectItem value={"name"} className="capitalize">
                        {t("Name")}
                      </SelectItem>
                      <SelectItem
                        value={"points_needed"}
                        className="capitalize"
                      >
                        {t("points needed")}
                      </SelectItem>
                      <SelectItem value={"discount"} className="capitalize">
                        {t("discount")}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )} */}
        <Card className="flex justify-between items-center w-full px-2  py-2 flex-wrap gap-2">
           <FiltersSection
              setPage={setPage} 
              value={filters}
              onChange={setFilters}  
              isLoading={isLoading}
              isMenuOpen={isFilterMenu}
              searchQueryKey="code"
              setIsMenuOpen={setIsFilterMenu}
             />
          <div className="flex items-center gap-3">
            <Can permissions={["app_api.add_couponoffer"]}>
              <Button
                onClick={handleAddPointsCoupon}
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
                {t("Add New Code Points")}
              </Button>
            </Can>
            <Button
              // variant="outline"
              onClick={exportCsvHandler}
              disabled={csvDownload}
              // className="text-slate-900 dark:text-slate-200"
            >
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
                  <span className="md:hidden">
                    <Upload size={12} />
                  </span>
                  {t("Export")}
                </p>
              )}
            </Button>
          </div>

          <div className="flex justify-end items-center flex-wrap gap-2">
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
          isEmpty={!PointsCoupons?.data?.results?.length > 0}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={<DataTableSkeleton columnCount={5} />}
          emptyStateMessage={
            isFilter
              ? t("You don't have any promo codes point by this filter")
              : t("You don't have any promo codes point get started by creating a new one.")
          }
        >
          <DataTable
            columns={columns}
            data={PointsCoupons?.data?.results?.map((pointsCoupon) => ({
              id: pointsCoupon.id,
              name: pointsCoupon.name,
              points_needed: pointsCoupon.points_needed,
              discount: pointsCoupon.discount,
              created_at: pointsCoupon.created_at
                ? displayBasicDate(pointsCoupon.created_at)
                : "/",
              days_to_expire: pointsCoupon.days_to_expire_after_added,
              end_date:calculateEndDate(pointsCoupon.created_at||'',pointsCoupon.days_to_expire_after_added ||''),
              actions: pointsCoupon.id,
            }))}
          />
          <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
            <Pagination
              itemPerPage={itemPerPage}
              next={PointsCoupons?.data?.next}
              previous={PointsCoupons?.data?.previous}
              totalPages={totalPages}
              totalCount={PointsCoupons?.data?.count}
              page={page}
              setPage={setPage}
            />
          </Card>
        </WrapperComponent>
        <PointsCouponDialog />

        <OnDeleteDialog
          name={"PointsCoupons"}
          heading={t("Are you absolutely sure?")}
          description={`${t("This action cannot be undone. This will permanently delete this")}  "${selectedPointsCoupon?.name}".`}
          url={POINT_COUPONS_URL}
          id={selectedPointsCoupon?.id}
          isDialogOpen={isDeletePointsCouponDialogOpen}
          setIsDialogOpen={setIsDeleteDialogOpen}
        />
      </Section>
    </CanSection>
  );
};

export default PointsCoupons;

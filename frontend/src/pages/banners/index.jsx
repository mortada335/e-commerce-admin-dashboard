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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import qs from "qs";
import { Link } from "react-router-dom";
import Pagination from "@/components/layout/Pagination";
import columns from "./components/columns";
import { BANNER_URL } from "@/utils/constants/urls";

import {
  CalendarIcon,
  Loader2,
  Plus,
  RotateCcw,
  Search,
  Upload,
  X,
} from "lucide-react";
import BannerDialog from "./components/BannerDialog";
import OnDeleteDialog from "@/components/Dialogs/OnDelete";
import {
  setIsBannerDialogOpen,
  setIsDeleteDialogOpen,
  setIsFilterMenu,
  setSearchBy,
  setSelectedBanner,
  useBannerStore,
} from "./store";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import Text from "@/components/layout/text";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { exportToExcel, formatDate, formatFullDate } from "@/utils/methods";
import { useState } from "react";
import CanSection from "@/components/CanSection";
import Can from "@/components/Can";

import { useToast } from "@/components/ui/use-toast";

import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";
import { useTranslation } from "react-i18next";
import FiltersMenu from "@/components/filters-ui/FiltersMenu";
import FiltersSection from "@/components/filters-ui/FiltersSection";
const Banners = () => {
  // Toast for notification.
  const { toast } = useToast();
  const {t} = useTranslation()

  const axiosPrivate = useAxiosPrivate();
  const {
    isDeleteBannerDialogOpen,
    selectedBanner,
    sortBy,
    sortType,
    searchBy,

    isFilterMenu,
  } = useBannerStore();

  const [search, setSearch] = useState(null);
  const [eventDate, setEventDate] = useState(null);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(null);

  const [bannerType, setBannerType] = useState(null);

  // Loading when CSV start downloading state.
  const [csvDownload, setCsvDownload] = useState(false);

  const [filters,setFilters] = useState([])
  const [itemPerPage, setItemPerPage] = useState("25");
  const [page, setPage] = useState(1);

  const clearFilters = () => {
    setEventDate(null);
    setBannerType(null);

    setIsFilterMenu(false);
    setPage(1);
    setItemPerPage("25");

    setDebouncedSearchValue(null);
    setSearch(null);
    setSearchBy("name");
  };

  // const fetchAdminBanners = async (page) => {
  //   let searchKeyObject = {};

  //   searchKeyObject = Object.fromEntries(
  //     Object.entries({
  //       [searchBy]: debouncedSearchValue,
  //       banner_type: bannerType,
  //       event_date: eventDate ? eventDate : null,
  //       ordering: sortBy
  //         ? `${sortType === "asc" ? "" : "-"}${sortBy}`
  //         : "sort_order",
  //       // eslint-disable-next-line no-unused-vars
  //     }).filter(([_, value]) => value !== undefined && value !== null)
  //   );
  //   return axiosPrivate.get(
  //     `${BANNER_URL}?page=${page}&page_size=${itemPerPage}`,
  //     {
  //       params: { ...searchKeyObject },
  //       paramsSerializer: (params) => qs.stringify(params, { encode: false }),
  //     }
  //   );
  // };

const defaultsFilters = [
  {
    title: t("Banner Type"),
    key: "banner_type",
    type: "select",
    value: null,
    options: [
      { label: t("All Types"), value: null },
      { label: t("Product"), value: "product" },
      { label: t("Category"), value: "category" },
      { label: t("Products"), value: "products" }, // matches API "products"
    ],
  },
  {
    title: t("Event Date"),
    type: "date",
    key: "event_date",
    value: null,
  },
  // {
  //   title: t("Event End After"),
  //   type: "date",
  //   key: "event_date_after",
  //   value: null,
  // },
  {
    title: t("Language"),
    key: "language_id",
    type: "select",
    value: null,
    options: [
      { label: t("All Languages"), value: null },
      { label: t("English"), value: 1 },
      { label: t("Arabic"), value: 2 },
    ],
  },
  {
    title: t("Title"),
    key: "title",
    type: "text",
    value: null,
  },
];

const fetchAdminBanners = async () => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("page_size", itemPerPage);
  params.append(
    "ordering",
    sortBy ? `${sortType === "asc" ? "" : "-"}${sortBy}` : "sort_order"
  );

  if (filters?.length) {
    filters.forEach((filter) => {
      if (!filter?.value) return;

      let valueToSend = filter.value;

      // Handle date range filters
      if (filter.type === "daterange" && typeof valueToSend === "object") {
        if (valueToSend?.from)
          params.append(`${filter.key}_after`, formatDate(valueToSend.from));
        if (valueToSend?.to)
          params.append(`${filter.key}_before`, formatDate(valueToSend.to));
        return;
      }

      // Handle object-type filters (combobox items)
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

  return axiosPrivate.get(`${BANNER_URL}?${params.toString()}`);
};

  const {
    data: banners,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "Banners",
      page,
      filters,
      itemPerPage,
      bannerType,
      debouncedSearchValue,
      eventDate,
      sortBy,
      sortType,
    ],
    queryFn: () => fetchAdminBanners(page),
  });
  const totalPages = Math.ceil(banners?.data?.count / itemPerPage); // Assuming 25 items per page

  const handleAddBanner = () => {
    setSelectedBanner(null);
    setIsBannerDialogOpen(true);
  };

  const isFilter =
    debouncedSearchValue || bannerType || eventDate ? true : false;

  // Handler for exporting the users as a CSV file.
  const exportCsvHandler = async () => {
    // Set the state to indicate loading and disable the button.
    setCsvDownload(true);

    // Initialize an object to store search params fro API request..
    // let searchKeyObject = {};

    // // Convert an object into an array of [key, value] pairs, filter it, then convert it back to an object.
    // searchKeyObject = Object.fromEntries(
    //   Object.entries({
    //     [searchBy]: debouncedSearchValue,
    //     banner_type: bannerType,
    //     event_date: eventDate ? eventDate : null,
    //     ordering: sortBy
    //       ? `${sortType === "asc" ? "" : "-"}${sortBy}`
    //       : "sort_order",
    //     columns: "title,image,event_date,event_date_end,banner_type,sort_order",
    //     // eslint-disable-next-line no-unused-vars
    //   }).filter(([_, value]) => value !== undefined && value !== null)
    // );

    // Try to fetch and handle the response data.
    try {
      if (banners.data?.results?.length) {
        const currentData = banners.data?.results?.map((banner) => {
          return {
            banner_id: banner.banner_image_id,

            title: banner.title,
            image: banner.image,
            index: banner.sort_order,
            banner_type: banner.banner_type,
            banner_type_id: banner.banner_type_id,
            products_detail: banner.products_detail,
            language_id: banner.language_id === 1 ? "english" : "arabic",
            event_date: banner.event_date
              ? formatFullDate(banner.event_date)
              : "",
            event_date_end: banner.event_date_end
              ? formatFullDate(banner.event_date_end)
              : "",
          };
        });

        // Reset the state and initiate the CSV file download.
        setCsvDownload(false);
        exportToExcel(currentData, "Banners.xlsx");
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
    <CanSection permissions={["app_api.view_ocbannerimage"]}>
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
              <BreadcrumbPage>{t("Banners")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderText className={"w-full text-start "} text={t("Banners")} />
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
                        !eventDate && "text-muted-foreground w-[150px]"
                      )}
                    >
                      {eventDate ? (
                        formatDate(eventDate)
                      ) : (
                        <>
                          {t("Event Date")}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </>
                      )}
                    </Button>
                    {eventDate && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {" "}
                            <Button
                              variant={"ghost"}
                              size="icon"
                              className="rounded-none"
                              onClick={() => {
                                setEventDate(null);
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
                    selected={eventDate}
                    onSelect={(value) => {
                      setEventDate(value);
                      setPage(1);
                    }}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Select
                onValueChange={(val) => {
                  setBannerType(val);
                  setPage(1);
                }}
                defaultValue={bannerType}
                value={bannerType}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue
                    className="!text-xs"
                    placeholder={t("Select Banner Type")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="!text-xs">{t("Banner Type")}</SelectLabel>
                    <SelectItem className="!text-xs" value={null}>
                      {t("All Types")}
                    </SelectItem>

                    <SelectItem className="!text-xs" value={"product"}>
                      {t("Product")}
                    </SelectItem>
                    <SelectItem className="!text-xs" value={"category"}>
                      {t("Category")}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-4">
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
                    type={searchBy === "sort_order" ? "number" : "text"}
                    placeholder={`${t("Search by")} ${searchBy?.replace(
                      /[_\s]/g,
                      " "
                    )}...`}
                    disabled={isLoading}
                    className={"w-[200px]"}
                    value={search}
                  />
                  <Button
                    className="absolute  rtl:left-0 rtl:rounded-r-none rtl:rounded-l-md top-0 rounded-l-none rounded-r-md"
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
                    <SelectValue placeholder="Search By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("Banner Field")}</SelectLabel>
                      <SelectItem value={"title"} className="capitalize">
                        {t("Title")}
                      </SelectItem>
                      <SelectItem value={"sort_order"} className="capitalize">
                      {t("Index")}
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
            <div className="flex items-center space-x-2 gap-3">
              <Can permissions={["app_api.add_ocbannerimage"]}>
              <Button
                onClick={handleAddBanner}
                className="flex items-center gap-1 bg-[#2fad4f] hover:bg-[#237422]"
              >
                {/* Medium screen and above */}
                <span className="hidden md:block">
                  <Plus size={18} />
                </span>
                {/* Small screen */}
                <span className="md:hidden">
                  <Plus size={14} />
                </span>
                {t("Add New Banner")}
              </Button>
              </Can>
              <Button
                // variant="outline"
                onClick={exportCsvHandler}
                disabled={csvDownload}
                // className="text-slate-900 dark:text-slate-200"
              >
                {csvDownload ? (
                  <p className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t("Please wait")}</span>
                  </p>
                ) : (
                  <p className="flex items-center gap-1">
                    {/* Medium screen and above */}
                    <span className="hidden md:block">
                      <Upload size={16} />
                    </span>
                    {/* Small screen */}
                    <span className="md:hidden">
                      <Upload size={12} />
                    </span>
                    {t("Export")}
                  </p>
                )}
              </Button>
            <CustomsItemsPerPage
              setItemPerPage={setItemPerPage}
              itemPerPage={itemPerPage}
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
          isEmpty={!banners?.data?.results?.length > 0}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={<DataTableSkeleton columnCount={5} />}
          emptyStateMessage={
            isFilter
              ? t("You don't have any banners by this filter")
              : t("You don't have any banners get started by creating a new one.")
          }
        >
          {/* {banners?.data?.results?.length > 0 && (
          <> */}
          <DataTable
            columns={columns}
            data={banners?.data?.results?.map((banner) => ({
              banner_image_id: banner.banner_image_id,

              title: banner.title,
              image: banner.image,
              sort_order: banner.sort_order,
              banner_type: banner.banner_type,
              banner_type_id: banner.banner_type_id,
              language_id: banner.language_id,
              event_date: banner.event_date,
              event_date_end: banner.event_date_end,
              products_detail: banner.products_detail,

              actions: "actions",
            }))}
          />
          <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
            <Pagination
              itemPerPage={itemPerPage}
              next={banners?.data?.next}
              previous={banners?.data?.previous}
              totalCount={banners?.data?.count}
              totalPages={totalPages}
              page={page}
              setPage={setPage}
            />
          </Card>
          {/* </>
        )} */}
        </WrapperComponent>
        <BannerDialog />
        <OnDeleteDialog
          name={"Banners"}
          heading={t("Are you absolutely sure?")}
          description={`${t("This action cannot be undone. This will permanently delete this")}  "${selectedBanner?.title}".`}
          url={BANNER_URL}
          id={selectedBanner?.banner_image_id + "/"}
          isDialogOpen={isDeleteBannerDialogOpen}
          setIsDialogOpen={setIsDeleteDialogOpen}
        />
      </Section>
    </CanSection>
  );
};

export default Banners;

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
import { HOME_VIDEO_URL } from "@/utils/constants/urls";

import {
  CalendarIcon,
  Loader2,
  Plus,
  RotateCcw,
  Search,
  Upload,
  X,
} from "lucide-react";
import HomeVideoDialog from "./components/HomeVideoDialog";
import OnDeleteDialog from "@/components/Dialogs/OnDelete";
import {
  setIsHomeVideoDialogOpen,
  setIsDeleteDialogOpen,
  setIsFilterMenu,
  setSearchBy,
  setSelectedHomeVideo,
  useHomeVideoStore,
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
import FiltersSection from "@/components/filters-ui/FiltersSection";
import FiltersMenu from "@/components/filters-ui/FiltersMenu";
const HomeVideos = () => {
  // Toast for notification.
  const { toast } = useToast();
  const {t} = useTranslation()
  const [filters,setFilters] = useState([])
  const axiosPrivate = useAxiosPrivate();
  const {
    isDeleteHomeVideoDialogOpen,
    selectedHomeVideo,
    sortBy,
    sortType,
    searchBy,

    isFilterMenu,
  } = useHomeVideoStore();

  const [search, setSearch] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(null);

  const [HomeVideoType, setHomeVideoType] = useState(null);

  // Loading when CSV start downloading state.
  const [csvDownload, setCsvDownload] = useState(false);

  const [itemPerPage, setItemPerPage] = useState("25");
  const [page, setPage] = useState(1);

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setHomeVideoType(null);

    setIsFilterMenu(false);
    setPage(1);
    setItemPerPage("25");

    setDebouncedSearchValue(null);
    setSearch(null);
    setSearchBy("name");
  };
const defaultsFilters = [
  {
    title: t("Video Type"),
    key: "banner_type",
    type: "select",
    value: null,
    options: [
      { label: t("All Types"), value: null },
      { label: t("Product"), value: "product" },
      { label: t("Category"), value: "category" },
    ],
  },
  {
    title: t("Start Date"),
    key: "start_date",
    type: "date",
    value: null,
  },
  {
    title: t("End Date"),
    key: "end_date",
    type: "date",
    value: null,
  },

];

  // const fetchAdminHomeVideos = async (page) => {
  //   let searchKeyObject = {};

  //   searchKeyObject = Object.fromEntries(
  //     Object.entries({
  //       [searchBy]: debouncedSearchValue,
  //       banner_type: HomeVideoType,
  //       start_date: startDate ? startDate : null,
  //       end_date: endDate ? endDate : null,
  //       ordering: sortBy
  //         ? `${sortType === "asc" ? "" : "-"}${sortBy}`
  //         : "end_date",
  //       // eslint-disable-next-line no-unused-vars
  //     }).filter(([_, value]) => value !== undefined && value !== null)
  //   );
  //   return axiosPrivate.get(
  //     `${HOME_VIDEO_URL}?page=${page}&page_size=${itemPerPage}`,
  //     {
  //       params: { ...searchKeyObject },
  //       paramsSerializer: (params) => qs.stringify(params, { encode: false }),
  //     }
  //   );
  // };

  const fetchAdminHomeVideos = async (page) => {
  const params = new URLSearchParams();

  // Basic pagination and ordering
  params.append("page", page);
  params.append("page_size", itemPerPage);
  params.append(
    "ordering",
    sortBy ? `${sortType === "asc" ? "" : "-"}${sortBy}` : "end_date"
  );

  // Apply dynamic filters
  if (filters?.length) {
    filters.forEach((filter) => {
      if (!filter?.value) return;

      let valueToSend = filter.value;

      // Handle date filters
      if (filter.type === "date" && valueToSend) {
        params.append(filter.key, formatDate(valueToSend));
        return;
      }

      // Handle search input
      if (filter.type === "search") {
        params.append(searchBy || "title", valueToSend);
        return;
      }

      // Handle object-type filters (e.g., select with object values)
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

  return axiosPrivate.get(`${HOME_VIDEO_URL}?${params.toString()}`);
};

  const {
    data: HomeVideos,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "HomeVideos",
      page,
      itemPerPage,
      filters,
      HomeVideoType,
      debouncedSearchValue,
      startDate,
      endDate,
      sortBy,
      sortType,
    ],
    queryFn: () => fetchAdminHomeVideos(page),
  });
  const totalPages = Math.ceil(HomeVideos?.data?.count / itemPerPage); // Assuming 25 items per page

  const handleAddHomeVideo = () => {
    setSelectedHomeVideo(null);
    setIsHomeVideoDialogOpen(true);
  };

  const isFilter =
    debouncedSearchValue || HomeVideoType || startDate ? true : false;

  // Handler for exporting the users as a CSV file.
  const exportCsvHandler = async () => {
    // Set the state to indicate loading and disable the button.
    setCsvDownload(true);


    // Try to fetch and handle the response data.
    try {
      

      if (HomeVideos.data?.results?.length) {

        const currentData = HomeVideos.data?.results?.map((HomeVideo)=> { 

          return {
            

            id: HomeVideo.id,

            title: HomeVideo.title,
            video: HomeVideo.video,
        
            banner_type: HomeVideo.banner_type,
            target: HomeVideo.banner_id,
            start_date: HomeVideo.start_date
              ? formatDate(HomeVideo.start_date)
              : "",
            end_date: HomeVideo.end_date
              ? formatDate(HomeVideo.end_date)
              : "",

            
           
          }
        })

        // Reset the state and initiate the CSV file download.
        setCsvDownload(false);
        exportToExcel(currentData, "HomeVideos.xlsx");
        
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
    <CanSection permissions={["app_api.view_shorthomepagevideo"]}>
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
              <BreadcrumbPage>{t("Home Videos")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderText className={"w-full text-start "} text={t("Home Videos")} />
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
                        !startDate && "text-muted-foreground w-[150px]"
                      )}
                    >
                      {startDate ? (
                        formatDate(startDate)
                      ) : (
                        <>
                          {t("Start Date")}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </>
                      )}
                    </Button>
                    {startDate && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {" "}
                            <Button
                              variant={"ghost"}
                              size="icon"
                              className="rounded-none"
                              onClick={() => {
                                setStartDate(null);
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
                    selected={startDate}
                    onSelect={(value) => {
                      setStartDate(formatDate(value));
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
                        " w-fit text-left !text-xs font-normal rounded-none flex justify-start items-center",
                        !endDate && "text-muted-foreground w-[150px]"
                      )}
                    >
                      {endDate ? (
                        formatDate(endDate)
                      ) : (
                        <>
                          {t("End Date")}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </>
                      )}
                    </Button>
                    {endDate && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {" "}
                            <Button
                              variant={"ghost"}
                              size="icon"
                              className="rounded-none"
                              onClick={() => {
                                setEndDate(null);
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
                    selected={endDate}
                    onSelect={(value) => {
                      setEndDate(formatDate(value));
                      setPage(1)
                    }}
                    disabled={(date) => {
                                const currentStartDate = new Date(
                                  startDate
                                );
                                currentStartDate.setDate(currentStartDate.getDate() - 1);

                                return date <= currentStartDate;
                              }}
                   
                  />
                </PopoverContent>
              </Popover>

              <Select
                onValueChange={(val)=>{
                  setHomeVideoType(val)
                  setPage(1)
                }}
                defaultValue={HomeVideoType}
                value={HomeVideoType}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue
                    className="!text-xs"
                    placeholder={t("Select HomeVideo Type")}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="!text-xs">{t("Video Type")}</SelectLabel>
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
                    setPage(1)
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
                    <SelectValue placeholder="Search By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("Video Fields")}</SelectLabel>
                      <SelectItem value={"title"} className="capitalize">
                        {t("Title")}
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
              searchQueryKey="title"
              onChange={setFilters}  
              isLoading={isLoading}
              isMenuOpen={isFilterMenu}
              setIsMenuOpen={setIsFilterMenu}
            />
            <div className="flex items-center gap-3">
              <Can permissions={["app_api.add_shorthomepagevideo"]}>
              <Button
                onClick={handleAddHomeVideo}
                className="flex items-center gap-1"
              >
                {/* Medium screen and above */}
                <span className="hidden md:block">
                  <Plus size={18} />
                </span>
                {/* Small screen */}
                <span className="md:hidden">
                  <Plus size={14} />
                </span>
                {t("Add New Video")}
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
            </div>
          <div className="flex justify-end items-center  py-2 flex-wrap gap-2">
          <CustomsItemsPerPage setItemPerPage={setItemPerPage} itemPerPage={itemPerPage}/>

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
          isEmpty={!HomeVideos?.data?.results?.length > 0}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={<DataTableSkeleton columnCount={5} />}
          emptyStateMessage={
            isFilter
              ? t("You don't have any home video by this filter")
              : t("You don't have any  home video get started by creating a new one.")
          }
        >
          {/* {HomeVideos?.data?.results?.length > 0 && (
          <> */}
          <DataTable
            columns={columns}
            data={HomeVideos?.data?.results?.map((HomeVideo) => ({
              ...HomeVideo
            }))}
          />
          <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
            <Pagination
              itemPerPage={itemPerPage}
              next={HomeVideos?.data?.next}
              previous={HomeVideos?.data?.previous}
              totalCount={HomeVideos?.data?.count}
              totalPages={totalPages}
              page={page}
              setPage={setPage}
            />
          </Card>
          {/* </>
        )} */}
        </WrapperComponent>
        <HomeVideoDialog />
        <OnDeleteDialog
          name={"HomeVideos"}
          heading={t("Are you absolutely sure?")}
          description={`${t("This action cannot be undone. This will permanently delete this")}  "${selectedHomeVideo?.title}".`}
          url={HOME_VIDEO_URL}
          id={selectedHomeVideo?.id}
          isDialogOpen={isDeleteHomeVideoDialogOpen}
          setIsDialogOpen={setIsDeleteDialogOpen}
        />
      </Section>
    </CanSection>
  );
};

export default HomeVideos;

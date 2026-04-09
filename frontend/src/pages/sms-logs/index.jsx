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
import { SMS_LOGS_URL } from "@/utils/constants/urls";

import {
  CalendarIcon,
  Loader2,
  Plus,
  RotateCcw,
  Search,
  Upload,
  X,
} from "lucide-react";
import SMSLogDialog from "./components/SMSLogDialog";
import OnDeleteDialog from "@/components/Dialogs/OnDelete";
import {
  setIsSMSLogDialogOpen,
  setIsDeleteDialogOpen,
  setIsFilterMenu,
  setSearchBy,
  setSelectedSMSLog,
  useSMSLogsStore,
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
const SMSLogs = () => {
  // Toast for notification.
  const { toast } = useToast();
  const {t} = useTranslation()

  const axiosPrivate = useAxiosPrivate();
  const {

    sortBy,
    sortType,
    searchBy,

    isFilterMenu,
  } = useSMSLogsStore();

  const [search, setSearch] = useState(null);
  const [createdDate, setCreatedDate] = useState(null);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(null);
  const [filters,setFilters] = useState([])

  const [SMSLogType, setSMSLogType] = useState(null);

  // Loading when CSV start downloading state.
  const [csvDownload, setCsvDownload] = useState(false);

  const [itemPerPage, setItemPerPage] = useState("25");
  const [page, setPage] = useState(1);

  const clearFilters = () => {
    setCreatedDate(null);
    setSMSLogType(null);

    setIsFilterMenu(false);
    setPage(1);
    setItemPerPage("25");

    setDebouncedSearchValue(null);
    setSearch(null);
    setSearchBy("level");
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
    title: t("SMS Log Field"),
    key: "search_by",
    type: "select",
    value: "level",
    options: [
      { label: t("Level"), value: "level" },
      { label: t("Message"), value: "message" },
    ],
  },
];

const fetchAdminSMSLogs = async (page) => {
  const params = new URLSearchParams();

  // Pagination
  params.append("page", page);
  params.append("page_size", itemPerPage);

  // Sorting
  params.append(
    "ordering",
    sortBy ? `${sortType === "asc" ? "" : "-"}${sortBy}` : "-created_at"
  );

  // Filters
  if (filters?.length) {
    filters.forEach((filter) => {
      if (filter?.value === null || filter?.value === undefined) return;

      let valueToSend = filter.value;

      // Date range filter
      if (filter.type === "date" && valueToSend) {
        if (valueToSend?.from)
          params.append(`${filter.key}_after`, formatDate(valueToSend.from));
        if (valueToSend?.to)
          params.append(`${filter.key}_before`, formatDate(valueToSend.to));
        return;
      }

      // Text / Search filter
      if (filter.type === "text" || filter.type === "search") {
        if (valueToSend) params.append(searchBy || "level", valueToSend);
        return;
      }

      // Object filters (selects)
      if (typeof valueToSend === "object") {
        valueToSend = valueToSend?.id ?? valueToSend?.value ?? null;
      }

      if (valueToSend !== null && valueToSend !== undefined) {
        params.append(filter.key, valueToSend);
      }
    });
  }

  // Fallback search value
  if (debouncedSearchValue) params.append(searchBy, debouncedSearchValue);

  // Specific created date range fallback
  if (createdDate?.from) params.append("created_at_after", formatDate(createdDate.from));
  if (createdDate?.to) params.append("created_at_before", formatDate(createdDate.to));

  return axiosPrivate.get(`${SMS_LOGS_URL}?${params.toString()}`);
};



  // const fetchAdminSMSLogs = async (page) => {
  //   let searchKeyObject = {};



  //   searchKeyObject = Object.fromEntries(
  //     Object.entries({
  //       [searchBy]: debouncedSearchValue,
  
      
  //        created_at_after: createdDate?.from ? formatDate(createdDate?.from) : null,
  //        created_at_before: createdDate?.to ? formatDate(createdDate?.to) : null,
  
  //       ordering: sortBy
  //         ? `${sortType === "asc" ? "" : "-"}${sortBy}`
  //         : "-created_at",
  //       // eslint-disable-next-line no-unused-vars
  //     }).filter(([_, value]) => value !== undefined && value !== null)
  //   );
  //   return axiosPrivate.get(
  //     `${SMS_LOGS_URL}?page=${page}&page_size=${itemPerPage}`,
  //     {
  //       params: { ...searchKeyObject },
  //       paramsSerializer: (params) => qs.stringify(params, { encode: false }),
  //     }
  //   );
  // };

  const {
    data: SMSLogs,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "SMSLogs",
      page,
      filters,
      itemPerPage,
      SMSLogType,
      debouncedSearchValue,
      createdDate,
      sortBy,
      sortType,
    ],
    queryFn: () => fetchAdminSMSLogs(page),
  });
  const totalPages = Math.ceil(SMSLogs?.data?.count / itemPerPage); // Assuming 25 items per page


  const isFilter =
    debouncedSearchValue ||  createdDate ? true : false;

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
      
    //     created_at_after: createdDate?.from ? formatDate(createdDate?.from) : null,
    //     created_at_before: createdDate?.to ? formatDate(createdDate?.to) : null,
    //     ordering: sortBy
    //       ? `${sortType === "asc" ? "" : "-"}${sortBy}`
    //       : "created_at",
    //     columns: "level,message,created_at",
    //     // eslint-disable-next-line no-unused-vars
    //   }).filter(([_, value]) => value !== undefined && value !== null)
    // );

    // Try to fetch and handle the response data.
    try {
 
      if (SMSLogs.data?.results?.length) {

        const currentData = SMSLogs.data?.results?.map((SMSLog)=> { 

          return {
            

            level: SMSLog.level,
            message: SMSLog.message,
            created_at: SMSLog.created_at
              ? formatFullDate(SMSLog.created_at)
              : "",

            
           
          }
        })

        // Reset the state and initiate the CSV file download.
        setCsvDownload(false);
        exportToExcel(currentData, "SMS Logs.xlsx");
        
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
    <CanSection permissions={["app_api.view_currencyexchange"]}>
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
              <BreadcrumbPage>{t("SMS Logs")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderText className={"w-full text-start "} text={t("SMS Logs")} />
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
                        <p className="space-x-2 flex">
                        <span>{formatDate(createdDate?.from)}</span>
                        {createdDate?.to && <span>/</span>}

                        {createdDate?.to && (
                          <span>{formatDate(createdDate?.to)}</span>
                        )}
                      </p>
                      ) : (
                        <>
                          {t("Pick Range Date")}
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
                     mode="range"
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
                    type={"text"}
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
                    <SelectValue placeholder={t("Search By")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("SMS Log Field")}</SelectLabel>
                      <SelectItem value={"level"} className="capitalize">
                      {t("Level")}
                      </SelectItem>
                     
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )} */}
        <Card className="flex justify-end items-center w-full px-2  py-2 flex-wrap gap-4">
     <FiltersSection
              setPage={setPage} 
              value={filters}
              onChange={setFilters}  
              isLoading={isLoading}
              isMenuOpen={isFilterMenu}
              searchQueryKey="name"
              setIsMenuOpen={setIsFilterMenu}
             />
          <Can permissions={["app_api.view_currencyexchange"]}>
            <div className="flex items-center space-x-2">
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
          </Can>
          <div className="flex justify-end items-center  py-2 flex-wrap gap-2">
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
          isEmpty={!SMSLogs?.data?.results?.length > 0}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={<DataTableSkeleton columnCount={5} />}
          emptyStateMessage={
            isFilter
              ? t("You don't have any SMSLogs by this filter")
              : t("You don't have any SMSLogs get started by creating a new one.")
          }
        >
          {/* {SMSLogs?.data?.results?.length > 0 && (
          <> */}
          <DataTable
            columns={columns}
            data={SMSLogs?.data?.results?.map((SMSLog) => ({
            

              level: SMSLog.level,
              message: SMSLog.message,
              created_at: SMSLog.created_at
                ? formatFullDate(SMSLog.created_at)
                : "",
              

              actions: "actions",
            }))}
          />
          <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
            <Pagination
              itemPerPage={itemPerPage}
              next={SMSLogs?.data?.next}
              previous={SMSLogs?.data?.previous}
              totalCount={SMSLogs?.data?.count}
              totalPages={totalPages}
              page={page}
              setPage={setPage}
            />
          </Card>
          {/* </>
        )} */}
        </WrapperComponent>
        <SMSLogDialog />
      </Section>
    </CanSection>
  );
};

export default SMSLogs;

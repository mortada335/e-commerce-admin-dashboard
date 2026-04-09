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
import { useEffect, useState } from "react";
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
import { DELETED_USERS_URL } from "@/utils/constants/urls";

import {
  setSearchBy,
  setIsFilterMenu,
  useDeletedUsersStore,
  setStatus,
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

import {
  CalendarIcon,
  Loader2,
  RotateCcw,
  Search,
  Upload,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/input";

import { displayBasicDate, exportToExcel, formatDate } from "@/utils/methods";
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

import { useToast } from "@/components/ui/use-toast";

import CanSection from "@/components/CanSection";
import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";
import { useTranslation } from "react-i18next";
import FiltersSection from "@/components/filters-ui/FiltersSection";
import FiltersMenu from "@/components/filters-ui/FiltersMenu";

const DeletedUsers = () => {
  const axiosPrivate = useAxiosPrivate();
  const { sortType, sortBy, searchBy, status, isFilterMenu } =
    useDeletedUsersStore();

  const [search, setSearch] = useState(null);
  const [isStaff, setIsStaff] = useState(null);
  const [rangeDate, setRangeDate] = useState(null);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(null);

  const [dateDeleted, setDateDeleted] = useState(null);
  const {t} = useTranslation()
  const [filters,setFilters] = useState([])

  const [itemPerPage, setItemPerPage] = useState("25");
  const [page, setPage] = useState(1);

  // Clear search value when search by changes.
  useEffect(() => {
    setSearch("");
  }, [searchBy]);

  const clearFilters = () => {
    setDateDeleted(null);
    setStatus(null);

    setIsFilterMenu(false);
    setPage(1);
    setItemPerPage("25");

    setDebouncedSearchValue(null);
    setSearch(null);
    setSearchBy("phone_number");
    setIsStaff(null);
    setRangeDate(null);
  };

  const [csvDownload, setCsvDownload] = useState(false);

  const { toast } = useToast();  

  
  const defaultsFilters = [
  {
    title: t("Search By Name"),
    key: "username",
    type: "text",
    value: null,
  },
  {
    title: t("User Type"),
    key: "user_type",
    type: "select",
    value: null,
    options: [
      { label: t("All Users"), value: null },
      { label: t("Users With Done Orders"), value: "users_with_done_orders" },
      { label: t("Users With Zero Orders"), value: "users_with_zero_orders" },
    ],
  },
  {
    title: t("User Status"),
    key: "is_active",
    type: "select",
    value: null,
    options: [
      { label: t("All Status"), value: null },
      { label: t("Active"), value: "1" },
      { label: t("Inactive"), value: "0" },
    ],
  },
  {
    title: t("Date Deleted"),
    key: "date_deleted",
    type: "date",
    value: null,
  },
  {
    title: t("Date Joined"),
    key: "date_joined",
    type: "date",
    value: null,
  },
  {
    title: t("Users By First Order Date"),
    key: "users_by_first_order_date",
    type: "date",
    value: null,
  },
  {
    title: t("Users With No Orders Date"),
    key: "get_users_with_no_orders",
    type: "date",
    value: null,
  },
  {
    title: t("LTV Min Threshold"),
    key: "ltv_min_threshold",
    type: "text",
    value: null,
  },
  {
    title: t("LTV Max Threshold"),
    key: "ltv_max_threshold",
    type: "text",
    value: null,
  },
  {
    title: t("LTV Start Date"),
    key: "ltv_start_date",
    type: "date",
    value: null,
  },
  {
    title: t("LTV End Date"),
    key: "ltv_end_date",
    type: "date",
    value: null,
  },
];
  // const GetDeletedUsers = async (page) => {
  //   let searchKeyObject = {};

  //   searchKeyObject = Object.fromEntries(
  //     Object.entries({
  //       [searchBy]: debouncedSearchValue
  //         ? searchBy === "phone_number"
  //           ? `%2B964${debouncedSearchValue}`
  //           : debouncedSearchValue
  //         : null,
  //       date_deleted_after: rangeDate?.from
  //         ? formatDate(rangeDate?.from)
  //         : null,
  //       date_deleted_before: rangeDate?.to ? formatDate(rangeDate?.to) : null,
  //       is_superuser: 0,
  //       is_active: status >= 0 ? status : null,
  //       is_staff: isStaff,
  //       ordering: sortBy
  //         ? `${sortType === "asc" ? "" : "-"}${sortBy}`
  //         : "-date_deleted",
  //       // eslint-disable-next-line no-unused-vars
  //     }).filter(
  //       // eslint-disable-next-line no-unused-vars
  //       ([_, value]) => value !== "" && value !== undefined && value !== null
  //     )
  //   );

  //   return axiosPrivate.get(
  //     `${DELETED_USERS_URL}?page=${page}&page_size=${itemPerPage}`,
  //     {
  //       params: { ...searchKeyObject },
  //       paramsSerializer: (params) => qs.stringify(params, { encode: false }),
  //     }
  //   );
  // };

  const GetDeletedUsers = async () => {
  const params = new URLSearchParams();

  // Pagination & ordering
  params.append("page", page);
  params.append("page_size", itemPerPage);
  params.append(
    "ordering",
    sortBy ? `${sortType === "asc" ? "" : "-"}${sortBy}` : "-date_deleted"
  );

  // Core filters
  params.append("is_superuser", 0);

  // Search
  if (debouncedSearchValue) {
    const searchValue =
      searchBy === "phone_number"
        ? `+964${debouncedSearchValue}`
        : debouncedSearchValue;
    params.append(searchBy, searchValue);
  }

  // Date deleted range
  if (rangeDate?.from)
    params.append("date_deleted_after", formatDate(rangeDate.from));
  if (rangeDate?.to)
    params.append("date_deleted_before", formatDate(rangeDate.to));

  // Staff / active filters
  if (isStaff === true) params.append("is_staff", true);
  if (isStaff === false) params.append("is_staff", false);

  if (status !== null && status !== undefined)
    params.append("is_active", status);

  

  // Dynamic filters
  if (filters?.length) {
    filters.forEach((filter) => {
      if (!filter?.value) return;
      let value = filter.value;

      if (filter.type === "daterange" && typeof value === "object") {
        if (value.from)
          params.append(`${filter.key}_after`, formatDate(value.from));
        if (value.to)
          params.append(`${filter.key}_before`, formatDate(value.to));
        return;
      }

      if (typeof value === "object") {
        value =
          value?.id ??
          value?.value ??
          value?.category_id ??
          value?.product_id ??
          null;
      }

      if (value !== null && value !== undefined)
        params.append(filter.key, value);
    });
  }

  return axiosPrivate.get(`${DELETED_USERS_URL}?${params.toString()}`);
};

  const {
    data: deletedUsers,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "DeletedUsers",
      page,
      filters,
      debouncedSearchValue,
      status,
      isStaff,
      itemPerPage,

      dateDeleted,
      sortBy,
      sortType,
      rangeDate?.from && rangeDate?.to,
    ],
    queryFn: () => GetDeletedUsers(page),
  });
  const totalPages = Math.ceil(deletedUsers?.data?.count / itemPerPage); // Assuming 25 items per page

  // Handler for exporting the users as a CSV file.
  const exportCsvHandler = async () => {
    // Set the state to indicate loading and disable the button.
    setCsvDownload(true);

    // // Initialize an object to store search params fro API request..
    // let searchKeyObject = {};

    // // Convert an object into an array of [key, value] pairs, filter it, then convert it back to an object.
    // searchKeyObject = Object.fromEntries(
    //   Object.entries({
    //     // Set search parameters based on various conditions.
    //     [searchBy]: debouncedSearchValue
    //       ? searchBy === "phone_number"
    //         ? `%2B964${debouncedSearchValue}`
    //         : debouncedSearchValue
    //       : null,
    //     date_deleted_after: rangeDate?.from
    //       ? formatDate(rangeDate?.from)
    //       : null,
    //     date_deleted_before: rangeDate?.to ? formatDate(rangeDate?.to) : null,
    //     is_superuser: 0,
    //     is_active: status >= 0 ? status : null,

    //     ordering: sortBy
    //       ? `${sortType === "asc" ? "" : "-"}${sortBy}`
    //       : "-date_deleted",
    //     columns:
    //       "id,first_name,last_name,is_active,is_staff,phone_number,date_deleted",
    //     // eslint-disable-next-line no-unused-vars
    //   }).filter(
    //     // eslint-disable-next-line no-unused-vars
    //     ([_, value]) => value !== "" && value !== undefined && value !== null
    //   )
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
      //   downloadCsv(response.data, undefined, "Deleted Users.csv");
      // }


      if (deletedUsers.data?.results?.length) {

        const currentData = deletedUsers.data?.results?.map((user)=> { 

          return {
            

            id: user.id,
              name: user.first_name + " " + user.last_name,
              first_name: user.first_name,
              last_name: user.last_name,
              status: user.is_active,
              is_staff: user.is_staff,
              is_superuser: user.is_superuser,
              phone_number: user.phone_number,
              date_deleted: user?.date_deleted
                ? displayBasicDate(user?.date_deleted)
                : "",

            
           
          }
        })

        // Reset the state and initiate the CSV file download.
        setCsvDownload(false);
        exportToExcel(currentData, "Deleted Users.xlsx");
        
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

  const isFilter =
    debouncedSearchValue ||
    dateDeleted ||
    status ||
    rangeDate ||
    isStaff === true ||
    isStaff === false
      ? true
      : false;

  return (
    <CanSection permissions={["app_api.view_deleteduser"]}>
      <Section className="space-y-6 h-fit items-start">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link to="/">{t("Home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("Deleted Users")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderText
          className={"w-full text-start "}
          text={t("Deleted Users List")}
        />

        <Card className="flex justify-between items-center w-full px-2  py-2 flex-wrap gap-2">
           <FiltersSection
              setPage={setPage} 
              value={filters}
              onChange={setFilters}  
              isLoading={isLoading}
              isMenuOpen={isFilterMenu}
              searchQueryKey="name"
              setIsMenuOpen={setIsFilterMenu}
             />
          <div className="flex items-center space-x-2">
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
                  {/* Small screen. */}
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
          isEmpty={!deletedUsers?.data?.results?.length > 0}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={<DataTableSkeleton columnCount={5} />}
          emptyStateMessage={
            isFilter
              ? t("You don't have any deleted users by this filter.")
              : t("You don't have any deleted users.")
          }
        >
          <DataTable
            canView={true}
            to={"/deleted-users/details/"}
            columns={columns}
            data={deletedUsers?.data?.results?.map((user) => ({
              id: user.id,
              name: user.first_name + " " + user.last_name,
              first_name: user.first_name,
              last_name: user.last_name,
              status: user.is_active,
              is_staff: user.is_staff,
              is_superuser: user.is_superuser,
              phone_number: user.phone_number,
              date_deleted: user?.date_deleted
                ? displayBasicDate(user?.date_deleted)
                : "",
              actions: user.original_user_id,
            }))}
          />
          <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
            <Pagination
              itemPerPage={itemPerPage}
              next={deletedUsers?.data?.next}
              previous={deletedUsers?.data?.previous}
              totalPages={totalPages}
              totalCount={deletedUsers?.data?.count}
              page={page}
              setPage={setPage}
            />
          </Card>
        </WrapperComponent>
      </Section>
    </CanSection>
  );
};

export default DeletedUsers;

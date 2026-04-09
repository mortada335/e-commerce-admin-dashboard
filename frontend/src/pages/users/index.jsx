import Section from "@/components/layout/Section";
import DataTable from "@/components/ui/DataTable";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import { Button } from "@/components/ui/button";
import AddWarehouseToUserDialog from "./components/AddWarehouseToUserDialog";

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
import { CATEGORIES_URL, USERS_URL } from "@/utils/constants/urls";

import {
  setIsUserDialogOpen,
  setSelectedUser,
  useUserStore,
  setIsChangeStatusDialogOpen,
  setSearchBy,
  setIsLTVFilter,
  setIsFilterMenu,
  setIsDeleteUserDialogOpen,
} from "./store";

import UserDialog from "./components/UserDialog";
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
  RotateCcw,
  Search,
  UserRoundPlus,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/input";

import { displayBasicDate, formatDate, formatDateToISO } from "@/utils/methods";
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

import OnChangeStatus from "@/components/Dialogs/OnChangeStatus";
import OnDeleteDialog from "@/components/Dialogs/OnDelete";
import ChangePasswordDialog from "./user/components/ChangePasswordDialog";
import CanSection from "@/components/CanSection";
import UserEditDialog from "./components/UserEditDialog";
import AssignRolesDialog from "./components/AssignRolesDialog";
import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";
import Can from "@/components/Can";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ColumnsMenu from "@/components/data-table/ColumnsMenu";
import CategoryAutocomplete from "@/components/CategoryAutocomplete";
import ExportButton from "@/components/ui/export-button";
import { useTranslation } from "react-i18next";
import FiltersSection from "@/components/filters-ui/FiltersSection";
import FiltersMenu from "@/components/filters-ui/FiltersMenu";

const Users = () => {
  const axiosPrivate = useAxiosPrivate();
  const {
    isChangeStatusDialogOpen,
    selectedUser,
    sortType,
    sortBy,
    searchBy,

    dateJoined,

    isFilterMenu,

    isDeleteUserDialogOpen,
    isLTVFilter,
  } = useUserStore();

  const [search, setSearch] = useState(null);
  const [status, setStatus] = useState(null);
  const [userType, setUserType] = useState(null);
  const [showLTV, setShowLTV] = useState(false);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(null);
  const [debouncedLtvMinThreshold, setDebouncedLtvMinThreshold] =
    useState(null);
  const [debouncedLtvMaxThreshold, setDebouncedLtvMaxThreshold] =
    useState(null);

  const [applyLTVFilter, setApplyLTVFilter] = useState(false);
  const [rangeDate, setRangeDate] = useState(null);
  const [getUsersWithNoOrdersRangeDate, setGetUsersWithNoOrdersRangeDate] =
    useState(null);
  const [ordersInCategory, setOrdersInCategory] = useState({ filter_id: null });
  const [firstOrderDate, setFirstOrderDate] = useState(null);
  const [ltvStartDate, setLtvStartDate] = useState(null);
  const [ltvEndDate, setLtvEndDate] = useState(null);
  const [filters,setFilters] = useState([])

  const {t} = useTranslation()
  const [itemPerPage, setItemPerPage] = useState("25");
  const [page, setPage] = useState(1);

  // Clear search value when search by changes.
  useEffect(() => {
    setSearch("");
  }, [searchBy]);

  const clearFilters = () => {
    setRangeDate(null);
    setGetUsersWithNoOrdersRangeDate(null);
    setFirstOrderDate(null);
    setOrdersInCategory({ filter_id: null });
    setLtvStartDate(null);
    setLtvEndDate(null);
    setStatus(null);

    setApplyLTVFilter(false);
    setIsFilterMenu(false);
    setPage(1);
    setItemPerPage("25");

    setDebouncedLtvMinThreshold(null);
    setDebouncedLtvMaxThreshold(null);
    setDebouncedSearchValue(null);
    setSearch(null);
    setUserType(null);
    setSearchBy("username");
    setShowLTV(false);
  };


  const defaultsFilters = [
  {
    title: t("Search By Name"),
    key: "username",
    type: "text",
    value: null,
    placeholder: t("e.g. 7712885482"),
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
    title: t("Date Joined"),
    key: "date_joined",
    type: "date",
    value: null,
  },
  // {
  //   title: t("Users By First Order Date"),
  //   key: "users_by_first_order_date",
  //   type: "date",
  //   value: null,
  // },
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


  // const GetAdminUser = async (page) => {
  //   let searchKeyObject = {};

  //   searchKeyObject = Object.fromEntries(
  //     Object.entries({
  //       [searchBy]: debouncedSearchValue
  //         ? searchBy === "username"
  //           ? `%2B964${debouncedSearchValue}`
  //           : debouncedSearchValue
  //         : null,
  //       users_by_first_order_date: firstOrderDate?.to && firstOrderDate?.from ?`${formatDate(firstOrderDate?.from)},${formatDate(firstOrderDate?.to)}` : null,
  //       date_joined_before: rangeDate?.to ? formatDate(rangeDate?.to) : null,
  //       date_joined_after: rangeDate?.from ? formatDate(rangeDate?.from) : null,
  //       get_users_with_no_orders_before: getUsersWithNoOrdersRangeDate?.to ? formatDate(getUsersWithNoOrdersRangeDate?.to) : null,
  //       get_users_with_no_orders_after: getUsersWithNoOrdersRangeDate?.from ? formatDate(getUsersWithNoOrdersRangeDate?.from) : null,
  //       // date_added_after: dateJoined ? formatDate(dateJoined) : null,
  //       is_superuser: 0,
  //       orders_in_category: ordersInCategory?.filter_id?ordersInCategory?.filter_id:null,
  //       is_active: status >= 0 ? status : null,
  //       ltv_max_threshold: applyLTVFilter ? debouncedLtvMaxThreshold : null,
  //       ltv_min_threshold: applyLTVFilter ? debouncedLtvMinThreshold : null,
  //       ltv_start_date:
  //         ltvEndDate && applyLTVFilter ? formatDateToISO(ltvStartDate) : null,
  //       ltv_end_date:
  //         ltvStartDate && applyLTVFilter ? formatDateToISO(ltvEndDate) : null,
  //       show_ltv: showLTV?true:null,
  //       [userType]:  userType&&true,
  //       ordering: sortBy
  //         ? `${sortType === "asc" ? "" : "-"}${sortBy}`
  //         : "-date_joined",
  //       // eslint-disable-next-line no-unused-vars
  //     }).filter(
  //       // eslint-disable-next-line no-unused-vars
  //       ([_, value]) => value !== "" && value !== undefined && value !== null
  //     )
  //   );

  //   return axiosPrivate.get(
  //     `${USERS_URL}?page=${page}&page_size=${itemPerPage}`,
  //     {
  //       params: { ...searchKeyObject },
  //       paramsSerializer: (params) => qs.stringify(params, { encode: false }),
  //     }
  //   );
  // };

  const GetAdminUser = async () => {
  const params = new URLSearchParams();

  // Pagination & ordering
  params.append("page", page);
  params.append("page_size", itemPerPage);
  params.append(
    "ordering",
    sortBy ? `${sortType === "asc" ? "" : "-"}${sortBy}` : "-date_joined"
  );

  // Core filters
  params.append("is_superuser", 0);

  // Search
  if (debouncedSearchValue) {
    const searchValue =
      searchBy === "username"
        ? `+964${debouncedSearchValue}`
        : debouncedSearchValue;
    params.append(searchBy, searchValue);
  }

  // Users by first order date
  if (firstOrderDate?.from && firstOrderDate?.to) {
    params.append(
      "users_by_first_order_date",
      `${formatDate(firstOrderDate.from)},${formatDate(firstOrderDate.to)}`
    );
  }

  // Date joined range
  if (rangeDate?.from)
    params.append("date_joined_after", formatDate(rangeDate.from));
  if (rangeDate?.to)
    params.append("date_joined_before", formatDate(rangeDate.to));

  // Users with no orders range
  if (getUsersWithNoOrdersRangeDate?.from)
    params.append(
      "get_users_with_no_orders_after",
      formatDate(getUsersWithNoOrdersRangeDate.from)
    );
  if (getUsersWithNoOrdersRangeDate?.to)
    params.append(
      "get_users_with_no_orders_before",
      formatDate(getUsersWithNoOrdersRangeDate.to)
    );

  // Orders in category
  if (ordersInCategory?.filter_id)
    params.append("orders_in_category", ordersInCategory.filter_id);

  // Active status
  if (status !== null && status !== undefined)
    params.append("is_active", status);

  // User type (with_done_orders / with_zero_orders)
  if (userType) params.append(userType, true);

  // LTV filters
  if (applyLTVFilter) {
    if (debouncedLtvMinThreshold)
      params.append("ltv_min_threshold", debouncedLtvMinThreshold);
    if (debouncedLtvMaxThreshold)
      params.append("ltv_max_threshold", debouncedLtvMaxThreshold);
    if (ltvStartDate)
      params.append("ltv_start_date", formatDateToISO(ltvStartDate));
    if (ltvEndDate)
      params.append("ltv_end_date", formatDateToISO(ltvEndDate));
  }

  // Show LTV column toggle
  if (showLTV) params.append("show_ltv", true);

  // Additional dynamic filters
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

      if (value !== null && value !== undefined) {
        params.append(filter.key, value);
      }
    });
  }
  params.append("include", "roles")

  return axiosPrivate.get(`${USERS_URL}?${params.toString()}`);
};


  const {
    data: users,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "Users",
      page,
      filters,
      debouncedSearchValue,
      status,
      itemPerPage,
      userType,
      dateJoined,
      applyLTVFilter,
      sortBy,
      sortType,
      rangeDate,
      getUsersWithNoOrdersRangeDate,
      showLTV,
      firstOrderDate?.to,
      ordersInCategory?.filter_id,
    ],
    queryFn: () => GetAdminUser(page),
  });
  const totalPages = Math.ceil(users?.data?.count / itemPerPage); // Assuming 25 items per page

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserDialogOpen(true);
  };

  const isFilter =
    debouncedSearchValue ||
    rangeDate ||
    getUsersWithNoOrdersRangeDate ||
    firstOrderDate ||
    ordersInCategory?.filter_id ||
    status ||
    applyLTVFilter ||
    userType ||
    showLTV
      ? true
      : false;

  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    first_name: JSON.parse(localStorage.getItem("first_name")) ?? true,
    username: JSON.parse(localStorage.getItem("username")) ?? true,
    ltv: showLTV ? JSON.parse(localStorage.getItem("ltv")) ?? true : false, // Hidden by default
    is_active: JSON.parse(localStorage.getItem("is_active")) ?? true, // Hidden by default
    dateJoined: JSON.parse(localStorage.getItem("dateJoined")) ?? true,

    actions: true,
  });

  const disabledColumnVisibility = (column) => {
    if (column) {
      return (
        column?.accessorKey !== "id" &&
        column?.accessorKey !== "username" &&
        column?.accessorKey !== "actions"
      );
    } else {
      return true;
    }
  };

  const exportObject = (item) => {
    return {
      Id: item.id,
      "First Name": item?.first_name,
      "Last Name": item?.last_name,
      "Phone Number": item?.username,
      "Date Joined": item.date_joined ? displayBasicDate(item.date_joined) : "",
    };
  };

  return (
    <CanSection permissions={["app_api.view_currencyexchange"]}>
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
              <BreadcrumbPage>{t("Customers")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderText className={"w-full text-start "} text={t("Customers List")} />

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
          <div className="flex items-center gap-3">
          <Can permissions={["app_api.view_currencyexchange"]}>

            <Button onClick={handleAddUser} className="flex items-center gap-1 ">
              {/* Medium screen and above. */}
              <span className="hidden md:block">
                <UserRoundPlus size={18} />
              </span>
              {/* Small screen. */}
              <span className="md:hidden">
                <UserRoundPlus size={14} />
              </span>
              {t("Add New Customer")}
            </Button>
          </Can>
           
          <ExportButton 
       //  variant="outline" 
           itemPerPage={users?.data?.count} url={USERS_URL} 
           isCustomObject={true}
           exportObject={exportObject}
           fileName="Customers.xlsx"
           filters={
            [
                            {
            key:'slim',
            value: true,
           },

                {
                  key: searchBy,
                  value: debouncedSearchValue
                    ? searchBy === "username"
                      ? `+964${debouncedSearchValue}`
                      : debouncedSearchValue
                    : null,
                },
                {
                  key: "users_by_first_order_date",
                  value:
                    firstOrderDate?.to && firstOrderDate?.from
                      ? `${formatDate(firstOrderDate?.from)},${formatDate(
                          firstOrderDate?.to
                        )}`
                      : null,
                },
                {
                  key: "date_joined_before",
                  value: rangeDate?.to ? formatDate(rangeDate?.to) : null,
                },
                {
                  key: "date_joined_after",
                  value: rangeDate?.from ? formatDate(rangeDate?.from) : null,
                },
                {
                  key: "get_users_with_no_orders_before",
                  value: getUsersWithNoOrdersRangeDate?.to
                    ? formatDate(getUsersWithNoOrdersRangeDate?.to)
                    : null,
                },
                {
                  key: "get_users_with_no_orders_after",
                  value: getUsersWithNoOrdersRangeDate?.from
                    ? formatDate(getUsersWithNoOrdersRangeDate?.from)
                    : null,
                },
                {
                  key: "is_superuser",
                  value: 0,
                },
                {
                  key: "orders_in_category",
                  value: ordersInCategory?.filter_id
                    ? ordersInCategory?.filter_id
                    : null,
                },
                {
                  key: "is_active",
                  value: status >= 0 ? status : null,
                },
                //     {
                //   key:'ltv_max_threshold',
                //   value: applyLTVFilter ? debouncedLtvMaxThreshold : null,
                //  },
                //     {
                //   key:'ltv_min_threshold',
                //   value: applyLTVFilter ? debouncedLtvMinThreshold : null,
                //  },
                //     {
                //   key:'ltv_start_date',
                //   value: ltvEndDate && applyLTVFilter ? formatDateToISO(ltvStartDate) : null,
                //  },
                //     {
                //   key:'ltv_end_date',
                //   value: ltvStartDate && applyLTVFilter ? formatDateToISO(ltvEndDate) : null,
                //  },
                //     {
                //   key:'show_ltv',
                //   value: showLTV?true:null,
                //  },
                {
                  key: userType,
                  value: userType && true,
                },
              ]}
              initSortBy="date_joined"
              sortBy={sortBy}
              sortType={sortType}
              page={page}
            />
          </div>

          <div className="flex justify-end items-center flex-wrap gap-2">
            <div className="flex items-center space-x-2 group">
              <Switch
                id="#ShowLTV"
                checked={showLTV}
                onCheckedChange={(val) => {
                  setShowLTV(val);

                  setPage(1);
                }}
              />
              <Label
                htmlFor="#OnlyNewProducts"
                className={cn(
                  "text-slate-500 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition",
                  showLTV && "text-slate-900 dark:text-slate-200"
                )}
              >
                {t("Show LTV")}
              </Label>
            </div>
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
          isEmpty={!users?.data?.results?.length > 0}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={<DataTableSkeleton columnCount={5} />}
          emptyStateMessage={
            isFilter
              ? t("You don't have any users by this filter")
              : t("You don't have any users get started by creating a new one.")
          }
        >
          <DataTable
            canView={true}
            to={"/users/details/"}
            columns={columns}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            data={users?.data?.results?.map((user) => ({
              id: user.id,
              name: user.first_name + " " + user.last_name,
              first_name: user.first_name,
              last_name: user.last_name,
              username: user.username,
              status: user.is_active,
              is_active: user.is_active,
              ltv: showLTV ? user.ltv || 0 : "-",
              dateJoined: user?.date_joined
                ? displayBasicDate(user?.date_joined)
                : "",
              actions: user.id,
            }))}
          />
          <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
            <Pagination
              itemPerPage={itemPerPage}
              next={users?.data?.next}
              previous={users?.data?.previous}
              totalPages={totalPages}
              totalCount={users?.data?.count}
              page={page}
              setPage={setPage}
            />
          </Card>
        </WrapperComponent>
        <UserDialog />
        <UserEditDialog />
        <AssignRolesDialog />
        <ChangePasswordDialog id={selectedUser?.id} />
        <OnChangeStatus
          name={"Users"}
          heading={t("Are you absolutely sure?")}
          description={`This action will ${
            selectedUser?.is_active ? "Disable" : "Enabled"
          }  "${selectedUser?.name}".`}
          url={`change-user-status/`}
          id={``}
          isDialogOpen={isChangeStatusDialogOpen}
          setIsDialogOpen={setIsChangeStatusDialogOpen}
          headers={{
            "Content-Type": "multipart/form-data",
          }}
          data={{
            user_id: selectedUser?.id,
            is_active: selectedUser?.is_active ? false : true,
          }}
          requestType="post"
        />
        <AddWarehouseToUserDialog />

        <OnDeleteDialog
          name={"Users"}
          heading={t("Are you absolutely sure?")}
          description={`${t("This action cannot be undone. This will permanently delete this")}  "${selectedUser?.name}".`}
          url={USERS_URL}
          id={selectedUser?.id + "/"}
          isDialogOpen={isDeleteUserDialogOpen}
          setIsDialogOpen={setIsDeleteUserDialogOpen}
        />
      </Section>
    </CanSection>
  );
};

export default Users;

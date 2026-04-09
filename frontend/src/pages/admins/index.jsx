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
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "@/components/layout/Pagination";
import columns from "./components/columns";
import { USERS_URL } from "@/utils/constants/urls";

import {
  // setIsUserDialogOpen,
  // setSelectedUser,
  useUserStore,
  setIsChangeStatusDialogOpen,
  setStatus,
  setDebouncedSearchValue,
  setSearch,
  setSearchBy,
  // setIsFilterMenu,
  setRangeDate,
  setIsDeleteUserDialogOpen,
} from "./store";

import UserDialog from "./components/UserDialog";
import AddWarehouseToUserDialog from "./components/AddWarehouseToUserDialog";
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
  Search,
  ShieldPlus,
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
import OnChangeStatus from "@/components/Dialogs/OnChangeStatus";
import OnDeleteDialog from "@/components/Dialogs/OnDelete";
import CanSection from "@/components/CanSection";
import Can from "@/components/Can";
import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";
import { useTranslation } from "react-i18next";
import AssignRoleToUser from "./components/AssignRoleToUser";

const Users = () => {
  const axiosPrivate = useAxiosPrivate();
  const {
    isChangeStatusDialogOpen,
    selectedUser,
    sortType,
    sortBy,
    searchBy,
    search,
    debouncedSearchValue,
    status,
    dateJoined,

    isFilterMenu,

    rangeDate,
    isDeleteUserDialogOpen,
  } = useUserStore();

  const [csvDownload, setCsvDownload] = useState(false);
  const navigate = useNavigate();

  const { toast } = useToast();
  const { t } = useTranslation();

  const [itemPerPage, setItemPerPage] = useState("25");
  const [page, setPage] = useState(1);

  const GetAdminUser = async (page) => {
    let searchKeyObject = {};

    searchKeyObject = Object.fromEntries(
      Object.entries({
        [searchBy]: debouncedSearchValue ? debouncedSearchValue : null,
        date_joined_before: rangeDate?.to ? formatDate(rangeDate?.to) : null,
        date_joined_after: rangeDate?.from ? formatDate(rangeDate?.from) : null,
        // date_added_after}: dateJoined ? formatDate(dateJoined) : null,
        is_staff: true,
        include: "role" || null,
        is_active: status >= 0 ? status : null,

        ordering: sortBy
          ? `${sortType === "asc" ? "" : "-"}${sortBy}`
          : "-date_joined",
        // eslint-disable-next-line no-unused-vars
      }).filter(
        // eslint-disable-next-line no-unused-vars
        ([_, value]) => value !== "" && value !== undefined && value !== null
      )
    );

    return axiosPrivate.get(
      `${USERS_URL}?page=${page}&page_size=${itemPerPage}&include=warehouse`,
      {
        params: { ...searchKeyObject },
        paramsSerializer: (params) => qs.stringify(params, { encode: false }),
      }
    );
  };

  const {
    data: users,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "Admins",
      page,
      debouncedSearchValue,
      status,
      itemPerPage,

      dateJoined,

      sortBy,
      sortType,
      rangeDate,
      status,
    ],
    queryFn: () => GetAdminUser(page),
  });
  const totalPages = Math.ceil(users?.data?.count / itemPerPage); // Assuming 25 items per page

  // const handleAddUser = () => {
  //   setSelectedUser(null);
  //   setIsUserDialogOpen(true);
  // };

  // const exportFunction = async () => {

  //   setCsvDownload(true);
  //   let searchKeyObject;
  //   searchKeyObject = Object.fromEntries(
  //     Object.entries({
  //       is_superuser: 1,
  //     }).filter(
  //       // eslint-disable-next-line no-unused-vars
  //       ([_, value]) => value !== "" && value !== undefined && value !== null
  //     )
  //   );
  //   try {
  //     const response = await getExportedCsv(searchKeyObject);

  //     if (response.data) {
  //       setCsvDownload(false);
  //       downloadCsv(response.data, undefined, "users.csv");
  //     }
  //   } catch (error) {
  //     setCsvDownload(false);

  //     toast({
  //       variant: "destructive",
  //       title: "Failed!!!",
  //       description: "Something went wrong",
  //     });
  //   }
  // };

  // Handler for exporting the users as a CSV file.

  const exportCsvHandler = async () => {
    // Set the state to indicate loading and disable the button.
    setCsvDownload(true);

    // // Initialize an object to store search params fro API request..
    // let searchKeyObject = {};

    // // Convert an object into an array of [key, value] pairs, filter it, then convert it back to an object.
    // searchKeyObject = Object.fromEntries(
    //   Object.entries({
    //     [searchBy]: debouncedSearchValue ? debouncedSearchValue : null,
    //     date_joined_before: rangeDate?.to ? formatDate(rangeDate?.to) : null,
    //     date_joined_after: rangeDate?.from ? formatDate(rangeDate?.from) : null,
    //     // date_added_after}: dateJoined ? formatDate(dateJoined) : null,
    //     is_superuser: 1,
    //     is_active: status >= 0 ? status : null,

    //     ordering: sortBy
    //       ? `${sortType === "asc" ? "" : "-"}${sortBy}`
    //       : "-date_joined",
    //     // eslint-disable-next-line no-unused-vars
    //   }).filter(
    //     // eslint-disable-next-line no-unused-vars
    //     ([_, value]) => value !== "" && value !== undefined && value !== null
    //   )
    // );

    // Try to fetch and handle the response data.
    try {
      // const response = await getExportedCsv(searchKeyObject);

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
      //   downloadCsv(response.data, undefined, "User Permissions.csv");
      // }

      if (users.data?.results?.length) {
        const currentData = users.data?.results?.map((admin) => {
          return {
            id: admin.id,
            name: admin.first_name + " " + admin.last_name,
            first_name: admin.first_name,
            last_name: admin.last_name,
            username: admin.username,
            status: admin.is_active ? "Active" : "Inactive",
            dateJoined: admin?.date_joined
              ? displayBasicDate(admin?.date_joined)
              : "",
          };
        });

        // Reset the state and initiate the CSV file download.
        setCsvDownload(false);
        exportToExcel(currentData, "Admins.xlsx");
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
    <CanSection permissions={["app_api.change_userrank"]}>
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
              <BreadcrumbPage>{t("Admins List")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderText className={"w-full text-start "} text={t("Admins List")} />
        {isFilterMenu && (
          <Card className="w-full">
            <CardHeader>
              <CardDescription>{t("Filter By")}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-start flex-wrap w-full gap-4">
              <Select onValueChange={setStatus} defaultValue={status}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select User Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("Users Status")}</SelectLabel>
                    <SelectItem value={null}>{t("All Status")}</SelectItem>
                    <SelectItem value={1}>{t("Active")}</SelectItem>
                    <SelectItem value={0}>{t("Inactive")}</SelectItem>
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
                    selected={rangeDate}
                    onSelect={(value) => {
                      setRangeDate(value);
                    }}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <div className="flex items-center space-x-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setDebouncedSearchValue(search);
                  }}
                  className="relative"
                >
                  <Input
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    placeholder={`${t("Search by")} ${
                      searchBy === "username"
                        ? "phone number"
                        : searchBy?.replace(/[_\s]/g, " ")
                    }...`}
                    disabled={isLoading}
                    className={"w-[250px]"}
                    value={search}
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
                <Select onValueChange={setSearchBy} defaultValue={searchBy}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Search By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("User Field")}</SelectLabel>
                      <SelectItem value={"username"} className="capitalize">
                        {t("Phone Number")}
                      </SelectItem>
                      <SelectItem value={"first_name"} className="capitalize">
                        {t("First Name")}
                      </SelectItem>
                      <SelectItem value={"last_name"} className="capitalize">
                        {t("Last Name")}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="flex justify-between items-center w-full px-2  py-2">
          {/* <Button onClick={handleAddUser}>Add New User</Button> */}

          <div className="flex items-center gap-3">
            <Can permissions={["app_api.change_userrank"]}>
              <Button
                onClick={() => navigate("/settings/admins/add-new-admin")}
                className="flex items-center gap-1"
              >
                {/* Medium screen and above. */}
                <span className="hidden md:block">
                  <ShieldPlus size={18} />
                </span>
                {/* Small screen. */}
                <span className="md:hidden">
                  <ShieldPlus size={14} />
                </span>
                {t("Add New Admin")}
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
                  {/* Small screen. */}
                  <span className="md:hidden">
                    <Upload size={12} />
                  </span>
                  {t("Export")}
                </p>
              )}
            </Button>
          </div>

          <div className="flex justify-end items-center gap-2 w-full">
            <CustomsItemsPerPage
              setItemPerPage={setItemPerPage}
              itemPerPage={itemPerPage}
            />
            {/* <Button
            variant={isFilterMenu ? "default" : "secondary"}
            onClick={() => {
              setIsFilterMenu(!isFilterMenu)
            }}
          >
            Filter Menu
          </Button>
          <Button onClick={exportFunction} disabled={csvDownload}>
            {csvDownload ? (
              <p className="flex justify-center items-center space-x-2">
                <Loader2 className=" h-5 w-5 animate-spin" />
                <span>Please wait</span>
              </p>
            ) : (
              <span>Export</span>
            )}
          </Button> */}
          </div>
        </Card>

        <WrapperComponent
          isEmpty={!users?.data?.results?.length > 0}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={<DataTableSkeleton columnCount={5} />}
          emptyStateMessage={debouncedSearchValue || dateJoined || status}
        >
          <DataTable
            canView={true}
            to={"/users/details/"}
            columns={columns}
            data={users?.data?.results?.map((admin) => ({
              id: admin.id,
              name: admin.first_name + " " + admin.last_name,
              first_name: admin.first_name,
              last_name: admin.last_name,
              username: admin.username,
              status: admin.is_active,
              warehouse_ids: admin.warehouse_ids,
              is_active: admin.is_active,
              roles: admin.roles,
              dateJoined: admin?.date_joined
                ? displayBasicDate(admin?.date_joined)
                : "",
              actions: admin.id,
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
        <AddWarehouseToUserDialog />
        <AssignRoleToUser />

        <OnChangeStatus
          name={"Admins"}
          heading={t("Are you absolutely sure?")}
          description={`This action will ${
            selectedUser?.is_active ? "Disable" : "Enabled"
          }  "${selectedUser?.username}".`}
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
        <OnDeleteDialog
          name={"Admins"}
          heading={t("Are you absolutely sure?")}
          description={`${t(
            "This action cannot be undone. This will permanently delete this"
          )}  "${selectedUser?.username}".`}
          url={USERS_URL}
          id={selectedUser?.id}
          isDialogOpen={isDeleteUserDialogOpen}
          setIsDialogOpen={setIsDeleteUserDialogOpen}
        />
      </Section>
    </CanSection>
  );
};

export default Users;

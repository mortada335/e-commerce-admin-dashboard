import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { ROLES_URL } from "@/utils/constants/urls";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Section from "@/components/layout/Section";
import WrapperComponent from "@/components/layout/WrapperComponent";
import DataTable from "@/components/ui/DataTable";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Pagination } from "@/components/ui/pagination";
import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";
import { Plus, RotateCcw, ShieldPlus } from "lucide-react";
import CanSection from "@/components/CanSection";
import FiltersMenu from "@/components/filters-ui/FiltersMenu";
import RoleDialog from "./components/RoleDialog";
import RoleEditDialog from "./components/RoleEditDialog";
import OnDeleteDialog from "@/components/Dialogs/OnDelete";
import {
  setIsDeleteRoleDialogOpen,
  setIsFilterMenu,
  setIsRoleDialogOpen,
  setItemPerPage,
  setPage,
  setSelectedRole,
  useRolesStore,
} from "./store";
import columns from "./components/columns";
import FiltersSection from "@/components/filters-ui/FiltersSection";
import Can from "@/components/Can";
import HeaderText from "@/components/layout/header-text";
import ColumnsMenu from "@/components/data-table/ColumnsMenu";
import AssignPermissionToRole from "./components/AssignPermissionToRole";

const Roles = () => {
  const axiosPrivate = useAxiosPrivate();
  const { t,i18n } = useTranslation();
  const {
    selectedRole,
    isDeleteRoleDialogOpen,
    sortBy,
    sortType,
    isFilterMenu,
    itemPerPage,
    page,
  } = useRolesStore();

  const [filters, setFilters] = useState([]);

  const defaultsFilters = [
    {
      title: t("Search By Name"),
      key: "username",
      type: "text",
      value: null,
      placeholder: t("e.g. 7712885482"),
    },
  ];

  const [columnVisibility, setColumnVisibility] = useState({
    id: true,
    name: true,
    actions: true,
  });

  const GetRoles = async (page) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("page_size", itemPerPage);

    params.append(
    "ordering",
    sortBy ? `${sortType === "asc" ? "" : "-"}${sortBy}` : "-date_joined"
  );


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


    return axiosPrivate.get(`${ROLES_URL}?${params.toString()}`);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["Roles", page, itemPerPage, filters, sortBy, sortType,],
    queryFn: () => GetRoles(page),
  });

  const handleAddNewRole = () => {
    setIsRoleDialogOpen(true);
    setSelectedRole(null);
  };


  const totalPages = Math.ceil(data?.data?.count / itemPerPage) || 1;



  return (
    <CanSection permissions={["app_api.change_userrank"]}>
      <Section className="space-y-8 h-fit items-start">
        <Breadcrumb dir={i18n.dir()}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">{t("Home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t("roles")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderText className={"w-full text-start "} text={t("Roles")} />
        <Card className="flex justify-between items-center w-full px-2  py-2 flex-wrap gap-2">
          <FiltersSection
            setPage={setPage}
            value={filters}
            onChange={setFilters}
            isLoading={isLoading}
            isMenuOpen={isFilterMenu}
            searchQueryKey="permission name"
            isFilterMenu={false}
            // setIsMenuOpen={setIsFilterMenu}
          />
          <div className="flex items-center space-x-2">
            <Can permissions={["app_api.change_userrank"]}>
              <Button
                onClick={handleAddNewRole}
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
                {t("Add New Role")}
              </Button>
            </Can>
          </div>
          <div className="flex justify-end items-center flex-wrap gap-2">
            <ColumnsMenu
              columns={columns}
              columnVisibility={columnVisibility}
              setColumnVisibility={setColumnVisibility}
            />
            <CustomsItemsPerPage
              setItemPerPage={setItemPerPage}
              itemPerPage={itemPerPage}
            />
          </div>
        </Card>
        {/* <FiltersMenu
          isLoading={isLoading}
          values={filters}
          onChange={setFilters}
          defaultsFilters={defaultsFilters}
          isMenuOpen={isFilterMenu}
          setIsMenuOpen={setIsFilterMenu}
          setPage={setPage}
        /> */}

        <WrapperComponent
          isEmpty={!data?.data?.results?.length > 0}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={<DataTableSkeleton columnCount={3} />}
          emptyStateMessage={t("No roles found.")}
        >
          <DataTable
          name="Roles"
            columns={columns}
            data={data?.data?.results?.map((role) => ({
              id: role.id,
              name: role.name,
              permissions:
                role.permissions?.length > 0
                  ? role.permissions.join(", ")
                  : t("No Permissions"),
            }))}
          />

          { (data?.data?.next || data?.data?.previous) !== null &&
           <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
            <Pagination
              itemPerPage={itemPerPage}
              next={data?.data?.next}
              previous={data?.data?.previous}
              totalPages={totalPages}
              currentPage={page}
              setPage={setPage}
            />
          </Card>}
        </WrapperComponent>
        <RoleDialog />
        {/* <RoleEditDialog /> */}
        <AssignPermissionToRole/>
        <OnDeleteDialog
          name={"Roles"}
          heading={t("Are you absolutely sure?")}
          description={`${t(
            "This action cannot be undone. This will permanently delete this"
          )}  "${selectedRole?.name}".`}
          url={`${ROLES_URL}/`}
          id={selectedRole?.id + "/"}
          isDialogOpen={isDeleteRoleDialogOpen}
          setIsDialogOpen={setIsDeleteRoleDialogOpen}
        />
      </Section>
    </CanSection>
  );
};

export default Roles;

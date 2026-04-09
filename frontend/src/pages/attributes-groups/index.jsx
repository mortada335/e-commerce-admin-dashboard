import Section from "@/components/layout/Section";
import DataTable from "@/components/ui/DataTable";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";

import { Card } from "@/components/ui/card";
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
import { Link } from "react-router-dom";
import Pagination from "@/components/layout/Pagination";
import columns from "./components/columns";
import { ATTRIBUTES_GROUPS_URL } from "@/utils/constants/urls";

import qs from "qs";
import { Loader2, Plus, Search, Upload } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OnDeleteDialog from "@/components/Dialogs/OnDelete";
import {
  setIsAttributesGroupDialogOpen,
  setIsDeleteAttributesGroupDialogOpen,
  setSelectedAttributesGroup,
  useAttributesGroupStore,
} from "./store";
import { Button } from "@/components/ui/button";
import AttributesGroupDialog from "./components/AttributesGroupDialog";
import { Input } from "@/components/ui/input";
import { getExportedCsv } from "@/utils/apis/attributes-group";
import { toast } from "@/components/ui/use-toast";

import CanSection from "@/components/CanSection";
import Can from "@/components/Can";
import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";
import { exportToExcel } from "@/utils/methods";
import { useTranslation } from "react-i18next";
const AttributesGroups = () => {
  const axiosPrivate = useAxiosPrivate();
  const { t } = useTranslation();

  const {
    isDeleteAttributesGroupDialogOpen,
    selectedAttributesGroup,
    sortBy,
    sortType,
  } = useAttributesGroupStore();
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(null);
  const [search, setSearch] = useState(null);
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState("25");

  const [csvDownload, setCsvDownload] = useState(false);

  const fetchAdminProductsAttributesGroups = async (page) => {
    let searchKeyObject = {};
    searchKeyObject = Object.fromEntries(
      Object.entries({
        name: debouncedSearchValue ? debouncedSearchValue : null,
        ordering: sortBy
          ? `${sortType === "asc" ? "" : "-"}${sortBy}`
          : "-date_added",
      }).filter(([_, value]) => value !== undefined && value !== null)
    );
    return axiosPrivate.get(
      `${ATTRIBUTES_GROUPS_URL}?page=${page}&page_size=${itemPerPage}`,
      {
        params: { ...searchKeyObject },
        paramsSerializer: (params) => qs.stringify(params, { encode: false }),
      }
    );
  };

  const {
    data: attributesGroups,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "AttributesGroups",
      page,
      itemPerPage,
      debouncedSearchValue,
      sortBy,
      sortType,
    ],
    queryFn: () => fetchAdminProductsAttributesGroups(page),
  });

  const totalPages = Math.ceil(attributesGroups?.data?.count / itemPerPage);

  const handleAddAttributesGroup = () => {
    setSelectedAttributesGroup(null);
    setIsAttributesGroupDialogOpen(true);
  };

  const exportCsvHandler = async () => {
    setCsvDownload(true);
    try {
      if (attributesGroups.data?.results?.length) {
        const currentData = attributesGroups.data?.results?.map((group) => {
          return {
            id: group?.attribute_group_id,
            nameEnglish:
              group?.text?.find((item) => item.language_id == 1)?.name ||
              t("no name"),
            nameArabic:
              group?.text?.find((item) => item.language_id == 2)?.name ||
              t("لا يوجد اسم"),
            num_of_attributes: group?.num_of_attributes,
          };
        });

        setCsvDownload(false);
        exportToExcel(currentData, t("Attributes Groups") + ".xlsx");
      }
    } catch (error) {
      setCsvDownload(false);
      toast({
        variant: "destructive",
        title: t("Failed!!!"),
        description: t("An unexpected error occurred. Please try again."),
      });
    }
  };

  return (
    <CanSection permissions={["app_api.view_ocattributegroup","app_api.change_ocattributegroup"]}>
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
              <BreadcrumbPage>{t("Attributes Groups")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <HeaderText
          className={"w-full text-start "}
          text={t("Attributes Groups")}
        />

        <Card className="flex justify-between items-center w-full px-2 py-2 flex-wrap gap-4">
          <div className="flex items-center space-x-2 gap-3">
            <Can permissions={["app_api.add_ocattributegroup"]}>
              <Button
                onClick={handleAddAttributesGroup}
                className="flex items-center gap-1"
              >
                <span className="hidden md:block">
                  <Plus size={18} />
                </span>
                <span className="md:hidden">
                  <Plus size={14} />
                </span>
                {t("Add New Group")}
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
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{t("Please wait")}</span>
                </p>
              ) : (
                <p className="flex items-center gap-2">
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

          <div className="flex justify-end items-center space-x-2 gap-3">
            <CustomsItemsPerPage
              setItemPerPage={setItemPerPage}
              itemPerPage={itemPerPage}
            />
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
                type="text"
                placeholder={t("Search...")}
                disabled={isLoading}
                className={"w-fit"}
              />
              <Button
                className="absolute rtl:left-0 ltr:right-0 rtl:rounded-r-none rtl:rounded-l-md top-0 rounded-l-none rounded-r-md"
                variant="ghost"
                size={"icon"}
                type="submit"
              >
                <Search size={16} />
              </Button>
            </form>
          </div>
        </Card>

        <WrapperComponent
          isEmpty={!attributesGroups?.data?.results?.length > 0}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={<DataTableSkeleton columnCount={5} />}
        >
          <DataTable
            columns={columns}
            data={attributesGroups?.data?.results?.map((group) => ({
              id: group?.attribute_group_id,
              nameEnglish:
                group?.text?.find((item) => item.language_id == 1)?.name ||
                t("no name"),
              nameArabic:
                group?.text?.find((item) => item.language_id == 2)?.name ||
                t("لا يوجد اسم"),
              num_of_attributes: group?.num_of_attributes,
              actions: group?.attribute_group_id,
            }))}
          />

          <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
            <Pagination
              itemPerPage={itemPerPage}
              next={attributesGroups?.data?.next}
              previous={attributesGroups?.data?.previous}
              totalPages={totalPages}
              totalCount={attributesGroups?.data?.count}
              page={page}
              setPage={setPage}
            />
          </Card>
        </WrapperComponent>

        <AttributesGroupDialog />

        <OnDeleteDialog
          name={"AttributesGroups"}
          heading={t("Are you absolutely sure?")}
          description={`${t(
            "This action cannot be undone. This will permanently delete this"
          )} "${selectedAttributesGroup?.nameEnglish}".`}
          url={ATTRIBUTES_GROUPS_URL}
          id={selectedAttributesGroup?.id}
          isDialogOpen={isDeleteAttributesGroupDialogOpen}
          setIsDialogOpen={setIsDeleteAttributesGroupDialogOpen}
        />
      </Section>
    </CanSection>
  );
};


export default AttributesGroups;

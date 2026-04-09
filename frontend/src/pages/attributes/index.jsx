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
import { ATTRIBUTES_URL } from "@/utils/constants/urls";

import { Loader2, Plus, Search, Upload } from "lucide-react";
import qs from "qs";
import OnDeleteDialog from "@/components/Dialogs/OnDelete";
import {
  setIsAttributeDialogOpen,
  setIsDeleteAttributeDialogOpen,
  setSelectedAttribute,
  useAttributeStore,
} from "./store";
import { Button } from "@/components/ui/button";
import AttributeDialog from "./components/AttributeDialog";

import { Input } from "@/components/ui/input";

import { toast } from "@/components/ui/use-toast";

import CanSection from "@/components/CanSection";
import Can from "@/components/Can";
import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";
import { exportToExcel } from "@/utils/methods";
import { useTranslation } from "react-i18next";
const Attributes = () => {
  const axiosPrivate = useAxiosPrivate();
  const {t} = useTranslation()

  const { isDeleteAttributeDialogOpen, selectedAttribute, sortBy, sortType } =
    useAttributeStore();
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(null);

  const [csvDownload, setCsvDownload] = useState(false);

  const [itemPerPage, setItemPerPage] = useState("25");
  const fetchAdminProductsAttributes = async (page) => {
    let searchKeyObject = {};
    searchKeyObject = Object.fromEntries(
      Object.entries({
        name: debouncedSearchValue ? debouncedSearchValue : null,
        ordering: sortBy
          ? `${sortType === "asc" ? "" : "-"}${sortBy}`
          : "-date_added",
        // eslint-disable-next-line no-unused-vars
      }).filter(([_, value]) => value !== undefined && value !== null)
    );
    return axiosPrivate.get(
      `${ATTRIBUTES_URL}?page=${page}&page_size=${itemPerPage}`,
      {
        params: { ...searchKeyObject },
        paramsSerializer: (params) => qs.stringify(params, { encode: false }),
      }
    );
  };

  const {
    data: attributes,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "Attributes",
      page,
      debouncedSearchValue,
      itemPerPage,
      sortBy,
      sortType,
    ],
    queryFn: () => fetchAdminProductsAttributes(page),
  });
  const totalPages = Math.ceil(attributes?.data?.count / itemPerPage); // Assuming 25 items per page

  const handleAddAttribute = () => {
    setSelectedAttribute(null);
    setIsAttributeDialogOpen(true);
  };

  // Handler for exporting the users as a CSV file.
  const exportCsvHandler = async () => {
    // Set the state to indicate loading and disable the button.
    setCsvDownload(true);

    // // Initialize an object to store search params fro API request..
    // let searchKeyObject = {};

    // // Convert an object into an array of [key, value] pairs, filter it, then convert it back to an object.
    // searchKeyObject = Object.fromEntries(
    //   Object.entries({
    //     name: debouncedSearchValue ? debouncedSearchValue : null,
    //     ordering: sortBy
    //       ? `${sortType === "asc" ? "" : "-"}${sortBy}`
    //       : "-date_added",
    //     columns: "attribute_id,attribute_group_id,attribute_group_name,text",
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
      //   downloadCsv(response.data, undefined, "Attributes.csv");
      // }

      if (attributes.data?.results?.length) {

        const currentData = attributes.data?.results?.map((attribute)=> { 

          return {
            

            id: attribute?.attribute_id,
            attribute_group_id: attribute?.attribute_group_id,
            nameEnglish:
              attribute?.text?.find((item) => item.language_id == 1)?.name ||
              "no name",
            nameArabic:
              attribute?.text?.find((item) => item.language_id == 2)?.name ||
              "لا يوجد اسم",

            attribute_group_name: attribute?.attribute_group_name?.find(
              (item) => item.language_id == 1
            )?.name,

            
           
          }
        })

        // Reset the state and initiate the CSV file download.
        setCsvDownload(false);
        exportToExcel(currentData, "Attributes.xlsx");
        
      }
    } catch (error) {
      // Reset the state and notify the user about the error.
      setCsvDownload(false);
      toast({
        variant: "destructive",
        title: t("Failed!!!"),
        description: t("An unexpected error occurred. Please try again."),
      });
    }
  };

  return (
    <CanSection permissions={["app_api.view_ocattribute"]}>
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
              <BreadcrumbPage>{t("Attributes")}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderText className={"w-full text-start "} text={t("Attributes")} />

        <Card className="flex justify-between items-center w-full px-2  py-2 gap-4 flex-wrap">
          <div className="flex items-center space-x-2 gap-4">
            <Can permissions={["app_api.add_ocattribute"]}>
              <Button
                onClick={handleAddAttribute}
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
                {t("Add New Attribute")}
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
                <div className="flex items-center gap-2">
                  {/* Medium screen and above */}
                  <span className="hidden md:block">
                    <Upload size={16} />
                  </span>
                  {/* Small screen */}
                  <span className="md:hidden">
                    <Upload size={12} />
                  </span>
                  <span>

                  {t("Export")}
                  </span>
                </div>
              )}
            </Button>
          </div>
          <div className="flex justify-end items-center gap-2">
          <CustomsItemsPerPage setItemPerPage={setItemPerPage} itemPerPage={itemPerPage}/>
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
                placeholder={t("Search...")}
                disabled={isLoading}
                className={"w-fit"}
              />
              <Button
                className="absolute  rtl:left-0 rtl:rounded-r-none rtl:rounded-l-md top-0 rounded-l-none rounded-r-md"
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
          isEmpty={!attributes?.data?.results?.length > 0}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={<DataTableSkeleton columnCount={5} />}
          emptyStateMessage={
            debouncedSearchValue
              ? t("You don't have any attributes by this filter")
              : t("You don't have any attributes")
          }
        >
          <DataTable
            columns={columns}
            data={attributes?.data?.results?.map((attribute) => ({
              id: attribute?.attribute_id,
              attribute_group_id: attribute?.attribute_group_id,
              nameEnglish:
                attribute?.text?.find((item) => item.language_id == 1)?.name ||
                "no name",
              nameArabic:
                attribute?.text?.find((item) => item.language_id == 2)?.name ||
                "لا يوجد اسم",

              attribute_group_name: attribute?.attribute_group_name?.find(
                (item) => item.language_id == 1
              )?.name,
              actions: attribute?.attribute_id,
            }))}
          />
          <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
            <Pagination
              itemPerPage={itemPerPage}
              next={attributes?.data?.next}
              previous={attributes?.data?.previous}
              totalPages={totalPages}
              totalCount={attributes?.data?.count}
              page={page}
              setPage={setPage}
            />
          </Card>
        </WrapperComponent>
        <AttributeDialog />
        <OnDeleteDialog
          name={"Attributes"}
          heading={t("Are you absolutely sure?")}
          description={t("This action cannot be undone. This will permanently delete this  \"{{name}}\".", { name: selectedAttribute?.nameEnglish })}
          url={ATTRIBUTES_URL}
          id={selectedAttribute?.id}
          isDialogOpen={isDeleteAttributeDialogOpen}
          setIsDialogOpen={setIsDeleteAttributeDialogOpen}
        />
      </Section>
    </CanSection>
  );
};

export default Attributes;

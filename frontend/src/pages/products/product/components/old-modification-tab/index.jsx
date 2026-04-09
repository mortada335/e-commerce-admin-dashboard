import Section from "@/components/layout/Section";
import DataTable from "@/components/ui/DataTable";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import WrapperComponent from "@/components/layout/WrapperComponent";
import HeaderText from "@/components/layout/header-text";

import Pagination from "@/components/layout/Pagination";
import columns from "./components/columns";
import { Old_PRODUCT_MODIFICATIONS_URL } from "@/utils/constants/urls";

import { useModificationStore } from "./store";

import qs from "qs";

import { Loader2 } from "lucide-react";

import { useState } from "react";

import { toast } from "@/components/ui/use-toast";

import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";
import { displayBasicDate, exportToExcel } from "@/utils/methods";

const OldModificationTab = ({ productId = null }) => {
  const axiosPrivate = useAxiosPrivate();
  const { sortType, sortBy } = useModificationStore();

  // CSV download State
  const [csvDownload, setCsvDownload] = useState(null);

  const [itemPerPage, setItemPerPage] = useState("25");
  const [page, setPage] = useState(1);

  const GetAdminOrder = async (page) => {
    // Initialize an object to store search params fro API request.
    let searchKeyObject = {};

    // Convert object to [key, value] array and filter it, then reconvert to a valid {key: value} object.
    searchKeyObject = Object.fromEntries(
      Object.entries({
        product_id: productId,
        ordering: sortBy
          ? `${sortType === "asc" ? "" : "-"}${sortBy}`
          : "-date_added",
        // eslint-disable-next-line no-unused-vars
      }).filter(([_, value]) => value !== undefined && value !== null)
    );

    return axiosPrivate.get(
      `${Old_PRODUCT_MODIFICATIONS_URL}?page=${page}&page_size=${itemPerPage}`,
      {
        params: { ...searchKeyObject },
        paramsSerializer: (params) => qs.stringify(params, { encode: false }),
      }
    );
  };

  const {
    data: modifications,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "old-modifications",
      page,

      sortBy,
      sortType,
      itemPerPage,

      productId,
    ],
    queryFn: () => GetAdminOrder(page),
  });
  const totalPages = Math.ceil(modifications?.data?.count / itemPerPage); // Assuming 25 items per page
  const isChild = productId === null ? true : false;

  // Handler for exporting the modifications list as a CSV file.
  const exportCsvHandler = async () => {
    // Set the state to indicate loading and disable the button.
    setCsvDownload(true);

    try {
      if (modifications?.data?.results?.length) {
        const currentData = modifications.data?.results?.map((modification) => {
          return {
            product_id: modification?.product_id,
            old_info: modification?.old_info,
            new_info: modification?.new_info,
            modifyby: modification?.modifyby,
            noteAdmin: modification?.noteAdmin,
            date_edit: modification?.date_edit,
            date_added: modification?.date_added
              ? displayBasicDate(modification?.date_added)
              : "",
            date_modified: modification?.date_modified
              ? displayBasicDate(modification?.date_modified)
              : "",
          };
        });

        // Reset the state and initiate the CSV file download.
        setCsvDownload(false);
        exportToExcel(currentData, "OldModificationTab.xlsx");
        // downloadCsv(response.data, undefined, "modifications List.csv");
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
    <Section className="space-y-6 h-fit items-start px-0">
      <HeaderText
        className={"w-full text-start "}
        text={"Old Modifications List"}
      />

      <Card className="flex justify-between items-center w-full px-2  py-2 space-x-2">
        <Button disabled={csvDownload} onClick={exportCsvHandler}>
          {csvDownload ? (
            <p className="flex justify-center items-center space-x-2">
              <Loader2 className=" h-5 w-5 animate-spin" />
              <span>Please wait</span>
            </p>
          ) : (
            <span>Export</span>
          )}
        </Button>
        <div className="flex items-center space-x-2">
          <CustomsItemsPerPage
            setItemPerPage={setItemPerPage}
            itemPerPage={itemPerPage}
          />
        </div>
      </Card>

      <WrapperComponent
        isEmpty={!modifications?.data?.length > 0}
        isError={isError}
        error={error}
        isLoading={isLoading}
        loadingUI={<DataTableSkeleton columnCount={5} />}
        emptyStateMessage={"You don't have any modification"}
      >
        <DataTable
          canView={true}
          defaultPagination={true}
          columns={columns}
          data={modifications?.data?.map((modification) => ({
            ...modification,
          }))}
        />
        {/* <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
          <Pagination
            itemPerPage={itemPerPage}
            next={modifications?.data?.next}
            previous={modifications?.data?.previous}
            totalPages={totalPages}
            totalCount={modifications?.data?.count}
            page={page}
            setPage={setPage}
          />
        </Card> */}
      </WrapperComponent>
    </Section>
  );
};

export default OldModificationTab;

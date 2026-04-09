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
import {
  Old_PRODUCT_MODIFICATIONS_URL,
  PRODUCTS_URL,
} from "@/utils/constants/urls";

import { useModificationStore } from "./store";

import qs from "qs";

import { Loader2 } from "lucide-react";

import { useState } from "react";

import { toast } from "@/components/ui/use-toast";

import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";
import { displayBasicDate, exportToExcel } from "@/utils/methods";

const WarehouseTab = ({ productId = null }) => {
  const axiosPrivate = useAxiosPrivate();
  const { sortType, sortBy } = useModificationStore();

  // CSV download State
  const [csvDownload, setCsvDownload] = useState(null);

  const [itemPerPage, setItemPerPage] = useState("25");
  const [page, setPage] = useState(1);

  const GetProductById = async (id) => {
    return axiosPrivate.get(`${PRODUCTS_URL}${id}/`);
  };

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["Product", productId],
    queryFn: () => GetProductById(productId),
    enabled: !!productId,
    onSuccess: (data) => {
      console.log("data", data);
    },
  });

  //   const totalPages = Math.ceil(modifications?.data?.count / itemPerPage); // Assuming 25 items per page
  //   const isChild = productId === null ? true : false;

  // Handler for exporting the modifications list as a CSV file.
  const exportCsvHandler = async () => {
    // Set the state to indicate loading and disable the button.
    setCsvDownload(true);

    try {
      if (data?.data?.warehouses_quantities?.length) {
        const currentData = data?.data?.warehouses_quantities?.map(
          (warehouse) => {
            return {
              warehouse_id: warehouse?.warehouse_id,
              warehouse_name: warehouse?.warehouse_name,
              available_quantity: warehouse?.available_quantity,
              reserved: warehouse?.reserved,
            };
          }
        );

        // Reset the state and initiate the CSV file download.
        setCsvDownload(false);
        exportToExcel(currentData, "WarehouseTab.xlsx");
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
        isEmpty={!data?.data?.warehouses_quantities?.length > 0}
        isError={isError}
        error={error}
        isLoading={isLoading}
        loadingUI={<DataTableSkeleton columnCount={5} />}
        emptyStateMessage={"You don't have any modification"}
      >
        <DataTable
          canView={true}
          defaultPagination={false}
          columns={columns}
          data={data?.data?.warehouses_quantities?.map((warehouse) => ({
            ...warehouse,
          }))}
        />
      </WrapperComponent>
    </Section>
  );
};

export default WarehouseTab;

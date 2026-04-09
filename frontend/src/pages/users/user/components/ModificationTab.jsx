import Pagination from "@/components/layout/Pagination";
import WrapperComponent from "@/components/layout/WrapperComponent";

import { Skeleton } from "@/components/ui/skeleton";

import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { AUDIT_LOGS } from "@/utils/constants/urls";
import contentTypes from "@/utils/contentTypes.json";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

import ChangeTable from "@/elements/changes/ChangeTable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getExportedCsv } from "@/utils/apis/products/modification";
import { toast } from "@/components/ui/use-toast";
import downloadCsv from "download-csv";
import { useTranslation } from "react-i18next";

const ModificationTab = ({userData}) => {
  const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();

  const [page, setPage] = useState(1);

  const [csvDownload, setCsvDownload] = useState(false);

  const GetHistoryOfUser = async (userId) => {
   

    return axiosPrivate.get(`${AUDIT_LOGS}?page=${page}`, {
      params: {
        // resource_type: contentTypes.ocuser,
        object_id:id
      },
    });
  };

  const {
    data: userHistory,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["UserModification", page],
    queryFn: () => GetHistoryOfUser(id),
    enabled: !!id,
  });

  const totalPages = Math.ceil(userHistory?.data?.count / 25); // Assuming 25 items per page
  const {t}= useTranslation()

  // Handler for exporting the users as a CSV file.
  const exportCsvHandler = async () => {
    // Set the state to indicate loading and disable the button.
    setCsvDownload(true);

    const objectReprParam = `OcUser object (${id})`;
    const searchKeyObject = { object_repr: objectReprParam };

    // Try to fetch and handle the response data.
    try {
      const response = await getExportedCsv(searchKeyObject);

      // Handle cases where the response status is not 200.
      if (response.status !== 200) {
        // Reset the state and notify the user about the export failure.
        setCsvDownload(false);
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: `Failed to export due, ${response.message}`,
        });
      }

      // Succesfull request and handle the data.
      if (response.data) {
        // Reset the state and initiate the CSV file download.
        setCsvDownload(false);
        downloadCsv(response.data, undefined, "Modifications.csv");
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
    <div className="flex flex-col justify-start items-center w-full h-full">
      <WrapperComponent
        isEmpty={!userHistory?.data?.results?.length > 0}
        isError={isError}
        error={error}
        isLoading={isLoading}
        loadingUI={
          <div className="grid grid-cols-1 gap-8 place-content-center place-items-center w-full h-full py-4">
            {[1, 2].map((item) => (
              <Skeleton key={item} className="h-[125px] w-[90%] rounded-xl" />
            ))}
          </div>
        }
        emptyStateMessage="There is no changes preview for this user"
      >
        <div className="grid grid-cols-1 gap-8 place-content-center place-items-center w-full h-full py-4 px-4">
          <div className="border w-full p-2 rounded-md">
            <Button onClick={exportCsvHandler} disabled={csvDownload}>
              {csvDownload ? (
                <p className="flex justify-center items-center space-x-2">
                  <Loader2 className=" h-5 w-5 animate-spin" />
                  <span>{t("Please wait")}</span>
                </p>
              ) : (
                <span>{t("Export")}</span>
              )}
            </Button>
          </div>
          {userHistory?.data?.results?.map((item) => (
            <ChangeTable key={item.id} singleChange={item} />
          ))}
        </div>

        <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
          <Pagination
            next={userHistory?.data?.next}
            previous={userHistory?.data?.previous}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
          />
        </Card>
      </WrapperComponent>
    </div>
  );
};

export default ModificationTab;

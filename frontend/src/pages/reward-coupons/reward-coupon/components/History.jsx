import DataTable from "@/components/ui/DataTable";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";
import { COUPON_HISTORY_URL } from "@/utils/constants/urls";
import { useQuery } from "@tanstack/react-query";
import Columns from "./Columns";
import { Loader2, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import Pagination from "@/components/layout/Pagination";
import { useState } from "react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import WrapperComponent from "@/components/layout/WrapperComponent";
import { useTranslation } from "react-i18next";

const History = () => {
  // Get selected coupon id.
  const { id: coupon_id } = useParams();
  // Current page.
  const [page, setPage] = useState(1);
  // Items per page.
  const [itemsPerPage, setItemsPerPage] = useState("10");

  // Axios private to fetch coupon history.
  const axiosPrivate = useAxiosPrivate();
  const {t} = useTranslation()

  // Fetch coupon history function.
  const getCouponHistoryDetails = async () => {
    const { data } = await axiosPrivate.get(
      `${COUPON_HISTORY_URL}?page=${page}&page_size=${itemsPerPage}`,
      {
        params: {
          coupon_id,
        },
      }
    );

    return data;
  };

  // Get coupon history with use query.
  const { data: couponHistory, isLoading,isError,error } = useQuery({
    queryKey: ["history", itemsPerPage, page,coupon_id],
    queryFn: getCouponHistoryDetails,
    enabled: !!coupon_id,
  });

  const totalPages = Math.ceil(couponHistory?.count / itemsPerPage); // Assuming 25 items per page

 

  return (

    <WrapperComponent
    isEmpty={!couponHistory?.results.length}
    isError={isError}
    error={error}
    isLoading={isLoading}
    loadingUI={
      <div className="w-full flex items-center space-x-2 justify-center mt-20">
      <Loader2 size={24} className="animate-spin" />
      <span>{t("Please wait")}</span>
    </div>
    }
    emptyStateMessage="You don't have any History for this promo code"
  >
    <Card className="flex items-center gap-2 mb-4 p-2">
            <Select
              defaultValue={itemsPerPage}
              value={itemsPerPage}
              onValueChange={setItemsPerPage}
            >
              <SelectTrigger className="w-20" def>
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("Items Per Page")}</SelectLabel>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Clear filters button - Reset items to 10. */}
            {itemsPerPage !== "10" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setItemsPerPage("10")}
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
            )}
          </Card>
          <DataTable
            data={couponHistory ? couponHistory?.results : []}
            columns={Columns}
          />
          <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full mt-4">
         
            <Pagination
              itemPerPage={itemsPerPage}
              next={couponHistory?.next}
              previous={couponHistory?.previous}
              totalPages={totalPages}
              totalCount={couponHistory?.count}
              page={page}
              setPage={setPage}
            />
          </Card>
  </WrapperComponent>
   
  );
};

export default History;

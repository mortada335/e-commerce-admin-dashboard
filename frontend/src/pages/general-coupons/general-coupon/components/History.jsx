import DataTable from "@/components/ui/DataTable";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";
import { COUPON_HISTORY_URL } from "@/utils/constants/urls";
import { useQuery } from "@tanstack/react-query";
import Columns from "./Columns";
import { CalendarIcon, Loader2, RotateCcw, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/methods";
import Text from "@/components/layout/text";
import qs from "qs";
import { useGeneralCouponStore } from "../../store";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import { useTranslation } from "react-i18next";

const History = () => {
  // Get selected coupon id.
  const { id: coupon_id } = useParams();
  // Current page.
  const [page, setPage] = useState(1);
  const [dateAdded, setDateAdded] = useState(null);
  // Items per page.
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [isFilterMenu, setIsFilterMenu] = useState(false);
  // Axios private to fetch coupon history.
  const axiosPrivate = useAxiosPrivate();
  const {t} = useTranslation()
  const clearFilters = () => {
 
    setDateAdded(null);
 

    setIsFilterMenu(false);
    setPage(1);



  };
    const {

      historySortBy,
      historySortType,
     
    } = useGeneralCouponStore();
  // Fetch coupon history function.
  const getCouponHistoryDetails = async () => {

    let searchKeyObject = {};
    searchKeyObject = Object.fromEntries(
      Object.entries({
        coupon_id:coupon_id,
        date_added_after: dateAdded?.from ? formatDate(dateAdded?.from) : null,
        date_added_before: dateAdded?.to ? formatDate(dateAdded?.to) : null,
       
     
        ordering: historySortBy
          ? `${historySortType === "asc" ? "" : "-"}${historySortBy}`
          : "-date_added",
        // eslint-disable-next-line no-unused-vars
      }).filter(([_, value]) => value !== undefined && value !== null)
    );

    const { data } = await axiosPrivate.get(
      `${COUPON_HISTORY_URL}?page=${page}&page_size=${itemsPerPage}`,
       {
              params: { ...searchKeyObject },
              paramsSerializer: (params) => qs.stringify(params, { encode: false }),
            }
    
    );

    return data;
  };

  // Get coupon history with use query.
  const { data: couponHistory, isLoading,isError,error } = useQuery({
    queryKey: ["history", itemsPerPage, page,coupon_id,dateAdded,historySortBy,historySortType],
    queryFn: getCouponHistoryDetails,
    enabled: !!coupon_id,
  });

  const totalPages = Math.ceil(couponHistory?.count / itemsPerPage); // Assuming 25 items per page

  const isFilter =
   dateAdded 
    ? true
    : false;

  return (
    <>

       {isFilterMenu && (
          <Card className="w-full">
            <CardHeader>
              <CardDescription>{t("Filter By")}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-start flex-wrap w-full gap-4">


              <Popover>
                <PopoverTrigger asChild>
                  <Card className="flex justify-between items-center space-y-0 space-x-0">
                    <Button
                      variant={"ghost"}
                      className={cn(
                        " w-fit text-left font-normal rounded-none flex justify-start items-center",
                        !dateAdded && "text-muted-foreground w-[180px]"
                      )}
                    >
                      {dateAdded ? (
                        <p className="space-x-2 flex">
                          <span>{formatDate(dateAdded?.from)}</span>
                          {dateAdded?.to && <span>/</span>}

                          {dateAdded?.to && (
                            <span>{formatDate(dateAdded?.to)}</span>
                          )}
                        </p>
                      ) : (
                        <>
                          {t("Pick Added Range")}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </>
                      )}
                    </Button>
                    {dateAdded && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            {" "}
                            <Button
                              variant={"ghost"}
                              size="icon"
                              className="rounded-none"
                              onClick={() => {
                                setDateAdded(null);
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
                    selected={dateAdded}
                    onSelect={(value) => {
                      setDateAdded(value);
                      setPage(1)
                    }}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>



            </CardContent>
          </Card>
        )}
    <Card className="flex justify-end items-center gap-2 mb-4 p-2">
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
          <Button
              variant={isFilterMenu ? "default" : "outline"}
              onClick={() => {
                setIsFilterMenu(!isFilterMenu);
              }}
            >
              {t("Filter Menu")}
            </Button>
            {/* Clear filters button - Reset items to 10. */}
            {isFilter&& (
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
            )}
          </Card>
          <WrapperComponent
    isEmpty={!couponHistory?.results.length}
    isError={isError}
    error={error}
    isLoading={isLoading}
    loadingUI={<DataTableSkeleton columnCount={5} />}
    emptyStateMessage={
            isFilter
              ? t("You don't have any promo code history by this filter")
              : t("You don't have any promo code history get started by creating a new one.")
          }
  >
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
   </>
  );
};

export default History;

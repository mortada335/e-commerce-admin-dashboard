import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import HeaderText from "@/components/layout/header-text";
import WrapperComponent from "@/components/layout/WrapperComponent";
import { Card } from "@/components/ui/card";
import DataTable from "@/components/ui/DataTable";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { ADMIN_ORDER_TASKS_HISTORY } from "@/utils/constants/urls";
import { displayBasicDate } from "@/utils/methods";
import { useQuery } from "@tanstack/react-query";
import columns from "./components/columns";
import Pagination from "@/components/layout/Pagination";
import { useState } from "react";
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

// import { Button } from "@/components/ui/button";
// import { CalendarIcon, Text, X } from "lucide-react";
import { useRewardHistoryPoints } from "./store";
import { useTranslation } from "react-i18next";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { Calendar } from "@/components/ui/calendar";
// import { cn } from "@/lib/utils";
// import { formatDate } from "@/utils/methods";

const OrderTasks = ({ id }) => {
  const { sortType, sortBy } = useRewardHistoryPoints();
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(false);
  const {t} = useTranslation()

  // const [addedDate, setAddedDate] = useState(null);

  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState("5");

  const axiosPrivate = useAxiosPrivate();

  const fetchAdminOrderTasks = async (page) => {
    let searchKeyObject = {};

    // Convert object to [key, value] array and filter it, then reconvert to a valid {key: value} object.
    searchKeyObject = Object.fromEntries(
      Object.entries({
        // date_added: addedDate ? formatDateToISO(addedDate) : null,
        ordering: sortBy
          ? `${sortType === "asc" ? "" : "-"}${sortBy}`
          : "-date_added",
        // eslint-disable-next-line no-unused-vars
      }).filter(([_, value]) => value !== undefined && value !== null)
    );

    try {
      const response = await axiosPrivate.get(
        `${ADMIN_ORDER_TASKS_HISTORY}?page=${page}&page_size=${itemPerPage}&customer_id=${id}`,
        {
          params: { ...searchKeyObject },
          paramsSerializer: (params) => qs.stringify(params, { encode: false }),
        }
      );

      return response;
      // ...
    } catch (error) {
      // Handle the error
      setIsError(true);
      setError(error);
      return error;
    }
  };

  const { data: adminOrderTasksHistory, isLoading } = useQuery({
    queryKey: [
      "orderTasks",
      page,
      itemPerPage,
      id,
      sortBy,
      sortType,
      // addedDate,
    ],
    queryFn: () => fetchAdminOrderTasks(page),
    enabled: !!id,
  });

  const adminOrderTasks = adminOrderTasksHistory?.data?.results;

  const totalPages = Math.ceil(
    adminOrderTasksHistory?.data?.count / itemPerPage
  ); // Assuming 25 items per page

  return (
    <>
      <Card className="w-full p-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <HeaderText
            className={"w-full text-start pb-6"}
            text={t("Scheduled Rewards Points")}
          />
          <div className="flex justify-end items-center w-full px-2  py-2 flex-wrap gap-4">
            <Select onValueChange={setItemPerPage} defaultValue={itemPerPage}>
              <SelectTrigger className="w-full sm:w-fit">
                <SelectValue placeholder={t("Select item per page")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("Item per page")}</SelectLabel>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* <Popover>
              <PopoverTrigger asChild>
                <Card className="flex justify-between items-center space-y-0 space-x-0 w-full md:w-fit min-w-44">
                  <Button
                    variant={"ghost"}
                    className={cn(
                      "w-full text-left !text-xs font-normal rounded-none flex justify-start items-center",
                      !addedDate && "text-muted-foreground md:w-[180px]"
                    )}
                  >
                    {addedDate ? (
                      formatDate(addedDate)
                    ) : (
                      <>
                        Date Added
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </>
                    )}
                  </Button>
                  {addedDate && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {" "}
                          <Button
                            variant={"ghost"}
                            size="icon"
                            className="rounded-none"
                            onClick={() => {
                              setAddedDate(null);
                            }}
                          >
                            <X className=" h-4 w-4 opacity-50" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <Text text={"Clear"} />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Card>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={addedDate}
                  onSelect={(value) => {
                    setAddedDate(value);
                  }}
                  disabled={(date) => date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover> */}
          </div>
        </div>
        <WrapperComponent
          isEmpty={!adminOrderTasks?.length > 0}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={<DataTableSkeleton columnCount={5} />}
        >
          <DataTable
            columns={columns}
            data={adminOrderTasks?.map((taskOrder) => ({
              id: taskOrder.id,
              customer_id: taskOrder.customer_id,
              order_id: taskOrder.order_id,
              points: taskOrder.points,
              is_active: taskOrder.is_active,
              extras: taskOrder.extras,
              date_added: taskOrder?.date_added
                ? displayBasicDate(taskOrder?.date_added)
                : "/",
            }))}
          />
          <Card className="flex items-center justify-center space-x-2 py-2 px-0 w-full">
            <Pagination
              itemPerPage={itemPerPage}
              next={adminOrderTasks?.data?.next}
              previous={adminOrderTasks?.data?.previous}
              totalPages={totalPages}
              totalCount={adminOrderTasks?.data?.count}
              page={page}
              setPage={setPage}
            />
          </Card>
        </WrapperComponent>
      </Card>
    </>
  );
};

export default OrderTasks;

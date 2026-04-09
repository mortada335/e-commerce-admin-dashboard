
import Section from "@/components/layout/Section";
import WrapperComponent from "@/components/layout/WrapperComponent";

import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";

import { useQuery } from "@tanstack/react-query";


import { useState, useEffect } from "react";


import { Card } from "@/components/ui/card";




import CustomsItemsPerPage from "@/components/ui/customs-items-per-page";



import { cn } from "@/lib/utils";



import columns from "./components/columns";
import { toast } from "sonner";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReportsSummary from "./components/ReportsSummary";
import { ORDERS_BY_CITY_URL } from "@/utils/constants/urls";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import DataTable from "@/components/ui/DataTable";

import CustomRangeDatePicker from "@/components/ui/custom-range-date-picker";
import { advancedExportToExcel, formatText } from "@/utils/methods";
import { useTranslation } from "react-i18next";



const OrdersByCityReports = ({children}) => {
  const [filters, setFilters] = useState([]);
  const [itemPerPage, setItemPerPage] = useState("15");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState(null);
  const [sortType, setSortType] = useState("desc");

  const {t}=useTranslation()
  const [rangeDate, setRangeDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).toISOString().split("T")[0];
    const lastDay = new Date(year, month + 1, 0).toISOString().split("T")[0];
    return { from: firstDay, to: lastDay };
  });


  const [columnVisibility, setColumnVisibility] = useState({
    globalIndex: true,
    id: true,
    customer: true,
    unit: true,
    "unit.block": true,
    "unit.block.zone": true,
    amount: true,
    remaining_amount: true,
    pay_status: true,
    bill_type: true,
    created_at: true,
    pay_date_at: true,
    actions: true,
  });


  const [rowSelection, setRowSelection] = useState({});


  const axiosPrivate = useAxiosPrivate();

  const getReport = async () => {
    // Create filter object for POST request
 

       const params = new URLSearchParams();

    params.append("start_date", rangeDate.from);
    params.append("end_date", rangeDate.to);

  


    return axiosPrivate.get(`${ORDERS_BY_CITY_URL}?${params.toString()}`);
     
  };

  const {
    isLoading,
    isError,
    data: report,
    error,
  } = useQuery({
    queryKey: [
      "orders-by-city-reports",
      sortBy,
      sortType,
      page,
      itemPerPage,
      filters,
      rangeDate
    ],
    queryFn: getReport,
  });

  const totalPages = Math.ceil(report?.data?.data?.total / itemPerPage);
    const results = report?.data ? report.data : []

// Handler for exporting the bill reports as an Excel file
const exportExcelHandler = async () => {
  try {
    if (results?.length) {
      // Prepare main city data
      const currentData = results?.map((report) => ({
        name: report?.name,
        order_count: report?.order_count || 0,
        areas: report?.areas || [],
      }));

      // Calculate aggregates
      const highestCity = (results && results.length > 0)
        ? results.reduce((max, city) =>
        city.order_count > max.order_count ? city : max,
        results[0]
        )
        : { name: "", order_count: 0 };

        const allAreas = results?.flatMap(city => city.areas || []);
        const highestArea = (allAreas && allAreas.length > 0)
          ? allAreas.reduce((max, area) =>
            area.order_count > max.order_count ? area : max,
            allAreas[0]
            )
          : { name: "", order_count: 0 };

          
// 3️⃣ Total orders count (sum of all cities)
        const totalOrders = results?.reduce((sum, city) => sum + city.order_count, 0) || 0;
        const totalCities = results?.length || 0;

const summaryRows = [
  { label: t("Highest City"), value: `${highestCity.name} (${highestCity.order_count})` },
  { label: t("Highest Area"), value: `${highestArea.name} (${highestArea.order_count})` },
  { label: t("Total Orders"), value: totalOrders },
  { label: t("Total Cities"), value: totalCities },
];


     

      // Define headers (simple version since your groupedHeaders is bill-specific)
      const groupedHeaders = [
        {
          label: t("City Report"),
          keys: [
            { label: t("City Name"), key: "name" },
            { label: t("Orders Count"), key: "order_count" },
            { label: t("Areas"), key: "areas" },
          ],
          groupStyle: {
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFDDEBF7" } },
            font: { bold: true },
            alignment: { horizontal: "center", vertical: "middle" },
          },
        },
      ];

      // Export
      advancedExportToExcel(
        currentData,
        `${formatText("orders-by-cities-report")} ${rangeDate.from}-${rangeDate.to}.xlsx`,
        true,
        groupedHeaders,
        summaryRows
      );
    }
  } catch (error) {
    toast(t("Failed!!!: An unexpected error occurred. Please try again."));
  }
};







  // 1️⃣ Highest city order count
  const highestCity = (results && results.length > 0)
    ? results.reduce((max, city) =>
        city.order_count > max.order_count ? city : max,
        results[0]
        )
     : { name: "", order_count: 0 };

// 2️⃣ Highest area order count (search all areas in all cities)
const allAreas = results?.flatMap(city => city.areas || []);
const highestArea = allAreas?.reduce((max, area) =>
  area.order_count > max.order_count ? area : max,
  { name: "", order_count: 0 }
);

// 3️⃣ Total orders count (sum of all cities)
const totalOrders = results?.reduce((sum, city) => sum + city.order_count, 0);
const totalCities = results?.length;

const summary={
  total_orders:totalOrders,
  total_cities:totalCities,
  highest_city:highestCity,
  highest_area:highestArea,

}
  return (

      <>
      
        
        <Card className={cn("flex flex-col md:flex-row flex-wrap justify-between rtl:flex-row-reverse items-center w-full h-fit px-4 py-3 md:py-2 gap-4")}>

          {children}
          <div className="flex flex-wrap flex-row justify-end items-center gap-2">
          <CustomRangeDatePicker range={rangeDate} setRange={setRangeDate} />
            <Button
              size={"sm"}
              className="w-full md:w-fit flex gap-1"
              onClick={exportExcelHandler}
            >
              <Download size={12} /> 
              <span>
              {t("Export")}
              </span>
         
            </Button>
           

        
          </div>
        </Card>

        {/* Summary Statistics */}
        {results && results?.length > 0 && (
          <ReportsSummary summary={summary} date={rangeDate}/>
        )}

        <WrapperComponent
          isEmpty={results?.length === 0}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={<DataTableSkeleton columnCount={5} />}
          emptyStateMessage={t("No orders by city reports found")}
        >


          <DataTable
            name="orders-by-city-reports"
            columns={columns}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            defaultPagination={true}
            data={
              (results && Array.isArray(results)) 
                ? results?.map((report) => ({
                    ...report,
                  }))
                : []
            }
          />
          
        
        </WrapperComponent>
      </>

  );
};

export default OrdersByCityReports; 
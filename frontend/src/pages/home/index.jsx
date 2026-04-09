import Section from "@/components/layout/Section";
import WrapperComponent from "@/components/layout/WrapperComponent";
import { Building2, ClipboardList, FileText, Grid2x2, Package, ShoppingBag, Users } from "lucide-react";
import { displayBasicDate, formatNumberWithCurrency } from "@/utils/methods";

import DataTable from "@/components/ui/DataTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LineGraph from "@/components/Charts/Line";
import {
  getBarChartConfig,
  getDoughnutChartConfig,
  getLineChartConfig,
} from "@/lib/chartjs/chartjsConfig";
import BarGraph from "@/components/Charts/Bar";
import DoughnutChart from "@/components/Charts/DoughnutChart";
import { Separator } from "@/components/ui/separator";
import {
  CATEGORIES_URL,
  DASHBOARD_CHARTS_URL,
  DASHBOARD_STATISTICS_URL,
  ENUMS_URL,
  PRODUCTS_URL,
  SCHEDULED_NOTIFICATION_URL,
  WAREHOUSES_URL,
} from "@/utils/constants/urls";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import {
  top5CustomerUsersHeaders,
  validatedTop5PurchaseTotalCustomersHeaders,
} from "./components/columns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { setStatus } from "../orders/store";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import Can from "@/components/Can";
import { useTranslation } from "react-i18next";
import { useHomeStore } from "@/pages/home/store";
import ordersColumns from "@/pages/orders/components/columns";
import { ORDERS_URL } from "@/utils/constants/urls";

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { t } = useTranslation()
  const { selectedWarehouseId, isSuperuser } = useHomeStore()
  const fetchDashboardStatistics = async () => {
    const params = new URLSearchParams();
    if (!isSuperuser && selectedWarehouseId) {
      params.append("warehouse_id", selectedWarehouseId);
    }
    const qs = params.toString();
    return axiosPrivate.get(`${DASHBOARD_STATISTICS_URL}${qs ? `?${qs}` : ""}`);
  };
//   const fetchEnums = async () => {
//     return axiosPrivate.get(ENUMS_URL);
//   };

//   const {
//     data: Enums,

//   } = useQuery({
//     queryKey: ["fetchEnums"],
//     queryFn: () => fetchEnums(),
//   });

// console.log(Enums);


  const {
    data: dashboardStatistics,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["DashboardStatistics", selectedWarehouseId, isSuperuser],
    queryFn: () => fetchDashboardStatistics(),
  });
  const fetchDashboardCharts = async () => {
    const params = new URLSearchParams();
    if (!isSuperuser && selectedWarehouseId) {
      params.append("warehouse_id", selectedWarehouseId);
    }
    const qs = params.toString();
    return axiosPrivate.get(`${DASHBOARD_CHARTS_URL}${qs ? `?${qs}` : ""}`);
  };

  const {
    data: chartsData,
    error: chartError,
    isLoading: isChartsDataLoading,
    isError: isChartsDataError,
  } = useQuery({
    queryKey: ["DashboardCharts", selectedWarehouseId, isSuperuser],
    queryFn: () => fetchDashboardCharts(),
  });
  const fetchLatestOrders = async () => {
    const params = new URLSearchParams();
    // page size small for dashboard preview
    params.append("page", 1);
    params.append("page_size", 6);
    if (!isSuperuser && selectedWarehouseId) {
      params.append("warehouse_id", selectedWarehouseId);
    }
    const qs = params.toString();
    return axiosPrivate.get(`${ORDERS_URL}?${qs}`);
  };

  const {
    data: latestOrders,
    error: latestOrdersError,
    isLoading: isLatestOrdersLoading,
    isError: isLatestOrdersError,
  } = useQuery({
    queryKey: ["HomeLatestOrders", selectedWarehouseId, isSuperuser],
    queryFn: () => fetchLatestOrders(),
  });

  const fetchProducts = async () => {
    const params = new URLSearchParams();
    params.append("page", 1);
    params.append("page_size", 6);
    if (!isSuperuser && selectedWarehouseId) {
      params.append("warehouse_id", selectedWarehouseId);
    }
    const qs = params.toString();
    return axiosPrivate.get(`${PRODUCTS_URL}?${qs}`);
  }

  const {
    data: Products,
    error: ProductsError,
    isLoading: ProductsIsLoading,
    isError: ProductsIsError,
  } = useQuery({
    queryKey: ["Products", selectedWarehouseId, isSuperuser],
    queryFn: () => fetchProducts(),
  });

  const fetchWarehouses = async ()=>{
    const params = new URLSearchParams();
    params.append("page", 1);
    params.append("page_size", 6);
    if (!isSuperuser && selectedWarehouseId) {
      params.append("warehouse_id", selectedWarehouseId);
    }
    const qs = params.toString();
    return axiosPrivate.get(`${WAREHOUSES_URL}?${qs}`);
  }
    const {
    data: Warehouses,

  } = useQuery({
    queryKey: ["Warehouses"],
    queryFn: () => fetchWarehouses(),
  });

    const fetchCategories = async ()=>{
    const params = new URLSearchParams();
    params.append("page", 1);
    params.append("page_size", 6);
    if (!isSuperuser && selectedWarehouseId) {
      params.append("warehouse_id", selectedWarehouseId);
    }
    const qs = params.toString();
    return axiosPrivate.get(`${CATEGORIES_URL}?${qs}`);
  }
    const {
    data: Categories,

  } = useQuery({
    queryKey: ["Categories"],
    queryFn: () => fetchCategories(),
  });

  const chartJsCustomColors = {
    white: "#fff",
    yellow: "#ffe802",
    success: "#00b893",
    primary: "#3b9cff",
    areaChartBlue: "#2c9aff",
    barChartYellow: "#ffcf5c",
    polarChartGrey: "#4f5d70",
    polarChartInfo: "#299aff",
    lineChartYellow: "#d4e157",
    polarChartGreen: "#28dac6",
    lineChartPrimary: "#9e69fd",
    lineChartWarning: "#ff9800",
    horizontalBarInfo: "#26c6da",
    polarChartWarning: "#ff8131",
    scatterChartGreen: "#28c76f",
    warningShade: "#ffbd1f",
    areaChartBlueLight: "#84d0ff",
    areaChartGreyLight: "#edf1f4",
    scatterChartWarning: "#ff9f43",
  };

  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [
      {
        fill: false,
        tension: 0,
        pointRadius: 5,
        label: "",
        pointHoverRadius: 5,
        pointStyle: "circle",
        borderColor: chartJsCustomColors.primary,
        backgroundColor: chartJsCustomColors.primary,
        pointHoverBorderWidth: 5,
        pointHoverBorderColor: chartJsCustomColors.white,
        pointBorderColor: "transparent",
        pointHoverBackgroundColor: chartJsCustomColors.primary,
        data: [],
      },
    ],
  });
  const [barDate, setBarDate] = useState({
    labels: [],
    datasets: [
      {
        label: t("Orders Count"),
        maxBarThickness: 15,
        backgroundColor: chartJsCustomColors.primary,
        borderColor: "transparent",
        borderRadius: {
          topRight: 15,
          topLeft: 15,
        },
        data: [],
      },
      {
        label: t("New Customers Count"),
        maxBarThickness: 15,
        backgroundColor: chartJsCustomColors.success,
        borderColor: "transparent",
        borderRadius: {
          topRight: 15,
          topLeft: 15,
        },
        data: [],
      },
    ],
  });

  useEffect(() => {
    if (chartsData?.data) {
      const labels = Object.keys(chartsData.data).map((key) => {
        const [year, month] = key.split("-");
        return `${year.slice(2)}/${month}`;
      });
      const ordersData = Object.keys(chartsData.data).map(
        (key) => chartsData?.data[key]?.orders_count
      );
      const newCustomersData = Object.keys(chartsData.data).map(
        (key) => chartsData.data[key]?.new_customers_count
      );
      const totalSalesData = Object.keys(chartsData.data).map(
        (key) => chartsData.data[key]?.total_sales
      );

      setLineData({
        labels: labels,
        datasets: [
          {
            fill: false,
            tension: 0,
            pointRadius: 5,
            label: t("Total Sales"),
            pointHoverRadius: 5,
            pointStyle: "circle",
            borderColor: chartJsCustomColors.primary,
            backgroundColor: chartJsCustomColors.primary,
            pointHoverBorderWidth: 5,
            pointHoverBorderColor: chartJsCustomColors.white,
            pointBorderColor: "transparent",
            pointHoverBackgroundColor: chartJsCustomColors.primary,
            data: totalSalesData,
          },
        ],
      });
      setBarDate({
        labels: labels,
        datasets: [
          {
            label: t("Orders Count"),
            maxBarThickness: 15,
            backgroundColor: chartJsCustomColors.primary,
            borderColor: "transparent",
            borderRadius: {
              topRight: 15,
              topLeft: 15,
            },
            data: ordersData,
          },
          {
            label: t("New Customers Count"),
            maxBarThickness: 15,
            backgroundColor: chartJsCustomColors.success,
            borderColor: "transparent",
            borderRadius: {
              topRight: 15,
              topLeft: 15,
            },
            data: newCustomersData,
          },
        ],
      });
    }
  }, [chartsData]);

  const doughnutData = {
    labels: [t("Orders"), t("Customers")],
    datasets: [
      {
        borderWidth: 0,
        label: t("Total"),
        data: [
          dashboardStatistics?.data?.total_number_orders,
          dashboardStatistics?.data?.total_customers,
        ],
        backgroundColor: [
          chartJsCustomColors.primary,
          chartJsCustomColors.success,
          chartJsCustomColors.polarChartWarning,
          chartJsCustomColors.polarChartInfo,
          chartJsCustomColors.polarChartGrey,
          chartJsCustomColors.polarChartGreen,
        ],
      },
    ],
  };

  const handleNewOrdersButton = () => {
    navigate("/sales/orders");

    setStatus(1);
  };

  return (
    <Section
      className={
        "flex-col xl:flex-row w-full h-fit gap-4 justify-start items-center  py-4 "
      }
    >
      <div className="flex flex-col w-full h-full justify-start items-start space-y-4">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Orders */}
          <div className="bg-card text-card-foreground rounded-lg p-4  border border-border relative flex items-center justify-between">
            <div className="flex-1 text-right pr-4 truncate">
              <p className="text-muted-foreground text-xs truncate">{t("Total Orders")}</p>
              <p className="text-base font-bold truncate">
                {formatNumberWithCurrency(dashboardStatistics?.data?.total_amount_of_orders || 0, "IQD")}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-400 rounded-full flex-shrink-0 flex items-center justify-center text-primary-foreground text-lg">
              <FileText className="text-white/70" />
            </div>
          </div>

        {/* Warehouses */}
        <div className="bg-card text-card-foreground rounded-lg p-4 shadow-sm border border-border relative flex items-center justify-between">
            <div className="flex-1 text-right pr-4 truncate">
              <p className="text-muted-foreground text-xs truncate">{t("Warehouses Count")}</p>
              <p className="text-base font-bold truncate">{Warehouses?.data?.count}</p>
            </div>
            <div className="w-10 h-10 bg-purple-900 rounded-full flex-shrink-0 flex items-center justify-center text-primary-foreground text-lg">
              <Building2 className="text-white/70" />
            </div>
          </div>

          {/* Products */}
          <div className="bg-card text-card-foreground rounded-lg p-4 shadow-sm border border-border relative flex items-center justify-between">
            <div className="flex-1 text-right pr-4 truncate">
              <p className="text-muted-foreground text-xs truncate">{t("Total Products")}</p>
              <p className="text-base font-bold truncate">{Products?.data?.count}</p>
            </div>
            <div className="w-10 h-10 bg-blue-400  rounded-full flex-shrink-0 flex items-center justify-center text-primary-foreground text-lg">
              <Package className="text-white/70" />
            </div>
          </div>

  
        {/* Categories */}
          <div className="bg-card text-card-foreground rounded-lg p-4 shadow-sm border border-border relative flex items-center justify-between">
            <div className="flex-1 text-right pr-4 truncate">
              <p className="text-muted-foreground text-xs truncate">{t("Categories Count")}</p>
              <p className="text-base ont-bold truncate">{Categories?.data?.count}</p>
            </div>
            <div className="w-10 h-10 bg-green-400 rounded-full flex-shrink-0 flex items-center justify-center text-primary-foreground text-lg">
              <Grid2x2 className="text-white/70" />
            </div>
          </div>
        </div>
        <WrapperComponent
          isEmpty={false}
          isError={isChartsDataError}
          error={chartError}
          isLoading={isChartsDataLoading}
          loadingUI={
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full h-fit">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <Skeleton className={"h-[200px] w-full"} />
            </div>
          }
          emptyStateMessage={t("There is no user data")}
        >
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full h-fit">
            <Card className="w-full h-full">
              <CardHeader>
                <CardDescription>{t("Total Sales")}</CardDescription>
                <CardTitle>
                  {formatNumberWithCurrency(dashboardStatistics?.data?.total_amount_of_orders || 0, "IQD")}
                </CardTitle>
              </CardHeader>
              <CardContent className="w-full h-full">
                <LineGraph options={getLineChartConfig} data={lineData} />
              </CardContent>
            </Card>
            <Card className=" w-full h-full">
              <CardHeader>
                <CardDescription className=" !text-sm">
                  {t("Orders and Customers")}
                </CardDescription>
                <CardTitle className="!font-semibold !text-xl">
                  {t("Orders")} {dashboardStatistics?.data?.total_number_orders} -
                  {t("Customers")} {dashboardStatistics?.data?.total_customers}
                </CardTitle>
              </CardHeader>
              <CardContent className="w-full h-full">
                <BarGraph options={getBarChartConfig} data={barDate} />
              </CardContent>
            </Card>
          </div>
        </WrapperComponent>
        <WrapperComponent
          isEmpty={false}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={<DataTableSkeleton columnCount={5} />}
          emptyStateMessage={t("There is no user data")}
        >
<div className="flex flex-col xl:flex-row w-full gap-4">
  {/* Latest Orders */}
  <Card className="w-full xl:w-1/2 rounded-xl border border-border bg-card">
    <CardHeader className="px-6 py-4 border-b border-border">
      <CardTitle className="text-xl font-medium text-gray-800 capitalize">
        {t("Latest Orders")}
      </CardTitle>
    </CardHeader>
    <CardContent className="px-4 py-4">
      <WrapperComponent
        isEmpty={!latestOrders?.data?.results?.length > 0}
        isError={isLatestOrdersError}
        error={latestOrdersError}
        isLoading={isLatestOrdersLoading}
        loadingUI={<DataTableSkeleton columnCount={5} />}
        emptyStateMessage={t("You don't have any orders")}
      >
        <DataTable
          canView={true}
          to={"/sales/orders/details/"}
          columns={ordersColumns}
          data={
            latestOrders?.data?.results?.map((order) => ({
              orderData: order,
              id: order.order_id,
              has_points: order.has_points,
              orderId: order.order_id,
              customerName: order?.customer_name,
              shipmentName: `${order.shipping_firstname} ${order.shipping_lastname}`,
              customerNumber: order?.customer_number,
              coupon: order.coupon,
              status: order.order_status_id,
              total: order.total ? parseFloat(order.total) : "/",
              paymentMethod: order.payment_method,
              dateAdded: order.date_added
                ? displayBasicDate(order.date_added)
                : "",
              dateModified: order.date_modified
                ? displayBasicDate(order.date_modified)
                : "",
              actions: false,
            })) || []
          }
          defaultPagination={false}
        />
      </WrapperComponent>
    </CardContent>
  </Card>

  {/* Most users by orders number */}
  <Card className="w-full xl:w-1/2  rounded-xl border border-border bg-card">
    <CardHeader className="px-6 py-4 border-b border-border">
      <CardTitle className="text-xl font-medium text-gray-800 capitalize">
        {t("Most users by orders number")}
      </CardTitle>
    </CardHeader>
    <CardContent className="px-4 py-4">
      <DataTable
        columns={top5CustomerUsersHeaders}
        data={
          dashboardStatistics?.data?.top_5_customer_users?.map((customer) => ({
            username: customer.customer.username,
            name: `${customer.customer.first_name} ${customer.customer.last_name}`,
            active: customer.customer.is_active,
            date_joined: customer.customer.date_joined
              ? displayBasicDate(customer.customer.date_joined)
              : "no date",
            operating_system:
              customer.customer.user_login_details?.operating_system,
            last_login_ip:
              customer.customer.user_login_details?.last_login_ip,
            login_time: customer.customer.user_login_details?.login_time,
            order_count: customer.order_count,
          })) || []
        }
        defaultPagination={true}
      />
    </CardContent>
  </Card>
</div>


          {/* <Card className="w-full border">
            <CardHeader>
              <CardTitle className="capitalize text-xl font-medium">
                {" "}
                {t("Most users by price")}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <DataTable
                columns={validatedTop5PurchaseTotalCustomersHeaders}
                data={dashboardStatistics?.data?.validated_top_5_purchase_total_customers?.map(
                  (customer) => ({
                    username: customer.customer.username,
                    name:
                      customer.customer.first_name +
                      " " +
                      customer.customer.last_name,
                    active: customer.customer.is_active,
                    date_joined: customer.customer.date_joined,
                    operating_system:
                      customer.customer.user_login_details?.operating_system,
                    last_login_ip:
                      customer.customer.user_login_details?.last_login_ip,
                    // login_time: customer.customer.user_login_details.login_time,
                    total_amount: customer.total_amount,
                  })
                ) || []}
                defaultPagination={true}
              />
            </CardContent>
          </Card> */}
        </WrapperComponent>
      </div>
      <Card className="flex flex-col md:flex-row xl:flex-col justify-start items-center py-2 h-full w-full xl:w-[300px] gap-4">
        <WrapperComponent
          isEmpty={false}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={
            <div className=" w-full h-fit px-2 py-2">
              <Skeleton className="h-[200px] w-full rounded-xl" />
            </div>
          }
          emptyStateMessage={"There is no user data"}
        >
          <CardContent className="flex justify-center items-center w-full h-fit">
            <DoughnutChart
              options={getDoughnutChartConfig}
              data={doughnutData}
            />
          </CardContent>
        </WrapperComponent>
        <Separator className=" block md:hidden xl:block" />
        <Separator
          orientation="vertical"
          className="hidden md:block  xl:hidden"
        />
        <CardContent className="w-full h-full gap-4 flex flex-col">
          <Can permissions={["app_api.view_ocorder"]}>
            <Button
              onClick={handleNewOrdersButton}
              className="w-full space-x-1 justify-between px-4 bg-green-600/60 dark:text-white"
              size="lg"
            >
              <span>{t("Pending Orders")}</span>
              <ClipboardList size={16} />
            </Button>
          </Can>
          <Can permissions={["app_api.view_ocproduct"]}>
            <Button
              onClick={() => {
                navigate("/catalog/products");
              }}
              className="w-full space-x-1 justify-between px-4 bg-slate-400 hover:bg-slate-500 dark:text-white"
              size="lg"
            >
              <span>{t("Show Product")}</span>
              <ShoppingBag size={16} />
            </Button>

          </Can>
          <Can permissions={["app_api.view_ocuser"]}>

            <Button
              onClick={() => {
                navigate("/users");
              }}
              className="w-full space-x-1 justify-between px-4 bg-teal-500 hover:bg-teal-600 dark:text-white"
              size="lg"
            >
              <span>{t("Show Users")}</span>
              <Users size={16} />
            </Button>
          </Can>
        </CardContent>
      </Card>
    </Section>
  );
};

export default Home;

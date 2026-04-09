import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { WAREHOUSES_URL } from "@/utils/constants/urls";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import WrapperComponent from "@/components/layout/WrapperComponent";
import Text from "@/components/layout/text";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Map from "@/components/Map";
import Products from "@/pages/products";
import { useTranslation } from "react-i18next";

const BasicInfoTab = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();

  const GetById = async (id) => {
    return axiosPrivate.get(`${WAREHOUSES_URL}${id}/`);
  };

  const {
    data: warehouse,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["warehouse", id],
    queryFn: () => GetById(id),
    enabled: !!id,
  });

  // 🔄 Toggle mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async (newActive) => {
      return axiosPrivate.patch(`${WAREHOUSES_URL}${id}/`, { active: newActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["warehouse", id]);
    },
  });

  const handleToggleActive = () => {
    const newStatus = !warehouse?.data?.active;
    toggleActiveMutation.mutate(newStatus);
  };

  return (
    <Card className="flex flex-col justify-start items-center w-full h-full space-y-4">
      <WrapperComponent
        isEmpty={!warehouse?.data?.id}
        isError={isError}
        error={error}
        isLoading={isLoading}
        loadingUI={
          <div className="flex justify-center items-center space-x-2 h-[450px] w-full">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{t("Please wait")}</span>
          </div>
        }
        emptyStateMessage={t("Warehouse not found")}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 z-10 place-content-center place-items-start w-full">
          {/* 🗺️ Map Section */}
          <div className="flex flex-col justify-start items-center py-4 w-full">
            <Map data={warehouse?.data} title={t("Warehouse Location")} />
          </div>

          {/* ℹ️ Info Section */}
          <div className="flex flex-col justify-start items-start space-y-4 w-full h-full py-4 px-4">
            <div className="flex justify-between items-start w-full">
              <CardHeader className="py-0 px-0">
                <CardTitle className="!font-normal !text-2xl">
                  {t("Warehouse Name")} : {warehouse?.data?.name}
                </CardTitle>
              </CardHeader>

              {/* 🔘 Active/Inactive Toggle */}
              <Badge
                onClick={handleToggleActive}
                disabled={toggleActiveMutation.isPending}
                className={cn(
                  "rounded-sm py-2 uppercase cursor-pointer transition-all",
                  warehouse?.data?.active
                    ? "bg-[#3AC5AB] text-white hover:opacity-90"
                    : "bg-red-500 text-white hover:opacity-90"
                )}
                variant={warehouse?.data?.active ? "success" : "destructive"}
              >
                {warehouse?.data?.active ? t("Enabled") : t("Disabled")}
              </Badge>
            </div>

            {/* 📍 Code */}
            <div className="flex justify-start space-x-1 items-center w-full">
              <Text className="text-lg" text={t("Code")} />
              <span className="font-semibold text-sm">
                {" : "} {warehouse?.data?.code}
              </span>
            </div>

            {/* 🌐 Latitude */}
            <div className="flex justify-start space-x-1 items-center w-full">
              <Text className="text-lg" text={t("Latitude")} />
              <span className="font-semibold text-sm">
                {" : "} {warehouse?.data?.latitude}
              </span>
            </div>

            {/* 🌐 Longitude */}
            <div className="flex justify-start space-x-1 items-center w-full">
              <Text className="text-lg" text={t("Longitude")} />
              <span className="font-semibold text-sm">
                {" : "} {warehouse?.data?.longitude}
              </span>
            </div>

            {/* 📅 Start Accept Orders Date */}
            <div className="flex justify-start space-x-1 items-center w-full">
              <Text className="text-lg" text={t("Start Accept Orders Date")} />
              <span className="font-semibold text-sm">
                {" : "}{" "}
                {warehouse?.data?.start_accept_orders_date
                  ? new Date(warehouse?.data?.start_accept_orders_date).toLocaleDateString()
                  : t("Not Set")}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* 🛒 Products Section */}
        <Products warehouseId={id} />
      </WrapperComponent>
    </Card>
  );
};

export default BasicInfoTab;

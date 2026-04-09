import DataTable from "@/components/ui/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import columns from "@/pages/general-coupons/components/columns";
import { GENERAL_COUPONS_URL } from "@/utils/constants/urls";
import { displayBasicDate } from "@/utils/methods";
import { useQuery } from "@tanstack/react-query";
import qs from "qs";
import { useTranslation } from "react-i18next";

const UserCoupons = ({ originalUserId }) => {
  const axiosPrivate = useAxiosPrivate();
  const {t} = useTranslation()

  const getDeletedUserCoupons = (userId, searchKeyParams = {}) => {
    return axiosPrivate.get(GENERAL_COUPONS_URL, {
      params: { ...searchKeyParams, for_customer_id: userId },
      paramsSerializer: (params) => qs.stringify(params, { encode: false }),
    });
  };
  const {
    data: deletedUserCoupons,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["DeletedUserCoupons", originalUserId],
    queryFn: () => getDeletedUserCoupons(originalUserId),
    enabled: !!originalUserId,
  });

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1>Error {isError.valueOf.name}</h1>;

  return (
    <Card className="flex flex-col justify-start items-start w-full h-full px-4 py-4">
      <CardHeader className="w-full">
        <CardTitle className="capitalize text-xl font-medium">
          {" "}
          {t("Promo Codes")}
        </CardTitle>
      </CardHeader>

      <CardContent className="w-full">
        <DataTable
          columns={columns}
          data={deletedUserCoupons?.data?.results?.map((coupon) => ({
            id: coupon.coupon_id,
            name: coupon.name,
            code: coupon.code,
            type: coupon.type,
            discount: coupon.discount,
            total_max: coupon.total_max,
            status: coupon.status,
            date_added: coupon.date_added
              ? displayBasicDate(coupon.date_added)
              : "",
            date_start: coupon.date_start
              ? displayBasicDate(coupon.date_start)
              : "",
            date_end: coupon.date_end ? displayBasicDate(coupon.date_end) : "",

            actions: coupon.coupon_id,
          }))}
          defaultPagination={true}
        />
      </CardContent>
    </Card>
  );
};

export default UserCoupons;

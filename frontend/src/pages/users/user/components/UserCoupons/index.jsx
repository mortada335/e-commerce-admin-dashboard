import DataTable from "@/components/ui/DataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import columns from "@/pages/general-coupons/components/columns";
import { displayBasicDate } from "@/utils/methods";
import GeneralCouponDialog from "@/pages/general-coupons/components/GeneralCouponDialog";
import OnDeleteDialog from "@/components/Dialogs/OnDelete";
import { GENERAL_COUPONS_URL } from "@/utils/constants/urls";
import { setIsChangeStatusDialogOpen, setIsDeleteDialogOpen, useGeneralCouponStore } from "@/pages/general-coupons/store";
import UserCouponsColumns from "./UserCouponsColumns";
import OnChangeStatus from "@/components/Dialogs/OnChangeStatus";
import UpdateCouponStatus from "@/pages/general-coupons/components/UpdateCouponStatusDialog";
import { useTranslation } from "react-i18next";
const UserCoupons = ({ coupons=[] }) => {
  const {t} = useTranslation()
    const {
      isDeleteGeneralCouponDialogOpen,
      selectedGeneralCoupon,
      isChangeStatusDialogOpen

    } = useGeneralCouponStore();

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
          
          columns={UserCouponsColumns}
          data={coupons?.map((coupon) => ({
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
          // defaultPagination={true}
        />
      </CardContent>
      <UpdateCouponStatus queryKey="UserDetails"/>
              {/* <OnChangeStatus
          name={"UserDetails"}
          heading={"Are you absolutely sure?"}
          description={`This action will ${
            selectedGeneralCoupon?.status === 0 || selectedGeneralCoupon?.status === 2  ? "Enabled" : "Disable"
          }  "${selectedGeneralCoupon?.code}".`}
          url={GENERAL_COUPONS_URL}
          id={selectedGeneralCoupon?.id}
          isDialogOpen={isChangeStatusDialogOpen}
          setIsDialogOpen={setIsChangeStatusDialogOpen}
        
          data={{
           
            status: selectedGeneralCoupon?.status === 0 || selectedGeneralCoupon?.status === 2 ? 1 : 0,
          }}
       
        /> */}
              <OnDeleteDialog
                name={"GeneralCoupons"}
                heading={t("Are you absolutely sure?")}
                description={`${t("This action cannot be undone. This will permanently delete this")}  "${selectedGeneralCoupon?.name}".`}
                url={GENERAL_COUPONS_URL}
                id={selectedGeneralCoupon?.id}
                isDialogOpen={isDeleteGeneralCouponDialogOpen}
                setIsDialogOpen={setIsDeleteDialogOpen}
              />
    </Card>
  );
};

export default UserCoupons;

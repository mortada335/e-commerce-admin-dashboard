import { axiosPrivate } from '@/api/axios';
import HeaderText from '@/components/layout/header-text';
import WrapperComponent from '@/components/layout/WrapperComponent';

import { Card } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { ORDERS_CHECK_ZAIN_CASH_STATUS_URL } from '@/utils/constants/urls';
import { displayBasicDate, formatNumberWithCurrency } from '@/utils/methods';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';


const CheckZainCashStatus = (data) => {
  const {t} = useTranslation()

    const GetCheckZainCashStatus= async () => {

        console.log(data);
        
        return axiosPrivate.get(`${ORDERS_CHECK_ZAIN_CASH_STATUS_URL}?transaction_id=${data?.order?.data?.payment_custom_field}`,{data:{transaction_id :data?.order?.data?.payment_custom_field}});
      };
    
      
    
      const {
        isLoading,
        data: checkZainCashStatus,
        isError,
        error
        
      } = useQuery({
        queryKey: ["GetCheckZainCashStatus", data],
        queryFn: () => GetCheckZainCashStatus(),
      
      });
  return (

 <div className="grid grid-cols-1 w-full h-full place-content-center place-items-start gap-4 ">
    <Card className="flex justify-between items-center w-full px-4  py-2 print:hidden">
      <HeaderText
        className={"w-fit text-start text-lg"}
        text={"Zain Cash"}
      />
    </Card>
    <WrapperComponent
          isEmpty={isError}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={
            <div className="grid grid-cols-1 gap-8 place-content-center place-items-center w-full h-full py-4">
              {[1].map((item) => (
                <Skeleton key={item} className="h-[200px] w-[80%] rounded-xl" />
              ))}
            </div>
          }
          emptyStateMessage={t("You don't have any data")}
        >

    <ScrollArea className="h-full pb-4 min-w-[250px] w-full ">
      <Table className="w-full">
        <TableHeader className=" w-full">
          <TableRow className="divide-x-2 w-full">
            <TableHead className="w-[150px] !font-semibold">
             {t("Wallet")}
            </TableHead>
            <TableHead className="w-[150px] !font-semibold">
            {t("Amount")}
            </TableHead>
            <TableHead className="w-[150px] !font-semibold">
            {t("Total Fees")}
            </TableHead>
            <TableHead className=" w-[50px] !font-semibold">
              {t("Status")}
            </TableHead>
            <TableHead className=" w-[150px] !font-semibold">
            {t("Is credit")}
            </TableHead>
            <TableHead className="w-[150px] !font-semibold">
            {t("Created Date")}
            </TableHead>
            <TableHead className=" w-[150px] !font-semibold">
            {t("Operation Date")}
            </TableHead>
            <TableHead className=" w-[150px] !font-semibold">
            {t("Updated Date")}
            </TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="divide-x-2 w-full">
            <TableCell className="w-[150px]">
            {checkZainCashStatus?.data?.from}
            </TableCell>
            <TableCell>
                {formatNumberWithCurrency(
                   String(checkZainCashStatus?.data?.amount),
                  checkZainCashStatus?.data?.to?.currency||"IQD"
                )}
            </TableCell>
            <TableCell>
                {formatNumberWithCurrency(
                   String(checkZainCashStatus?.data?.totalFees),
                  checkZainCashStatus?.data?.to?.currency||"IQD"
                )}
            </TableCell>
            <TableCell className="capitalize">
              {checkZainCashStatus?.data?.status}
            </TableCell>
            <TableCell>
              {checkZainCashStatus?.data?.credit? t('Yes') : t('No')}
            </TableCell>
            <TableCell >
            {checkZainCashStatus?.data?.createdAt? displayBasicDate(checkZainCashStatus?.data?.createdAt ): "Empty"}
            </TableCell>
            <TableCell>
              {checkZainCashStatus?.data?.operationDate? displayBasicDate(checkZainCashStatus?.data?.operationDate ): "Empty"}
            </TableCell>
            <TableCell>
              {checkZainCashStatus?.data?.updatedAt? displayBasicDate(checkZainCashStatus?.data?.updatedAt ): "Empty"}
            </TableCell>

          </TableRow>
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
        </WrapperComponent>

  </div>
  )
}

export default CheckZainCashStatus
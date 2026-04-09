import WrapperComponent from "@/components/layout/WrapperComponent";
import HeaderText from "@/components/layout/header-text";
import { Card } from "@/components/ui/card";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { ADDRESS_ADMIN_URL } from "@/utils/constants/urls";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import AddressDialog from "./AddressDialog";
import Governorate from "@/components/Governorate";
import { useTranslation } from "react-i18next";

const UserAddresses = ({ id }) => {
  const axiosPrivate = useAxiosPrivate();
  const {t} = useTranslation()
  const [isAddressedDialogOpen , setIsAddressedDialogOpen] = useState(false);
  const [selectedAddressed , setSelectedAddressed] = useState(null);
  const fetchAdminUsersDetails = async (id) => {
      // Create a new URLSearchParams object
      const params = new URLSearchParams();

      params.append("customer_id", String(id));
        return axiosPrivate.get(`${ADDRESS_ADMIN_URL}?${params.toString()}`);
      };
  const {
    data: userAddresses,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["UserAddresses"],
    queryFn: () => fetchAdminUsersDetails(id),
    enabled: !!id,
  });

  const onRowClick= (item) =>{
    if (item?.latitude&&item?.longitude) {
      
      setIsAddressedDialogOpen(true)
      setSelectedAddressed(item)
    }
  }

  return (

      <WrapperComponent
        isEmpty={!userAddresses?.data?.results?.length}
        isError={isError}
        error={error}
        isLoading={isLoading}
        loadingUI={
          <div className="flex justify-center items-center space-x-2 h-[450px] w-full">
            <Loader2 className=" h-5 w-5 animate-spin" />
            <span>{t("Please wait")}</span>
          </div>
        }
        emptyStateMessage={"This user has no registered addresses."}
      >
        <div className="flex justify-start items-center w-full px-0  py-2">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="divide-x-2">
                <TableHead className="w-[150px] !font-semibold">{t("City")}</TableHead>
                <TableHead className="w-[150px] !font-semibold">
                  {t("Address 1")}
                </TableHead>
                <TableHead className="w-[150px] !font-semibold">
                  {t("Address 2")}
                </TableHead>
                <TableHead className="w-[100px] !font-semibold">
                  {t("Zone Id")}
                </TableHead>
                <TableHead className="w-[100px] !font-semibold">
                {t("Governorate")}
                </TableHead>
                <TableHead className="w-[100px] !font-semibold">
                {t("Postcode")}
                </TableHead>
                <TableHead className="w-[100px] !font-semibold">
                {t("Latitude")}
                </TableHead>
                <TableHead className="w-[100px] !font-semibold">
                {t("Longitude")}
                </TableHead>
                <TableHead className="w-[100px] !font-semibold">
                  {t("Alternative Phone")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userAddresses?.data?.results &&
                userAddresses?.data?.results?.map((address, index) => (
                  <TableRow key={index} onClick={()=>onRowClick(address)}>
                    <TableCell>{address.city}</TableCell>
                    <TableCell>{address.address_1}</TableCell>
                    <TableCell>{address.address_2}</TableCell>
                    <TableCell>{address.zone_id}</TableCell>
                
                    <TableCell>{address.postcode&&<Governorate postcode={address.postcode}/>}</TableCell>
                    <TableCell>{address.postcode}</TableCell>
                    <TableCell>{address.latitude}</TableCell>
                    <TableCell>{address.longitude}</TableCell>
                    <TableCell>{address.alternative_phone}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
    <AddressDialog address={selectedAddressed} isAddressDialogOpen={isAddressedDialogOpen} setIsAddressDialogOpen={setIsAddressedDialogOpen}/>
      </WrapperComponent>

  );
};

export default UserAddresses;

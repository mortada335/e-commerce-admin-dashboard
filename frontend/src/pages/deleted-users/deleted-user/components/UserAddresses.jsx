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

const UserAddresses = ({ id }) => {
  const axiosPrivate = useAxiosPrivate();

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

  

  return (
    <Card className="flex flex-col justify-start items-start w-full h-full space-y-4 px-4 py-4">
      <HeaderText className={"w-full text-start "} text="User Addresses" />
      <WrapperComponent
        isEmpty={!userAddresses?.data?.length}
        isError={isError}
        error={error}
        isLoading={isLoading}
        loadingUI={
          <div className="flex justify-center items-center space-x-2 h-[450px] w-full">
            <Loader2 className=" h-5 w-5 animate-spin" />
            <span>Please wait</span>
          </div>
        }
        emptyStateMessage={"User Addresses not found "}
      >
        <Card className="flex justify-start items-center w-full px-2  py-2">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="divide-x-2">
                <TableHead className="w-[150px] !font-semibold">City</TableHead>
                <TableHead className="w-[150px] !font-semibold">
                  Address 1
                </TableHead>
                <TableHead className="w-[150px] !font-semibold">
                  Address 1
                </TableHead>
                <TableHead className="w-[100px] !font-semibold">
                  Zone Id
                </TableHead>
                <TableHead className="w-[100px] !font-semibold">
                  Alternative Phone
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userAddresses?.data &&
                userAddresses?.data?.map((address, index) => (
                  <TableRow key={index}>
                    <TableCell>{address.city}</TableCell>
                    {address.address_1}
                    <TableCell>{address.address_2}</TableCell>
                    <TableCell>{address.zone_id}</TableCell>
                    <TableCell>{address.postcode}</TableCell>
                    <TableCell>{address.alternative_phone}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Card>
      </WrapperComponent>
    </Card>
  );
};

export default UserAddresses;

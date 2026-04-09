import HeaderText from "@/components/layout/header-text";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomersMembership from "@/pages/customer-membership";
import { useDeletedUsersStore } from "../../store";
import { useToast } from "@/components/ui/use-toast";
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import contentTypes from "@/utils/contentTypes.json";
import { AUDIT_LOGS, CUSTOMER_MEMBERSHIP_URL } from "@/utils/constants/urls";
import { useQuery } from "@tanstack/react-query";
import useMutation from "@/hooks/useMutation";

import WrapperComponent from "@/components/layout/WrapperComponent";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { displayBasicDate } from "@/utils/methods";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RewardsPointsSchema } from "@/utils/validation/user";
import RankCard from "@/pages/ranks/components/RankCard";
import Can from "@/components/Can";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import RewardPointsHistory from "./RewardPointsHistory";
import OrderTasks from "./orderTasks";
const RewardPoints = ({ id, userPoints, userRank }) => {
  const { activeCustomerMembershipId } = useDeletedUsersStore();
  const { toast } = useToast();
  const axiosPrivate = useAxiosPrivate();

  const [userCurrentPoints, setUserCurrentPoints] = useState(userPoints);
  const fetchOrderHistory = async () => {
    const objectReprParam = `OcCustomerMembership ID: ${activeCustomerMembershipId}`;

    const response = await axiosPrivate.get(AUDIT_LOGS, {
      params: {
        resource_type: contentTypes.occustomermembership,
        object_repr: objectReprParam,
      },
    });

    try {
      const justUpdate = response.data?.results?.filter(
        (change) => change.action == 1
      );
      const justWithCurrentRewardPointsChanges = justUpdate?.filter(
        (change) => "current_reward_points" in JSON.parse(change.changes)
      );
      return justWithCurrentRewardPointsChanges;
    } catch (error) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: error.message,
      });
    }
  };

  const {
    data: userRewardPointsHistory,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["UserRewardPointsHistory", activeCustomerMembershipId],
    queryFn: () => fetchOrderHistory(),
    enabled: !!id,
  });

  const defaultFormFields = {
    points: 0,
    reason: "",
  };
  const [rewardFields, setRewardFields] = useState(defaultFormFields);

  const form = useForm({
    resolver: yupResolver(RewardsPointsSchema),
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const {
    mutate,

    isPending: isAction,
  } = useMutation("UserRewardPointsHistory");

  useEffect(() => {
    if (rewardFields.points) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [rewardFields]);

  const onSubmit = async () => {
    // Validate currency Change
    if (!rewardFields) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }

    const finalPoints = Math.ceil(
      Number(userPoints) + Number(rewardFields.points)
    );

    const formData = {
      current_reward_points: finalPoints,

      customer_id: id,
    };
    if (rewardFields.reason) {
      formData.comment = rewardFields.reason;
    }

    mutate({
      url: CUSTOMER_MEMBERSHIP_URL,
      id: activeCustomerMembershipId,
      headers: {
        "Content-Type": "application/json",
      },
      onFinish: () => {
        setRewardFields(defaultFormFields), setUserCurrentPoints(finalPoints);
      },
      formData,
    });
  };
  return (
    <div className="flex flex-col justify-start items-start w-full h-full space-y-4">
      {/* Scheduled Reward Points */}
      <OrderTasks id={id} />

      {/* Reward Points History */}
      <RewardPointsHistory id={id} />

      {/* Customer Membership */}
      <Card className="w-full">
        <CustomersMembership customer_id={id} />
      </Card>

      {/* Reward Points Base on Orders */}
      <Card className="w-full px-4 py-4 space-y-4">
        <HeaderText
          className={"w-full text-start "}
          text={"Reward Points base on orders"}
        />

        <WrapperComponent
          isEmpty={!userRewardPointsHistory?.length}
          isError={isError}
          error={error}
          isLoading={isLoading}
          loadingUI={
            <div className="flex justify-center items-center space-x-2 h-[450px] w-full">
              <Loader2 className=" h-5 w-5 animate-spin" />
              <span>Please wait</span>
            </div>
          }
          emptyStateMessage={"There is no reward points history"}
        >
          <Table className="w-full">
            <TableHeader>
              <TableRow className="divide-x-2">
                <TableHead className="w-[150px] !font-semibold ">
                  Date Added
                </TableHead>
                {/* <TableHead className="w-[150px] !font-semibold">
                  Order
                </TableHead> */}
                <TableHead className="w-[100px] !font-semibold">
                  Points
                </TableHead>
                <TableHead className="w-[200px] !font-semibold">
                  Reason
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userRewardPointsHistory &&
                userRewardPointsHistory?.map((single_log) => (
                  <TableRow className="divide-x-2" key={single_log?.timestamp}>
                    <TableCell>
                      {displayBasicDate(single_log?.timestamp)}
                    </TableCell>
                    {/* <TableCell >----</TableCell> */}
                    <TableCell>
                      {JSON.parse(
                        single_log?.changes
                      )?.current_reward_points?.at(0)}{" "}
                      to:{" "}
                      {JSON.parse(
                        single_log?.changes
                      )?.current_reward_points?.at(1)}
                    </TableCell>
                    <TableCell>
                      {JSON.parse(single_log?.changes)?.comment?.at(1)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </WrapperComponent>

        {/* Add Rewared Points */}
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-fit place-content-center place-items-start gap-8 px-0 py-4">
        {activeCustomerMembershipId && (
          <Card className="flex flex-col justify-start items-start w-full h-full px-4 py-4 space-y-4">
            <CardHeader className="py-2 ">
              <CardTitle>Add Rewards Points</CardTitle>
              <CardDescription>
                Make Add Rewards Points here. Click save when you are done.
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full">
              <Form {...form} className="h-full">
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2 w-full"
                >
                  <FormField
                    control={form.control}
                    name="points"
                    render={({ field }) => (
                      <FormItem className="w-full px-1 pt-0">
                        <FormLabel className="capitalize">Points</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="User Points"
                            value={rewardFields.points}
                            onChange={(e) => {
                              field.onChange(e.target.value);

                              setRewardFields((prev) => ({
                                ...prev,
                                points: e.target.value,
                              }));
                            }}
                            autoComplete="points"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem className="w-full px-1 pt-2 relative">
                        <FormLabel className="capitalize">Reason</FormLabel>
                        <FormControl>
                          <Textarea
                            type="text"
                            placeholder="Enter a reason..."
                            value={rewardFields.reason}
                            onChange={(e) => {
                              field.onChange(e.target.value);

                              setRewardFields((prev) => ({
                                ...prev,
                                reason: e.target.value,
                              }));
                            }}
                            autoComplete="reason"
                          />
                        </FormControl>

                        <FormMessage />

                        <span className={cn("text-xs text-gray-700")}>
                          {rewardFields.reason.trim().length}/250 Characters
                        </span>
                      </FormItem>
                    )}
                  />
                  <Can
                    permissions={["app_api.change_occustomermembership"]}
                  >
                    <div className="flex justify-start items-center w-full py-2 space-x-4 px-1">
                      <Button disabled={!isSubmit || isAction} type="submit">
                        {isAction ? (
                          <p className="flex justify-center items-center space-x-2">
                            <Loader2 className=" h-5 w-5 animate-spin" />
                            <span>Please wait</span>
                          </p>
                        ) : (
                          <span>Save</span>
                        )}
                      </Button>
                    </div>
                  </Can>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
        <RankCard
          rank={userRank}
          canEdit={false}
          userCurrentPoints={userCurrentPoints}
        />
      </div>
    </div>
  );
};

export default RewardPoints;

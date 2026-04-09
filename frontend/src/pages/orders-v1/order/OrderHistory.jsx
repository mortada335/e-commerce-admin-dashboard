import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { vonageSendMessage } from "@/utils/apis/messages";
import { GetHistoryOfOrderStatusAndComment } from "@/utils/apis/history";
import { convertStatusIdToString, displayBasicDate } from "@/utils/methods";
import { EditCustomerNotifiedIdStringArray } from "@/utils/apis/sales/orders";

import { Button } from "@/components/ui/button";

import WrapperComponent from "@/components/layout/WrapperComponent";
import { Loader2 } from "lucide-react";
// import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast";
import { axiosPrivate } from "@/api/axios";
import { ORDERS_V1_URL } from "@/utils/constants/urls";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useQueryClient } from "@tanstack/react-query";

const OrderHistory = ({
  order,
  orderId,
  reRender,
  messageInfo,
  userNotifiedArray,
}) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  // const [userNotifiedOrNotArray, setUserNotifiedOrNotArray] = useState([])

  // useEffect(() => {
  //   if (userNotifiedArray && userNotifiedArray !== "") {
  //     try {
  //       const parsedArray = JSON.parse(userNotifiedArray)
  //       setUserNotifiedOrNotArray(parsedArray)
  //     } catch (error) {
  //       console.error("Error parsing userNotifiedArray:", error)
  //     }
  //   }
  // }, [userNotifiedArray])

  // const sendMessage = async (index, status) => {
  //   const messageContent = getMessageContent(status)
  //   if (!messageContent) return

  //   try {
  //     const response = await vonageSendMessage({
  //       receiverNumber: messageInfo.customer_number,
  //       customerId: messageInfo.customerId,
  //       content: messageContent,
  //       firstChannel: "sms",
  //       type: "orderStatus",
  //     })

  //     if (response.status === 201 || response.status === 200) {
  //       const updatedArray = [...userNotifiedOrNotArray]
  //       updatedArray[index] = 1
  //       const updateResponse = await EditCustomerNotifiedIdStringArray(
  //         orderId,
  //         updatedArray
  //       )
  //       if (updateResponse.status === 200 || updateResponse.status === 201) {
  //         setReRenderOrderDetails((prev) => !prev)
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error sending message:", error)
  //   }
  // }

  // const getMessageContent = (status) => {
  //   const messages = {
  //     Completed: `😎 تم تأكيد طلبك المرقم ${messageInfo.orderId}، من شغلاتي، سنتواصل معك في أقرب وقت`,
  //     Refunded: `🥺 تم إسترداد طلبك المُرقم ${messageInfo.orderId}، نأمل أن تعاود التسوق معنا قريبًا`,
  //     "Cancelled Order": `🥹 يؤسفنا إلغاء طلبك المُرقم ${messageInfo.orderId}، نتمنى خدمتك قريبًا`,
  //   }
  //   return messages[status]
  // }

  // const fetchOrderHistory = async (orderId) => {
  //   try {
  //     const result = await GetHistoryOfOrderStatusAndComment(orderId)
  //     if (result instanceof Error) throw new Error(result.message)
  //     if (result.data.error) throw new Error(result.data.error)

  //     const filteredResults = result.data?.results.filter((item) => {
  //       const changes = JSON.parse(item.changes)
  //       return "order_status_id" in changes
  //     })
  //     const sortedResults = filteredResults.sort(
  //       (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  //     )
  //     return sortedResults
  //   } catch (error) {
  //     return toast({
  //       variant: "destructive",
  //       title: "Failed!!!",
  //       description: error.message,
  //     })
  //   }
  // }

  // const {
  //   data: historyObj,
  //   isLoading,
  //   error,
  //   isError,
  // } = useQuery({
  //   queryKey: ["HistoryObj", reRender],
  //   queryFn: () => fetchOrderHistory(),
  //   enabled: !!orderId,
  // })

  // const isUserNotified = (index) =>
  //   userNotifiedOrNotArray[index] ? "Yes" : "No"

  const [historyObj, setHistoryObj] = useState();
  const [userNotifiedOrNotArray, setUserNotifiedOrNotArray] = useState();

  useEffect(() => {
    if (userNotifiedArray != "" && userNotifiedArray) {
      try {
        const parsedArray = JSON.parse(userNotifiedArray);
        setUserNotifiedOrNotArray(parsedArray);
      } catch (error) {
        console.error("Error parsing userNotifiedArray:", error);
      }
    }
  }, [userNotifiedArray]);
  const customer_number = messageInfo.customer_number?.replace("+964", "0");

  const sendMessageFunction = async (index, status) => {
    let messageObjectBody = {
      receiverNumber: customer_number,
      customerId: messageInfo.customerId,
      content:
        "Your request has been processed, and it will be delivered to you very soon",
      firstChannel: "sms",
      type: "reminder",
    };
   
    if (status == "Completed") {
      messageObjectBody.content = `.وسيتم الاتصال بك لتاكيد المعلومات ${orderId || ""} عزيزنا المستخدم، يتم تجهيز طلبك`;
    } else if (status == "Refunded") {
      messageObjectBody.content = `.${orderId || ""} عزيزنا المستخدم، تم استرداد الطلب`;
    } else if (status == "Cancelled Order") {
      messageObjectBody.content = `.${orderId || ""} عزيزنا المستخدم، تم إلغاء الطلب`;
    }

    try {
      // const response = await vonageSendMessage(messageObjectBody)
      const response = await axiosPrivate.post(
        `/redirect_to_sms/`,
        messageObjectBody
      );
      // response.status === 201
      if (response.status === 201 || response.status === 200) {
        if (userNotifiedOrNotArray?.length) {
          const newCustomerNotifiedArr = userNotifiedOrNotArray;
          newCustomerNotifiedArr[index] = 1;

          let formData = {};

          formData = Object.fromEntries(
            Object.entries({
              ...order?.data,
              customer_notified_id: JSON.stringify(newCustomerNotifiedArr),

              // eslint-disable-next-line no-unused-vars
            }).filter(
              ([_, value]) =>
                value !== "" && value !== undefined && value !== null
            )
          );

          const responseOfUpdateCustomerNotifiedArr = await axiosPrivate.put(
            `${ORDERS_V1_URL}${orderId}/`,
            formData
          );

          if (
            responseOfUpdateCustomerNotifiedArr.status === 200 ||
            responseOfUpdateCustomerNotifiedArr.status === 201
          ) {
            queryClient.invalidateQueries({ queryKey: ["OrderV1"] });

            toast({
              title: "Success",
              description: "The message has been sent.",
            });
          }
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed!!!",
        description: error?.message,
      });
    }
  };

  useEffect(() => {
    const fetchOrderHistory = async () => {
      const result = await GetHistoryOfOrderStatusAndComment(orderId);

      // this is a valid response
      if (!(result instanceof Error)) {
        // check if there is a validations errors
        if (!result.data.error) {
          const filteredResults = result.data?.results.filter((item) => {
            const changes = JSON.parse(item.changes);
            // eslint-disable-next-line no-prototype-builtins
            return changes.hasOwnProperty("order_status_id");
          });
          const sortedResults = filteredResults.sort((a, b) => {
            const dateA = new Date(a.timestamp);
            const dateB = new Date(b.timestamp);
            return dateB - dateA;
          });

          return setHistoryObj(sortedResults);
        } else {
          // this is backend validation error

          return toast({
            variant: "destructive",
            title: "Failed!!!",
            description: result.data.error,
          });
        }
      } else {
        // this is server error or other erro that could happen
        return toast({
          variant: "destructive",
          title: "Failed!!!",
          description: result.message,
        });
      }
    };
    fetchOrderHistory();
  }, [reRender]);

  const userNotifiedOrNotFunction = (index) => {
    // length exist and index exist

    if (
      userNotifiedOrNotArray?.length &&
      userNotifiedOrNotArray?.length > index
    ) {
      // 0 ---> not notified

      if (userNotifiedOrNotArray[index]) {
        return 1;
      } else return 0;
    }
    //  to diable send message if there is error
    return 1;
  };

  return (
    <div className="flex flex-col justify-start items-center w-full h-fit">
      <WrapperComponent
        isEmpty={!historyObj?.length}
        isError={false}
        error={{}}
        isLoading={false}
        loadingUI={
          <div className="flex justify-center items-center space-x-2 h-[450px] w-full">
            <Loader2 className=" h-5 w-5 animate-spin" />
            <span>Please wait</span>
          </div>
        }
        emptyStateMessage={"There is no History in this order"}
      >
        <ScrollArea className="h-full pb-4 min-w-[250px] w-full ">
          <Table className="w-full h-fit">
            <TableHeader>
              <TableRow className="divide-x-2">
                <TableHead className="w-[150px] !font-semibold">
                  Date Added
                </TableHead>
                <TableHead className="w-[150px] !font-semibold">
                  Status
                </TableHead>
                <TableHead className="w-[150px] !font-semibold">
                  comment
                </TableHead>
                <TableHead className="w-[100px] !font-semibold">
                  notified
                </TableHead>
                <TableHead className=" w-[100px] !font-semibold">
                  send message
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyObj?.length &&
                historyObj?.map((single_log, index) => (
                  <TableRow key={index} className="divide-x-2">
                    <TableCell>
                      {displayBasicDate(single_log.timestamp)}
                    </TableCell>
                    <TableCell>
                      {JSON.parse(single_log.changes)?.order_status_id &&
                        convertStatusIdToString(
                          JSON.parse(single_log.changes)?.order_status_id[1]
                        )}
                    </TableCell>
                    <TableCell>
                      {JSON.parse(single_log.changes)?.comment &&
                        JSON.parse(single_log.changes)?.comment[1]}
                    </TableCell>
                    <TableCell>
                      {index == historyObj?.length
                        ? "-----"
                        : userNotifiedOrNotFunction(index + 1)
                        ? "Yes"
                        : "No"}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() =>
                          sendMessageFunction(
                            index + 1,
                            convertStatusIdToString(
                              JSON.parse(single_log.changes)?.order_status_id[1]
                            )
                          )
                        }
                        disabled={
                          userNotifiedOrNotFunction(index + 1) ||
                          index === historyObj.length
                        }
                        variant={"default"}
                      >
                        Send Notification
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </WrapperComponent>
    </div>
  );
};

export default OrderHistory;

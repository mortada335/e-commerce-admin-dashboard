import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { messaging, getToken, onMessage } from "@/utils/firebase";
import {
  ArrowDown,
  Bell,
  BellPlus,
  Loader2,
  Mail,
  MailOpen,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { axiosPrivate } from "@/api/axios";
import { NOTIFICATION_URL, SAVE_CUSTOMER_TOKEN } from "@/utils/constants/urls";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import NotificationCard from "./NotificationCard";
import { ToastAction } from "@/components/ui/toast";

import { setIsReFetchBaseOnNotification } from "@/pages/home/store";

export function NotificationsMenu() {
  const [notificationPermission, setNotificationPermission] = useState(null);
  const [fcmMessages, setFcmMessages] = useState([]);
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState("10");
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Initialize query client.
  const queryClient = useQueryClient();

  useEffect(() => {
    requestNotificationPermission();

    // Handle incoming messages
    onMessage(messaging, (payload) => {
      // Customize notification here

      // Update the notifications array with the received data
      const newNotification = {
        id: payload.data.notification_id,
        title: payload.notification.title,
        body: payload.notification.body,
        sent_at: new Date().toLocaleDateString(), // You may customize the timestamp
        is_read: 0, // Assuming the notification is unread by default
        notifiable_type: payload.data.type,
        order_id: payload.data.order_id,
      };

      toast({
        title: payload?.notification?.title,
        description: payload?.notification?.body,
        // action: <ToastAction onClick={()=>onToastClick(newNotification)} altText="Show">{isAction?  <Loader2 className=" h-5 w-5 animate-spin" />:'Show'}</ToastAction>,
      });

      // Add the new notification to the beginning of the array

      setFcmMessages((prev) => [...prev, newNotification]);

      setIsReFetchBaseOnNotification(true);
    });

    // Cleanup function to unsubscribe before the component unmounts
    // return () => {
    //   unsubscribeFromTopic();
    // };
  }, []); // Ensure this effect runs only once, on component mount

  const fetchNotifications = async () => {
    return axiosPrivate.get(
      `${NOTIFICATION_URL}?topic=taawin_admin&page=${page}&page_size=${itemPerPage.toString()}&is_read=false`
    );
  };

  const {
    data: notifications,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["NavBarNotifications", page, itemPerPage],
    queryFn: () => fetchNotifications(),
  });

  const requestNotificationPermission = async () => {
    setNotificationPermission(Notification.permission);

    try {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });

      // Subscribe to topic
      if (token) {
        subscribeToTopic(token, "admin_topic");
      }
    } catch (error) {
      console.error("Permission denied", error);
    }
  };
  const subscribeToTopic = async (token, topic) => {

    
    try {
      
      if (token) {
        
        // Subscribe the device to the topic
        await axiosPrivate.post(
         `${SAVE_CUSTOMER_TOKEN}`,
 
         {
           notification_token : token
         },
 
         {
           headers:  {
             "Content-Type": "application/json",
           },
         }
       )
      }else{
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: "There is no token",
        })
      }

      
    } catch (error) {

      if (error?.response?.status && error?.response?.status !== 500) {
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: error.response?.data?.error,
        })
      } else if (error.code === "ERR_NETWORK") {
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: "Network error, please try again",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: "An unknown error occurred. Please try again later",
        })
      }
      
    }
    // fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
    //   method: "POST",
    //   headers: {
    //     Authorization: `key=${import.meta.env.VITE_FIREBASE_SERVER_KEY}`, // Add your server key here
    //     "Content-Type": "application/json",
    //   },
    // })
    //   .then((response) => {
    //     //   if (response.ok) {
    //     //     console.log(`Subscribed to topic "${topic}"`);
    //     //   } else {
    //     //     console.error('Error subscribing to topic:', response.statusText);
    //     //   }
    //   })
    //   .catch((error) => {
    //     console.error("Error subscribing to topic:", error);
    //   });
  };

  // const unsubscribeFromTopic = async () => {
  //   try {
  //     const token = await getToken(messaging, {
  //       vapidKey:
  //         "BNJJ1MXWMPcdlJZFJOmUoykj4JEB9IQNWWDEtpjUfjj9d8BxzCE8K2viaj2hzjaHSgFF4M3971o35KbaeFjQGS0",
  //     });

  //     // Unsubscribe from topic
  //     if (token) {
  //       fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/admin_topic`, {
  //         method: "DELETE",
  //         headers: {
  //           Authorization: `key=AAAAyoRGl28:APA91bEK0K-3pptwiO2UpdZRNK4Ojr_7cswO2RMhlbZRU6Y3yigZ7t8AZP_6_BtWHqUEARY3BgOv3Qvcqy1N7tVf4k98tEgdp3-dac5jXfQO9XOcZjnabGRXBGoMXASIDYN5k2Pt0fZf`, // Add your server key here
  //           "Content-Type": "application/json",
  //         },
  //       })
  //         .then((response) => {
  //           // if (response.ok) {
  //           //   console.log(`Unsubscribed from topic "admin_topic"`);
  //           // } else {
  //           //   console.error('Error unsubscribing from topic:', response.statusText);
  //           // }
  //         })
  //         .catch((error) => {
  //           console.error("Error unsubscribing from topic:", error);
  //         });
  //     }
  //   } catch (error) {
  //     console.error("Error getting token for unsubscription", error);
  //   }
  // };
  // const handleDeleteMessage = (notification) => {
  //   const index = fcmMessages?.findIndex((item) => item.notifiable_id === notification.id);

  //   setFcmMessages((prev) => [
  //     ...prev.slice(0, index),
  //     ...prev.slice(index + 1),
  //   ]);
  // };

  // const clearAllMessages = () => {
  //   setFcmMessages([]);
  // };

  const handleDeleteMessage = (notification) => {
    setFcmMessages((prev) =>
      prev.filter((item) => item.id !== notification.id)
    );
  };

  const allowNotificationPermission = () => {
    Notification.requestPermission().then((permission) => {
      setNotificationPermission(permission);
    });
  };

  useEffect(() => {
    setTotalCount(
      Number(notifications?.data?.count || 0) + fcmMessages?.length
    );
  }, [fcmMessages, notifications?.data?.count]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button className="relative" variant="outline" size="icon">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {totalCount > 0 && (
            <div className=" text-xs absolute -top-4 -right-2 ">
              <span className="relative flex  text-white">
                <span className="animate-ping absolute py-0.5  px-1.5 h-full w-full rounded-full bg-red-400  opacity-75"></span>
                <span className="relative rounded-full py-0.5  px-1.5 text-center text-[10px] bg-red-500">
                  {totalCount}
                </span>
              </span>
            </div>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 px-0 py-0">
        <ScrollArea className="h-[320px] !w-full  rounded-md px-0">
          <div className="py-2 h-[300px] w-[20rem]">
            <div className="flex justify-between items-center w-full h-fit px-4  ">
              <h4 className="text-lg font-medium leading-none py-2">
                Notifications
              </h4>
              <div className="flex justify-end items-center w-full gap-2">
                {notificationPermission !== "granted" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={allowNotificationPermission}
                          variant="ghost"
                          size="icon"
                          className="rounded-full h-8 w-8"
                        >
                          <BellPlus size={15} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p> Enable Notification</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                {/* {!!fcmMessages?.length && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={clearAllMessages}
                          variant="ghost"
                          size="icon"
                          className="rounded-full h-8 w-8"
                        >
                          {" "}
                          <MailOpen size={15} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p> Mark all as read</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )} */}
              </div>
            </div>
            <Separator className="my-2" />
            {notifications?.data?.results.length || fcmMessages.length ? (
              [...fcmMessages, ...(notifications?.data?.results || [])]?.map(
                (notification, index) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    setIsOpen={setIsOpen}
                    handleDeleteMessage={handleDeleteMessage}
                  />
                )
              )
            ) : isLoading ? (
              <p className="flex items-center justify-center gap-1">
                <Loader2 size={16} className="animate-spin text-blue-500" />
                Loading...
              </p>
            ) : (
              <div className="text-center h-[90%] flex items-center justify-center w-full px-4">
                <p>No Notification Found!</p>
              </div>
            )}
            {notifications?.data?.count >
              notifications?.data?.results?.length && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full text-center">
                      <Button
                        onClick={() => {
                          setItemPerPage((prev) => parseInt(prev, 10) + 10);
                        }}
                        size="icon"
                        className="animate-bounce mt-3"
                      >
                        <ArrowDown size={18} />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Load More</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

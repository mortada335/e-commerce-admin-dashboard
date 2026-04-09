
import {

    Loader2,
    
  } from "lucide-react";
  import {  useState } from "react";
  import {  useQueryClient } from "@tanstack/react-query";
  import {  useNavigate } from "react-router-dom";
  import { useToast } from "@/components/ui/use-toast";
import { NOTIFICATION_URL } from '@/utils/constants/urls';
import { axiosPrivate } from '@/api/axios';
import Text from '@/components/layout/text';
import { handleError } from "@/utils/methods";


const NotificationCard = ({notification,setIsOpen,handleDeleteMessage}) => {

    const { toast } = useToast();
    const [isAction, setIsAction] = useState(false);
  
    // Initialize query client.
    const queryClient = useQueryClient();
    const navigate = useNavigate()
  

    const onClickNotification=async(notification,isNavigate=true)=>{
  


        try {
          setIsAction(true)
    
            const response = await axiosPrivate.patch(
              `${NOTIFICATION_URL}${ notification?.id}/`,
    
              {
                is_read:true
              },
    
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
    
            if (response.status === 201 || response.status === 200) {

            
                if (isNavigate) {
                    navigate(`/sales/orders/details/${notification.order_id}`)
                    setIsOpen(false)
                }
                handleDeleteMessage(notification);

              
             
              queryClient.invalidateQueries({ queryKey: ['NavBarNotifications'] })
            }
    
          
    
          
        } catch (error) {
          // Handle the error
          // console.log(error)
          setIsAction(false)
          handleError(error)
          
         
        }finally{
          setIsAction(false)
     
        }
      }
  return (
    <div
                 
    onClick={()=>onClickNotification(notification)}
      key={notification.id}
      className="group notification-card border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition cursor-pointer"
    >
      <div
        
        className="flex flex-col justify-start items-start py-2 w-full h-fit gap-1"
      >
        <div className="flex justify-between items-center w-full px-4 pr-6">
          <p className="text-[.95rem] font-medium mx-1 w-full truncate">
            {notification.title}
          </p>
          {!notification.is_read && (

            isAction?  <Loader2 size={16} className="animate-spin text-blue-500" />:
            <span className="relative rounded-full py-1 px-1 text-center text-xs bg-blue-500" />
          )}
        </div>
        <Text
          text={notification.body}
          className="text-[.8rem] mx-1 truncate px-4 w-full max-w-[92%]"
        />
        <div className="flex justify-between items-center w-full pl-4 pr-3.5">
          <Text
            text={new Date(notification.sent_at).toDateString()}
            className="text-[.7rem] mx-1 text-slate-400 dark:text-slate-500 truncate"
          />

          {/* <Button
            onClick={() => {

                onClickNotification(notification,false)
        
            }}
            variant="ghost"
            size="icon"
            className="rounded-full h-8 w-8 opacity-0 group-hover:opacity-100 transition "
          >
            <X size={15} />
          </Button> */}
        </div>
      </div>
      {/* {index + 1 !== fcmMessages.length ||
        (index + 1 !== notifications?.data?.results?.length && (
          <Separator className="my-2" />
        ))} */}
    </div>
  )
}

export default NotificationCard
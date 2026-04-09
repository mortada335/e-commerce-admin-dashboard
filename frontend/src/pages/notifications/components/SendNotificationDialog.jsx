import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AlertCircle, CalendarIcon, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

import { SEND_NOTIFICAtION_URL, USERS_URL } from "@/utils/constants/urls";
import useMutation from "@/hooks/useMutation";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { notificationSchema } from "@/utils/validation/notification";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import CategoryAutocomplete from "@/components/CategoryAutocomplete";
import ProductAutocomplete from "@/components/ProductAutocomplete";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Text from "@/components/layout/text";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import {  formatDateToISO,  formatFullDate } from "@/utils/methods";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import TimePicker from "@/components/ui/notification-time-picker";
import CustomerAutocomplete from "@/components/CustomerAutocomplete";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CustomsMultiCombobox from "@/components/ui/customs-multi-combobox";
import usePost from "@/hooks/usePost";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// import TimePicker from 'react-time-picker';
const defaultFormFields = {
  title: "",
  body: "",
  url: "",
  type: "product",
  filter_id: null,
  send_date: (() => {
    const now = new Date();
    let minutes = now.getMinutes();

    // Custom rules for rounding up to the next 5-minute interval
    if (minutes < 5) {
      minutes = 5;
    } else if (minutes < 10) {
      minutes = 10;
    } else if (minutes < 15) {
      minutes = 15;
    } else if (minutes < 20) {
      minutes = 25;
    } else if (minutes < 25) {
      minutes = 25;
    } else if (minutes < 30) {
      minutes = 35;
    } else if (minutes < 35) {
      minutes = 35;
    } else if (minutes < 40) {
      minutes = 45;
    } else if (minutes < 45) {
      minutes = 45;
    } else if (minutes < 50) {
      minutes = 55;
    } else if (minutes < 55) {
      minutes = 55;
    } else {
      minutes = 0;
      now.setHours(now.getHours() + 1); // Move to the next hour
    }

    now.setMinutes(minutes);
    now.setSeconds(0); // Reset seconds to 0
    now.setMilliseconds(0); // Reset milliseconds to 0

    return now;
  })(),
};

export default function SendNotificationDialog({
  isDialogOpen,
  setIsDialogOpen,
}) {
      const queryClient = useQueryClient()
  const { toast } = useToast();
  const { t } = useTranslation()
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [selectedCustomer, setSelectedCustomer] = useState({
    filter_id: "",
    filter_name: "",
  });
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const form = useForm({
    resolver: yupResolver(notificationSchema),
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);
  
  const customersFilters = [
    {
      key: "is_superuser",
      value: 0,
    },
  ];
  const onClose = async() => {
    setIsDialogOpen(false);
    form.reset();
    setSelectedCustomer({
      filter_id: "",
      filter_name: "",
    })
    setSelectedCustomers([])
    setFormFields(defaultFormFields);
        await queryClient.invalidateQueries({ queryKey: ['ScheduledNotification'] }); // Invalidate queries to refresh data
  };

    const {
      mutate,
  
      isPending: isAction,
    } = usePost({
      queryKey: "SentNotification",
      onSuccess: onClose,
    });
  

  useEffect(() => {
    if (formFields.title && formFields.body) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [formFields]);



  const onSubmit = async () => {
    // Validate currency Change
    if (!formFields.title || !formFields.body) {
      toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }


  

    const payload ={
      title:formFields.title,
      body:formFields.body,
    }

     if (formFields.send_date)
      payload.send_date=formatDateToISO(formFields.send_date);
    if (formFields.url)
      payload.url=formFields.url;
  
    if (formFields.type === "category" && formFields.filter_id!==null )
      payload.category_id=formFields.filter_id;
    if (formFields.type === "product" && formFields.filter_id!==null )
      payload.product_id=formFields.filter_id;
    if (selectedCustomers?.length) {

      payload.customer_ids= selectedCustomers?.map((customer)=>customer?.id);
    }
   
    

         mutate({
        endpoint: SEND_NOTIFICAtION_URL,
      

        body: payload,
      
      });
    
   
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="w-[95%] sm:max-w-[750px] px-4 ">
      <ScrollArea className=" w-[99%] md:w-full border-none">

        <ScrollArea className=" h-[400px] sm:h-[450px] md:h-[550px] lg:h-[600px] xl:h-[650px] 2lx:h-fit pr-4 w-full ">
          <DialogHeader className={"rtl:items-end"}>
            <DialogTitle>{t("Send Notification")}</DialogTitle>
            <DialogDescription>
              {t("Send Notification here. Click save when you are done.")}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 pt-2"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full px-1 pt-0">
                    <FormLabel>
                      {" "}
                      <span className="text-red-500 text-xl">*</span>{t("title")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("Notification title")}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);

                          setFormFields({
                            ...formFields,
                            title: e.target.value,
                          });
                        }}
                        autoComplete="title"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
               <Popover>
                <PopoverTrigger asChild>
                  <div className="flex flex-col justify-start items-start space-y-2 w-full">
                    <Label className="w-full">{t("Send Date")}</Label>
                    <Card className="flex justify-between items-center space-y-0 space-x-0 pr-4 w-full">
                      <Button
                        type="button"
                        variant={"ghost"}
                        className={cn(
                          " w-fit text-left font-normal rounded-none flex justify-start items-center ",
                          !formFields.send_date &&
                            "text-muted-foreground w-[180px]"
                        )}
                      >
                        {formFields.send_date &&
                        formFields.send_date !== null ? (
                          formatFullDate(formFields?.send_date || "")
                        ) : (
                          <>{t("Pick Send Date")}</>
                        )}
                      </Button>
                      {formFields?.send_date ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              {" "}
                              <div
                                className="rounded-sm w-8 h-8 hover:bg-accent flex justify-center items-center"
                                onClick={() => {
                                  setFormFields({
                                    ...formFields,
                                    send_date: null,
                                  });
                                }}
                              >
                                <X className=" h-4 w-4 opacity-50" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <Text text={t("Clear")} />
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <CalendarIcon className="  h-4 w-4 opacity-50" />
                      )}
                    </Card>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formFields.send_date}
                    onSelect={(value) => {
                    
                      setFormFields({
                        ...formFields,
                        send_date: value,
                      });
                    }}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />

                  <TimePicker
                    selectedTime={formFields.send_date} // Sending the date to TimePicker component.
                    onSelectTime={(value) => {
                      // Lift the state up from TimePicker component.
                   
                      setFormFields({
                        ...formFields,
                        send_date: value,
                      });
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem className="w-full px-1">
                    <FormLabel>
                      {" "}
                      <span className="text-red-500 text-xl">*</span>{t("Notification body")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("Notification body")}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);

                          setFormFields({
                            ...formFields,
                            body: e.target.value,
                          });
                        }}
                        autoComplete="body"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

<FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="w-full px-1 pt-0">
                    <FormLabel>
                      {t("URL")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder={t("Notification URL")}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);

                          setFormFields({
                            ...formFields,
                            url: e.target.value,
                          });
                        }}
                    
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3 px-1">
                    <FormLabel>{t("Notify about...")}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);

                          setFormFields({
                            ...formFields,
                            type: value,
                          });
                        }}
                        autoComplete="title"
                        defaultValue={field.value}
                        className="flex  space-x-1"
                      >
          
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="product" />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {t("product")}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="category" />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {t("category")}
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              { formFields.type === "category" ? (
                <FormItem className="w-full px-1 ">
               
                  <CategoryAutocomplete
                    formFields={formFields}
                    setFormFields={setFormFields}
                  />
                </FormItem>
              ) : (
                <ProductAutocomplete
                  formFields={formFields}
                  setFormFields={setFormFields}
                />


              )}
              {
                !formFields?.filter_id&&
              <Alert variant="destructive" >
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{t("Warning")}</AlertTitle>
      <AlertDescription>
      {t("If no Category, or Product is selected, the notification will redirect only to the home page. Please ensure that a selection is made to provide a more relevant experience.")}
      </AlertDescription>
    </Alert>
              }
              <FormItem className="w-full px-1 ">

              <FormLabel>{t("customers")}</FormLabel>


              {/* <CustomerAutocomplete 
                             formFields={selectedCustomer}
                             setFormFields={setSelectedCustomer}
                             isFetchCategory={ false }
                            /> */}
                             <CustomsMultiCombobox
                                          
                                       
                                            endpoint={USERS_URL}
                                            itemKey={"id"}
                                            setItems={setSelectedCustomers}
                                            items={selectedCustomers}
                                            filters={customersFilters}
                                            itemTitle="username"
                                            searchQueryKey="username"
                                            sortBy="-date_joined"
                                            queryKey="users"
                                            className="border rounded-md px-1"
                                            placeholder={t("Select Customers")}
                                          >
                                            {(item) => (
    <>
      {item.first_name} {item.last_name}

    </>
  )}
                                          </CustomsMultiCombobox>
              </FormItem>

              <div className="flex justify-start items-center w-full py-2 space-x-4 px-1">
                <Button disabled={!isSubmit || isAction} type="submit">
                  {isAction ? (
                    <p className="flex justify-center items-center space-x-2">
                      <Loader2 className=" h-5 w-5 animate-spin" />
                      <span>{t("Please wait")}</span>
                    </p>
                  ) : (
                    <span>{t("Save")}</span>
                  )}
                </Button>
                <Button variant="secondary" onClick={onClose}>
                  {t("Cancel")}
                </Button>
              </div>
            </form>
          </Form>

        </ScrollArea>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

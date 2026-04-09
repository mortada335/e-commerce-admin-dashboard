import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, CalendarIcon, RotateCcw } from "lucide-react";
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

import { DELIVERY_COSTS_ULR } from "@/utils/constants/urls";
import useMutation from "@/hooks/useMutation";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { deliveryCostSchema } from "@/utils/validation/delivery-cost";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/methods";
import CanSection from "@/components/CanSection";
import { useDeliveryCostStore } from "../store";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Can from "@/components/Can";
import { useTranslation } from "react-i18next";

const defaultFormFields = {
  zone: "baghdad",
  cost: 0,
  special_cost: 0,
  special_cost_total_order: 0,
  date_start: null,
  date_end: null,
};

export default function UpdateDeliveryCostDialog({
  isDialogOpen,
  setIsDialogOpen,
}) {
  const { toast } = useToast();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { selectedDeliveryCost }=useDeliveryCostStore()

  const {t}= useTranslation()
  const form = useForm({
    resolver: yupResolver(deliveryCostSchema),
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const {
    mutate,

    isPending: isAction,
  } = useMutation("DeliveryCosts");

  useEffect(() => {
    if (formFields.zone && formFields.cost >= 0) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [formFields]);

  useEffect(() => {
    if (
      selectedDeliveryCost !== null &&
      selectedDeliveryCost !== undefined &&
      isDialogOpen
    ) {
      
      
      setFormFields({
        zone: selectedDeliveryCost.zone,
        cost: selectedDeliveryCost.cost,
        special_cost: selectedDeliveryCost.special_cost,
        special_cost_total_order: selectedDeliveryCost.special_cost_total_order,
        date_start: selectedDeliveryCost.start_date,
        date_end: selectedDeliveryCost.end_date,
        
      });
      form.setValue("zone", selectedDeliveryCost.zone);
      form.setValue("cost", selectedDeliveryCost.cost);

      form.setValue("special_cost", selectedDeliveryCost.special_cost);
      form.setValue("special_cost_total_order", selectedDeliveryCost.special_cost_total_order);
      form.setValue("date_start",selectedDeliveryCost.start_date);
      form.setValue("date_end", selectedDeliveryCost.end_date);
    } else {
      // this is server error or other erro that could happen
      setFormFields(defaultFormFields);
      form.reset();
    }
  }, [selectedDeliveryCost, isDialogOpen, form]);


  const onClose = () => {
    setIsDialogOpen(false);
    form.reset();

    setFormFields(defaultFormFields);
  };

  const onSubmit = async () => {
    // Validate currency Change

    if (!formFields.zone || Number(formFields.cost) <= 0) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }

    // set the id
    const deliveryCostId = selectedDeliveryCost?.id;

    /// send post delivery cost request

    // const formData = new FormData();

    const formData={
      zone:selectedDeliveryCost.zone,
      cost: formFields.cost,
      special_cost: 0,
      special_cost_total_order:0,
      
      date_start: null,
      date_end: null
    }
    // formData.append("zone", formFields.zone);
    // formData.append("cost", formFields.cost);

 
    //   formData.append("special_cost", formFields.special_cost||0);

    //   formData.append(
    //     "special_cost_total_order",
    //     formFields.special_cost_total_order
    //   );
    // // formData.append("special_cost", formFields.special_cost);
    // // formData.append(
    // //   "special_cost_total_order",
    // //   formFields.special_cost_total_order
    // // );

    if (formFields.special_cost) {
      
      formData.special_cost= formFields.special_cost;
    } 
    if (formFields.special_cost_total_order) {
      
      formData.special_cost_total_order= formFields.special_cost_total_order;
    } 
    if (formFields.date_start) {
      
      formData.date_start= formatDate(formFields.date_start);
    } 
    if (formFields.date_end) {
      
      formData.date_end= formatDate(formFields.date_end);
    } 



    mutate({
      url: DELIVERY_COSTS_ULR,
      id: deliveryCostId,

      headers: {
        "Content-Type": "application/json",
      },
      onFinish: onClose,
      formData,
    });
  };

  return (
    <Can permissions={[ "app_api.change_deliverycost"]}>

    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <DialogContent className="w-[95%] sm:max-w-[700px] px-4 ">
      <ScrollArea className=" w-[99%] md:w-full border-none">

        <ScrollArea className=" h-fit pr-4 w-full ">
          <DialogHeader className={"mb-4 rtl:items-end"}>
            <DialogTitle>{t("Delivery Cost")}</DialogTitle>
            <DialogDescription>
              {t("Update Delivery Cost here. Click save when you are done.")}
            </DialogDescription>
          </DialogHeader>

          <Form {...form} className="h-full bg-black">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 ">
              {/* <FormField
                control={form.control}
                name="zone"
                render={({ field }) => (
                  <FormItem className="px-1">
                    <FormLabel>
                      {" "}
                      <span className="text-red-500 text-xl">*</span>Zone
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setFormFields({
                          ...formFields,
                          zone: value,
                        });
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={"baghdad"}>Baghdad</SelectItem>
                        <SelectItem value={"others"}>Others</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem className="w-full px-1">
                    <FormLabel>
                      {" "}
                      <span className="text-red-500 text-xl">*</span>{t("Cost")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Delivery Cost"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setFormFields({
                            ...formFields,
                            cost: e.target.value,
                          });
                        }}
                        autoComplete="cost"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="special_cost"
                render={({ field }) => (
                  <FormItem className="w-full px-1">
                    <FormLabel>{t("Special Cost")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Delivery Special Cost"
                        value={field.value}
                        min={0}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setFormFields({
                            ...formFields,
                            special_cost: e.target.value,
                          });
                        }}
                        autoComplete="special_cost"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* {formFields.special_cost > 0 && (
                <> */}
                  <div className="flex justify-between items-start w-full h-fit px-1 space-x-4 pt-4">
                    <FormField
                      control={form.control}
                      name="date_start"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                          <FormLabel>{t("Start Date")}</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <div className="flex justify-start items-center gap-2">

                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>{t("Pick a date")}</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                                {
                                  field.value&&
                                  <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        onClick={() => {
                                          field.onChange(null);
                                          setFormFields({
                                            ...formFields,
                                            date_start: null,
                                          });
                                        }}
                                        size="icon"
                                        variant={"outline"}
                                      >
                                        <RotateCcw size={16} />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">{t("Clear Start Date")}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                }
                                </div>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(value) => {
                                  field.onChange(value);
                                  setFormFields({
                                    ...formFields,
                                    date_start: value,
                                  });
                                }}
                                disabled={(date) =>
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date_end"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                          <FormLabel>{t("End Date")}</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                              <div className="flex justify-start items-center gap-2">
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>{t("Pick a date")}</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                                {
                                  field.value&&
                                  <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        onClick={() => {
                                          field.onChange(null);
                                          setFormFields({
                                            ...formFields,
                                            date_end: null,
                                          });
                                        }}
                                        size="icon"
                                        variant={"outline"}
                                      >
                                        <RotateCcw size={16} />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p className="text-xs">{t("Clear End Date")}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                }
                                </div>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(value) => {
                                  field.onChange(value);
                                  setFormFields({
                                    ...formFields,
                                    date_end: value,
                                  });
                                }}
                                disabled={(date) =>
                                  date < new Date(formFields.date_start)
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="special_cost_total_order"
                    render={({ field }) => (
                      <FormItem className="w-full px-1">
                        <FormLabel>{t("Minimum Total Cost")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Delivery Minimum Total Cost"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setFormFields({
                                ...formFields,
                                special_cost_total_order: e.target.value,
                              });
                            }}
                            autoComplete="special_cost_total_order"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                {/* </>
              )} */}

              <div className="flex justify-start items-center w-full py-2 space-x-4">
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
    </Can>
  );
}

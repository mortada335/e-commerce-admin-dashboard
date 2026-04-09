import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, CalendarIcon } from "lucide-react";
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

import { ScrollArea } from "@/components/ui/scroll-area";

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
    const deliveryCostId = formFields.zone === "baghdad" ? 1 : 2;

    /// send post delivery cost request

    // const formData = new FormData();

    const formData={
      zone:formFields.zone,
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
    <CanSection permissions={[ "app_api.change_deliverycost"]}>

    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-[350px] sm:max-w-[500px] md:max-w-[700px]">
        <ScrollArea className="h-[500px] pr-4 w-full ">
          <DialogHeader>
            <DialogTitle>Delivery Cost</DialogTitle>
            <DialogDescription>
              Update Delivery Cost here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>

          <Form {...form} className="h-full bg-black">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 ">
              <FormField
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
              />
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem className="w-full px-1">
                    <FormLabel>
                      {" "}
                      <span className="text-red-500 text-xl">*</span>Cost
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
                    <FormLabel>Special Cost</FormLabel>
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
              {formFields.special_cost > 0 && (
                <>
                  <div className="flex justify-between items-start w-full h-fit px-1 space-x-4 pt-4">
                    <FormField
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                          <FormLabel>Start Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
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
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
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
                      name="end_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                          <FormLabel>End Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
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
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
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
                        <FormLabel>Minimum Total Cost</FormLabel>
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
                </>
              )}

              <div className="flex justify-end items-center w-full py-2 space-x-4">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
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
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
    </CanSection>
  );
}

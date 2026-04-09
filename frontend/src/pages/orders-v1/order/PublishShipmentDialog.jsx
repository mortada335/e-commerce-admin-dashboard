import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Loader2 } from "lucide-react";
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

import { DELIVERY_SERVICE_PUBLISH_SHIPMENT, } from "@/utils/constants/urls";

import { ScrollArea } from "@/components/ui/scroll-area";

import { publishShipmentSchema } from "@/utils/validation/order";
import { setIsPublishShipmentDialogOpenDialogOpen, useOrderStore } from "../store";

import { Input } from "@/components/ui/input";

import {
  
  convertStringToStatusId,
  handleError,
} from "@/utils/methods";
import { useQueryClient } from "@tanstack/react-query";
import CanSection from "@/components/CanSection";
import { axiosPrivate } from "@/api/axios";
import { Textarea } from "@/components/ui/textarea";
import DeliveryServiceCitiesAutocomplete from "@/components/DeliveryServiceCitiesAutocomplete";
import DeliveryServiceAreasAutocomplete from "@/components/DeliveryServiceAreasAutocomplete";
import { Label } from "@/components/ui/label";
import Can from "@/components/Can";

const defaultFormFields = {

  senderHp: "",
  receiverName:"",
  receiverHp1:"",
  receiverHp2:"",
  stateKey:"",
  stateName:"",
  districtId:"",
  districtName:"",
  locationDetails:"",
};

export default function PublishShipmentDialog({order,products}) {
  const { isPublishShipmentDialogOpen, orderDetails } = useOrderStore();
  const { toast } = useToast();
  const [formFields, setFormFields] = useState(defaultFormFields);

  const form = useForm({
    resolver: yupResolver(publishShipmentSchema),
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const [isAction, setIsAction] = useState(false);

  // Initialize query client.
  const queryClient = useQueryClient();


  useEffect(() => {
    if (

      formFields.senderHp&&
  formFields.receiverName&&
  formFields.receiverHp1&&
  formFields.stateKey&&
  formFields.stateName&&
  formFields.districtId&&
  formFields.districtName&&
  formFields.locationDetails
    ) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [formFields]);

  useEffect(() => {
    if (
      orderDetails !== null &&
      orderDetails !== undefined &&
      isPublishShipmentDialogOpen
    ) {
      setFormFields({
    
        receiverName: order?.customer_data?.customer_name || "",
        receiverHp1:  order?.customer_data?.customer_number ||"",
       
        
        locationDetails:  order?.payment_address_1||"",
      
      });

      
      form.setValue("receiverName", order?.customer_data?.customer_name || "");
      form.setValue("receiverHp1", order?.customer_data?.customer_number ||"");
     
 
      form.setValue("locationDetails", order?.payment_address_1||"");
      
    } else {
      // this is server error or other erro that could happen
      setFormFields(defaultFormFields);
      form.reset();
    }
  }, [orderDetails]);
  console.log(order);
  

  const onClose = () => {
    setIsPublishShipmentDialogOpenDialogOpen(false);
    setFormFields(defaultFormFields);
      form.reset();
  };

  const onSubmit = async () => {
    console.log(formFields.senderHp,
      formFields.receiverName,
      formFields.receiverHp1,
      formFields.stateKey,
      formFields.stateName,
      formFields.districtId,
      formFields.districtName,
      order.order_id,
      order.num_products,
      order.delivery_costs,
    
      order.total,

      formFields.locationDetails);
    
    // Validate currency Change
    if (!formFields.senderHp||
      !formFields.receiverName||
      !formFields.receiverHp1||
      !formFields.stateKey||
      !formFields.stateName||
      !formFields.districtId||
      !formFields.districtName||
      !order.order_id||
      !order.num_products||
      !order.delivery_costs||
     
      !order.total||

      !formFields.locationDetails
    ) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }

    let deliveryCosts = parseFloat(order.delivery_costs);

    // Check if the conversion was successful
    if (!isNaN(deliveryCosts)) {
        deliveryCosts = deliveryCosts.toFixed(2);
    } 
    let total = parseFloat(order.total);

    // Check if the conversion was successful
    if (!isNaN(total)) {
      total = total.toFixed(2);
    } 
    
    
    let formData = {

      senderHp: formFields.senderHp,
      receiverName:formFields.receiverName,
      receiverHp1:formFields.receiverHp1,
      receiverHp2:formFields.receiverHp2,
      state:formFields.stateKey,
      district:formFields.districtId,
      locationDetails:formFields.locationDetails,
      orderId:order.order_id,
      custReceiptNoOri:order.order_id,
      qty:order.num_products,
      shipmentCharge:deliveryCosts,
      receiptAmt:total,
      
    };

  

    

    try {
      setIsAction(true)

        const response = await axiosPrivate.post(
          DELIVERY_SERVICE_PUBLISH_SHIPMENT,

          formData,

          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )

        if (response.status === 201 || response.status === 200) {
          toast({
            title: "Success",
            description: "Publish successfully",
          })
          onClose(response.data)
        }

      

      
    } catch (error) {
      // Handle the error
      // console.log(error)
      setIsAction(false)
      handleError(error)
      
     
    }finally{
      setIsAction(false)
      queryClient.invalidateQueries({ queryKey: ['OrderV1'] })
    }

  
  };

  return (
    <Can permissions={["app_api.change_ocorder"]}>
      <Dialog
        open={isPublishShipmentDialogOpen}
        onOpenChange={setIsPublishShipmentDialogOpenDialogOpen}
      >
        <DialogContent className="max-w-[90%]  sm:max-w-[500px] md:max-w-[700px]">
          <ScrollArea className=" h-[500px] pr-4 w-full ">
            <DialogHeader>
              <DialogTitle className="tracking-wide">Publish Shipment</DialogTitle>
              <DialogDescription>
                Publish shipment order here. Click save when you are done.
              </DialogDescription>
            </DialogHeader>

            <Form {...form} className="h-full bg-black">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 pt-4"
              >
                <div className="flex w-full justify-center items-center">

                <FormField
                  control={form.control}
                  name="senderHp"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-0">
                      <FormLabel className="capitalize">Sender Phone Number<span className="text-red-500 text-xl">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Sender Phone Number"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                            setFormFields({
                              ...formFields,
                              senderHp: e.target.value,
                            });
                          }}
                          autoComplete="senderHp"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="receiverName"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-0">
                      <FormLabel className="capitalize">Receiver Name<span className="text-red-500 text-xl">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          readOnly={order?.customer_data?.customer_name}
                          placeholder="Enter Receiver Name"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                            setFormFields({
                              ...formFields,
                              receiverName: e.target.value,
                            });
                          }}
                          autoComplete="receiverName"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
                <div className="flex w-full justify-center items-center">

                <FormField
                  control={form.control}
                  name="receiverHp1"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-0">
                      <FormLabel className="capitalize">Receiver Phone Number <span className="text-red-500 text-xl">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          // readOnly={order?.customer_data?.customer_number}
                          placeholder="Enter Receiver Phone Number"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                            setFormFields({
                              ...formFields,
                              receiverHp1: e.target.value,
                            });
                          }}
                          autoComplete="receiverHp1"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="receiverHp2"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-0">
                      <FormLabel className="capitalize">Receiver Second Phone Number<span className="text-red-500 text-xl">*</span></FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Receiver Second  Phone Number"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                            setFormFields({
                              ...formFields,
                              receiverHp2: e.target.value,
                            });
                          }}
                          autoComplete="receiverHp2"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
               
                </div>
                <div className="flex w-full justify-center items-center gap-2 ">
                  <div className="flex flex-col gap-2 justify-start items-start w-full">
                  <Label className="capitalize">Receiver City<span className="text-red-500 text-xl">*</span></Label>
                  <DeliveryServiceCitiesAutocomplete formFields={formFields} setFormFields={setFormFields} orderShippingCity={order?.shipping_city}/>
                  </div>
                  <div className="flex flex-col gap-2 justify-start items-start w-full">
                  <Label className="capitalize">Receiver Area<span className="text-red-500 text-xl">*</span></Label>
                  <DeliveryServiceAreasAutocomplete formFields={formFields} setFormFields={setFormFields} stateKey={formFields.stateKey}/>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="locationDetails"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-0">
                      <FormLabel className="capitalize">Location Details<span className="text-red-500 text-xl">*</span></FormLabel>
                      <FormControl>
                        <Textarea
                         
                          placeholder="Enter Location Details"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                            setFormFields({
                              ...formFields,
                              locationDetails: e.target.value,
                            });
                          }}
                          autoComplete="locationDetails"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

             

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
    </Can>
  );
}

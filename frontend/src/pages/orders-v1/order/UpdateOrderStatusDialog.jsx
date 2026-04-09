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

import { ORDERS_V1_URL } from "@/utils/constants/urls";

import { ScrollArea } from "@/components/ui/scroll-area";

import { statusSchema } from "@/utils/validation/order";
import { setIsUpdateOrderStatusDialogOpen, useOrderStore } from "../store";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  convertStatusIdToString,
  convertStringToStatusId,
  handleError,
} from "@/utils/methods";
import { useQueryClient } from "@tanstack/react-query";
import CanSection from "@/components/CanSection";
import { axiosPrivate } from "@/api/axios";
import Can from "@/components/Can";

const defaultFormFields = {
  status: 1,
  comment: "",
};

export default function UpdateOrderStatusDialog() {
  const { isUpdateOrderStatusDialogOpen, orderDetails } = useOrderStore();
  const { toast } = useToast();
  const [formFields, setFormFields] = useState(defaultFormFields);

  const form = useForm({
    resolver: yupResolver(statusSchema),
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const [isAction, setIsAction] = useState(false);

  // Initialize query client.
  const queryClient = useQueryClient();

  useEffect(() => {
    if (formFields.status) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [formFields]);

  useEffect(() => {
    if (
      orderDetails !== null &&
      orderDetails !== undefined &&
      isUpdateOrderStatusDialogOpen
    ) {
      setFormFields({
        comment: orderDetails.comment || "",
        status: convertStatusIdToString(orderDetails.order_status_id),
      });

      form.setValue("comment", "");
      form.setValue(
        "status",
        convertStatusIdToString(orderDetails.order_status_id)
      );
    } else {
      // this is server error or other erro that could happen
      setFormFields(defaultFormFields);
      form.reset();
    }
  }, [orderDetails]);

  const onClose = () => {
    setIsUpdateOrderStatusDialogOpen(false);
    form.setValue("comment", "");
    form.setValue(
      "status",
      convertStatusIdToString(orderDetails.order_status_id)
    );

    setFormFields({
      status: orderDetails.order_status_id,
      comment: "",
    });
  };

  const onSubmit = async () => {
    // Validate currency Change
    if (!formFields.status) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }

    const arrayOfUserNotifiedOrNot =
      orderDetails?.customer_notified_id &&
      orderDetails?.customer_notified_id != ""
        ? JSON.parse(orderDetails?.customer_notified_id)
        : "";

    if (arrayOfUserNotifiedOrNot?.length) {
      arrayOfUserNotifiedOrNot.unshift(0);
    }

    let formData = {};

    formData = Object.fromEntries(
      Object.entries({
        comment: formFields.comment ? formFields.comment : null,
        order_status_id: convertStringToStatusId(formFields.status),
        // eslint-disable-next-line no-unused-vars
      }).filter(
        ([_, value]) => value !== "" && value !== undefined && value !== null
      )
    );

    try {
      setIsAction(true);

      const response = await axiosPrivate.patch(
        `${ORDERS_V1_URL}${orderDetails?.order_id}/`,

        formData,

        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast({
          title: "Success",
          description: "Updated successfully",
        });
        onClose(response.data);
      }
    } catch (error) {
      // Handle the error
      // console.log(error)
      setIsAction(false);
      handleError(error);
    } finally {
      setIsAction(false);
      queryClient.invalidateQueries({ queryKey: ["OrderV1"] });
    }
  };

  return (
    <Can permissions={["app_api.change_ocorder"]}>
      <Dialog
        open={isUpdateOrderStatusDialogOpen}
        onOpenChange={setIsUpdateOrderStatusDialogOpen}
      >
        <DialogContent className="max-w-[350px] sm:max-w-[500px] md:max-w-[700px]">
          <ScrollArea className=" h-[400px] pr-4 w-full ">
            <DialogHeader>
              <DialogTitle className="tracking-wide">Update Order</DialogTitle>
              <DialogDescription>
                Make changes to order here. Click save when you are done.
              </DialogDescription>
            </DialogHeader>

            <Form {...form} className="h-full bg-black">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 pt-4"
              >
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="space-y-3 px-1">
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);

                          setFormFields({
                            ...formFields,
                            status: value,
                          });
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={"Pending"}>Pending</SelectItem>
                          <SelectItem value={"Completed"}>Completed</SelectItem>
                          <SelectItem value={"Cancelled Order"}>
                            Cancelled Order
                          </SelectItem>
                          <SelectItem value={"Refunded"}>Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-0">
                      <FormLabel className="capitalize">comment</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Comment"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                            setFormFields({
                              ...formFields,
                              comment: e.target.value,
                            });
                          }}
                          autoComplete="comment"
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

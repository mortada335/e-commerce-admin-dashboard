import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import UserMultiSelect from "@/components/UserMultiSelect";

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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { ORDERS_URL } from "@/utils/constants/urls";
import useMutation from "@/hooks/useMutation";

import { ScrollArea } from "@/components/ui/scroll-area";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { orderSchema } from "@/utils/validation/order";
import { setIsOrderDialogOpen, useOrderStore } from "../store";
import {
  convertStatusIdToString,
  convertStringToStatusId,
} from "@/utils/methods";
import CouponAutocomplete from "@/components/CouponAutocomplete";
import { useTranslation } from "react-i18next";

const defaultFormFields = {
  payment_firstname: "",
  payment_lastname: "",
  payment_address_1: "",
  payment_address_2: "",
  payment_city: "",
  payment_postcode: "",
  payment_custom_field: "",
  shipping_firstname: "",
  shipping_lastname: "",
  shipping_address_1: "",
  shipping_address_2: "",
  shipping_city: "",
  shipping_postcode: "",
  shipping_custom_field: "",
  payment_method: "",
  num_products: 0,
  comment: "",
  sub_total: 0,
  total_after_discount: 0,
  order_status_id: "",
  coupon: "",
};
export default function OrderDialog() {
  const { isOrderDialogOpen, selectedOrder } = useOrderStore();
  const { toast } = useToast();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [categoryFormFields, setCategoryFormFields] = useState([]);

  const { t } = useTranslation();
  const form = useForm({
    resolver: yupResolver(orderSchema),
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const {
    mutate,

    isPending: isAction,
  } = useMutation("Orders");

  useEffect(() => {
    const isPaymentValid =
      formFields.payment_firstname &&
      formFields.payment_lastname &&
      formFields.payment_address_1 &&
      formFields.payment_city;

    const isShippingValid =
      formFields.shipping_firstname &&
      formFields.shipping_lastname &&
      formFields.shipping_address_1 &&
      formFields.shipping_city;

    setIsSubmit(isPaymentValid && isShippingValid);
  }, [formFields]);

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    Object.entries(form.formState.errors).forEach(([key, value]) => {
      if (value.message) {
        return toast({
          variant: "destructive",
          title: "Failed!!!",
          description: value.message,
        });
      } else {
        return;
      }
    });
  }, [form.formState.errors]);

  useEffect(() => {
    if (selectedOrder && isOrderDialogOpen) {
      const {
        payment_firstname,
        payment_lastname,
        payment_address_1,
        payment_address_2,
        payment_city,
        payment_postcode,
        shipping_firstname,
        shipping_lastname,
        shipping_address_1,
        shipping_address_2,
        shipping_city,
        shipping_postcode,
        payment_method,
        num_products,
        comment,
        sub_total,
        total_after_discount,
        order_status_id,
        coupon,
      } = selectedOrder;

      const paymentCustomField =
        selectedOrder.payment_custom_field ||
        defaultFormFields.payment_custom_field;
      const shippingCustomField =
        selectedOrder.shipping_custom_field ||
        defaultFormFields.shipping_custom_field;

      setFormFields({
        payment_firstname,
        payment_lastname,
        payment_address_1,
        payment_address_2,
        payment_city,
        payment_postcode,
        payment_custom_field: paymentCustomField,
        shipping_firstname,
        shipping_lastname,
        shipping_address_1,
        shipping_address_2,
        shipping_city,
        shipping_postcode,
        shipping_custom_field: shippingCustomField,
        payment_method,
        num_products,
        comment,
        sub_total,
        total_after_discount,
        order_status_id: convertStatusIdToString(order_status_id),
        coupon,
      });

      Object.entries(selectedOrder).forEach(([key, value]) => {
        if (key === "order_status_id") {
          form.setValue(key, convertStatusIdToString(value));
        } else {
          form.setValue(key, value);
        }
      });
    } else {
      setFormFields(defaultFormFields);
      form.reset();
    }
  }, [selectedOrder, isOrderDialogOpen]);

  const onClose = () => {
    setIsOrderDialogOpen(false);
    form.reset();
    setFormFields(defaultFormFields);
  };

  const onSubmit = async () => {
    // Validate currency Change
    const isPaymentValid =
      formFields.payment_firstname &&
      formFields.payment_lastname &&
      formFields.payment_address_1 &&
      formFields.payment_city;

    const isShippingValid =
      formFields.shipping_firstname &&
      formFields.shipping_lastname &&
      formFields.shipping_address_1 &&
      formFields.shipping_city;
    if (!isShippingValid && !isPaymentValid) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }

    let formData = {};

    formData = Object.fromEntries(
      Object.entries({
        ...formFields,

        //TODO remove -
        shipping_postcode: formFields.shipping_postcode
          ? formFields.shipping_postcode
          : "-",
        payment_postcode: formFields.payment_postcode
          ? formFields.payment_postcode
          : "-",
        shipping_custom_field: formFields.shipping_custom_field
          ? formFields.shipping_custom_field
          : "-",
        payment_custom_field: formFields.payment_custom_field
          ? formFields.payment_custom_field
          : "-",
        shipping_address_2: formFields.shipping_address_2
          ? formFields.shipping_address_2
          : "-",
        payment_address_2: formFields.payment_address_2
          ? formFields.payment_address_2
          : "-",
        coupon: formFields.coupon ? formFields.coupon : null,
        coupon_discount_value: formFields.coupon
          ? `-${formFields.coupon_discount_value}`
          : null,
        comment: formFields.comment ? formFields.comment : null,
        order_status_id: convertStringToStatusId(formFields.order_status_id),
        // eslint-disable-next-line no-unused-vars
      }).filter(([_, value]) => value !== undefined && value !== null)
    );

    mutate({
      url: ORDERS_URL,
      id: selectedOrder?.order_id,
      headers: {
        "Content-Type": "application/json",
      },
      onFinish: onClose,
      formData,
    });
  };

  return (
    <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
      <DialogContent className="sm:max-w-[900px]">
        <ScrollArea className=" h-[500px] pr-4 w-full ">
          <DialogHeader className={"rtl:items-end"}>
            <DialogTitle>{t("Edit Order")}</DialogTitle>
            <DialogDescription>
              {t(
                "Make changes to any Order here. Click save when you are done."
              )}
            </DialogDescription>
            jhikldfghdkfjgdjf
          </DialogHeader>

          <Form {...form} className="h-full bg-black">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 ">
              <div className="">
                <Accordion className="w-[830px]" type="single" collapsible>
                  <AccordionItem className="w-full" value="shipping">
                    <AccordionTrigger className="w-full">
                      {t("Shipping")}
                    </AccordionTrigger>
                    <AccordionContent className="grid grid-cols-3 place-content-center place-items-start w-full gap-4">
                      <FormField
                        control={form.control}
                        name="shipping_firstname"
                        render={({ field }) => (
                          <FormItem className="w-full px-1 pt-0">
                            <FormLabel className="capitalize">
                              <span className="text-red-500 text-xl">*</span>
                              {t("Shipping First Name")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder={t("Enter Shipping First Name")}
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.value);

                                  setFormFields({
                                    ...formFields,
                                    shipping_firstname: e.target.value,
                                  });
                                }}
                                autoComplete="shipping_firstname"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shipping_lastname"
                        render={({ field }) => (
                          <FormItem className="w-full px-1 pt-0">
                            <FormLabel className="capitalize">
                              <span className="text-red-500 text-xl">*</span>{" "}
                              {t("Shipping Last Name")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder={t("Enter Shipping Last Name")}
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.value);

                                  setFormFields({
                                    ...formFields,
                                    shipping_lastname: e.target.value,
                                  });
                                }}
                                autoComplete="shipping_lastname"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shipping_address_1"
                        render={({ field }) => (
                          <FormItem className="w-full px-1 pt-0">
                            <FormLabel className="capitalize">
                              <span className="text-red-500 text-xl">*</span>{" "}
                              {t("Shipping Address 1")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder={t("Enter Shipping Address 1")}
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.value);

                                  setFormFields({
                                    ...formFields,
                                    shipping_address_1: e.target.value,
                                  });
                                }}
                                autoComplete="shipping_address_1"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shipping_address_2"
                        render={({ field }) => (
                          <FormItem className="w-full px-1 pt-0">
                            <FormLabel className="capitalize">
                              <span className="text-red-500 text-xl">*</span>{" "}
                              {t("Shipping Address 2")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder={t("Enter Shipping Address 2")}
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.value);

                                  setFormFields({
                                    ...formFields,
                                    shipping_address_2: e.target.value,
                                  });
                                }}
                                autoComplete="shipping_address_2"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shipping_city"
                        render={({ field }) => (
                          <FormItem className="w-full px-1 pt-0">
                            <FormLabel className="capitalize">
                              <span className="text-red-500 text-xl">*</span>{" "}
                              {t("Shipping City")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder={t("Enter Shipping City")}
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.value);

                                  setFormFields({
                                    ...formFields,
                                    shipping_city: e.target.value,
                                  });
                                }}
                                autoComplete="shipping_city"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shipping_postcode"
                        render={({ field }) => (
                          <FormItem className="w-full px-1 pt-0">
                            <FormLabel className="capitalize">
                              <span className="text-red-500 text-xl">*</span>{" "}
                              {t("Shipping Postcode")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder={t("Enter Shipping Postcode")}
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.value);

                                  setFormFields({
                                    ...formFields,
                                    shipping_postcode: e.target.value,
                                  });
                                }}
                                autoComplete="shipping_postcode"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shipping_custom_field"
                        render={({ field }) => (
                          <FormItem className="w-full px-1 pt-0">
                            <FormLabel className="capitalize">
                              <span className="text-red-500 text-xl">*</span>{" "}
                              {t("Shipping Custom Field")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder={t("Enter Shipping Custom Field")}
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.value);

                                  setFormFields({
                                    ...formFields,
                                    shipping_custom_field: e.target.value,
                                  });
                                }}
                                autoComplete="shipping_custom_field"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormItem className="w-full px-1 ">
                        <FormLabel>Users</FormLabel>
                        <UserMultiSelect
                          className="py-1 px-1 border rounded-md "
                          selectedCategories={categoryFormFields}
                          setSelectedCategories={setCategoryFormFields}
                        />
                      </FormItem>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem className="w-full" value="payment">
                    <AccordionTrigger className="w-full">
                      {t("Payment")}
                    </AccordionTrigger>
                    <AccordionContent className="grid grid-cols-3 place-content-center place-items-start w-full gap-4">
                      <FormField
                        control={form.control}
                        name="payment_firstname"
                        render={({ field }) => (
                          <FormItem className="w-full px-1 pt-0">
                            <FormLabel className="capitalize">
                              <span className="text-red-500 text-xl">*</span>{" "}
                              {t("Payment First Name")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder={t("Enter Payment First Name")}
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.value);

                                  setFormFields({
                                    ...formFields,
                                    payment_firstname: e.target.value,
                                  });
                                }}
                                autoComplete="payment_firstname"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="payment_lastname"
                        render={({ field }) => (
                          <FormItem className="w-full px-1 pt-0">
                            <FormLabel className="capitalize">
                              <span className="text-red-500 text-xl">*</span>{" "}
                              {t("Payment Last Name")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder={t("Enter Payment Last Name")}
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.value);

                                  setFormFields({
                                    ...formFields,
                                    payment_lastname: e.target.value,
                                  });
                                }}
                                autoComplete="payment_lastname"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="payment_address_1"
                        render={({ field }) => (
                          <FormItem className="w-full px-1 pt-0">
                            <FormLabel className="capitalize">
                              <span className="text-red-500 text-xl">*</span>{" "}
                              {t("Payment Address 1")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder={t("Enter Payment Address 1")}
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.value);

                                  setFormFields({
                                    ...formFields,
                                    payment_address_1: e.target.value,
                                  });
                                }}
                                autoComplete="payment_address_1"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="payment_address_2"
                        render={({ field }) => (
                          <FormItem className="w-full px-1 pt-0">
                            <FormLabel className="capitalize">
                              <span className="text-red-500 text-xl">*</span>{" "}
                              {t("Payment Address 2")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder={t("Enter Payment Address 2")}
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.value);

                                  setFormFields({
                                    ...formFields,
                                    payment_address_2: e.target.value,
                                  });
                                }}
                                autoComplete="payment_address_2"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="payment_city"
                        render={({ field }) => (
                          <FormItem className="w-full px-1 pt-0">
                            <FormLabel className="capitalize">
                              {" "}
                              <span className="text-red-500 text-xl">*</span>
                              {t("Payment City")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder={t("Enter Payment City")}
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.value);

                                  setFormFields({
                                    ...formFields,
                                    payment_city: e.target.value,
                                  });
                                }}
                                autoComplete="payment_city"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="payment_postcode"
                        render={({ field }) => (
                          <FormItem className="w-full px-1 pt-0">
                            <FormLabel className="capitalize">
                              <span className="text-red-500 text-xl">*</span>
                              {t("Payment Postcode")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder={t("Enter Payment Postcode")}
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.value);

                                  setFormFields({
                                    ...formFields,
                                    payment_postcode: e.target.value,
                                  });
                                }}
                                autoComplete="payment_postcode"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="payment_custom_field"
                        render={({ field }) => (
                          <FormItem className="w-full px-1 pt-0">
                            <FormLabel className="capitalize">
                              <span className="text-red-500 text-xl">*</span>{" "}
                              {t("Payment Custom Field")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder={t("Enter Payment Custom Field")}
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.value);

                                  setFormFields({
                                    ...formFields,
                                    payment_custom_field: e.target.value,
                                  });
                                }}
                                autoComplete="payment_custom_field"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="payment_method"
                        render={({ field }) => (
                          <FormItem className="w-full px-1 pt-0">
                            <FormLabel className="capitalize">
                              {t("Payment Method")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder={t("Enter Payment Method")}
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.value);

                                  setFormFields({
                                    ...formFields,
                                    payment_method: e.target.value,
                                  });
                                }}
                                autoComplete="payment_method"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem className="w-full" value="other">
                    <AccordionTrigger className="w-full">
                      {t("Other")}
                    </AccordionTrigger>
                    <AccordionContent className="grid grid-cols-3 place-content-center place-items-start w-full gap-4">
                      <FormField
                        control={form.control}
                        name="num_products"
                        render={({ field }) => (
                          <FormItem className="w-full px-1 pt-0">
                            <FormLabel className="capitalize">
                              {t("Num Products")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder={t("Enter Num Products")}
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.value);

                                  setFormFields({
                                    ...formFields,
                                    num_products: e.target.value,
                                  });
                                }}
                                autoComplete="num_products"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sub_total"
                        render={({ field }) => (
                          <FormItem className="w-full px-1 pt-0">
                            <FormLabel className="capitalize">
                              {t("Total")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder={t("Enter Total")}
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.value);

                                  setFormFields({
                                    ...formFields,
                                    sub_total: e.target.value,
                                  });
                                }}
                                autoComplete="sub_total"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="coupon"
                        render={({ field }) => (
                          <FormItem className="w-full px-1 pt-0">
                            <FormLabel className="capitalize">
                              {t("coupon")}
                            </FormLabel>
                            <FormControl>
                              <CouponAutocomplete
                                formFields={formFields}
                                setFormFields={setFormFields}
                                coupon={formFields.coupon}
                              />

                              {/* <Input
                                type="text"
                                placeholder="Enter coupon"
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.value)

                                  setFormFields({
                                    ...formFields,
                                    coupon: e.target.value,
                                  })
                                }}
                                autoComplete="coupon"
                              /> */}
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="total_after_discount"
                        render={({ field }) => (
                          <FormItem className="w-full px-1 pt-0">
                            <FormLabel className="capitalize">
                              {t("Total After Discount")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder={t("Enter Total After Discount")}
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.value);

                                  setFormFields({
                                    ...formFields,
                                    total_after_discount: e.target.value,
                                  });
                                }}
                                autoComplete="total_after_discount"
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                          <FormItem className="w-full px-1 pt-0">
                            <FormLabel className="capitalize">
                              {t("Comment")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                placeholder={t("Enter Comment")}
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
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              <FormField
                control={form.control}
                name="order_status_id"
                render={({ field }) => (
                  <FormItem className="space-y-3 px-1">
                    <FormLabel>{t("Order Status")}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);

                          setFormFields({
                            ...formFields,
                            order_status_id: value,
                          });
                        }}
                        autoComplete="order_status_id"
                        defaultValue={field.value}
                        className="flex space-x-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="New Order" />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {t("New Order")}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Completed" />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {t("Completed")}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Cancelled Order" />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {t("Cancelled Order")}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Refunded" />
                          </FormControl>
                          <FormLabel className="font-normal capitalize">
                            {t("Refunded")}
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end items-center w-full py-2 space-x-4">
                <Button variant="secondary" onClick={onClose}>
                  {t("Cancel")}
                </Button>
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
              </div>
            </form>
          </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

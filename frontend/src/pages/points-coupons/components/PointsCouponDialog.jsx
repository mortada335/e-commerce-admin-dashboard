import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

import { POINT_COUPONS_URL } from "@/utils/constants/urls";
import useMutation from "@/hooks/useMutation";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { setIsPointsCouponDialogOpen, usePointsCouponStore } from "../store";

import { couponSchema } from "@/utils/validation/points-coupon";
import CanSection from "@/components/CanSection";
import { useLocation } from "react-router-dom";
import Can from "@/components/Can";
import { useTranslation } from "react-i18next";

const defaultFormFields = {
  name: "",
  points_needed: 0,
  discount: 0,
  days_to_expire_after_added: null,
};

export default function PointsCouponDialog() {
  // React router hook.
  const { pathname } = useLocation();
  const {t} = useTranslation()

  const { isPointsCouponDialogOpen, selectedPointsCoupon } =
    usePointsCouponStore();
  const { toast } = useToast();
  const [formFields, setFormFields] = useState(defaultFormFields);

  const form = useForm({
    resolver: yupResolver(couponSchema),
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const {
    mutate,

    isPending: isAction,
  } = useMutation("PointsCoupons");

  useEffect(() => {
    if (formFields.name && formFields.points_needed && formFields.discount) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [formFields]);

  useEffect(() => {
    if (
      selectedPointsCoupon !== null &&
      selectedPointsCoupon !== undefined &&
      isPointsCouponDialogOpen
    ) {
      setFormFields({
        name: selectedPointsCoupon.name,
        points_needed: selectedPointsCoupon.points_needed,
        discount: selectedPointsCoupon.discount,
        days_to_expire_after_added: Number(selectedPointsCoupon.days_to_expire),
      });

      form.setValue("name", selectedPointsCoupon.name);
      form.setValue("points_needed", selectedPointsCoupon.points_needed);
      form.setValue("discount", selectedPointsCoupon.discount);
      form.setValue(
        "days_to_expire_after_added",
        Number(selectedPointsCoupon.days_to_expire)
      );
    } else {
      // this is server error or other error that could happen
      setFormFields(defaultFormFields);
      form.reset();
    }
  }, [selectedPointsCoupon]);

  const onClose = () => {
    setIsPointsCouponDialogOpen(false);
    form.reset();

    setFormFields(defaultFormFields);
  };

  const onSubmit = async () => {
    // Validate currency Change
    if (!formFields.name || !formFields.points_needed || !formFields.discount) {
      return toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }

    const formData = new FormData();
    formData.append("name", formFields.name);
    formData.append("points_needed", formFields.points_needed);
    formData.append("discount", formFields.discount);
    if (formFields.days_to_expire_after_added)
      formData.append(
        "days_to_expire_after_added",
        formFields.days_to_expire_after_added
      );
    mutate({
      url: POINT_COUPONS_URL,
      id: selectedPointsCoupon?.id,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onFinish: onClose,
      formData,
    });
  };

  return (
    <Can permissions={["app_api.change_couponoffer"]}>
      <Dialog
        open={isPointsCouponDialogOpen}
        onOpenChange={setIsPointsCouponDialogOpen}
      >
        <DialogContent className="w-[95%] sm:max-w-[700px] px-4 ">
      <ScrollArea className=" w-[99%] md:w-full border-none">

        <ScrollArea className="h-fit pr-4 w-full ">
            <DialogHeader className={"rtl:items-end"}>
              <DialogTitle>
                {selectedPointsCoupon?.id
                  ? t("Edit")
                  : pathname.endsWith("points")
                  ? t("Add")
                  : t("Create")}{" "}
                {pathname.endsWith("points")
                  ? t("Promo Code Points")
                  : t("Promo Codes")}
              </DialogTitle>
              <DialogDescription>
                {selectedPointsCoupon?.id ? t("Make changes to your") : t("Create")}{" "}
                {t("Promo Codes here. Click save when you are done.")}
              </DialogDescription>
            </DialogHeader>

            <Form {...form} className="h-full bg-black">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2 "
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-0">
                      <FormLabel>
                        {" "}
                        <span className="text-red-500 text-xl">*</span>{t("Name")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("Promo Codes name")}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                            setFormFields({
                              ...formFields,
                              name: e.target.value,
                            });
                          }}
                          autoComplete="name"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="points_needed"
                  render={({ field }) => (
                    <FormItem className="w-full pt-0 px-1">
                      <FormLabel>
                        {" "}
                        <span className="text-red-500 text-xl">*</span>{t("Points Needed")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={2147483647}
                          placeholder={t("Promo Codes Points Needed")}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);

                            setFormFields({
                              ...formFields,
                              points_needed: e.target.value,
                            });
                          }}
                          autoComplete="points_needed"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem className="w-full px-1">
                      <FormLabel>
                        {" "}
                        <span className="text-red-500 text-xl">*</span>{t("Discount")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={2147483647}
                          placeholder={t("Promo Codes discount")}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setFormFields({
                              ...formFields,
                              discount: e.target.value,
                            });
                          }}
                          autoComplete="discount"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="days_to_expire_after_added"
                  render={({ field }) => (
                    <FormItem className="w-full px-1">
                      <FormLabel>{t("Days to Expire")}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t("Promo Codes Days to Expire (Leave it blank will never expire)")}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setFormFields({
                              ...formFields,
                              days_to_expire_after_added: e.target.value,
                            });
                          }}
                          autoComplete="days_to_expire_after_added"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

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

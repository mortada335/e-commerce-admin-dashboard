import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import useMutation from "@/hooks/useMutation";
import { setIsZoneDialogOpen, useWarehousesStore } from "../../store";

// ✅ Validation schema
const zoneSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  distance: yup.string().required("Distance is required"),
  threshold: yup.string().required("Threshold is required"),
  fees_above_threshold: yup.string().required("Fees above threshold is required"),
  fees_below_threshold: yup.string().required("Fees below threshold is required"),
  service_fee: yup.string().required("Service fee is required"),
  mov: yup.string().required("MOV is required"),
  active: yup.string().oneOf(["active", "inactive"]),
});

const defaultFormFields = {
  warehouse: "",
  name: "",
  distance: "",
  threshold: "",
  fees_above_threshold: "",
  fees_below_threshold: "",
  service_fee: "",
  mov: "",
  active: "active",
};

export default function ZonesDialog({ warehouseId }) {
  const { t } = useTranslation();
  const { isZoneDialogOpen, selectedZone } = useWarehousesStore();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const [isSubmit, setIsSubmit] = useState(false);
  const { mutate, isPending } = useMutation("WarehouseZones");

  const form = useForm({
    resolver: yupResolver(zoneSchema),
    defaultValues: defaultFormFields,
  });

  // ✅ Autofill when editing
  useEffect(() => {
    if (selectedZone && isZoneDialogOpen) {
      console.log(selectedZone)
      const zoneData = {
        ...selectedZone,
        active: selectedZone.active ? "active" : "inactive",
      };
      form.reset(zoneData);
      setFormFields(zoneData);
    } else {
      form.reset({ ...defaultFormFields, warehouse: warehouseId });
      setFormFields({ ...defaultFormFields, warehouse: warehouseId });
    }
  }, [selectedZone, isZoneDialogOpen, warehouseId]);

  // ✅ Track form validity
  useEffect(() => {
    const filled =
      formFields.name &&
      formFields.distance &&
      formFields.threshold &&
      formFields.fees_above_threshold &&
      formFields.fees_below_threshold &&
      formFields.service_fee &&
      formFields.mov;
    setIsSubmit(Boolean(filled));
  }, [formFields]);

  const onClose = () => {
    setIsZoneDialogOpen(false);
    form.reset(defaultFormFields);
    setFormFields(defaultFormFields);
  };

  const onSubmit = async () => {
    if (!isSubmit) {
      return toast.error(t("Please fill all the required fields"));
    }

    const payload = {
      warehouse: warehouseId,
      name: formFields.name,
      distance: formFields.distance,
      threshold: formFields.threshold,
      fees_above_threshold: formFields.fees_above_threshold,
      fees_below_threshold: formFields.fees_below_threshold,
      service_fee: formFields.service_fee,
      mov: formFields.mov,
      active: formFields.active === "active",
    };

    mutate({
      url: `/warehouse_zones_admin/`,
      id: selectedZone?.id,
      headers: { "Content-Type": "application/json" },
      formData: payload,
      onFinish: ()=>{
        onClose()
        toast.success(selectedZone ? t("Zone updated successfully") : t("Zone created successfully"))
      },
      onError: (error) =>
        toast.error(error?.message || t("Something went wrong")),
    });
  };

  return (
    <Dialog open={isZoneDialogOpen} onOpenChange={setIsZoneDialogOpen}>
      <DialogContent className="w-[95%] sm:max-w-[700px] px-4">
        <ScrollArea className="w-full">
          <ScrollArea className="h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] 2xl:h-fit pr-4 w-full">
            <DialogHeader className={"rtl:items-end"}>
              <DialogTitle>
                {selectedZone?.id ? t("Edit Warehouse Zone") : t("Create Warehouse Zone")}
              </DialogTitle>
              <DialogDescription>
                {selectedZone
                  ? t("Make changes to the zone here.")
                  : t("Create a new warehouse zone here.")}{" "}
                {t("Click save when you are done.")}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full px-1 pt-0">
                      <FormLabel>
                        <span className="text-red-500">*</span> {t("Name")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("Zone name")}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setFormFields({ ...formFields, name: e.target.value });
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Numeric fields */}
                {[
                  ["distance", "Distance"],
                  ["threshold", "Threshold"],
                  ["fees_above_threshold", "Fees Above Threshold"],
                  ["fees_below_threshold", "Fees Below Threshold"],
                  ["service_fee", "Service Fee"],
                  ["mov", "MOV"],
                ].map(([key, label]) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key}
                    render={({ field }) => (
                      <FormItem className="w-full px-1 pt-0">
                        <FormLabel>
                          <span className="text-red-500">*</span> {t(label)}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t(label)}
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setFormFields({ ...formFields, [key]: e.target.value });
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                {/* Active / Inactive */}
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="space-y-3 px-1">
                      <FormLabel>{t("Status")}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value);
                            setFormFields({ ...formFields, active: value });
                          }}
                          defaultValue={field.value}
                          className="flex space-x-3"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="active" />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">
                              {t("Active")}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="inactive" />
                            </FormControl>
                            <FormLabel className="font-normal capitalize">
                              {t("Inactive")}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action buttons */}
                <div className="flex justify-start items-center w-full py-3 space-x-4">
                  <Button disabled={!isSubmit || isPending} type="submit">
                    {isPending ? (
                      <p className="flex justify-center items-center space-x-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
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

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

import { SMS_LOGS_URL } from "@/utils/constants/urls";
import useMutation from "@/hooks/useMutation";

import { ScrollArea } from "@/components/ui/scroll-area";


import { setIsSMSLogDialogOpen, useSMSLogsStore } from "../store";

import CanSection from "@/components/CanSection";

import { addHours, isBefore } from "date-fns";

const endDatePlusHour = new Date();
endDatePlusHour.setHours(endDatePlusHour.getHours() + 1);
const defaultFormFields = {
  title: "",
  image: null,
  SMSLog_type: "product",
  filter_id: "",
  sort_order: 0,
  event_date: new Date(),
  event_date_end: endDatePlusHour,
  language_id: "english",
};

export default function SMSLogDialog() {
  const { isSMSLogDialogOpen, selectedSMSLog } = useSMSLogsStore();
  const { toast } = useToast();
  const [formFields, setFormFields] = useState(defaultFormFields);

  // Date status state.
  const [dateStatus, setDateStatus] = useState({
    isSubmit: false,
    isValid: false,
  });


  const [isSubmit, setIsSubmit] = useState(false);

  const {
    mutate,

    isPending: isAction,
  } = useMutation("SMSLogs");

  // Effect for tracking validity of dates.
  useEffect(() => {
    const startDate = new Date(formFields.event_date);
    const endDate = new Date(formFields.event_date_end);

    // Check if endDate is before (earlier than) startDate + 1 hour
    if (isBefore(endDate, addHours(startDate, 1))) {
      setDateStatus((prevStatus) => ({
        ...prevStatus,
        isValid: false,
      }));
    } else {
      setDateStatus((prevStatus) => ({
        ...prevStatus,
        isValid: true,
      }));
    }
  }, [formFields.event_date, formFields.event_date_end]);

  useEffect(() => {
    if (
      formFields.title &&
      formFields.image &&
      formFields.sort_order >= 0 &&
      formFields.filter_id
    ) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [formFields]);

  useEffect(() => {
    if (
      selectedSMSLog !== null &&
      selectedSMSLog !== undefined &&
      isSMSLogDialogOpen
    ) {
      setFormFields({
        title: selectedSMSLog.title || "",
        image: selectedSMSLog.image || null,

        sort_order: selectedSMSLog.sort_order || 0,
        language_id:
          selectedSMSLog.language_id === 1 ? "english" : "arabic" || "english",

        SMSLog_type: selectedSMSLog.SMSLog_type || "product",
        filter_id: selectedSMSLog.SMSLog_type_id || "",
        event_date: selectedSMSLog.event_date
          ? new Date(selectedSMSLog.event_date)
          : new Date(),
        event_date_end: selectedSMSLog.event_date_end
          ? new Date(selectedSMSLog.event_date_end)
          : new Date(),
      });
     
    } else {
      // this is server error or other error that could happen
      setFormFields(defaultFormFields);
 
    }
  }, [selectedSMSLog, isSMSLogDialogOpen]);

  const onClose = () => {
    setIsSMSLogDialogOpen(false);
  

    setFormFields(defaultFormFields);
    
    // Reset date status.
    setDateStatus({
      isSubmit: false,
      isValid: false,
    });
  };


  return (
    <CanSection permissions={["app_api.view_ocuser"]}>
      <Dialog open={isSMSLogDialogOpen} onOpenChange={setIsSMSLogDialogOpen}>
        <DialogContent className="w-[90%] sm:max-w-[700px]">
          <ScrollArea className=" h-[400px] sm:h-[600px] pr-4 w-full ">
            <DialogHeader>
              <DialogTitle>
                {selectedSMSLog?.SMSLog_image_id ? "Edit" : "Create"} SMSLog
              </DialogTitle>
              <DialogDescription>
                {selectedSMSLog?.SMSLog_image_id
                  ? "Make changes to your"
                  : "Create"}{" "}
                SMSLog here. Click save when you are done.
              </DialogDescription>
            </DialogHeader>

          
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </CanSection>
  );
}

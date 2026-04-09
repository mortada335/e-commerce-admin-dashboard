import { axiosPrivate } from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "../ui/use-toast";
import { useTranslation } from "react-i18next";

function OnChangeStatus({
  heading,
  description,
  url,
  id,
  name,
  isDialogOpen,
  setIsDialogOpen,
  data = {},
  headers,
  requestType = "patch",
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation()
  const onClose = () => {
    setIsDialogOpen(false);
  };

  const changeFn = async () => {
    try {
      let response;

      if (requestType === "post") {
        response = await axiosPrivate.post(
          `${url}${id}`,
          {
            ...data,
          },
          {
            headers,
          }
        );
      } else {
        response = await axiosPrivate.patch(
          `${url}${id}`,
          {
            ...data,
          },
          {
            headers,
          }
        );
      }

      if (response.status === 204 || response.status === 200) {
        toast({
          title: "Success",
          description: "Changed successfully",
        });
        onClose();
      }

      return response;
    } catch (error) {
      // Handle the error
      if (error?.response?.status && error?.response?.status !== 500) {
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: error.response?.data?.error,
        });
      } else if (error.code === "ERR_NETWORK") {
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: "Network error, please try again",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed!!!",
          description: "An unknown error occurred. Please try again later",
        });
      }
    }
  };
  const { mutate: onChange, isPending } = useMutation({
    mutationFn: changeFn,

    onSuccess: () => {
      // Invalidate and refetch

      queryClient.invalidateQueries({ queryKey: [name] });
    },
  });

  // const handleDelete=async ()={

  // }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent className="w-full">
        <DialogHeader className="rtl:items-end">
          <DialogTitle>{heading}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="rtl:items-end">
         <div className="flex justify-start items-center rtl:items-end w-full py-2 space-x-4 px-1 gap-2">
          <Button variant="secondary" onClick={onClose}>{t("Cancel")}</Button>
          <Button
            
            disabled={isPending}
            onClick={onChange}
            type="button"
          >
            {isPending ? (
              <p className="flex justify-center items-center space-x-2">
                <Loader2 className=" h-5 w-5 animate-spin" />
                <span>{t("Please wait")}</span>
              </p>
            ) : (
              <span>{t("Continue")}</span>
            )}
          </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default OnChangeStatus;

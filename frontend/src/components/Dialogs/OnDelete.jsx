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

function OnDeleteDialog({
  heading,
  description,
  url,
  id,
  name,
  isDialogOpen,
  setIsDialogOpen,
  data = {},
  onFinish = () => {},
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const {t} = useTranslation()
  const onClose = () => {
    setIsDialogOpen(false);
  };

  const deleteFn = async () => {
    if (id) {
      
      try {
        const response = await axiosPrivate.delete(`${url}${id}`, {
          headers: {
            accept: "application/json",
          },
          data: {
            ...data,
          },
        });
  
        if (response.status === 204 || response.status === 200) {
          toast({
            title: "Success",
            description: "Deleted successfully",
          });
          onFinish();
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
    }
  };
  const { mutate: onDelete, isPending } = useMutation({
    mutationFn: deleteFn,

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className=" rtl:text-right">
          <DialogTitle className="tracking-wide">{heading}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className={"gap-2 rtl:items-end"}>
          <Button onClick={onClose}>{t("Cancel")}</Button>
          <Button
            variant="destructive"
            disabled={isPending || !id}
            onClick={onDelete}
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default OnDeleteDialog;

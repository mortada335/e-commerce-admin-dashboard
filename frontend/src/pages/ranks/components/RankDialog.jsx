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
import { rankSchema } from "@/utils/validation/rank";

import { USER_RANK_URL } from "@/utils/constants/urls";
import useMutation from "@/hooks/useMutation";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import CanSection from "@/components/CanSection";
import Can from "@/components/Can";

const defaultFormFields = {
  rankNameEnglish: "",
  rankNameArabic: "",
  max_points: 0,
  min_points: 0,
};

export default function RankDialog({ isDialogOpen, setIsDialogOpen, rank }) {
  const { toast } = useToast();
  const [formFields, setFormFields] = useState(defaultFormFields);

  const form = useForm({
    resolver: yupResolver(rankSchema),
    defaultValues: defaultFormFields,
  });
  const [isSubmit, setIsSubmit] = useState(false);

  const {
    mutate,

    isPending: isAction,
  } = useMutation("Ranks");

  useEffect(() => {
    if (
      formFields.rankNameEnglish &&
      formFields.rankNameArabic &&
      formFields.max_points &&
      formFields.min_points
    ) {
      setIsSubmit(true);
    } else {
      setIsSubmit(false);
    }
  }, [formFields]);

  useEffect(() => {
    if (rank !== null && rank !== undefined && isDialogOpen) {
      const en = rank.rank_name?.find((item) => item.language_id === 1);
      const ar = rank.rank_name?.find((item) => item.language_id === 2);
      form.setValue("rankNameEnglish", en.rank_name);
      form.setValue("rankNameArabic", ar.rank_name);
      form.setValue("max_points", rank.max_points || null);
      form.setValue("min_points", rank.min_points || null);

      setFormFields({
        rankNameEnglish: en.rank_name,
        rankNameArabic: ar.rank_name,
        max_points: rank.max_points || null,
        min_points: rank.min_points || null,
      });
    } else {
      // this is server error or other erro that could happen
      setFormFields(defaultFormFields);
      form.reset();
      // form.setValue("rankNameEnglish", defaultFormFields.rank_name)
      // form.setValue("rankNameArabic", defaultFormFields.rank_name)
      // form.setValue("max_points", defaultFormFields.max_points || null)
      // form.setValue("min_points", defaultFormFields.min_points || null)
    }
  }, [rank]);

  const onClose = () => {
    setIsDialogOpen(false);
    form.reset();

    setFormFields(defaultFormFields);
  };

  const onSubmit = async () => {
    // Validate currency Change
    if (
      !formFields.rankNameEnglish ||
      !formFields.rankNameArabic ||
      !formFields.max_points ||
      !formFields.min_points
    ) {
      toast({
        variant: "destructive",
        title: "Failed!!!",
        description: "Please fill all the fields",
      });
    }

    const rankName = [
      {
        language_id: 1,
        rank_name: formFields.rankNameEnglish,
      },
      {
        language_id: 2,
        rank_name: formFields.rankNameArabic,
      },
    ];

    const formData = {
      rank_name: rankName,
      min_points: formFields.min_points,
      max_points: formFields.max_points,
    };

    mutate({
      url: USER_RANK_URL,
      id: rank?.id,
      headers: {
        "Content-Type": "application/json",
      },
      onFinish: onClose,
      formData,
    });
  };

  return (
    <Can permissions={["app_api.view_userrank"]}>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[95%] sm:max-w-[700px] px-4 ">
          <ScrollArea className=" w-[99%] md:w-full border-none">
            <ScrollArea className=" h-[500px] sm:h-[600px] pr-4 w-full ">
              <DialogHeader>
                <DialogTitle>{rank?.id ? "Edit" : "Create"} Rank</DialogTitle>
                <DialogDescription>
                  {rank?.id ? "Make changes to your" : "Create"} rank here.
                  Click save when you are done.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-2 "
                >
                  <FormField
                    control={form.control}
                    name="rankNameEnglish"
                    render={({ field }) => (
                      <FormItem className="w-full px-1 pt-0">
                        <FormLabel>
                          {" "}
                          <span className="text-red-500 text-xl">*</span>Name in
                          english
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Rank name in english"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);

                              setFormFields({
                                ...formFields,
                                rankNameEnglish: e.target.value,
                              });
                            }}
                            autoComplete="rankNameEnglish"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rankNameArabic"
                    render={({ field }) => (
                      <FormItem className="w-full px-1">
                        <FormLabel>
                          {" "}
                          <span className="text-red-500 text-xl">*</span>Name in
                          arabic
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Rank name in arabic"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);

                              setFormFields({
                                ...formFields,
                                rankNameArabic: e.target.value,
                              });
                            }}
                            autoComplete="rankNameArabic"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="max_points"
                    render={({ field }) => (
                      <FormItem className="w-full px-1">
                        <FormLabel>
                          {" "}
                          <span className="text-red-500 text-xl">*</span>Max
                          Points
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Rank Max Points"
                            value={field.value}
                            min={1}
                            max={2147483647}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setFormFields({
                                ...formFields,
                                max_points: e.target.value,
                              });
                            }}
                            autoComplete="max_points"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="min_points"
                    render={({ field }) => (
                      <FormItem className="w-full px-1">
                        <FormLabel>
                          {" "}
                          <span className="text-red-500 text-xl">*</span>Min
                          Points
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={2147483647}
                            placeholder="Rank Min Points"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              setFormFields({
                                ...formFields,
                                min_points: e.target.value,
                              });
                            }}
                            autoComplete="min_points"
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
                          <span>Please wait</span>
                        </p>
                      ) : (
                        <span>Save</span>
                      )}
                    </Button>
                    <Button variant="secondary" onClick={onClose}>
                      Cancel
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

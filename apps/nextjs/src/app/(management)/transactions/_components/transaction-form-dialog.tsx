"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@unithrift/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@unithrift/ui/dialog";
import { Label } from "@unithrift/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@unithrift/ui/select";
import { toast } from "@unithrift/ui/sonner";

import { useTRPC } from "~/trpc/react";

const formSchema = z.object({
  status: z.enum(["PENDING", "PAID", "SHIPPED", "COMPLETED", "CANCELLED"]),
  paymentMethod: z.enum(["DIRECT", "MIDTRANS"]),
});

type FormValues = z.infer<typeof formSchema>;

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: {
    id: string;
    status: "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";
    paymentMethod: "DIRECT" | "MIDTRANS";
  };
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  initialData,
}: TransactionFormDialogProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateMutation = useMutation(
    trpc.transaction.update.mutationOptions({
      onSuccess: async () => {
        toast.success("Transaction updated successfully");
        await queryClient.invalidateQueries(trpc.transaction.pathFilter());
        onOpenChange(false);
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: initialData.status,
      paymentMethod: initialData.paymentMethod,
    },
  });

  useEffect(() => {
    if (open && initialData) {
      form.reset({
        status: initialData.status,
        paymentMethod: initialData.paymentMethod,
      });
    }
  }, [open, initialData, form]);

  const onSubmit = (values: FormValues) => {
    updateMutation.mutate({
      id: initialData.id,
      ...values,
    });
  };

  const isPending = updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            Update the status or payment method of the transaction.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 py-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value) => form.setValue("status", value as any)}
              defaultValue={form.watch("status")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {["PENDING", "PAID", "SHIPPED", "COMPLETED", "CANCELLED"].map(
                  (s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              onValueChange={(value) =>
                form.setValue("paymentMethod", value as any)
              }
              defaultValue={form.watch("paymentMethod")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {["DIRECT", "MIDTRANS"].map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

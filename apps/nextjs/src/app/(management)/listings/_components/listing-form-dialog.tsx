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
import { Input } from "@unithrift/ui/input";
import { Label } from "@unithrift/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@unithrift/ui/select";
import { toast } from "@unithrift/ui/sonner";
import { Textarea } from "@unithrift/ui/textarea";

import { useTRPC } from "~/trpc/react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(256),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  category: z.enum([
    "CLOTHING",
    "BOOKS",
    "ELECTRONICS",
    "FURNITURE",
    "STATIONERY",
    "OTHER",
  ]),
  condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"]),
  universityId: z.string().min(1, "University ID is required"),
  status: z.enum(["DRAFT", "ACTIVE", "SOLD", "DELETED"]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ListingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    id: string;
    title: string;
    description: string;
    price: number;
    category:
      | "CLOTHING"
      | "BOOKS"
      | "ELECTRONICS"
      | "FURNITURE"
      | "STATIONERY"
      | "OTHER";
    condition: "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "POOR";
    universityId: string;
    status: "DRAFT" | "ACTIVE" | "SOLD" | "DELETED";
  };
}

export function ListingFormDialog({
  open,
  onOpenChange,
  initialData,
}: ListingFormDialogProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createMutation = useMutation(
    trpc.listing.create.mutationOptions({
      onSuccess: async () => {
        toast.success("Listing created successfully");
        await queryClient.invalidateQueries(trpc.listing.pathFilter());
        onOpenChange(false);
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const updateMutation = useMutation(
    trpc.listing.update.mutationOptions({
      onSuccess: async () => {
        toast.success("Listing updated successfully");
        await queryClient.invalidateQueries(trpc.listing.pathFilter());
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
      title: "",
      description: "",
      price: 0,
      category: "CLOTHING",
      condition: "NEW",
      universityId: "",
      status: "ACTIVE",
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          title: initialData.title,
          description: initialData.description,
          price: initialData.price,
          category: initialData.category,
          condition: initialData.condition,
          universityId: initialData.universityId,
          status: initialData.status,
        });
      } else {
        form.reset({
          title: "",
          description: "",
          price: 0,
          category: "CLOTHING",
          condition: "NEW",
          universityId: "",
          status: "ACTIVE",
        });
      }
    }
  }, [open, initialData, form]);

  const onSubmit = (values: FormValues) => {
    if (initialData) {
      updateMutation.mutate({
        id: initialData.id,
        ...values,
      });
    } else {
      createMutation.mutate(values);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Listing" : "Add Listing"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Make changes to the listing here. Click save when you're done."
              : "Add a new listing to the system."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 py-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Listing Title"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-destructive text-sm">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-destructive text-sm">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              placeholder="0"
              {...form.register("price")}
            />
            {form.formState.errors.price && (
              <p className="text-destructive text-sm">
                {form.formState.errors.price.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={(value) => form.setValue("category", value as any)}
              defaultValue={form.watch("category")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "CLOTHING",
                  "BOOKS",
                  "ELECTRONICS",
                  "FURNITURE",
                  "STATIONERY",
                  "OTHER",
                ].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="condition">Condition</Label>
            <Select
              onValueChange={(value) =>
                form.setValue("condition", value as any)
              }
              defaultValue={form.watch("condition")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="universityId">University ID</Label>
            <Input
              id="universityId"
              placeholder="University ID"
              {...form.register("universityId")}
            />
            {form.formState.errors.universityId && (
              <p className="text-destructive text-sm">
                {form.formState.errors.universityId.message}
              </p>
            )}
          </div>
          {initialData && (
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
                  {["DRAFT", "ACTIVE", "SOLD", "DELETED"].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
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

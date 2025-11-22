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
import { toast } from "@unithrift/ui/sonner";

import { useTRPC } from "~/trpc/react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  abbr: z.string().min(1, "Abbreviation is required"),
  domain: z.string().optional(),
  logo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface UniversityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    id: string;
    name: string;
    abbr: string;
    domain?: string | null;
    logo?: string | null;
  };
}

export function UniversityFormDialog({
  open,
  onOpenChange,
  initialData,
}: UniversityFormDialogProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createMutation = useMutation(
    trpc.university.create.mutationOptions({
      onSuccess: async () => {
        toast.success("University created successfully");
        await queryClient.invalidateQueries(trpc.university.pathFilter());
        onOpenChange(false);
        form.reset();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const updateMutation = useMutation(
    trpc.university.update.mutationOptions({
      onSuccess: async () => {
        toast.success("University updated successfully");
        await queryClient.invalidateQueries(trpc.university.pathFilter());
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
      name: "",
      abbr: "",
      domain: "",
      logo: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          abbr: initialData.abbr,
          domain: initialData.domain ?? "",
          logo: initialData.logo ?? "",
        });
      } else {
        form.reset({
          name: "",
          abbr: "",
          domain: "",
          logo: "",
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit University" : "Add University"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Make changes to the university here. Click save when you're done."
              : "Add a new university to the system."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 py-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="University of Technology"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-destructive text-sm">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="abbr">Abbreviation</Label>
            <Input id="abbr" placeholder="UT" {...form.register("abbr")} />
            {form.formState.errors.abbr && (
              <p className="text-destructive text-sm">
                {form.formState.errors.abbr.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="domain">Domain (Optional)</Label>
            <Input
              id="domain"
              placeholder="ut.edu"
              {...form.register("domain")}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="logo">Logo URL (Optional)</Label>
            <Input
              id="logo"
              placeholder="https://..."
              {...form.register("logo")}
            />
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

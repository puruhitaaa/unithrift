"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@unithrift/ui/alert-dialog";
import { toast } from "@unithrift/ui/sonner";

import { useTRPC } from "~/trpc/react";

interface ListingDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: { id: string; title: string } | null;
}

export function ListingDeleteDialog({
  open,
  onOpenChange,
  listing,
}: ListingDeleteDialogProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation(
    trpc.listing.delete.mutationOptions({
      onSuccess: async () => {
        toast.success("Listing deleted successfully");
        await queryClient.invalidateQueries(trpc.listing.pathFilter());
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const handleDelete = () => {
    if (listing) {
      deleteMutation.mutate({ id: listing.id });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <span className="text-foreground font-medium">
              {listing?.title}
            </span>{" "}
            and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import {
  IconChevronDown,
  IconChevronUp,
  IconDotsVertical,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";

import { Button } from "@unithrift/ui/button";
import { Checkbox } from "@unithrift/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@unithrift/ui/dropdown-menu";

import { ListingDeleteDialog } from "./listing-delete-dialog";
import { ListingFormDialog } from "./listing-form-dialog";

export interface Listing {
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
  status: "DRAFT" | "ACTIVE" | "SOLD" | "DELETED";
  universityId: string;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date | null;
}

function ActionsCell({ listing }: { listing: Listing }) {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <ListingFormDialog
        open={showUpdateDialog}
        onOpenChange={setShowUpdateDialog}
        initialData={listing}
      />
      <ListingDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        listing={listing}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowUpdateDialog(true)}>
            <IconEdit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <IconTrash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export const columns: ColumnDef<Listing>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <div
        role="button"
        className="flex cursor-pointer items-center gap-2 select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        {column.getIsSorted() === "asc" ? (
          <IconChevronUp className="h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <IconChevronDown className="h-3 w-3" />
        ) : null}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <div
        role="button"
        className="flex cursor-pointer items-center gap-2 select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        {column.getIsSorted() === "asc" ? (
          <IconChevronUp className="h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <IconChevronDown className="h-3 w-3" />
        ) : null}
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("status")?.toString().toLowerCase()}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <div
        role="button"
        className="flex cursor-pointer items-center gap-2 select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created At
        {column.getIsSorted() === "asc" ? (
          <IconChevronUp className="h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <IconChevronDown className="h-3 w-3" />
        ) : null}
      </div>
    ),
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell listing={row.original} />,
  },
];

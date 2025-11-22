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

import { Badge } from "@unithrift/ui/badge";
import { Button } from "@unithrift/ui/button";
import { Checkbox } from "@unithrift/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@unithrift/ui/dropdown-menu";

import { TransactionDeleteDialog } from "./transaction-delete-dialog";
import { TransactionFormDialog } from "./transaction-form-dialog";

export interface Transaction {
  id: string;
  amount: number;
  status: "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  paymentMethod: "DIRECT" | "MIDTRANS";
  createdAt: Date;
  updatedAt: Date | null;
  buyer: {
    id: string;
    name: string | null;
    email: string;
  };
  seller: {
    id: string;
    name: string | null;
    email: string;
  };
  listing: {
    id: string;
    title: string;
  };
}

function ActionsCell({ transaction }: { transaction: Transaction }) {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <TransactionFormDialog
        open={showUpdateDialog}
        onOpenChange={setShowUpdateDialog}
        initialData={transaction}
      />
      <TransactionDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        transaction={transaction}
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

export const columns: ColumnDef<Transaction>[] = [
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
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="w-[80px] truncate" title={row.getValue("id")}>
        {row.getValue("id")}
      </div>
    ),
  },
  {
    accessorKey: "listing.title",
    header: "Listing",
    cell: ({ row }) => (
      <div
        className="max-w-[200px] truncate"
        title={row.original.listing.title}
      >
        {row.original.listing.title}
      </div>
    ),
  },
  {
    accessorKey: "buyer.name",
    header: "Buyer",
    cell: ({ row }) => row.original.buyer.name || row.original.buyer.email,
  },
  {
    accessorKey: "seller.name",
    header: "Seller",
    cell: ({ row }) => row.original.seller.name || row.original.seller.email,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <div
        role="button"
        className="flex cursor-pointer items-center gap-2 select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount
        {column.getIsSorted() === "asc" ? (
          <IconChevronUp className="h-3 w-3" />
        ) : column.getIsSorted() === "desc" ? (
          <IconChevronDown className="h-3 w-3" />
        ) : null}
      </div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: "default" | "secondary" | "destructive" | "outline" =
        "default";

      switch (status) {
        case "PENDING":
          variant = "secondary";
          break;
        case "PAID":
        case "SHIPPED":
          variant = "default"; // Or maybe a different color if available
          break;
        case "COMPLETED":
          variant = "outline"; // Or success color if we had one
          break;
        case "CANCELLED":
          variant = "destructive";
          break;
      }

      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment",
    cell: ({ row }) => row.original.paymentMethod,
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
    cell: ({ row }) => <ActionsCell transaction={row.original} />,
  },
];

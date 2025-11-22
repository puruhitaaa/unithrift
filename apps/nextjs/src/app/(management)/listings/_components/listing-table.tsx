"use client";

import { useMemo, useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";

import { Button } from "@unithrift/ui/button";
import { DataTable } from "@unithrift/ui/data-table";
import { Input } from "@unithrift/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@unithrift/ui/select";

import { useTRPC } from "~/trpc/react";
import { columns } from "./listing-columns";
import { ListingFormDialog } from "./listing-form-dialog";

export function ListingTable() {
  const trpc = useTRPC();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(20),
  );
  const [pageIndex, setPageIndex] = useQueryState(
    "page",
    parseAsInteger.withDefault(0),
  );
  const [search, setSearch] = useQueryState("search");
  const [sortBy, setSortBy] = useQueryState(
    "sortBy",
    parseAsStringLiteral(["title", "createdAt", "price"]).withDefault("title"),
  );
  const [sortOrder, setSortOrder] = useQueryState(
    "sortOrder",
    parseAsStringLiteral(["asc", "desc"]).withDefault("asc"),
  );

  const offset = pageIndex * limit;

  // Fetch one extra item to know if there is a next page
  const { data: rawListings, isLoading } = useQuery(
    trpc.listing.list.queryOptions({
      limit: Math.min(limit + 1, 100),
      offset,
      search: search ?? undefined,
      sortBy,
      sortOrder,
    }),
  );

  const hasNextPage = (rawListings?.length ?? 0) > limit;
  const listings = useMemo(
    () => rawListings?.slice(0, limit) ?? [],
    [rawListings, limit],
  );
  const pageCount = hasNextPage ? pageIndex + 2 : pageIndex + 1;

  return (
    <>
      <ListingFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
      <div className="flex items-center gap-2">
        <Input
          id="search"
          placeholder="Search listings"
          value={search ?? ""}
          onChange={(e) => {
            void setSearch(e.target.value || null);
            // reset page when searching
            void setPageIndex(0);
          }}
        />
        <Select
          value={sortBy}
          onValueChange={(v) =>
            void setSortBy(v as "title" | "createdAt" | "price")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={sortBy} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="createdAt">Created At</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={sortOrder}
          onValueChange={(v) => void setSortOrder(v as "asc" | "desc")}
        >
          <SelectTrigger>
            <SelectValue placeholder={sortOrder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={listings}
        manualPagination
        pageCount={pageCount}
        controlledPageIndex={pageIndex}
        controlledPageSize={limit}
        onPaginationChange={({ pageIndex: newPageIndex, pageSize }) => {
          if (newPageIndex !== pageIndex) void setPageIndex(newPageIndex);
          if (pageSize !== limit) {
            void setLimit(pageSize);
            // Reset to first page when page size changes
            void setPageIndex(0);
          }
        }}
        controlledSorting={[{ id: sortBy, desc: sortOrder === "desc" }]}
        onSortingChange={(sorting) => {
          const first = sorting[0];
          if (!first) return;
          void setSortBy(first.id as "title" | "createdAt" | "price");
          void setSortOrder(first.desc ? "desc" : "asc");
          void setPageIndex(0);
        }}
        isLoading={isLoading}
      >
        <Button onClick={() => setShowCreateDialog(true)} size="sm">
          <IconPlus className="mr-2 size-4" />
          Add Listing
        </Button>
      </DataTable>
    </>
  );
}

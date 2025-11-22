"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";

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
import { columns } from "./transaction-columns";

// import { TransactionFormDialog } from "./transaction-form-dialog";

export function TransactionTable() {
  const trpc = useTRPC();
  // const [showEditDialog, setShowEditDialog] = useState(false);

  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(20),
  );
  const [pageIndex, setPageIndex] = useQueryState(
    "page",
    parseAsInteger.withDefault(0),
  );
  const [search, setSearch] = useQueryState("search");
  const [localSearch, setLocalSearch] = useState(search ?? "");
  const searchTimeout = useRef<number | null>(null);
  const [sortBy, setSortBy] = useQueryState(
    "sortBy",
    parseAsStringLiteral(["createdAt", "amount"]).withDefault("createdAt"),
  );
  const [sortOrder, setSortOrder] = useQueryState(
    "sortOrder",
    parseAsStringLiteral(["asc", "desc"]).withDefault("desc"),
  );

  const offset = pageIndex * limit;

  // debounce localSearch -> search query param
  useEffect(() => {
    // clear previous timer
    if (searchTimeout.current) window.clearTimeout(searchTimeout.current);
    // set a new timer to update the URL param and reset page
    searchTimeout.current = window.setTimeout(() => {
      void setSearch(localSearch || null);
      void setPageIndex(0);
    }, 250);
    return () => {
      if (searchTimeout.current) window.clearTimeout(searchTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  // keep local search in sync with incoming `search` query param
  useEffect(() => {
    setLocalSearch(search ?? "");
  }, [search]);

  // Fetch items (we still request one extra item so we can detect a next page when server
  // doesn't return a total count). Server now returns `{ items, total }` where total is the
  // total number of items available. We support both shapes for backward compatibility.
  const { data: rawTransactionsResponse, isLoading } = useQuery(
    trpc.transaction.list.queryOptions({
      limit: Math.min(limit + 1, 100),
      offset,
      search: search ?? undefined,
      sortBy,
      sortOrder,
    }),
  );

  const rawTransactionsArray = Array.isArray(rawTransactionsResponse)
    ? rawTransactionsResponse
    : (rawTransactionsResponse?.items ?? []);

  const totalFromServer = !Array.isArray(rawTransactionsResponse)
    ? rawTransactionsResponse?.total
    : undefined;

  const hasNextPage = (rawTransactionsArray?.length ?? 0) > limit;

  const transactions = useMemo(
    () => rawTransactionsArray?.slice(0, limit) ?? [],
    [rawTransactionsArray, limit],
  );

  const pageCount =
    typeof totalFromServer === "number"
      ? Math.max(1, Math.ceil(totalFromServer / limit))
      : hasNextPage
        ? pageIndex + 2
        : pageIndex + 1;

  return (
    <>
      <div className="flex items-center gap-2">
        <Input
          id="search"
          placeholder="Search by Transaction ID"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
        <Select
          value={sortBy}
          onValueChange={(v) => void setSortBy(v as "createdAt" | "amount")}
        >
          <SelectTrigger>
            <SelectValue placeholder={sortBy} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Created At</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
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
        data={transactions}
        manualPagination
        pageCount={pageCount}
        controlledPageIndex={pageIndex}
        controlledPageSize={limit}
        onPaginationChange={(p: { pageIndex: number; pageSize: number }) => {
          const { pageIndex: newPageIndex, pageSize } = p;
          if (newPageIndex !== pageIndex) void setPageIndex(newPageIndex);
          if (pageSize !== limit) {
            void setLimit(pageSize);
            // Reset to first page when page size changes
            void setPageIndex(0);
          }
        }}
        controlledSorting={[{ id: sortBy, desc: sortOrder === "desc" }]}
        onSortingChange={(
          sorting: import("@tanstack/react-table").SortingState,
        ) => {
          const first = sorting[0];
          if (!first) return;
          void setSortBy(first.id as "createdAt" | "amount");
          void setSortOrder(first.desc ? "desc" : "asc");
          void setPageIndex(0);
        }}
        isLoading={isLoading}
      >
        {/* No "Add Transaction" button */}
      </DataTable>
    </>
  );
}

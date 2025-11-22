"use client";

import {
  useMemo,
  // useState
} from "react";
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
  const [sortBy, setSortBy] = useQueryState(
    "sortBy",
    parseAsStringLiteral(["createdAt", "amount"]).withDefault("createdAt"),
  );
  const [sortOrder, setSortOrder] = useQueryState(
    "sortOrder",
    parseAsStringLiteral(["asc", "desc"]).withDefault("desc"),
  );

  const offset = pageIndex * limit;

  // Fetch one extra item to know if there is a next page
  const { data: rawTransactions, isLoading } = useQuery(
    trpc.transaction.list.queryOptions({
      limit: Math.min(limit + 1, 100),
      offset,
      search: search ?? undefined,
      sortBy,
      sortOrder,
    }),
  );

  const hasNextPage = (rawTransactions?.length ?? 0) > limit;
  const transactions = useMemo(
    () => rawTransactions?.slice(0, limit) ?? [],
    [rawTransactions, limit],
  );
  const pageCount = hasNextPage ? pageIndex + 2 : pageIndex + 1;

  return (
    <>
      {/* Note: We don't have a create dialog for transactions as they are created by users buying items. 
          However, we might need the form dialog for editing, which is handled by the columns actions. 
          But if we wanted a global edit dialog state we could lift it here. 
          For now, the columns handle the edit dialog state internally per row, 
          but wait, the university table had the create dialog here. 
          The edit dialog is usually inside the actions cell. 
          So I don't need to render TransactionFormDialog here unless I have a "Create Transaction" button, which I don't.
      */}

      <div className="flex items-center gap-2">
        <Input
          id="search"
          placeholder="Search by Transaction ID"
          value={search ?? ""}
          onChange={(e) => {
            void setSearch(e.target.value || null);
            // reset page when searching
            void setPageIndex(0);
          }}
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

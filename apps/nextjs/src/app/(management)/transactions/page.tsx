import { Suspense } from "react";

import { TableSkeleton } from "@unithrift/ui/table-skeleton";

import { columns } from "./_components/transaction-columns";
import { TransactionTable } from "./_components/transaction-table";

export default function TransactionsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Suspense fallback={<TableSkeleton columns={columns.length} rows={6} />}>
        <TransactionTable />
      </Suspense>
    </div>
  );
}

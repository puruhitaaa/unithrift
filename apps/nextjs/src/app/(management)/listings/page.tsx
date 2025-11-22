import { Suspense } from "react";

import { TableSkeleton } from "@unithrift/ui/table-skeleton";

import { columns } from "./_components/listing-columns";
import { ListingTable } from "./_components/listing-table";

export default function ListingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Suspense
        fallback={
          <div className="p-4">
            <TableSkeleton columns={columns.length} rows={6} />
          </div>
        }
      >
        <ListingTable />
      </Suspense>
    </div>
  );
}

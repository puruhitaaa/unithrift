import { Suspense } from "react";

import { TableSkeleton } from "@unithrift/ui/table-skeleton";

import { columns } from "./_components/university-columns";
import { UniversityTable } from "./_components/university-table";

export default function UniversitiesPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Suspense fallback={<TableSkeleton columns={columns.length} rows={6} />}>
        <UniversityTable />
      </Suspense>
    </div>
  );
}

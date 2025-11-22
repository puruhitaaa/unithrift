"use client";

import { cn } from "@unithrift/ui";
import { Skeleton } from "@unithrift/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@unithrift/ui/table";

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  className?: string;
  header?: boolean;
  // Render only body rows (for embedding into an existing <TableBody>)
  bodyOnly?: boolean;
}

export function TableSkeleton({
  columns = 6,
  rows = 5,
  className,
  header = true,
  bodyOnly = false,
}: TableSkeletonProps) {
  const cols = Array.from({ length: Math.max(1, columns) });
  const rws = Array.from({ length: Math.max(1, rows) });

  if (bodyOnly) {
    return (
      <>
        {rws.map((_, rIndex) => (
          <TableRow key={rIndex}>
            {cols.map((__, cIndex) => (
              <TableCell key={cIndex}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-lg border", className)}>
      <Table>
        {header && (
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              {cols.map((_, i) => (
                <TableHead key={i} className="px-2 py-3">
                  <Skeleton className="h-3 w-32" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {rws.map((_, rIndex) => (
            <TableRow key={rIndex}>
              {cols.map((__, cIndex) => (
                <TableCell key={cIndex}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default TableSkeleton;

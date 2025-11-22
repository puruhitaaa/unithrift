import { TransactionTable } from "./_components/transaction-table";

export default function TransactionsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <TransactionTable />
    </div>
  );
}

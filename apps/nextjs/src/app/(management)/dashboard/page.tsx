"use client";

import {
  IconActivity,
  IconBuildingStore,
  IconCreditCard,
  IconUsers,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@unithrift/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@unithrift/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@unithrift/ui/table";

import { useTRPC } from "~/trpc/react";

export default function DashboardPage() {
  const trpc = useTRPC();
  const { data: stats, isLoading } = useQuery(
    trpc.dashboard.getStats.queryOptions(),
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  if (isLoading) {
    return <div className="p-8">Loading dashboard data...</div>;
  }

  if (!stats) {
    return <div className="p-8">Failed to load dashboard data.</div>;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IconCreditCard className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <p className="text-muted-foreground text-xs">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <IconActivity className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-muted-foreground text-xs">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Listings
            </CardTitle>
            <IconBuildingStore className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalListings}</div>
            <p className="text-muted-foreground text-xs">
              +19% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <IconUsers className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-muted-foreground text-xs">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Daily revenue for the last 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `Rp${value}`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) =>
                      new Date(label).toLocaleDateString()
                    }
                  />
                  <Bar
                    dataKey="amount"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              You made {stats.recentTransactions.length} sales recently.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {stats.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm leading-none font-medium">
                      {transaction.listing.title}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {transaction.buyer.name || transaction.buyer.email}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Listing</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="max-w-[100px] truncate font-medium">
                    {transaction.id}
                  </TableCell>
                  <TableCell>{transaction.listing.title}</TableCell>
                  <TableCell>
                    {transaction.buyer.name || transaction.buyer.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.status === "PENDING"
                          ? "secondary"
                          : transaction.status === "CANCELLED"
                            ? "destructive"
                            : "default"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                  <TableCell className="text-right">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

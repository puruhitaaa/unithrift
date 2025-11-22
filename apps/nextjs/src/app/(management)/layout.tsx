import { AppSidebar } from "@unithrift/ui/app-sidebar";
import { SidebarInset, SidebarProvider } from "@unithrift/ui/sidebar";
import { SiteHeader } from "@unithrift/ui/site-header";

export default function ManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

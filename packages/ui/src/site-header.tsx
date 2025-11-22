"use client";

import { usePathname } from "next/navigation";

import { Separator } from "@unithrift/ui/separator";
import { SidebarTrigger } from "@unithrift/ui/sidebar";

export function SiteHeader() {
  const pathname = usePathname();

  // Extract the route name from the pathname and capitalize it
  const getPageTitle = (path: string) => {
    // Remove leading slash and get the first segment
    const segments = path.split("/").filter(Boolean);
    const routeName = segments[0] ?? "Dashboard";

    // Capitalize first letter
    return routeName.charAt(0).toUpperCase() + routeName.slice(1);
  };

  const title = getPageTitle(pathname);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 p-2.5 lg:gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
      </div>
    </header>
  );
}



import {LayoutSideContent, Bell, Envelope, Gear, House, Magnifier, Person} from "@gravity-ui/icons";
import {Button, Drawer} from "@heroui/react";
import Link from "next/link";

export function DashboardSidebar() {
  const navItems = [
    {icon: House, label: "Home", href: "/dashboard/user"},
    {icon: Magnifier, label: "Search"},
    {icon: Bell, label: "Notifications"},
    {icon: Envelope, label: "Messages"},
    {icon: Person, label: "Profile", href: "/dashboard/profile"},
    {icon: Gear, label: "Settings"},
  ];


  const navContent = <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const content = (
                    <div
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                    >
                      <item.icon className="size-5 text-muted" />
                      {item.label}
                    </div>
                  );

                  if (item.href) {
                    return (
                      <Link key={item.label} href={item.href}>
                        {content}
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={item.label}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                      type="button"
                    >
                      <item.icon className="size-5 text-muted" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>



  return (
    <>
    <aside className="hidden w-64 shrink-0 border-default p-4 lg:block">
        {navContent}
    </aside>

    <Drawer>
      <Button className="lg:hidden" variant="secondary">
        <LayoutSideContent />
        Sidebar
      </Button>
      <Drawer.Backdrop>
        <Drawer.Content placement="left">
          <Drawer.Dialog>
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Heading>Navigation</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              {navContent}
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>


    </>
  );
}
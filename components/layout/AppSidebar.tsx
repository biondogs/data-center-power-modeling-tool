"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Database, FileSpreadsheet, Settings } from "lucide-react";

export function AppSidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/scenarios", label: "Scenarios", icon: FileSpreadsheet },
        { href: "/catalog", label: "Catalog", icon: Database },
    ];

    return (
        <div className="hidden border-r bg-muted/20 md:block md:w-64 lg:w-72 h-screen fixed left-0 top-0 overflow-y-auto">
            <div className="flex h-14 items-center border-b px-6 font-semibold tracking-tight">
                Power Model
            </div>
            <div className="p-4">
                <nav className="grid gap-2 text-sm font-medium">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                    isActive ? "bg-muted text-primary" : "text-muted-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}

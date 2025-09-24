"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Network, Calculator, FileText, Settings, Home, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    description: "Overview and quick access",
  },
  {
    title: "BT Ether Pricing",
    href: "/bt-ether-pricing",
    icon: Calculator,
    description: "Get quotes for BT Ethernet services",
  },
  {
    title: "Network Services",
    href: "/network-services",
    icon: Network,
    description: "Manage network configurations",
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
    description: "View quotes and reports",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account and preferences",
  },
]

const externalNavigationItems = [
  {
    title: "CN Pricing Widget",
    href: "https://connectednetworks-pricingwidget.replit.app/new-quote",
    icon: ExternalLink,
    description: "External pricing widget tool",
  },
]

export function SidebarNavigation() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-card border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground">Connected Networks</h2>
            <p className="text-xs text-muted-foreground">Enterprise Portal</p>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground",
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs opacity-70 truncate">{item.description}</div>
                    </div>
                  )}
                </Link>
              </li>
            )
          })}

          <li className="pt-2">
            <div className="border-t border-border my-2" />
          </li>

          {externalNavigationItems.map((item) => {
            const Icon = item.icon

            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground text-muted-foreground",
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs opacity-70 truncate">{item.description}</div>
                    </div>
                  )}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        {!isCollapsed && (
          <div className="text-xs text-muted-foreground">
            <p>© 2024 Connected Networks</p>
            <p className="mt-1">Enterprise Solutions</p>
          </div>
        )}
      </div>
    </div>
  )
}

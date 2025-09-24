import { Construction, Network } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NetworkServicesPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
              <Construction className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Network className="h-6 w-6" />
              Network Services
            </CardTitle>
            <CardDescription className="text-lg">This section is currently under construction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">We're expanding our network services portfolio to include:</p>
            <ul className="text-left space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                MPLS and SD-WAN solutions
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Cloud connectivity services
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Security and firewall options
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Voice and unified communications
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-6">Check back soon for updates!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

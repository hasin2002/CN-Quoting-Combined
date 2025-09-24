export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Welcome to Connected Networks Enterprise Portal</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="font-heading text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a
                href="/bt-ether-pricing"
                className="block p-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <div className="font-medium">Get BT Ether Quote</div>
                <div className="text-sm opacity-90">Calculate pricing for Ethernet services</div>
              </a>
              <a href="/network-services" className="block p-3 rounded-md border hover:bg-accent transition-colors">
                <div className="font-medium">Network Services</div>
                <div className="text-sm text-muted-foreground">Manage configurations</div>
              </a>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="font-heading text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span>No recent quotes</span>
                <span className="text-muted-foreground">-</span>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="font-heading text-lg font-semibold mb-4">System Status</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">All systems operational</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Quote API available</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

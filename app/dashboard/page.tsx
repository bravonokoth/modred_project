"use client";

import { AuthGuard } from "@/components/wallet/auth-guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { WalletBalanceCard } from "@/components/wallet/wallet-balance-card";
import { FileText, Scale, Shield, DollarSign, Plus, TrendingUp, LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear all stored data
      localStorage.removeItem("walletAddress");
      localStorage.removeItem("hedera_wallet_account");
      localStorage.removeItem("hedera_wallet_connected");
      localStorage.removeItem("authToken");
      document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout Failed", 
        description: "There was an error logging out",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-heading font-bold text-3xl">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Manage your intellectual property portfolio</p>
              </div>
              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <Button variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button asChild>
                  <Link href="/ip-registration">
                    <Plus className="h-4 w-4 mr-2" />
                    Register New IP
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Registered IPs</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Licenses</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">+1 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Royalties</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,847</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Disputes</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">No active disputes</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Recent IP Assets</CardTitle>
                  <CardDescription>Your latest registered intellectual property</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Mobile App Design System", type: "Design", status: "Active", date: "2024-01-15" },
                      { name: "AI Algorithm Patent", type: "Patent", status: "Pending", date: "2024-01-12" },
                      { name: "Brand Logo Collection", type: "Trademark", status: "Active", date: "2024-01-10" },
                      { name: "Software Architecture", type: "Copyright", status: "Active", date: "2024-01-08" },
                    ].map((asset, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{asset.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {asset.type} • {asset.date}
                            </p>
                          </div>
                        </div>
                        <Badge variant={asset.status === "Active" ? "default" : "secondary"}>{asset.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <WalletBalanceCard />
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                    <Link href="/ip-registration">
                      <Plus className="h-4 w-4 mr-2" />
                      Register New IP
                    </Link>
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                    <Link href="/licensing" prefetch={true}>
                      <Scale className="h-4 w-4 mr-2" />
                      Create License
                    </Link>
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                    <Link href="/royalties" prefetch={true}>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Royalties
                    </Link>
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                    <Link href="/disputes" prefetch={true}>
                      <Shield className="h-4 w-4 mr-2" />
                      Manage Disputes
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="font-medium">License issued</p>
                      <p className="text-muted-foreground">Mobile App Design System</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Royalty received</p>
                      <p className="text-muted-foreground">$127.50 from Brand Logo</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">IP registered</p>
                      <p className="text-muted-foreground">AI Algorithm Patent</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
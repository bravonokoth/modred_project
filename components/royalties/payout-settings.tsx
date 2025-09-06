"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Wallet, Settings, Bell, Shield, Save } from "lucide-react"

export function PayoutSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    autoWithdraw: true,
    minThreshold: "0.1",
    withdrawalAddress: "0x1234567890123456789012345678901234567890",
    frequency: "weekly",
    notifications: true,
    emailNotifications: true,
    taxReporting: false,
  })
  const { toast } = useToast()

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Settings Saved",
        description: "Your payout settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Withdrawal Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Withdrawal Settings
          </CardTitle>
          <CardDescription>Configure how and when you receive your royalty payments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Automatic Withdrawals</Label>
              <p className="text-sm text-muted-foreground">Automatically withdraw earnings when threshold is reached</p>
            </div>
            <Switch
              checked={settings.autoWithdraw}
              onCheckedChange={(checked) => setSettings({ ...settings, autoWithdraw: checked })}
            />
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minThreshold">Minimum Threshold (ETH)</Label>
              <Input
                id="minThreshold"
                type="number"
                step="0.01"
                value={settings.minThreshold}
                onChange={(e) => setSettings({ ...settings, minThreshold: e.target.value })}
                placeholder="0.1"
              />
              <p className="text-xs text-muted-foreground">Minimum amount before automatic withdrawal triggers</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Withdrawal Frequency</Label>
              <Select
                value={settings.frequency}
                onValueChange={(value) => setSettings({ ...settings, frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="manual">Manual Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdrawalAddress">Withdrawal Address</Label>
            <Input
              id="withdrawalAddress"
              value={settings.withdrawalAddress}
              onChange={(e) => setSettings({ ...settings, withdrawalAddress: e.target.value })}
              placeholder="0x..."
            />
            <p className="text-xs text-muted-foreground">The wallet address where your royalties will be sent</p>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Choose how you want to be notified about payments and earnings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive browser notifications for new payments</p>
            </div>
            <Switch
              checked={settings.notifications}
              onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive email summaries of your earnings</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security & Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Compliance
          </CardTitle>
          <CardDescription>Additional security and tax reporting options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Tax Reporting</Label>
              <p className="text-sm text-muted-foreground">Generate tax reports for your royalty income</p>
            </div>
            <Switch
              checked={settings.taxReporting}
              onCheckedChange={(checked) => setSettings({ ...settings, taxReporting: checked })}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Current Security Status</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-700 dark:text-green-300">Wallet Connected</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Your withdrawal address is verified and secure
                </p>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Settings className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-700 dark:text-blue-300">Auto-Withdraw Enabled</span>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Payments will be processed automatically</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Balance & Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading">Current Balance</CardTitle>
          <CardDescription>Available funds ready for withdrawal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-bold">2.156 ETH</p>
              <p className="text-sm text-muted-foreground">$5,174.40 USD</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">View History</Button>
              <Button>Withdraw Now</Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Next automatic withdrawal: January 29, 2024</p>
            <p>Estimated gas fee: ~$12.50</p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <Settings className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings as SettingsIcon, Save, Bell, Database, Shield, Globe, Key, Plus, Edit, Trash2 } from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      emailNotifications: true,
      testFailures: true,
      scheduleReminders: false,
      weeklyReports: true
    },
    environment: {
      defaultEnvironment: "development",
      timeoutDuration: 30,
      retryAttempts: 3
    },
    d365: {
      instanceUrl: "",
      apiVersion: "9.2",
      authMethod: "oauth2"
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 480,
      apiKeyRotation: true
    }
  });

  const [credentials, setCredentials] = useState([
    {
      id: "cred1",
      name: "Production Admin",
      environment: "Production",
      status: "active",
      username: "admin@yourorg.com",
      lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: "cred2",
      name: "Staging Service Account",
      environment: "Staging",
      status: "active",
      username: "service@yourorg.com",
      lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    },
    {
      id: "cred3",
      name: "Dev Environment",
      environment: "Development",
      status: "active",
      username: "devuser@yourorg.com",
      lastUsed: new Date(Date.now() - 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: "cred4",
      name: "Test User Account",
      environment: "Development",
      status: "inactive",
      username: "testuser@yourorg.com",
      lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [showAddCredential, setShowAddCredential] = useState(false);
  const [newCredential, setNewCredential] = useState({
    name: "",
    environment: "",
    username: "",
    password: ""
  });

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log("Saving settings:", settings);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Configure your test automation preferences</p>
          </div>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="d365">D365 Connection</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="defaultEnv">Default Environment</Label>
                    <Select 
                      value={settings.environment.defaultEnvironment}
                      onValueChange={(value) => setSettings(prev => ({
                        ...prev,
                        environment: { ...prev.environment, defaultEnvironment: value }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timeout">Test Timeout (seconds)</Label>
                    <Input 
                      id="timeout"
                      type="number"
                      value={settings.environment.timeoutDuration}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        environment: { ...prev.environment, timeoutDuration: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="retries">Retry Attempts</Label>
                    <Input 
                      id="retries"
                      type="number"
                      min="0"
                      max="10"
                      value={settings.environment.retryAttempts}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        environment: { ...prev.environment, retryAttempts: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Credentials Management */}
          <TabsContent value="credentials">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Credential Management
                </CardTitle>
                <Button onClick={() => setShowAddCredential(!showAddCredential)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Credential
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {showAddCredential && (
                  <Card className="border-dashed">
                    <CardHeader>
                      <CardTitle className="text-lg">Add New Credential</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="credName">Credential Name</Label>
                          <Input
                            id="credName"
                            placeholder="e.g., Production Admin"
                            value={newCredential.name}
                            onChange={(e) => setNewCredential(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="credEnv">Environment</Label>
                          <Select
                            value={newCredential.environment}
                            onValueChange={(value) => setNewCredential(prev => ({ ...prev, environment: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select environment" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="development">Development</SelectItem>
                              <SelectItem value="staging">Staging</SelectItem>
                              <SelectItem value="production">Production</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="credUsername">Username/Email</Label>
                          <Input
                            id="credUsername"
                            type="email"
                            placeholder="user@yourorg.com"
                            value={newCredential.username}
                            onChange={(e) => setNewCredential(prev => ({ ...prev, username: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="credPassword">Password</Label>
                          <Input
                            id="credPassword"
                            type="password"
                            placeholder="Enter password"
                            value={newCredential.password}
                            onChange={(e) => setNewCredential(prev => ({ ...prev, password: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => {
                          setCredentials(prev => [...prev, {
                            id: `cred${Date.now()}`,
                            ...newCredential,
                            status: "active",
                            lastUsed: new Date(),
                            createdAt: new Date()
                          }]);
                          setNewCredential({ name: "", environment: "", username: "", password: "" });
                          setShowAddCredential(false);
                        }}>
                          Save Credential
                        </Button>
                        <Button variant="outline" onClick={() => setShowAddCredential(false)}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Existing Credentials</h3>
                  {credentials.map((credential) => (
                    <Card key={credential.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Key className="h-5 w-5 text-gray-400" />
                            <div>
                              <div className="font-medium">{credential.name}</div>
                              <div className="text-sm text-gray-500">
                                {credential.username} • {credential.environment}
                              </div>
                              <div className="text-xs text-gray-400">
                                Last used: {credential.lastUsed.toLocaleDateString()} • 
                                Created: {credential.createdAt.toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={credential.status === 'active' ? 'default' : 'secondary'}
                            >
                              {credential.status}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive email updates about test activities</p>
                    </div>
                    <Switch 
                      id="emailNotifications"
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, emailNotifications: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="testFailures">Test Failure Alerts</Label>
                      <p className="text-sm text-gray-500">Get notified immediately when tests fail</p>
                    </div>
                    <Switch 
                      id="testFailures"
                      checked={settings.notifications.testFailures}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, testFailures: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="scheduleReminders">Schedule Reminders</Label>
                      <p className="text-sm text-gray-500">Reminders before scheduled test runs</p>
                    </div>
                    <Switch 
                      id="scheduleReminders"
                      checked={settings.notifications.scheduleReminders}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, scheduleReminders: checked }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weeklyReports">Weekly Reports</Label>
                      <p className="text-sm text-gray-500">Weekly summary of test results and trends</p>
                    </div>
                    <Switch 
                      id="weeklyReports"
                      checked={settings.notifications.weeklyReports}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, weeklyReports: checked }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* D365 Connection Settings */}
          <TabsContent value="d365">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Dynamics 365 Connection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="instanceUrl">Instance URL</Label>
                    <Input 
                      id="instanceUrl"
                      placeholder="https://yourorg.crm.dynamics.com"
                      value={settings.d365.instanceUrl}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        d365: { ...prev.d365, instanceUrl: e.target.value }
                      }))}
                    />
                    <p className="text-sm text-gray-500 mt-1">Your Dynamics 365 organization URL</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="apiVersion">API Version</Label>
                      <Select 
                        value={settings.d365.apiVersion}
                        onValueChange={(value) => setSettings(prev => ({
                          ...prev,
                          d365: { ...prev.d365, apiVersion: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9.0">9.0</SelectItem>
                          <SelectItem value="9.1">9.1</SelectItem>
                          <SelectItem value="9.2">9.2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="authMethod">Authentication Method</Label>
                      <Select 
                        value={settings.d365.authMethod}
                        onValueChange={(value) => setSettings(prev => ({
                          ...prev,
                          d365: { ...prev.d365, authMethod: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                          <SelectItem value="serviceAccount">Service Account</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Status</Badge>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Connected</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Connection to D365 instance is healthy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch 
                      id="twoFactor"
                      checked={settings.security.twoFactorAuth}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, twoFactorAuth: checked }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input 
                      id="sessionTimeout"
                      type="number"
                      min="30"
                      max="1440"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                      }))}
                    />
                    <p className="text-sm text-gray-500 mt-1">Automatically log out after period of inactivity</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="apiKeyRotation">Automatic API Key Rotation</Label>
                      <p className="text-sm text-gray-500">Automatically rotate API keys every 90 days</p>
                    </div>
                    <Switch 
                      id="apiKeyRotation"
                      checked={settings.security.apiKeyRotation}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, apiKeyRotation: checked }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
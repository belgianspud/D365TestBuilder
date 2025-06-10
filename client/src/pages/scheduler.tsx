import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, Play, Pause, Edit, Trash2, Clock } from "lucide-react";

interface ScheduledTest {
  id: number;
  testCaseId: number;
  testCaseName: string;
  schedule: string;
  nextRun: Date;
  environment: string;
  status: 'active' | 'paused';
  lastRun?: Date;
  lastStatus?: 'passed' | 'failed';
}

export default function Scheduler() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const scheduledTests: ScheduledTest[] = [
    {
      id: 1,
      testCaseId: 1,
      testCaseName: "Account Creation Test Flow",
      schedule: "Daily at 9:00 AM",
      nextRun: new Date(Date.now() + 12 * 60 * 60 * 1000),
      environment: 'Development',
      status: 'active',
      lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
      lastStatus: 'passed'
    },
    {
      id: 2,
      testCaseId: 2,
      testCaseName: "Contact Update Test",
      schedule: "Weekly on Monday",
      nextRun: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      environment: 'Staging',
      status: 'active',
      lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      lastStatus: 'passed'
    },
    {
      id: 3,
      testCaseId: 3,
      testCaseName: "Opportunity Pipeline Test",
      schedule: "Daily at 6:00 PM",
      nextRun: new Date(Date.now() + 8 * 60 * 60 * 1000),
      environment: 'Production',
      status: 'paused',
      lastRun: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      lastStatus: 'failed'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'paused':
        return <Badge variant="secondary">Paused</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getLastRunBadge = (status?: string) => {
    if (!status) return null;
    switch (status) {
      case 'passed':
        return <Badge variant="outline" className="text-green-700 border-green-200">Passed</Badge>;
      case 'failed':
        return <Badge variant="outline" className="text-red-700 border-red-200">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Test Scheduler</h1>
            <p className="text-gray-600 mt-1">Automate test execution with scheduled runs</p>
          </div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Test
          </Button>
        </div>

        {/* Create Schedule Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Schedule New Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="testCase">Test Case</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select test case" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Account Creation Test Flow</SelectItem>
                      <SelectItem value="2">Contact Update Test</SelectItem>
                      <SelectItem value="3">Opportunity Pipeline Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="environment">Environment</Label>
                  <Select>
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
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input type="time" placeholder="09:00" />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button>Create Schedule</Button>
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scheduled Tests */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Tests ({scheduledTests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledTests.map((scheduled) => (
                <div key={scheduled.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">{scheduled.testCaseName}</div>
                      <div className="text-sm text-gray-500">
                        {scheduled.schedule} • {scheduled.environment}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {scheduled.nextRun.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">Next Run</div>
                    </div>
                    
                    {scheduled.lastRun && (
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          {scheduled.lastRun.toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">Last Run</div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      {getStatusBadge(scheduled.status)}
                      {getLastRunBadge(scheduled.lastStatus)}
                    </div>
                    
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        title={scheduled.status === 'active' ? 'Pause' : 'Resume'}
                      >
                        {scheduled.status === 'active' ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button size="sm" variant="outline" title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {scheduledTests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No scheduled tests</h3>
                <p className="mb-4">Create your first scheduled test to automate your testing workflow</p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Test
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
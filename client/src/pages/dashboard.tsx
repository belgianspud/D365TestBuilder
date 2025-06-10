import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TestTube, 
  Calendar,
  TrendingUp,
  Activity
} from "lucide-react";
import { Link } from "wouter";
import type { TestCase } from "@shared/schema";

interface TestResult {
  id: number;
  testCaseId: number;
  testCaseName: string;
  status: 'passed' | 'failed' | 'running';
  environment: string;
  runTime: number;
  executedAt: Date;
}

interface ScheduledTest {
  id: number;
  testCaseId: number;
  testCaseName: string;
  schedule: string;
  nextRun: Date;
  environment: string;
  status: 'active' | 'paused';
}

export default function Dashboard() {
  const { data: testCases } = useQuery<TestCase[]>({
    queryKey: ['/api/test-cases'],
  });

  // Mock data for dashboard KPIs and recent runs
  const mockTestResults: TestResult[] = [
    {
      id: 1,
      testCaseId: 1,
      testCaseName: "Account Creation Test Flow",
      status: 'passed',
      environment: 'Development',
      runTime: 4.5,
      executedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      testCaseId: 1,
      testCaseName: "Account Creation Test Flow",
      status: 'failed',
      environment: 'Staging',
      runTime: 2.1,
      executedAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: 3,
      testCaseId: 1,
      testCaseName: "Contact Update Test",
      status: 'passed',
      environment: 'Production',
      runTime: 3.2,
      executedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
    }
  ];

  const mockScheduledTests: ScheduledTest[] = [
    {
      id: 1,
      testCaseId: 1,
      testCaseName: "Account Creation Test Flow",
      schedule: "Daily at 9:00 AM",
      nextRun: new Date(Date.now() + 12 * 60 * 60 * 1000),
      environment: 'Development',
      status: 'active'
    },
    {
      id: 2,
      testCaseId: 1,
      testCaseName: "Contact Update Test",
      schedule: "Weekly on Monday",
      nextRun: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      environment: 'Staging',
      status: 'active'
    }
  ];

  // Calculate KPIs
  const totalTestCases = testCases?.length || 0;
  const totalRuns = mockTestResults.length;
  const passedRuns = mockTestResults.filter(r => r.status === 'passed').length;
  const failedRuns = mockTestResults.filter(r => r.status === 'failed').length;
  const passedPercentage = totalRuns > 0 ? Math.round((passedRuns / totalRuns) * 100) : 0;
  const failedPercentage = totalRuns > 0 ? Math.round((failedRuns / totalRuns) * 100) : 0;
  const avgRunTime = totalRuns > 0 ? mockTestResults.reduce((sum, r) => sum + r.runTime, 0) / totalRuns : 0;

  const formatRunTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Passed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'running':
        return <Badge variant="secondary">Running</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor your D365 test automation</p>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/flow-builder">
                <TestTube className="h-4 w-4 mr-2" />
                Create Test
              </Link>
            </Button>
            <Button variant="outline">
              <Play className="h-4 w-4 mr-2" />
              Run Test
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/test-cases">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Test Cases</CardTitle>
                <TestTube className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTestCases}</div>
                <p className="text-xs text-muted-foreground">Active test cases</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/results?status=passed">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Passed Tests</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{passedPercentage}%</div>
                <p className="text-xs text-muted-foreground">{passedRuns} of {totalRuns} runs</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/results?status=failed">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Tests</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{failedPercentage}%</div>
                <p className="text-xs text-muted-foreground">{failedRuns} of {totalRuns} runs</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/results">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Run Time</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatRunTime(avgRunTime)}</div>
                <p className="text-xs text-muted-foreground">Average execution time</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Test Runs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent Test Runs</CardTitle>
              <Link href="/results">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTestResults.map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <div className="font-medium text-sm">{result.testCaseName}</div>
                        <div className="text-xs text-gray-500">{result.environment}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(result.status)}
                      <div className="text-xs text-gray-500 mt-1">
                        {formatRunTime(result.runTime)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Tests */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Scheduled Tests</CardTitle>
              <Link href="/scheduler">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockScheduledTests.map((scheduled) => (
                  <div key={scheduled.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium text-sm">{scheduled.testCaseName}</div>
                        <div className="text-xs text-gray-500">{scheduled.schedule}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={scheduled.status === 'active' ? 'default' : 'secondary'}>
                        {scheduled.status}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        Next: {scheduled.nextRun.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
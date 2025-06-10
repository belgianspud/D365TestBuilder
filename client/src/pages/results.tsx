import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Clock, Search, Filter, Download } from "lucide-react";

interface TestResult {
  id: number;
  testCaseId: number;
  testCaseName: string;
  status: 'passed' | 'failed' | 'running';
  environment: string;
  runTime: number;
  executedAt: Date;
  passedSteps: number;
  totalSteps: number;
}

export default function Results() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [environmentFilter, setEnvironmentFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock test results data
  const testResults: TestResult[] = [
    {
      id: 1,
      testCaseId: 1,
      testCaseName: "Account Creation Test Flow",
      status: 'passed',
      environment: 'Development',
      runTime: 4.5,
      executedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      passedSteps: 4,
      totalSteps: 4
    },
    {
      id: 2,
      testCaseId: 1,
      testCaseName: "Account Creation Test Flow",
      status: 'failed',
      environment: 'Staging',
      runTime: 2.1,
      executedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      passedSteps: 2,
      totalSteps: 4
    },
    {
      id: 3,
      testCaseId: 2,
      testCaseName: "Contact Update Test",
      status: 'passed',
      environment: 'Production',
      runTime: 3.2,
      executedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      passedSteps: 3,
      totalSteps: 3
    },
    {
      id: 4,
      testCaseId: 3,
      testCaseName: "Opportunity Pipeline Test",
      status: 'running',
      environment: 'Development',
      runTime: 1.8,
      executedAt: new Date(Date.now() - 10 * 60 * 1000),
      passedSteps: 2,
      totalSteps: 5
    }
  ];

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

  const formatRunTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}m ${secs}s`;
  };

  const filteredResults = testResults.filter(result => {
    const matchesStatus = statusFilter === "all" || result.status === statusFilter;
    const matchesEnvironment = environmentFilter === "all" || result.environment === environmentFilter;
    const matchesSearch = searchTerm === "" || result.testCaseName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesEnvironment && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Test Results</h1>
            <p className="text-gray-600 mt-1">View and analyze test execution results</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search test cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                </SelectContent>
              </Select>
              <Select value={environmentFilter} onValueChange={setEnvironmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Environments</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Staging">Staging</SelectItem>
                  <SelectItem value="Production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Test Runs ({filteredResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredResults.map((result) => (
                <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(result.status)}
                    <div>
                      <div className="font-medium">{result.testCaseName}</div>
                      <div className="text-sm text-gray-500">
                        {result.environment} • {result.executedAt.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-sm font-medium">{result.passedSteps}/{result.totalSteps}</div>
                      <div className="text-xs text-gray-500">Steps</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{formatRunTime(result.runTime)}</div>
                      <div className="text-xs text-gray-500">Runtime</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(result.status)}
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredResults.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No test results found matching your criteria
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
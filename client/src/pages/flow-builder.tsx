import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Save, FolderOpen, Play, Bot, Settings, Globe, Key } from "lucide-react";
import ComponentPalette from "@/components/component-palette";
import FlowCanvas from "@/components/flow-canvas";
import PropertiesPanel from "@/components/properties-panel";
import TestResultsModal from "@/components/test-results-modal";
import { apiRequest } from "@/lib/queryClient";
import type { FlowNode, FlowConnection, TestCase } from "@shared/schema";

export default function FlowBuilder() {
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [currentTestCase, setCurrentTestCase] = useState<TestCase | null>(null);
  
  // Environment and test case configuration state
  const [testCaseName, setTestCaseName] = useState("");
  const [testCaseDescription, setTestCaseDescription] = useState("");
  const [selectedEnvironment, setSelectedEnvironment] = useState("");
  const [environmentUrl, setEnvironmentUrl] = useState("");
  const [selectedCredential, setSelectedCredential] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock credentials data - in real app this would be loaded from settings/backend
  const availableCredentials = [
    { id: "cred1", name: "Production Admin", environment: "Production", status: "active" },
    { id: "cred2", name: "Staging Service Account", environment: "Staging", status: "active" },
    { id: "cred3", name: "Dev Environment", environment: "Development", status: "active" },
    { id: "cred4", name: "Test User Account", environment: "Development", status: "inactive" }
  ];

  const environments = [
    { id: "development", name: "Development", defaultUrl: "https://dev.crm.dynamics.com" },
    { id: "staging", name: "Staging", defaultUrl: "https://staging.crm.dynamics.com" },
    { id: "production", name: "Production", defaultUrl: "https://prod.crm.dynamics.com" }
  ];

  // Load initial test case
  const { data: testCases, isLoading } = useQuery<TestCase[]>({
    queryKey: ['/api/test-cases'],
  });

  const saveTestCaseMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; nodes: FlowNode[]; connections: FlowConnection[] }) => {
      if (currentTestCase) {
        return apiRequest('PUT', `/api/test-cases/${currentTestCase.id}`, data);
      } else {
        return apiRequest('POST', '/api/test-cases', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/test-cases'] });
      toast({
        title: "Success",
        description: "Test case saved successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save test case",
        variant: "destructive",
      });
    },
  });

  const runTestMutation = useMutation({
    mutationFn: async (testCaseId: number) => {
      const response = await apiRequest('POST', `/api/test-cases/${testCaseId}/run`);
      return response.json();
    },
    onSuccess: (results) => {
      setTestResults(results);
      setShowResults(true);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to run test case",
        variant: "destructive",
      });
    },
  });

  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [connections, setConnections] = useState<FlowConnection[]>([]);

  // Load the first test case on mount
  useEffect(() => {
    if (testCases && Array.isArray(testCases) && testCases.length > 0 && !currentTestCase) {
      const firstTestCase = testCases[0];
      setCurrentTestCase(firstTestCase);
      setNodes(firstTestCase.nodes || []);
      setConnections(firstTestCase.connections || []);
      setTestCaseName(firstTestCase.name);
      setTestCaseDescription(firstTestCase.description || "");
    }
  }, [testCases, currentTestCase]);

  // Update environment URL when environment changes
  useEffect(() => {
    const selectedEnv = environments.find(env => env.id === selectedEnvironment);
    if (selectedEnv && !environmentUrl) {
      setEnvironmentUrl(selectedEnv.defaultUrl);
    }
  }, [selectedEnvironment, environmentUrl]);

  const handleSave = useCallback(() => {
    if (!testCaseName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a test case name",
        variant: "destructive",
      });
      return;
    }

    if (!selectedEnvironment) {
      toast({
        title: "Error", 
        description: "Please select an environment",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCredential) {
      toast({
        title: "Error",
        description: "Please select credentials",
        variant: "destructive",
      });
      return;
    }
    
    saveTestCaseMutation.mutate({
      name: testCaseName,
      description: testCaseDescription,
      nodes,
      connections,
    });
  }, [nodes, connections, testCaseName, testCaseDescription, selectedEnvironment, selectedCredential, saveTestCaseMutation, toast]);

  const handleLoad = useCallback(() => {
    // For now, load the first available test case
    if (testCases && Array.isArray(testCases) && testCases.length > 0) {
      const testCase = testCases[0];
      setCurrentTestCase(testCase);
      setNodes(testCase.nodes || []);
      setConnections(testCase.connections || []);
      toast({
        title: "Success",
        description: "Test case loaded successfully!",
      });
    }
  }, [testCases, toast]);

  const handleRun = useCallback(() => {
    if (currentTestCase) {
      runTestMutation.mutate(currentTestCase.id);
    } else {
      toast({
        title: "Error",
        description: "Please save the test case first",
        variant: "destructive",
      });
    }
  }, [currentTestCase, runTestMutation, toast]);

  const handleNodeUpdate = useCallback((updatedNode: FlowNode) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === updatedNode.id ? updatedNode : node
      )
    );
    setSelectedNode(updatedNode);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Bot className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading test automation tool...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900">D365 Test Automation Builder</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoad}
              disabled={!testCases || !Array.isArray(testCases) || testCases.length === 0}
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Load
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={saveTestCaseMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {saveTestCaseMutation.isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleRun}
              disabled={runTestMutation.isPending || !currentTestCase}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4 mr-2" />
              {runTestMutation.isPending ? "Running..." : "Run Test"}
            </Button>
          </div>
        </div>

        {/* Test Case Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Test Case Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Test Case Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="testName" className="text-xs">Test Case Name</Label>
                <Input
                  id="testName"
                  placeholder="Enter test case name"
                  value={testCaseName}
                  onChange={(e) => setTestCaseName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="testDescription" className="text-xs">Description (Optional)</Label>
                <Input
                  id="testDescription"
                  placeholder="Brief description"
                  value={testCaseDescription}
                  onChange={(e) => setTestCaseDescription(e.target.value)}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Environment Configuration */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Environment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="environment" className="text-xs">Environment</Label>
                <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    {environments.map((env) => (
                      <SelectItem key={env.id} value={env.id}>
                        {env.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="envUrl" className="text-xs">Environment URL</Label>
                <Input
                  id="envUrl"
                  placeholder="https://yourorg.crm.dynamics.com"
                  value={environmentUrl}
                  onChange={(e) => setEnvironmentUrl(e.target.value)}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Credentials */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Key className="h-4 w-4" />
                Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="credentials" className="text-xs">Select Credentials</Label>
                <Select value={selectedCredential} onValueChange={setSelectedCredential}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose credentials" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCredentials.map((cred) => (
                      <SelectItem key={cred.id} value={cred.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{cred.name}</span>
                          <Badge 
                            variant={cred.status === 'active' ? 'default' : 'secondary'}
                            className="ml-2 text-xs"
                          >
                            {cred.status}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-xs text-gray-500">
                Manage credentials in{" "}
                <Button variant="link" className="p-0 h-auto text-xs" asChild>
                  <a href="/settings">Settings</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <ComponentPalette />
        <FlowCanvas
          nodes={nodes}
          connections={connections}
          onNodesChange={setNodes}
          onConnectionsChange={setConnections}
          selectedNode={selectedNode}
          onNodeSelect={setSelectedNode}
        />
        <PropertiesPanel
          selectedNode={selectedNode}
          onNodeUpdate={handleNodeUpdate}
        />
      </div>

      {/* Test Results Modal */}
      <TestResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        results={testResults}
      />
    </div>
  );
}

import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Save, FolderOpen, Play, Bot } from "lucide-react";
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    }
  }, [testCases, currentTestCase]);

  const handleSave = useCallback(() => {
    const testCaseName = currentTestCase?.name || "New Test Case";
    const testCaseDescription = currentTestCase?.description || "";
    
    saveTestCaseMutation.mutate({
      name: testCaseName,
      description: testCaseDescription,
      nodes,
      connections,
    });
  }, [nodes, connections, currentTestCase, saveTestCaseMutation]);

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
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Bot className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">D365 Test Automation Builder</h1>
          </div>
          <div className="h-6 w-px bg-gray-200"></div>
          <span className="text-sm text-gray-600">
            {currentTestCase?.name || "New Test Case"}
          </span>
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
            Save
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleRun}
            disabled={runTestMutation.isPending || !currentTestCase}
            className="bg-green-600 hover:bg-green-700"
          >
            <Play className="h-4 w-4 mr-2" />
            Run Test
          </Button>
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

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TestTube, Plus, Play, Edit, Trash2 } from "lucide-react";
import { Link } from "wouter";
import type { TestCase } from "@shared/schema";

export default function TestCases() {
  const { data: testCases, isLoading } = useQuery<TestCase[]>({
    queryKey: ['/api/test-cases'],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <TestTube className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading test cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Test Cases</h1>
            <p className="text-gray-600 mt-1">Manage your automated test scenarios</p>
          </div>
          <Button asChild>
            <Link href="/flow-builder">
              <Plus className="h-4 w-4 mr-2" />
              Create Test Case
            </Link>
          </Button>
        </div>

        {/* Test Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testCases?.map((testCase) => (
            <Card key={testCase.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{testCase.name}</CardTitle>
                  <Badge variant="outline">{testCase.nodes?.length || 0} steps</Badge>
                </div>
                {testCase.description && (
                  <p className="text-sm text-gray-600">{testCase.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Last updated: {new Date(testCase.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/flow-builder">
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!testCases || testCases.length === 0) && (
          <Card className="text-center py-12">
            <CardContent>
              <TestTube className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No test cases yet</h3>
              <p className="text-gray-600 mb-6">Create your first automated test case to get started</p>
              <Button asChild>
                <Link href="/flow-builder">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Test Case
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
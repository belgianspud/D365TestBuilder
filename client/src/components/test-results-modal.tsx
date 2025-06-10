import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

interface TestResult {
  testCaseId: number;
  status: 'passed' | 'failed' | 'running';
  totalSteps: number;
  passedSteps: number;
  failedSteps: number;
  executionTime: number;
  steps: Array<{
    stepId: string;
    stepName: string;
    status: 'passed' | 'failed' | 'running';
    message: string;
    executionTime: number;
  }>;
}

interface TestResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: TestResult | null;
}

export default function TestResultsModal({ isOpen, onClose, results }: TestResultsModalProps) {
  if (!results) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'running':
        return <Clock className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge variant="default" className="bg-green-600">Passed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'running':
        return <Badge variant="secondary">Running</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getStatusIcon(results.status)}
            Test Execution Results
          </DialogTitle>
          <DialogDescription>
            Test case ID: {results.testCaseId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Status</div>
                  <div className="font-medium">{getStatusBadge(results.status)}</div>
                </div>
                <div>
                  <div className="text-gray-600">Total Steps</div>
                  <div className="font-medium">{results.totalSteps}</div>
                </div>
                <div>
                  <div className="text-gray-600">Passed</div>
                  <div className="font-medium text-green-600">{results.passedSteps}</div>
                </div>
                <div>
                  <div className="text-gray-600">Failed</div>
                  <div className="font-medium text-red-600">{results.failedSteps}</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Execution Time: <span className="font-medium">{results.executionTime.toFixed(2)} seconds</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Steps */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Step Results</h3>
            {results.steps.map((step, index) => (
              <Card key={step.stepId} className={`border-l-4 ${
                step.status === 'passed' ? 'border-l-green-500' : 
                step.status === 'failed' ? 'border-l-red-500' : 
                'border-l-blue-500'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(step.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">Step {index + 1}: {step.stepName}</span>
                        {getStatusBadge(step.status)}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{step.message}</div>
                      <div className="text-xs text-gray-500">
                        Execution time: {step.executionTime}ms
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

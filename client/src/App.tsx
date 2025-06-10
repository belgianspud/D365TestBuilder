import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import Dashboard from "@/pages/dashboard";
import TestCases from "@/pages/test-cases";
import FlowBuilder from "@/pages/flow-builder";
import Results from "@/pages/results";
import Scheduler from "@/pages/scheduler";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Navigation>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/test-cases" component={TestCases} />
        <Route path="/flow-builder" component={FlowBuilder} />
        <Route path="/results" component={Results} />
        <Route path="/scheduler" component={Scheduler} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Navigation>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

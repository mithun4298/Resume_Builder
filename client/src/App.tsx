
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import Home from '@/pages/home';
import Landing from '@/pages/landing';
import NotFound from '@/pages/not-found';
import ResumeBuilderPage from '@/pages/resume-builder';
import Templates from '@/pages/templates';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/home" component={Home} />
          <Route path="/resume-builder" component={ResumeBuilderPage} />
          <Route path="/templates" component={Templates} />
          <Route component={NotFound} />
        </Switch>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

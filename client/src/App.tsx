import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from "@/hooks/useAuth";
import { Switch, Route } from "wouter";

// Import your pages
import LandingPage from '@/pages/landing';
import HomePage from '@/pages/home';
import ResumeBuilder from '@/pages/resume-builder';
import NotFoundPage from '@/pages/not-found';

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={LandingPage} />
      ) : (
        <>
          <Route path="/" component={HomePage} />
          <Route path="/builder" component={ResumeBuilder} />
          <Route path="/templates" component={() => <div>Templates Page</div>} />
          <Route path="/my-resumes" component={() => <div>My Resumes Page</div>} />
        </>
      )}
      <Route component={NotFoundPage} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <Router />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}
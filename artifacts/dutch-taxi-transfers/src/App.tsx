import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Header } from '@/components/Header';
import { SiteFooter } from '@/components/SiteFooter';
import NotFound from '@/pages/not-found';
import { AboutPage, BlogPage, ContactPage, DestinationsPage, HomePage, PricingPage, ServicesPage } from '@/pages/SitePages';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <Header />
      {children}
      <SiteFooter />
    </div>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/"><SiteShell><HomePage /></SiteShell></Route>
        <Route path="/services"><SiteShell><ServicesPage /></SiteShell></Route>
        <Route path="/destinations"><SiteShell><DestinationsPage /></SiteShell></Route>
        <Route path="/pricing"><SiteShell><PricingPage /></SiteShell></Route>
        <Route path="/about"><SiteShell><AboutPage /></SiteShell></Route>
        <Route path="/blog"><SiteShell><BlogPage /></SiteShell></Route>
        <Route path="/contact"><SiteShell><ContactPage /></SiteShell></Route>
        <Route><SiteShell><NotFound /></SiteShell></Route>
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { BookingWidget } from '@/components/BookingWidget';
import { ServiceCategories } from '@/components/ServiceCategories';
import { TrustSection } from '@/components/TrustSection';
import { business } from '@/components/business-content';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  return (
    <div className="site-shell">
      <Header />
      <main>
        <Hero />
        <BookingWidget />
        <ServiceCategories />
        <TrustSection />
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <a className="footer-brand" href="#top">{business.name}</a>
          <p>{business.footerCopy}</p>
          <a href={business.phoneLink}>{business.phoneDisplay}</a>
          <span>{business.footerRegion}</span>
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
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

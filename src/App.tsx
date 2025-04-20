import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AuthProvider } from "@/context/AuthContext";
import { LoadingProvider } from "@/context/LoadingContext";
import { MapProvider } from "@/context/MapContext";
import Loader from "@/components/ui/loader";
import { Suspense, useState, useEffect } from "react";

// Direct imports instead of lazy loading
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Signup from './UserPage/Signup';
import Login from './UserPage/Login';
import ComingSoon from './pages/CommingSoon';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  const [pageLoading, setPageLoading] = useState(true);
  
  // Initial app load with 3-second loading screen
  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) {
    return <Loader  />;
  }

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LoadingProvider>
            <AuthProvider>
              <MapProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Suspense fallback={<Loader  />}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/Signup" element={<Signup />} />
                      <Route path="/Login" element={<Login />} />
                      <Route path="*" element={<NotFound />} />
                      <Route path="/coming-soon" element={<ComingSoon />} />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </MapProvider>
            </AuthProvider>
          </LoadingProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;

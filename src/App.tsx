import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";

const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile/Profile"));
const Products = lazy(() => import("./pages/Products"));
const Recipes = lazy(() => import("./pages/Recipes/Recipes"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RecipeDetails = lazy(() => import("./pages/RecipeDetails/RecipeDetails"));

import PrivateRoute from "./components/PrivateRoutes";
import PublicRoute from "./components/PublicRoutes";
import Navigation from "./components/Navigation";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";

const queryClient = new QueryClient();

const App = () => {
  const { checkAuthStatus, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size={48} className="animate-spin" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Suspense fallback={null}>
            <Routes>
              <Route element={<PrivateRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/products" element={<Products />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/recipes/:id" element={<RecipeDetails />} />
              </Route>

              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

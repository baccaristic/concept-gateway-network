
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SubmitIdea from "./pages/SubmitIdea";
import ExpertDashboard from "./pages/ExpertDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import IdeaDetails from "./pages/IdeaDetails";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PdfViewer from "./pages/PdfViewer";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import ProtectedRoute from "./components/ProtectedRoute";
import InvestorDashboard from "@/pages/InvestorDashboard";

// Import i18n
import "./i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <Routes>
              {/* Public routes - redirect if authenticated */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={
                <ProtectedRoute redirectAuthenticated redirectPath="/dashboard">
                  <Login />
                </ProtectedRoute>
              } />
              <Route path="/register" element={
                <ProtectedRoute redirectAuthenticated redirectPath="/dashboard">
                  <Register />
                </ProtectedRoute>
              } />
              <Route path="/forgot-password" element={
                <ProtectedRoute redirectAuthenticated redirectPath="/dashboard">
                  <ForgotPassword />
                </ProtectedRoute>
              } />
              <Route path="/reset-password" element={
                <ProtectedRoute redirectAuthenticated redirectPath="/dashboard">
                  <ResetPassword />
                </ProtectedRoute>
              } />
              
              {/* Idea holder protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/submit-idea" element={
                <ProtectedRoute>
                  <SubmitIdea />
                </ProtectedRoute>
              } />
              
              {/* Specific role protected routes */}
              <Route path="/investor-dashboard" element={
                <ProtectedRoute requiredRoles={['INVESTOR']}>
                  <InvestorDashboard />
                </ProtectedRoute>
              } />
              <Route path="/expert-dashboard" element={
                <ProtectedRoute requiredRoles={['EXPERT']}>
                  <ExpertDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin-dashboard" element={
                <ProtectedRoute requiredRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* Semi-protected routes - visible to all authenticated users */}
              <Route path="/ideas/:ideaId" element={
                <ProtectedRoute>
                  <IdeaDetails />
                </ProtectedRoute>
              } />
              <Route path="/pdf-viewer" element={
                <ProtectedRoute>
                  <PdfViewer />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

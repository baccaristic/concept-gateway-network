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
import AccountSettings from "./pages/AccountSettings";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import ProtectedRoute from "./components/ProtectedRoute";
import InvestorDashboard from "@/pages/InvestorDashboard";
import { ThemeProvider } from "@/components/ThemeProvider";

// Footer pages
import HowItWorks from "./pages/HowItWorks";
import Faq from "./pages/Faq";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Copyright from "./pages/Copyright";

// Import i18n
import "./i18n";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <NotificationProvider>
              <Routes>
                {/* Public routes - redirect if authenticated */}
                <Route path="/" element={
                  <ProtectedRoute redirectAuthenticated redirectPath="/dashboard">
                    <Index />
                  </ProtectedRoute>
                } />
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
                
                {/* Footer pages - public */}
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/copyright" element={<Copyright />} />
                
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
                
                {/* Account settings - available to all authenticated users */}
                <Route path="/account-settings" element={
                  <ProtectedRoute>
                    <AccountSettings />
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
                
                {/* Payment redirect route */}
                <Route path="/payment/callback" element={<PaymentRedirect />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </NotificationProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;

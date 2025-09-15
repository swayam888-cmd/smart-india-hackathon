import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import StudentLogin from "./auth/StudentLogin";
import StudentRegister from "./auth/StudentRegister";
import TeacherLogin from "./auth/TeacherLogin";
import TeacherRegister from "./auth/TeacherRegister";
import StudentDashboard from "./components/student/StudentDashboard";
import TeacherDashboard from "./components/teacher/TeacherDashboard";
import GamesDashboard from "./components/student/GamesDashboard";
import SearchPage from "./pages/SearchPage";
import VideoPage from "./pages/VideoPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Student Routes */}
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/games" element={<GamesDashboard />} />
          
          {/* Teacher Routes */}
          <Route path="/teacher/login" element={<TeacherLogin />} />
          <Route path="/teacher/register" element={<TeacherRegister />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          
          {/* Common Routes */}
          <Route path="/search" element={<SearchPage />} />
          <Route path="/videos/:videoId" element={<VideoPage />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
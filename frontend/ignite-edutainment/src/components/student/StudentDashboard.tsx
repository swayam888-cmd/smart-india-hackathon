import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, BookOpen, Trophy, Star, Search, Gamepad2, Video, FileText, Bot } from "lucide-react";
import { Button } from '@/components/ui/button';
import StudentProfileSidebar from "../common/StudentProfileSidebar"; // ✅ Corrected import
import studentAPI from "@/lib/api";
import Chatbot from "./Chatbot";



const StudentDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [recommendations, setRecommendations] = useState({
    teachers: [] as any[],
    videos: [] as any[],
    assignments: [] as any[],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [scores, setScores] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // ✅ Get logged in user
        const userData = localStorage.getItem("user");
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            setUser({
              ...parsedUser,
              points: parsedUser.points || 1250, // fallback mock
              level: parsedUser.level || 5, // fallback mock
            });
          } catch (parseError) {
            console.error("Failed to parse user data from localStorage:", parseError);
            // Optionally, clear invalid user data or redirect to login
            localStorage.removeItem("user");
            // navigate("/student/login"); // If you want to redirect
          }
        }

        // ✅ Fetch recommendations from backend
                const [teachersRes, videosRes, assignmentsRes] = await Promise.all([
          studentAPI.get("/recommendations/teachers"),
          studentAPI.get("/recommendations/videos"),
          studentAPI.get("/recommendations/assignments"),
        ]) as [any, any, any];


        setRecommendations({
          teachers: teachersRes.data || [],
          videos: videosRes.data || [],
          assignments: assignmentsRes.data || [],
        });
      } catch (error) {
        console.error("Failed to load dashboard:", error);

        // fallback mock data
        setRecommendations({
          teachers: [
            { id: 1, name: "Dr. Sarah Johnson", subject: "Mathematics", followers: 1250, avatar: "" },
            { id: 2, name: "Prof. Raj Kumar", subject: "Physics", followers: 980, avatar: "" },
            { id: 3, name: "Ms. Priya Sharma", subject: "Chemistry", followers: 750, avatar: "" },
          ],
          videos: [
            { id: 1, title: "Quadratic Equations Made Easy", teacher: "Dr. Sarah Johnson", duration: "15 min", views: 2500 },
            { id: 2, title: "Laws of Motion Explained", teacher: "Prof. Raj Kumar", duration: "22 min", views: 1800 },
            { id: 3, title: "Chemical Bonding Basics", teacher: "Ms. Priya Sharma", duration: "18 min", views: 1200 },
          ],
          assignments: [
            { id: 1, title: "Algebra Practice Quiz", subject: "Mathematics", dueDate: "Tomorrow", difficulty: "Medium" },
            { id: 2, title: "Force and Acceleration", subject: "Physics", dueDate: "2 days", difficulty: "Hard" },
            { id: 3, title: "Periodic Table Elements", subject: "Chemistry", dueDate: "1 week", difficulty: "Easy" },
          ],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    const fetchScores = async () => {
      try {
        // THIS IS A PLACEHOLDER. In a real app, you'd get this from auth context.
        const studentId = "60d5f1b3e6b3a7b3e8b4e6b1"; 
        const response = await fetch(`http://localhost:5000/api/auth/student/${studentId}/scores`);
        if (!response.ok) {
          throw new Error("Failed to fetch scores");
        }
        const data = await response.json();
        setScores(data);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    fetchScores();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      {user && <StudentProfileSidebar user={user} />} {/* ✅ Fixed */}

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.fullName?.split(" ")[0]}! 👋
            </h1>
            <p className="text-muted-foreground mt-2">
              Ready to continue your learning journey?
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search teachers or classes..."
              className="pl-10 pr-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-80"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link to="/student/games" className="group">
            <div className="game-tile">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-warning rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Play Games</h3>
                  <p className="text-sm text-muted-foreground">Learn through fun games</p>
                </div>
              </div>
            </div>
          </Link>

          <div className="game-tile">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Watch Videos</h3>
                <p className="text-sm text-muted-foreground">Educational content</p>
              </div>
            </div>
          </div>

          <div className="game-tile">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-success rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Assignments</h3>
                <p className="text-sm text-muted-foreground">Complete tasks</p>
              </div>
            </div>
          </div>

          {scores && (
            <div className="game-tile">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${scores.isEligible ? 'bg-gradient-success' : 'bg-destructive'}`}>
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Exam Eligibility</h3>
                  <p className={`text-sm font-bold ${scores.isEligible ? 'text-success' : 'text-destructive'}`}>
                    {scores.isEligible ? "Eligible" : "Not Eligible"}
                  </p>
                  <p className="text-xs text-muted-foreground">{scores.eligibilityPercentage.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Teachers */}
          <div className="learning-card">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-warning" />
              <h2 className="text-xl font-bold">Recommended Teachers</h2>
            </div>
            <div className="space-y-4">
              {recommendations.teachers.map((teacher: any) => (
                <div
                  key={teacher.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-card-hover transition-colors"
                >
                  <div className="profile-avatar w-10 h-10 text-sm">
                    {teacher.name?.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{teacher.name}</h3>
                    <p className="text-sm text-muted-foreground">{teacher.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">{teacher.followers}</p>
                    <p className="text-xs text-muted-foreground">followers</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Videos */}
          <div className="learning-card">
            <div className="flex items-center gap-2 mb-4">
              <Play className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Recommended Videos</h2>
            </div>
            <div className="space-y-4">
              {recommendations.videos.map((video: any) => (
                <div
                  key={video.id}
                  className="p-3 rounded-lg hover:bg-card-hover transition-colors cursor-pointer"
                >
                  <h3 className="font-medium text-foreground mb-1">{video.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{video.teacher}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{video.duration}</span>
                    <span>{video.views} views</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assignments */}
          <div className="learning-card">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-success" />
              <h2 className="text-xl font-bold">Assignments</h2>
            </div>
            <div className="space-y-4">
              {recommendations.assignments.map((assignment: any) => (
                <div
                  key={assignment.id}
                  className="p-3 rounded-lg hover:bg-card-hover transition-colors cursor-pointer"
                >
                  <h3 className="font-medium text-foreground mb-1">{assignment.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{assignment.subject}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Due: {assignment.dueDate}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        assignment.difficulty === "Easy"
                          ? "bg-success/10 text-success"
                          : assignment.difficulty === "Medium"
                          ? "bg-warning/10 text-warning"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {assignment.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="learning-card">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium">Math Quiz - Algebraic Expressions</span>
                <span className="text-muted-foreground">+50 points</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">Watched</span>
                <span className="font-medium">Introduction to Calculus</span>
                <span className="text-muted-foreground">Physics - Prof. Raj Kumar</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-muted-foreground">Achieved</span>
                <span className="font-medium">Problem Solver Badge</span>
                <span className="text-muted-foreground">Level 5 unlocked!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
      {!isChatbotOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setIsChatbotOpen(true)}
            className="w-20 h-20 shadow-lg flex flex-col items-center justify-center text-xs p-0 bg-primary text-primary-foreground"
            style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
          >
            <Bot className="w-6 h-6 mb-1" /> {/* Placeholder for owl icon */}
            <span>ClarifAI</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;

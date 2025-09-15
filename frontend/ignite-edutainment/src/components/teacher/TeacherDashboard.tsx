import { useState, useEffect } from "react";
import { Plus, BarChart3, Users, Video, Eye, Trash2 } from "lucide-react";
import TeacherProfileSidebar from "../common/TeacherProfileSidebar";
import VideoUploadModal from "./VideoUploadModal";
import { videoAPI } from "@/lib/api";

const TeacherDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({
    followers: 0,
    totalViews: 0,
    averageScore: 0,
    totalVideos: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch teacher data + videos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }

        const videoRes = await videoAPI.getVideos();
        const videoList = videoRes.data || [];
        setVideos(videoList);

        setAnalytics({
          followers: 1250,
          totalViews: videoList.reduce((sum: number, v: any) => sum + (v.views || 0), 0),
          averageScore: 87.5,
          totalVideos: videoList.length,
        });
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Upload handler
  const handleVideoUpload = async (videoData: any) => {
    try {
      const res = await videoAPI.uploadVideo(videoData);
      const newVideo = res.data;

      // Add the new video to the top
      setVideos((prev) => [newVideo, ...prev]);
      setIsUploadModalOpen(false);

      // Update analytics
      setAnalytics((prev) => ({
        ...prev,
        totalVideos: prev.totalVideos + 1,
      }));
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Video upload failed");
    }
  };

  // Delete handler
  const handleDeleteVideo = async (videoId: string) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      await videoAPI.deleteVideo(videoId);
      setVideos((prev) => prev.filter((v) => v._id !== videoId));

      setAnalytics((prev) => ({
        ...prev,
        totalVideos: prev.totalVideos - 1,
      }));
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete video");
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background flex">
      {user && <TeacherProfileSidebar user={user} />}

      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome, {user?.fullName?.split(" ")[0]}! 👨‍🏫
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your content and track student engagement
            </p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="btn-hero flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Upload Video
          </button>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="learning-card text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">{analytics.followers}</h3>
            <p className="text-muted-foreground">Followers</p>
          </div>

          <div className="learning-card text-center">
            <div className="w-12 h-12 bg-gradient-success rounded-xl flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</h3>
            <p className="text-muted-foreground">Total Views</p>
          </div>

          <div className="learning-card text-center">
            <div className="w-12 h-12 bg-gradient-warning rounded-xl flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">{analytics.averageScore}%</h3>
            <p className="text-muted-foreground">Avg Assignment Score</p>
          </div>

          <div className="learning-card text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-xl flex items-center justify-center mx-auto mb-3">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">{analytics.totalVideos}</h3>
            <p className="text-muted-foreground">Videos Created</p>
          </div>
        </div>

        {/* Videos */}
        <div className="learning-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Your Videos</h2>
            <div className="text-sm text-muted-foreground">
              {videos.length} video{videos.length !== 1 ? "s" : ""} uploaded
            </div>
          </div>

          {videos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No videos yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by uploading your first educational video
              </p>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="btn-hero"
              >
                Upload Your First Video
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video._id} className="border rounded-xl p-4 hover:shadow-card transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold line-clamp-2">{video.title}</h3>
                    <button
                      onClick={() => handleDeleteVideo(video._id)}
                      className="text-muted-foreground hover:text-destructive p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {video.classes?.map((cls: string) => (
                        <span
                          key={cls}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                        >
                          Class {cls}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{video.language}</span>
                      <span>{video.views || 0} views</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(video.createdAt).toLocaleDateString()}
                    </div>
                    <video
                      src={`http://localhost:5000${video.videoUrl}`}
                      controls
                      className="w-full rounded-lg mt-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <VideoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleVideoUpload}
      />
    </div>
  );
};

export default TeacherDashboard;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Video {
  _id: string;
  title: string;
  description: string;
  language: string;
  classes: string[];
  videoUrl: string;
}

const TeacherVideoGallery = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/videos");
      const data = await res.json();
      setVideos(data);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  if (loading) return <p>Loading videos...</p>;
  if (videos.length === 0) return <p>No videos uploaded yet.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {videos.map(video => (
        <Link to={`/videos/${video._id}`} key={video._id} className="border rounded-lg p-4 block hover:bg-secondary transition-colors">
          <h3 className="font-bold text-lg mb-2">{video.title}</h3>
          <p className="text-sm text-muted-foreground mb-2">{video.description}</p>
          <div className="aspect-video bg-black rounded-lg mb-2">
            <video
              src={`http://localhost:5000${video.videoUrl}`}
              className="w-full h-full rounded-lg"
              // controls are removed to make the whole card clickable
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Language: {video.language} | Classes: {video.classes.join(", ")}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default TeacherVideoGallery;

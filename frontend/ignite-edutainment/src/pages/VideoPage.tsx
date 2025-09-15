
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VideoPage = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/videos/${videoId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch video");
        }
        const data = await response.json();
        setVideo(data);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideo();

    const interval = setInterval(() => {
      const videoElement = document.querySelector("video");
      if (videoElement) {
        const studentId = "60d5f1b3e6b3a7b3e8b4e6b1"; // Placeholder
        fetch(`http://localhost:5000/api/videos/${videoId}/progress`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentId, watchTime: videoElement.currentTime }),
        });
      }
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [videoId]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // THIS IS A PLACEHOLDER. In a real app, you'd get this from auth context.
      const studentId = "60d5f1b3e6b3a7b3e8b4e6b1"; 

      const response = await fetch(`http://localhost:5000/api/videos/${videoId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId, answer }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit assignment");
      }

      const result = await response.json();
      alert(`Assignment submitted! Your score: ${result.score}`);
      // Optionally, you could disable the form or show a success message
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Failed to submit assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{video.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video mb-4">
            <video src={`http://localhost:5000${video.videoUrl}`} controls className="w-full h-full rounded-lg" />
          </div>
          <p className="text-muted-foreground">{video.description}</p>
        </CardContent>
      </Card>

      {video.assignment && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{video.assignment}</p>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your answer..."
              className="mb-4"
            />
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Assignment"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VideoPage;

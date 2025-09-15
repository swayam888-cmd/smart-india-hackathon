import { useState } from "react";
import { X, Upload, Link as LinkIcon } from "lucide-react";

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (videoData: any) => void;
}

const VideoUploadModal: React.FC<VideoUploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    classes: [] as string[],
    language: "English",
    videoUrl: "",
    uploadType: "url", // "url" or "file"
    videoFile: null as File | null
  });
  const [isUploading, setIsUploading] = useState(false);

  const classes = ["6", "7", "8", "9", "10", "11", "12"];
  const languages = ["English", "Hindi", "Odia"];

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.classes.length === 0) {
      alert("Please select at least one class");
      return;
    }

    setIsUploading(true);

    try {
      let response;

      if (formData.uploadType === "file" && formData.videoFile) {
        const data = new FormData();
        data.append("videoFile", formData.videoFile); // must match multer key
        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("language", formData.language);
        data.append("classes", JSON.stringify(formData.classes));

        response = await fetch("http://localhost:5000/api/videos", {
          method: "POST",
          body: data
        });
      } else {
        // URL upload
        response = await fetch("http://localhost:5000/api/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            language: formData.language,
            classes: formData.classes,
            videoUrl: formData.videoUrl
          })
        });
      }

      if (!response.ok) throw new Error("Upload failed");

      const savedVideo = await response.json();
      onUpload(savedVideo);

      // Reset form
      setFormData({
        title: "",
        description: "",
        classes: [],
        language: "English",
        videoUrl: "",
        uploadType: "url",
        videoFile: null,
        
      });
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Video upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, videoFile: e.target.files[0] }));
    }
  };

  const toggleClass = (className: string) => {
    setFormData(prev => ({
      ...prev,
      classes: prev.classes.includes(className)
        ? prev.classes.filter(c => c !== className)
        : [...prev.classes, className]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Upload New Video</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">Video Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter a descriptive title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Describe what students will learn"
              required
            />
          </div>

          {/* Classes */}
          <div>
            <label className="block text-sm font-medium mb-2">Target Classes * (Select multiple)</label>
            <div className="flex flex-wrap gap-2">
              {classes.map(className => (
                <button
                  key={className}
                  type="button"
                  onClick={() => toggleClass(className)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.classes.includes(className)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  Class {className}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label htmlFor="language" className="block text-sm font-medium mb-2">Language *</label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Upload Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Video Source *</label>
            <div className="flex bg-secondary rounded-lg p-1">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, uploadType: "url" }))}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  formData.uploadType === "url"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-secondary-foreground hover:text-foreground"
                }`}
              >
                <LinkIcon className="w-4 h-4 inline mr-2" /> Video URL
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, uploadType: "file" }))}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  formData.uploadType === "file"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-secondary-foreground hover:text-foreground"
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" /> Upload File
              </button>
            </div>
          </div>

          {/* Video Input */}
          {formData.uploadType === "url" ? (
            <div>
              <label htmlFor="videoUrl" className="block text-sm font-medium mb-2">Video URL *</label>
              <input
                type="url"
                id="videoUrl"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://youtube.com/watch?v=..."
                required
              />
            </div>
          ) : (
            <div>
              <label htmlFor="videoFile" className="block text-sm font-medium mb-2">Upload Video File *</label>
              <div className="border-2 border-dashed border-input rounded-lg p-6 text-center hover:border-primary transition-colors">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Click to select video file or drag and drop</p>
                <p className="text-xs text-muted-foreground">Supported: MP4, MOV, AVI (Max 500MB)</p>
                <input
                  type="file"
                  id="videoFile"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-input rounded-lg text-foreground hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="flex-1 btn-hero disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Upload Video"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoUploadModal;

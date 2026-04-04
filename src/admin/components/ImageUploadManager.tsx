import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploadManagerProps {
  label: string;
  value: string;
  onChange: (fileName: string) => void;
  addTemp: (fileName: string) => void;
  showPreview?: boolean; // Optional prop validation skip
}

const ImageUploadManager: React.FC<ImageUploadManagerProps> = ({
  label,
  value,
  onChange,
  addTemp,
}) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [originalDbImage, setOriginalDbImage] = useState<string>("");

  // Detect DB image only once
  useEffect(() => {
    const isDbImage =
      value &&
      (value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.includes("/assets/images/"));

    if (isDbImage) {
      setOriginalDbImage(value);
    }
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const form = new FormData();
    form.append("image", file);

    const sessionId = sessionStorage.getItem("adminSessionId");
    if (sessionId) form.append("sessionId", sessionId);

    try {
      const res = await axiosInstance.post("/upload/imageupload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const fileName = res.data.fileName;

      addTemp(fileName);
      onChange(fileName); // show temp image
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // TEMP or DB?
  const isTempImage =
    value &&
    !value.startsWith("http://") &&
    !value.startsWith("https://") &&
    !value.includes("/assets/images/");

  const getImagePreview = () => {
    if (!value) return null;

    if (!isTempImage) return value;

    return `${import.meta.env.VITE_API_URL}/assets/images/temp/${value}`;
  };

  // Delete temp image
  const handleRemoveTempImage = async () => {
    if (!isTempImage) return;

    try {
      await axiosInstance.post("/upload/remove-temp", {
        fileName: value,
        sessionId: sessionStorage.getItem("adminSessionId"),
      });

      // Restore DB image
      onChange(originalDbImage || "");
    } catch (err) {
      console.error("Failed to delete temp image:", err);
      toast({
        title: "Error",
        description: "Failed to delete temp image",
        variant: "destructive",
      });
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label className="form-label">{label}</label>

      <input
        type="text"
        readOnly
        value={value}
        placeholder="No image uploaded"
        className="form-input"
        style={{ marginBottom: 6, background: "#eef1f5" }}
      />

      {value && (
        <div
          style={{
            marginBottom: 8,
            position: "relative",
            display: "inline-block",
          }}
        >
          <img
            src={getImagePreview() || ""}
            alt="Preview"
            style={{
              maxWidth: "200px",
              maxHeight: "200px",
              objectFit: "contain",
              border: "1px solid #e2e8f0",
              borderRadius: 4,
            }}
          />

          {isTempImage && (
            <button
              onClick={handleRemoveTempImage}
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                background: "rgba(255, 255, 255, 0.9)",
                borderRadius: "50%",
                padding: 4,
                cursor: "pointer",
                border: "1px solid #ccc",
              }}
            >
              <Trash2 size={16} color="#dc2626" />
            </button>
          )}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        style={{ opacity: uploading ? 0.5 : 1 }}
      />

      {uploading && (
        <span style={{ marginLeft: 8, color: "#666" }}>Uploading...</span>
      )}
    </div>
  );
};

export default ImageUploadManager;

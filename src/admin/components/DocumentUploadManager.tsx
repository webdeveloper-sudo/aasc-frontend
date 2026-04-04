import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { Trash2, FileText, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DocumentUploadManagerProps {
  label: string;
  value: string;
  onChange: (fileName: string) => void;
  addTemp: (fileName: string) => void;
}

const DocumentUploadManager: React.FC<DocumentUploadManagerProps> = ({
  label,
  value,
  onChange,
  addTemp,
}) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [originalDbDocument, setOriginalDbDocument] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Detect DB document only once
  useEffect(() => {
    const isDbDocument =
      value &&
      (value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.includes("/assets/documents/"));

    if (isDbDocument) {
      setOriginalDbDocument(value);
    }
  }, []);

  // Update preview URL when value changes
  useEffect(() => {
    const isTempDocument =
      value &&
      !value.startsWith("http://") &&
      !value.startsWith("https://") &&
      !value.includes("/assets/documents/");

    if (value) {
      if (!isTempDocument) {
        setPreviewUrl(value);
      } else {
        setPreviewUrl(
          `${import.meta.env.VITE_API_URL}/assets/documents/temp/${value}`
        );
      }
    } else {
      setPreviewUrl("");
    }
  }, [value]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const form = new FormData();
    form.append("document", file);

    const sessionId = sessionStorage.getItem("adminSessionId");
    if (sessionId) form.append("sessionId", sessionId);

    try {
      const res = await axiosInstance.post(
        "/upload/document/documentupload",
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const fileName = res.data.fileName;

      addTemp(fileName);
      onChange(fileName); // show temp document
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // TEMP or DB?
  const isTempDocument =
    value &&
    !value.startsWith("http://") &&
    !value.startsWith("https://") &&
    !value.includes("/assets/documents/");

  // Delete temp document
  const handleRemoveTempDocument = async () => {
    if (!isTempDocument) return;

    try {
      await axiosInstance.post("/upload/document/remove-temp-document", {
        fileName: value,
        sessionId: sessionStorage.getItem("adminSessionId"),
      });

      // Restore DB document
      onChange(originalDbDocument || "");
    } catch (err) {
      console.error("Failed to delete temp document:", err);
    }
  };

  // Extract filename for display
  const getDisplayName = () => {
    if (!value) return "No document uploaded";
    const parts = value.split("/");
    return parts[parts.length - 1];
  };

  // Check if it's a PDF
  const isPDF = value && value.toLowerCase().endsWith(".pdf");

  return (
    <div className="mb-8 mt-6">
      <label className="form-label">{label}</label>

      {/* <input
        type="text"
        readOnly
        value={value}
        placeholder="No document uploaded"
        className="form-input"
        style={{ marginBottom: 6, background: "#eef1f5" }}
      /> */}

      {value && (
        <div
          style={{
            marginBottom: 8,
            padding: 12,
            background: "#f8f9fa",
            border: "1px solid #e2e8f0",
            borderRadius: 4,
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={24} color="#4a5568" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                {getDisplayName()}
              </div>
              {isPDF && (
                <div style={{ fontSize: 12, color: "#718096" }}>
                  PDF Document
                </div>
              )}
            </div>

            {isTempDocument && (
              <button
                onClick={handleRemoveTempDocument}
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  borderRadius: 4,
                  padding: 6,
                  cursor: "pointer",
                  border: "1px solid #ccc",
                }}
                title="Remove temp document"
              >
                <Trash2 size={16} color="#dc2626" />
              </button>
            )}

            {previewUrl && (
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#3b82f6",
                  color: "white",
                  borderRadius: 4,
                  padding: "6px 12px",
                  textDecoration: "none",
                  fontSize: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Download size={14} />
                Preview
              </a>
            )}
          </div>

          {/* PDF Preview iframe - Fixed */}
          {/* {isPDF && previewUrl && (
            <div style={{ marginTop: 12 }}>
              <iframe
                src={`${previewUrl}#view=FitH`}
                style={{
                  width: "100%",
                  height: "400px",
                  border: "1px solid #e2e8f0",
                  borderRadius: 4,
                }}
                title="PDF Preview"
              />
            </div>
          )} */}
        </div>
      )}

      <input
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx"
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

export default DocumentUploadManager;

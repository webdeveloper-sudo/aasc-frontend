import React, { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "../../../utils/axiosInstance";
import Heading from "@/components/reusable/Heading";
import ImageUploadManager from "../../components/ImageUploadManager";
import { AlertCircle, X } from "lucide-react";
import ScrollDownToPreview from "../../components/ScrollDownToPreview";
import PreviewWrapper from "@/admin/PreviewWrapper";
import OurCampus from "@/components/OurCampus";

interface OurCampusData {
  _id?: string;
  data: {
    title: string;
    image: string;
    videoUrl: string;
    paragraphs: string[];
  };
}

const ConfirmationPopup: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmStyle?: string;
}> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmStyle = "bg-blue-600",
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-600">{message}</p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 text-white rounded-lg font-medium ${confirmStyle}`}
            >
              {confirmText}
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } } .animate-scale-in { animation: scale-in 0.2s ease-out; }`}</style>
    </div>
  );
};

const OurCampusDataManager: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<OurCampusData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editItem, setEditItem] = useState<OurCampusData | null>(null);
  const [originalItem, setOriginalItem] = useState<OurCampusData | null>(null);
  const [tempFiles, setTempFiles] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  const sessionId = useRef(
    `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  const collectionName = "home/ourcampusdata";

  // ✅ AUTO LOAD FIRST ITEM ON MOUNT (No cards view)
  useEffect(() => {
    sessionStorage.setItem("adminSessionId", sessionId.current);
    const stored = sessionStorage.getItem("tempFiles");
    if (stored) setTempFiles(JSON.parse(stored));
    fetchData();
  }, []);

  // ✅ AUTO EDIT FIRST ITEM when data loads
  useEffect(() => {
    if (data.length > 0 && !editItem) {
      const firstItem = data[0];
      setEditItem(JSON.parse(JSON.stringify(firstItem)));
      setOriginalItem(JSON.parse(JSON.stringify(firstItem)));
    }
  }, [data]);

  const hasChanges = useCallback(() => {
    if (!editItem || !originalItem) return false;
    return JSON.stringify(editItem) !== JSON.stringify(originalItem);
  }, [editItem, originalItem]);

  useEffect(() => {
    setHasUnsavedChanges(hasChanges());
  }, [editItem, hasChanges]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(`/${collectionName}`);
      setData(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (e: any) {
      setError("Failed to load data: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const addTempFile = (fileName: string) => {
    setTempFiles((prev) => {
      const updated = [...prev, fileName];
      sessionStorage.setItem("tempFiles", JSON.stringify(updated));
      return updated;
    });
  };

  // CAROUSEL PATTERN: processTempFiles + saveData
  const processTempFiles = async (currentData: any): Promise<any> => {
    let finalData = { ...currentData };
    const processed: string[] = [];

    for (const fileName of tempFiles) {
      try {
        const res = await axiosInstance.post("/upload/save-temp-file", {
          fileName,
        });
        const finalUrl = res.data.url;

        if (finalData.image === fileName) {
          finalData.image = finalUrl;
        }
        processed.push(fileName);
      } catch (err) {
        console.error("Temp save failed:", fileName, err);
      }
    }

    const remaining = tempFiles.filter((f) => !processed.includes(f));
    setTempFiles(remaining);
    if (remaining.length === 0) {
      sessionStorage.removeItem("tempFiles");
    } else {
      sessionStorage.setItem("tempFiles", JSON.stringify(remaining));
    }

    return finalData;
  };

  const saveData = async (finalData: any) => {
    if (!editItem?._id) return;
    try {
      await axiosInstance.put(`/${collectionName}/${editItem._id}`, {
        data: finalData,
      });

      const updatedItem = { ...editItem, data: finalData };
      setData((prev) =>
        prev.map((item) => (item._id === editItem._id ? updatedItem : item))
      );
      setOriginalItem(JSON.parse(JSON.stringify(updatedItem)));
    } catch (err: any) {
      setError("Save failed: " + err.message);
      throw err;
    }
  };

  const handleSave = async () => {
    if (!editItem) return;
    setShowSavePopup(false);
    setLoading(true);

    try {
      const finalData = await processTempFiles(editItem.data);
      await saveData(finalData);
      setError("");
      toast({
        title: "Success",
        description: "Our Campus data saved successfully!",
      });
    } catch (err: any) {
      setError("Error saving: " + err.message);
      toast({
        title: "Error",
        description: "Error saving: " + err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setShowCancelPopup(false);
    try {
      if (tempFiles.length > 0) {
        await axiosInstance.post("/upload/remove-temp", {
          files: tempFiles,
          sessionId: sessionId.current,
        });
      }
      setTempFiles([]);
      sessionStorage.removeItem("tempFiles");
      setEditItem(null);
      setOriginalItem(null);
      // Reload first item
      if (data.length > 0) {
        const firstItem = data[0];
        setEditItem(JSON.parse(JSON.stringify(firstItem)));
        setOriginalItem(JSON.parse(JSON.stringify(firstItem)));
      }
    } catch (err: any) {
      console.error("Cancel cleanup failed:", err);
    }
  };

  const updateField = (path: string, value: any) => {
    if (!editItem) return;
    const updated = { ...editItem };
    const parts = path.split(".");
    let current: any = updated;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    setEditItem(updated);
  };

  const addParagraph = () => {
    if (!editItem) return;
    setEditItem({
      ...editItem,
      data: { ...editItem.data, paragraphs: [...editItem.data.paragraphs, ""] },
    });
  };

  const updateParagraph = (index: number, value: string) => {
    if (!editItem) return;
    const newParagraphs = editItem.data.paragraphs.map((p, i) =>
      i === index ? value : p
    );
    setEditItem({
      ...editItem,
      data: { ...editItem.data, paragraphs: newParagraphs },
    });
  };

  const deleteParagraph = (index: number) => {
    if (!editItem) return;
    const newParagraphs = editItem.data.paragraphs.filter(
      (_, i) => i !== index
    );
    setEditItem({
      ...editItem,
      data: { ...editItem.data, paragraphs: newParagraphs },
    });
  };

  // ✅ SIMPLIFIED RENDER: Always show form + preview
  if (loading && data.length === 0) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="collection-manager p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* ✅ DIRECTLY SHOW FORM + PREVIEW (No cards) */}
      {editItem ? (
        <div style={{ gap: "2rem", position: "relative" }}>
          {hasUnsavedChanges && <ScrollDownToPreview />}

          <div className="form-container border border-gray-300 rounded-lg p-6 bg-white">
            <Heading title="Edit Our Campus" size="lg" align="left" />

            <div className="mb-6 p-4 bg-gray-50 rounded-lg mt-6">
              <div className="mb-4">
                <label className="form-label block text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  className="form-input w-full px-3 py-2 border rounded-md"
                  value={editItem.data.title}
                  onChange={(e) => updateField("data.title", e.target.value)}
                />
              </div>

              <ImageUploadManager
                label="Thumbnail Image"
                value={editItem.data.image}
                onChange={(v) => updateField("data.image", v)}
                addTemp={addTempFile}
              />

              <div className="mb-4 mt-4">
                <label className="form-label block text-sm font-medium mb-2">
                  Video URL
                </label>
                <input
                  type="text"
                  className="form-input w-full px-3 py-2 border rounded-md"
                  value={editItem.data.videoUrl}
                  onChange={(e) => updateField("data.videoUrl", e.target.value)}
                />
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-3">
                  <strong>
                    Paragraphs ({editItem.data.paragraphs.length})
                  </strong>
                  <button
                    className="btn btn-primary px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm"
                    onClick={addParagraph}
                  >
                    + Add Paragraph
                  </button>
                </div>

                {editItem.data.paragraphs.map((para, index) => (
                  <div
                    key={index}
                    className="mb-3 p-3 bg-white rounded border border-gray-200"
                  >
                    <div className="flex justify-between mb-2">
                      <strong className="text-sm">Paragraph {index + 1}</strong>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => deleteParagraph(index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      className="form-input w-full px-3 py-2 border rounded-md"
                      value={para}
                      onChange={(e) => updateParagraph(index, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
              <button
                className="btn btn-primary px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                onClick={() => setShowSavePopup(true)}
                disabled={loading || !hasUnsavedChanges}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                className="btn px-6 py-2.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={() => setShowCancelPopup(true)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="py-4 mt-10 border border-gray-300 rounded-2xl p-8 bg-white">
            <Heading
              title="Live Preview"
              size="lg"
              align="left"
              className="mt-5 mb-8"
            />
            <PreviewWrapper Component={OurCampus} previewData={editItem.data} />
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p>No Our Campus data found. Please create one first.</p>
        </div>
      )}

      <ConfirmationPopup
        isOpen={showSavePopup}
        onClose={() => setShowSavePopup(false)}
        onConfirm={handleSave}
        title="Save Changes?"
        message="Save campus changes?"
        confirmText="Save Changes"
        confirmStyle="bg-blue-600 hover:bg-blue-700"
      />
      <ConfirmationPopup
        isOpen={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
        onConfirm={handleCancel}
        title="Discard Changes?"
        message="Discard all unsaved changes and reload?"
        confirmText="Discard"
        confirmStyle="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default OurCampusDataManager;

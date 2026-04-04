import React, { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "../../../utils/axiosInstance";
import AcademicCalendar from "@/pages/academics/AcademicCalendar";
import PreviewWrapper from "@/admin/PreviewWrapper";
import DocumentUploadManager from "../../components/DocumentUploadManager";
import Heading from "@/components/reusable/Heading";
import { AlertCircle, X } from "lucide-react";
import ScrollDownToPreview from "../../components/ScrollDownToPreview";

interface AcademicCalendarData {
  _id?: string;
  data: {
    semesterTitle: string;
    pdfLink: string;
    flipbook: {
      enabled: boolean;
      note: string;
      subnote: string;
    };
    meta: {
      updatedOn: string;
      uploadedBy: string;
    };
  };
}

// Confirmation Popup Component
const ConfirmationPopup: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmStyle?: string;
  showCancel?: boolean;
}> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmStyle = "bg-blue-600 hover:bg-blue-700",
  showCancel = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 bg-opacity-10 transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full transform transition-all animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 text-white rounded-lg transition-all font-medium shadow-sm hover:shadow-md ${confirmStyle}`}
            >
              {confirmText}
            </button>
            {showCancel && (
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

const AcademicCalendarDataManager: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<AcademicCalendarData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [editItem, setEditItem] = useState<AcademicCalendarData | null>(null);
  const [originalItem, setOriginalItem] = useState<AcademicCalendarData | null>(
    null
  );
  const [isNew, setIsNew] = useState(false);
  const [tempFiles, setTempFiles] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Popup states
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  const isSavingRef = useRef(false);
  const sessionId = useRef(
    `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );

  const collectionName = "academics/academiccalendardata";

  useEffect(() => {
    sessionStorage.setItem("adminSessionId", sessionId.current);
    const stored = sessionStorage.getItem("tempFiles");
    if (stored) {
      setTempFiles(JSON.parse(stored));
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0 && !editItem) {
      const firstItem = JSON.parse(JSON.stringify(data[0]));
      setEditItem(firstItem);
      setOriginalItem(JSON.parse(JSON.stringify(data[0])));
      setIsNew(false);
      setIsEditing(true);
    }
  }, [data, editItem]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (tempFiles.length > 0 && !isSavingRef.current) {
        const formData = new FormData();
        formData.append("files", JSON.stringify(tempFiles));
        formData.append("sessionId", sessionId.current);
        navigator.sendBeacon(
          `${import.meta.env.VITE_API_URL}/api/upload/remove-temp`,
          formData
        );
        sessionStorage.removeItem("tempFiles");
        sessionStorage.removeItem("adminSessionId");
      }
    };

    const cleanupOnRouteChange = async () => {
      if (tempFiles.length > 0 && !isSavingRef.current) {
        try {
          await axiosInstance.post("/upload/document/remove-temp-document", {
            files: tempFiles,
            sessionId: sessionId.current,
          });
          sessionStorage.removeItem("tempFiles");
        } catch (err) {
          console.error("Route change cleanup failed:", err);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (tempFiles.length > 0 && !isSavingRef.current) {
        cleanupOnRouteChange();
      }
    };
  }, [tempFiles]);

  const addTempFile = (fileName: string) => {
    setTempFiles((prev) => {
      const updated = [...prev, fileName];
      sessionStorage.setItem("tempFiles", JSON.stringify(updated));
      return updated;
    });
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(`/${collectionName}`);
      setData(Array.isArray(res.data) ? res.data : [res.data]);
      console.log("Data loaded:", res);
    } catch (e: any) {
      setError("Failed to load data: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = useCallback(() => {
    if (!editItem || !originalItem) return false;
    return JSON.stringify(editItem) !== JSON.stringify(originalItem);
  }, [editItem, originalItem]);

  useEffect(() => {
    setHasUnsavedChanges(hasChanges());
  }, [editItem, hasChanges]);

  const handleOverallSave = () => {
    setShowSavePopup(true);
  };

  const handleSave = async () => {
    if (!editItem) return;

    setShowSavePopup(false);
    isSavingRef.current = true;
    setLoading(true);

    try {
      // Save temp documents to permanent location
      for (const fileName of tempFiles) {
        const res = await axiosInstance.post(
          "/upload/document/save-temp-document",
          {
            fileName,
          }
        );
        const finalUrl = res.data.url;

        if (editItem.data.pdfLink === fileName) {
          editItem.data.pdfLink = finalUrl;
        }
      }

      if (isNew) {
        await axiosInstance.post(`/${collectionName}`, editItem);
      } else if (editItem._id) {
        await axiosInstance.put(`/${collectionName}/${editItem._id}`, editItem);
      }

      setTempFiles([]);
      sessionStorage.removeItem("tempFiles");
      setIsEditing(true);
      setOriginalItem(JSON.parse(JSON.stringify(editItem)));
      fetchData();
      toast({
        title: "Success",
        description: "Calendar saved successfully!",
      });
    } catch (err: any) {
      setError("Error saving: " + err.message);
      toast({
        title: "Error",
        description: "Error saving: " + err.message,
        variant: "destructive",
      });
    } finally {
      isSavingRef.current = false;
      setLoading(false);
    }
  };

  const handleOverallCancel = () => {
    setShowCancelPopup(true);
  };

  const handleCancel = async () => {
    setShowCancelPopup(false);

    try {
      if (tempFiles.length > 0) {
        await axiosInstance.post("/upload/document/remove-temp-document", {
          files: tempFiles,
          sessionId: sessionId.current,
        });
      }

      setTempFiles([]);
      sessionStorage.removeItem("tempFiles");

      if (originalItem) {
        setEditItem(JSON.parse(JSON.stringify(originalItem)));
      }
      setIsEditing(true);
    } catch (err: any) {
      console.error("Cancel cleanup failed:", err);
      if (originalItem) {
        setEditItem(JSON.parse(JSON.stringify(originalItem)));
      }
      setIsEditing(true);
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

  const renderForm = () => {
    if (!editItem) return null;

    return (
      <div style={{ gap: "2rem", position: "relative" }}>
        {hasUnsavedChanges && <ScrollDownToPreview />}

        <div className="form-container border border-gray-300 rounded-lg p-6 bg-white">
          <Heading
            title={isNew ? "Create New Calendar" : "Edit Academic Calendar"}
            size="lg"
            align="left"
          />

          {/* Form Fields */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg mt-6">
            <div className="mb-4">
              <label className="form-label block text-sm font-medium mb-2">
                Semester Title
              </label>
              <input
                type="text"
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editItem.data.semesterTitle}
                onChange={(e) =>
                  updateField("data.semesterTitle", e.target.value)
                }
                placeholder="e.g., ODD Semester 2024–2025"
              />
            </div>

            <DocumentUploadManager
              label="Academic Calendar PDF"
              value={editItem.data.pdfLink}
              onChange={(v) => updateField("data.pdfLink", v)}
              addTemp={addTempFile}
            />

            <div className="mb-4">
              <label className="form-label block text-sm font-medium mb-2">
                Uploaded By
              </label>
              <input
                type="text"
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editItem.data.meta.uploadedBy}
                onChange={(e) =>
                  updateField("data.meta.uploadedBy", e.target.value)
                }
              />
            </div>
          </div>

          <div className="mt-2 p-6 rounded-xl">
            <div className="mt-2 pt-6 border-t border-gray-200 flex gap-4">
              <button
                className="btn btn-primary px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleOverallSave}
                disabled={loading || !hasUnsavedChanges}
              >
                {loading ? "Saving..." : "Save All Changes"}
              </button>

              <button
                className="btn px-6 py-2.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleOverallCancel}
                disabled={loading || !hasUnsavedChanges}
              >
                Cancel All Changes
              </button>
            </div>
          </div>
        </div>

        <div className="py-4 mt-10 border border-gray-300 rounded-2xl p-8 bg-white">
          <Heading
            title="Live Preview"
            size="lg"
            align="left"
            className="mt-5"
          />
          <PreviewWrapper
            Component={AcademicCalendar}
            previewData={editItem.data}
          />
        </div>
      </div>
    );
  };

  if (loading && !editItem) {
    return <div className="text-center py-8">Loading…</div>;
  }

  return (
    <div className="collection-manager p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {renderForm()}

      {/* Save Confirmation Popup */}
      <ConfirmationPopup
        isOpen={showSavePopup}
        onClose={() => {
          setShowSavePopup(false);
        }}
        onConfirm={handleSave}
        title="Save Changes?"
        message="Save all changes to the Academic Calendar? This will update the calendar data permanently."
        confirmText="Save All Changes"
        confirmStyle="bg-blue-600 hover:bg-blue-700"
        showCancel={true}
      />

      {/* Cancel Confirmation Popup */}
      <ConfirmationPopup
        isOpen={showCancelPopup}
        onClose={() => {
          setShowCancelPopup(false);
        }}
        onConfirm={handleCancel}
        title="Discard Changes?"
        message="Discard ALL unsaved changes? This cannot be undone and all your edits will be lost."
        confirmText="Discard All Changes"
        confirmStyle="bg-red-600 hover:bg-red-700"
        showCancel={true}
      />
    </div>
  );
};

export default AcademicCalendarDataManager;

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "../../../utils/axiosInstance";
import PrincipalDesk from "@/pages/about/PrincipalDesk";
import PreviewWrapper from "@/admin/PreviewWrapper";
import ImageUploadManager from "../../components/ImageUploadManager";
import Heading from "@/components/reusable/Heading";
import { ChevronsDown, AlertCircle, X } from "lucide-react";
import ScrollDownToPreview from "../../components/ScrollDownToPreview";

interface PrincipalData {
  _id?: string;
  data: {
    banner: {
      title: string;
      image: string;
    };
    content: {
      title: string;
      image: string;
      email: string;
      paragraphs: string[];
      signOff: {
        text: string;
        name: string;
        title: string;
      };
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 bg-opacity-10 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full transform transition-all animate-scale-in">
        {/* Close Button */}
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

const PrincipalDataManager: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<PrincipalData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(true); // always show form
  const [editItem, setEditItem] = useState<PrincipalData | null>(null);
  const [originalItem, setOriginalItem] = useState<PrincipalData | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [tempFiles, setTempFiles] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Popup states
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const isSavingRef = useRef(false);
  const sessionId = useRef(
    `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );

  const collectionName = "about/principaldata";

  // Initialize session
  useEffect(() => {
    sessionStorage.setItem("adminSessionId", sessionId.current);

    const stored = sessionStorage.getItem("tempFiles");
    if (stored) {
      setTempFiles(JSON.parse(stored));
    }

    fetchData();
  }, []);

  // After data is loaded, set first item as editItem by default
  useEffect(() => {
    if (data.length > 0 && !editItem) {
      setEditItem(data[0]);
      setOriginalItem(JSON.parse(JSON.stringify(data[0])));
      setIsNew(false);
      setIsEditing(true);
    }
  }, [data, editItem]);

  // Cleanup temp files on unmount, route change, or refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (tempFiles.length > 0 && !isSavingRef.current) {
        const formData = new FormData();
        formData.append("files", JSON.stringify(tempFiles));
        formData.append("sessionId", sessionId.current);

        const sent = navigator.sendBeacon(
          `${import.meta.env.VITE_API_URL}/api/upload/remove-temp`,
          formData
        );

        console.log("Beacon sent:", sent, "Files:", tempFiles);

        sessionStorage.removeItem("tempFiles");
        sessionStorage.removeItem("adminSessionId");
      }
    };

    const cleanupOnRouteChange = async () => {
      if (tempFiles.length > 0 && !isSavingRef.current) {
        try {
          await axiosInstance.post("/upload/remove-temp", {
            files: tempFiles,
            sessionId: sessionId.current,
          });
          sessionStorage.removeItem("tempFiles");
          console.log("Route change cleanup completed");
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
      console.log("Data loaded:", res.data);
    } catch (e: any) {
      setError("Failed to load data: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if form has unsaved changes
  const hasChanges = useCallback(() => {
    if (!editItem || !originalItem) return false;
    return JSON.stringify(editItem) !== JSON.stringify(originalItem);
  }, [editItem, originalItem]);

  // Update hasUnsavedChanges when editItem changes
  useEffect(() => {
    setHasUnsavedChanges(hasChanges());
  }, [editItem, hasChanges]);

  const handleSave = async () => {
    if (!editItem) return;

    setShowSavePopup(false);
    isSavingRef.current = true;
    setLoading(true);

    try {
      // Move temp files to permanent folder
      for (const fileName of tempFiles) {
        const res = await axiosInstance.post("/upload/save-temp-file", {
          fileName,
        });
        const finalUrl = res.data.url;

        if (editItem.data.banner.image === fileName) {
          editItem.data.banner.image = finalUrl;
        }
        if (editItem.data.content.image === fileName) {
          editItem.data.content.image = finalUrl;
        }
      }

      // Save to MongoDB
      if (isNew) {
        await axiosInstance.post(`/${collectionName}`, editItem);
      } else if (editItem._id) {
        await axiosInstance.put(`/${collectionName}/${editItem._id}`, editItem);
      }

      setTempFiles([]);
      sessionStorage.removeItem("tempFiles");
      setIsEditing(true);
      setOriginalItem(JSON.parse(JSON.stringify(editItem)));
      toast({
        title: "Success",
        description: "Principal data updated successfully!",
      });
      fetchData();
    } catch (err: any) {
      setError("Error saving: " + err.message);
      toast({
        title: "Error",
        description: "Save failed: " + err.message,
        variant: "destructive",
      });
    } finally {
      isSavingRef.current = false;
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
        console.log("Cancel cleanup completed for files:", tempFiles);
      }

      setTempFiles([]);
      sessionStorage.removeItem("tempFiles");
      // Revert to original item
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

  const handleDelete = async () => {
    if (!deleteItemId) return;

    setShowDeletePopup(false);

    try {
      await axiosInstance.delete(`/${collectionName}/${deleteItemId}`);
      toast({ title: "Success", description: "Item deleted successfully" });
      fetchData();
      // If deleted item is current editItem, clear it
      if (editItem && editItem._id === deleteItemId) {
        setEditItem(null);
        setOriginalItem(null);
      }
    } catch (err: any) {
      setError("Error deleting: " + err.message);
      toast({
        title: "Error",
        description: "Delete failed: " + err.message,
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
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
    const updated = { ...editItem };
    if (!updated.data.content.paragraphs) updated.data.content.paragraphs = [];
    updated.data.content.paragraphs.push("");
    setEditItem(updated);
  };

  const updateParagraph = (index: number, value: string) => {
    if (!editItem) return;
    const updated = { ...editItem };
    updated.data.content.paragraphs[index] = value;
    setEditItem(updated);
  };

  const deleteParagraph = (index: number) => {
    if (!editItem) return;
    const updated = { ...editItem };
    updated.data.content.paragraphs = updated.data.content.paragraphs.filter(
      (_, i) => i !== index
    );
    setEditItem(updated);
  };

  const renderForm = () => {
    if (!editItem) return null;

    return (
      <div style={{ gap: "2rem", position: "relative" }}>
        {/* Unsaved Changes Indicator */}
        {hasUnsavedChanges && <ScrollDownToPreview />}

        <style>{`
          @keyframes pulse-custom {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .animate-pulse-custom {
            animation: pulse-custom 2s infinite;
          }
        `}</style>

        <div className="form-container border border-gray-300 rounded-lg p-6 bg-white">
          <Heading
            title={isNew ? "Create New" : "Edit Principal Data"}
            size="lg"
            align="left"
          />

          {/* Banner Section */}
          {/* <div className="mb-4 p-4 bg-gray-50 rounded-lg mt-6">
            <strong className="block mb-4 text-base">Banner</strong>
            <div className="mb-4">
              <label className="form-label block text-sm font-medium mb-2">
                Banner Title
              </label>
              <input
                type="text"
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editItem.data.banner.title}
                onChange={(e) =>
                  updateField("data.banner.title", e.target.value)
                }
              />
            </div>
            <ImageUploadManager
              label="Banner Image"
              value={editItem.data.banner.image}
              onChange={(v) => updateField("data.banner.image", v)}
              addTemp={addTempFile}
            />
          </div> */}

          {/* Content Section */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg scale-in">
            {/* <strong className="block mb-4 text-base">Content</strong> */}

            <div className="mb-4">
              <label className="form-label block text-sm font-medium mb-2">
                Content Title
              </label>
              <input
                type="text"
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editItem.data.content.title}
                onChange={(e) =>
                  updateField("data.content.title", e.target.value)
                }
              />
            </div>

            <div className="mb-4">
              <label className="form-label block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editItem.data.content.email}
                onChange={(e) =>
                  updateField("data.content.email", e.target.value)
                }
              />
            </div>

            <ImageUploadManager
              label="Content Image"
              value={editItem.data.content.image}
              onChange={(v) => updateField("data.content.image", v)}
              addTemp={addTempFile}
            />

            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <strong className="text-sm">
                  Paragraphs ({editItem.data.content.paragraphs?.length || 0})
                </strong>

                {/* <button
                  className="btn btn-primary px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  onClick={addParagraph}
                >
                  + Add Paragraph
                </button> */}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editItem.data.content.paragraphs?.map((para, index) => {
                  const maxChars = 450;
                  return (
                    <div
                      key={index}
                      className="mb-4 p-3 bg-white rounded border border-gray-200"
                    >
                      <label className="form-label block text-sm font-medium mb-2">
                        Paragraph {index + 1}
                      </label>

                      <div className="relative">
                        <textarea
                          className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                          rows={4}
                          value={para}
                          maxLength={maxChars}
                          onChange={(e) =>
                            updateParagraph(index, e.target.value)
                          }
                        />

                        <span
                          className={`absolute bottom-2 right-3 text-xs ${
                            para.length >= maxChars
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {para.length} / {maxChars}
                        </span>
                      </div>

                      <button
                        className="btn mt-2 px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
                        onClick={() => deleteParagraph(index)}
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sign Off */}
            {/* <div className="mt-6 pt-6 border-t border-gray-200">
              <strong className="block mb-4 text-sm">Sign Off Details</strong>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="form-label block text-xs font-medium mb-1">
                    Text
                  </label>
                  <input
                    type="text"
                    className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={editItem.data.content.signOff.text}
                    onChange={(e) =>
                      updateField("data.content.signOff.text", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="form-label block text-xs font-medium mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={editItem.data.content.signOff.name}
                    onChange={(e) =>
                      updateField("data.content.signOff.name", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="form-label block text-xs font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={editItem.data.content.signOff.title}
                    onChange={(e) =>
                      updateField("data.content.signOff.title", e.target.value)
                    }
                  />
                </div>
              </div>
            </div> */}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
            <button
              className="btn btn-primary px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setShowSavePopup(true)}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              className="btn px-6 py-2.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="mt-5"
          />
          <PreviewWrapper
            Component={PrincipalDesk}
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
        onClose={() => setShowSavePopup(false)}
        onConfirm={handleSave}
        title="Save Changes?"
        message="Are you sure you want to save these changes? This will update the Principal data permanently."
        confirmText="Save Changes"
        confirmStyle="bg-blue-600 hover:bg-blue-700"
        showCancel={true}
      />

      {/* Cancel Confirmation Popup */}
      <ConfirmationPopup
        isOpen={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
        onConfirm={handleCancel}
        title="Discard Changes?"
        message="Are you sure you want to discard all unsaved changes? This action cannot be undone and all your edits will be lost."
        confirmText="Discard Changes"
        confirmStyle="bg-red-600 hover:bg-red-700"
        showCancel={false}
      />

      {/* Delete Confirmation Popup */}
      <ConfirmationPopup
        isOpen={showDeletePopup}
        onClose={() => {
          setShowDeletePopup(false);
          setDeleteItemId(null);
        }}
        onConfirm={handleDelete}
        title="Delete Item?"
        message="Are you sure you want to delete this item? This action is permanent and cannot be undone."
        confirmText="Delete"
        confirmStyle="bg-red-600 hover:bg-red-700"
        showCancel={true}
      />
    </div>
  );
};

export default PrincipalDataManager;

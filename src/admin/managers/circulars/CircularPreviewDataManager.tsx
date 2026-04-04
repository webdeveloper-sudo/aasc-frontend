import React, { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "../../../utils/axiosInstance";
import Heading from "@/components/reusable/Heading";
import DocumentUploadManager from "../../components/DocumentUploadManager";
import { AlertCircle, X, Edit, Trash2Icon, Plus } from "lucide-react";
import ScrollDownToPreview from "../../components/ScrollDownToPreview";
import PreviewWrapper from "@/admin/PreviewWrapper";
import Circulars from "@/pages/circlulars/Circulars";

interface CircularPreviewData {
  _id?: string;
  title: string;
  path: string;
  file: string;
  description: string;
  date: string;
  postedBy: string;
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

const CircularPreviewDataManager: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<CircularPreviewData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [editItem, setEditItem] = useState<CircularPreviewData | null>(null);
  const [originalItem, setOriginalItem] = useState<CircularPreviewData | null>(
    null
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [tempFiles, setTempFiles] = useState<string[]>([]);

  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");

  const isSavingRef = useRef(false);
  const sessionId = useRef(
    `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  const collectionName = "home/circularpreviewdata";

  useEffect(() => {
    sessionStorage.setItem("adminSessionId", sessionId.current);
    const stored = sessionStorage.getItem("tempFiles");
    if (stored) {
      setTempFiles(JSON.parse(stored));
    }
    fetchData();
  }, []);

  const addTempFile = useCallback((fileName: string) => {
    setTempFiles((prev) => {
      const updated = [...prev, fileName];
      sessionStorage.setItem("tempFiles", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Cleanup temp files on unmount
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (tempFiles.length > 0 && !isSavingRef.current) {
        const formData = new FormData();
        formData.append("files", JSON.stringify(tempFiles));
        formData.append("sessionId", sessionId.current);
        navigator.sendBeacon(
          `${
            import.meta.env.VITE_API_URL
          }/api/upload/document/remove-temp-document`,
          formData
        );
        sessionStorage.removeItem("tempFiles");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [tempFiles]);

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

  const handleSave = async () => {
    if (!editItem) return;
    setShowSavePopup(false);
    isSavingRef.current = true;
    setLoading(true);

    try {
      // Process temp files and update document URLs
      for (const fileName of tempFiles) {
        const res = await axiosInstance.post(
          "/upload/document/save-temp-document",
          {
            fileName,
          }
        );
        const finalUrl = res.data.url;

        // Update file path if it matches temp file
        if (editItem.file === fileName) {
          editItem.file = finalUrl;
        }
      }

      // Save to backend
      if (isNew) {
        await axiosInstance.post(`/${collectionName}`, editItem);
      } else if (editItem._id) {
        await axiosInstance.put(`/${collectionName}/${editItem._id}`, editItem);
      }

      // Clear temp files
      setTempFiles([]);
      sessionStorage.removeItem("tempFiles");

      setOriginalItem(JSON.parse(JSON.stringify(editItem)));
      setIsEditing(false);
      setIsNew(false);
      fetchData();
      toast({
        title: "Success",
        description: "Circular saved successfully!",
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
    } catch (err: any) {
      console.error("Cancel cleanup failed:", err);
    }

    setIsEditing(false);
    setIsNew(false);
    setEditItem(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setShowDeletePopup(false);
    try {
      await axiosInstance.delete(`/${collectionName}/${deleteId}`);
      fetchData();
      toast({
        title: "Success",
        description: "Circular deleted successfully!",
      });
    } catch (err: any) {
      setError("Error deleting: " + err.message);
      toast({
        title: "Error",
        description: "Error deleting: " + err.message,
        variant: "destructive",
      });
    } finally {
      setDeleteId("");
    }
  };

  const handleEdit = (item: CircularPreviewData) => {
    setEditItem(JSON.parse(JSON.stringify(item)));
    setOriginalItem(JSON.parse(JSON.stringify(item)));
    setIsNew(false);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setEditItem({
      title: "",
      path: "",
      file: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      postedBy: "",
    });
    setOriginalItem({
      title: "",
      path: "",
      file: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      postedBy: "",
    });
    setIsNew(true);
    setIsEditing(true);
  };

  const updateField = (field: keyof CircularPreviewData, value: any) => {
    if (!editItem) return;
    setEditItem({ ...editItem, [field]: value });
  };

  const renderCards = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Circular Details Management
          </h2>
          <button onClick={handleAddNew} className="green-btn">
            <Plus size={16} /> Add New Circular
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {data.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center gap-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Posted by: {item.postedBy}
                  </p>
                </div>
                <div className="flex flex-row justify-end  gap-2 ">
                  <button onClick={() => handleEdit(item)} className="blue-btn">
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(item._id!);
                      setShowDeletePopup(true);
                    }}
                    className="trash-btn rounded-md px-3"
                  >
                    <Trash2Icon size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderForm = () => {
    if (!editItem) return null;

    return (
      <div style={{ gap: "2rem", position: "relative" }}>
        {hasUnsavedChanges && <ScrollDownToPreview />}

        <div className="form-container border border-gray-300 rounded-lg p-6 bg-white">
          <Heading
            title={isNew ? "Add New Circular" : "Edit Circular"}
            size="lg"
            align="left"
          />

          <div className="mb-6 p-4 bg-gray-50 rounded-lg mt-6">
            <div className="mb-4">
              <label className="form-label block text-sm font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
                value={editItem.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Circular title"
              />
            </div>

            <div className="mb-4">
              <label className="form-label block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                rows={4}
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
                value={editItem.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Circular description"
              />
            </div>

            <div className="">
              {/* <div className="mb-4">
                <label className="form-label block text-sm font-medium mb-2">
                  Date
                </label>
                <input
                  type="date"
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editItem.date}
                  onChange={(e) => updateField("date", e.target.value)}
                />
              </div> */}

              <div className="mb-4">
                <label className="form-label block text-sm font-medium mb-2">
                  Posted By
                </label>
                <input
                  type="text"
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editItem.postedBy}
                  onChange={(e) => updateField("postedBy", e.target.value)}
                  placeholder="e.g., Academic Office"
                />
              </div>
            </div>

            <DocumentUploadManager
              label="Circular Document (PDF)"
              value={editItem.file}
              onChange={(v) => updateField("file", v)}
              addTemp={addTempFile}
            />

            {/* <div className="mb-4">
              <label className="form-label block text-sm font-medium mb-2">
                Path (URL)
              </label>
              <input
                type="text"
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
                value={editItem.path}
                onChange={(e) => updateField("path", e.target.value)}
                placeholder="/circulars/example"
              />
            </div> */}
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

        {/* Live Preview */}
        <div className="py-4 mt-10 border border-gray-300 rounded-2xl p-8 bg-white">
          <Heading
            title="Live Preview"
            size="lg"
            align="left"
            className="mt-5"
          />
          <PreviewWrapper
            Component={Circulars}
            previewData={editItem ? [editItem] : []}
          />
        </div>
      </div>
    );
  };

  if (loading && data.length === 0)
    return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="collection-manager p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {!isEditing ? renderCards() : renderForm()}

      {/* Live Preview Section */}
      {hasUnsavedChanges && <ScrollDownToPreview />}

      <div className="py-4 mt-10 border border-gray-300 rounded-2xl p-8 bg-white">
        <Heading title="Live Preview" size="lg" align="left" className="mt-5" />
        <PreviewWrapper
          Component={Circulars}
          previewData={editItem && hasUnsavedChanges ? [editItem] : data}
        />
      </div>

      <ConfirmationPopup
        isOpen={showSavePopup}
        onClose={() => setShowSavePopup(false)}
        onConfirm={handleSave}
        title="Save Changes?"
        message="Save this circular? This will update the live site."
        confirmText="Save Changes"
        confirmStyle="bg-blue-600 hover:bg-blue-700"
      />

      <ConfirmationPopup
        isOpen={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
        onConfirm={handleCancel}
        title="Discard Changes?"
        message="Discard all unsaved changes? This action cannot be undone."
        confirmText="Discard Changes"
        confirmStyle="bg-red-600 hover:bg-red-700"
      />

      <ConfirmationPopup
        isOpen={showDeletePopup}
        onClose={() => {
          setShowDeletePopup(false);
          setDeleteId("");
        }}
        onConfirm={handleDelete}
        title="Delete Circular?"
        message="Delete this circular? This action cannot be undone."
        confirmText="Delete"
        confirmStyle="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default CircularPreviewDataManager;

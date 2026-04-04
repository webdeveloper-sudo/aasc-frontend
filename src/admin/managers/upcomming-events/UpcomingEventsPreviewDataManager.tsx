import React, { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import Heading from "@/components/reusable/Heading";
import ImageUploadManager from "@/admin/components/ImageUploadManager";
import DocumentUploadManager from "@/admin/components/DocumentUploadManager";
import {
  AlertCircle,
  X,
  Trash2Icon,
  Edit,
  Plus,
  ArrowLeft,
} from "lucide-react";
import ScrollDownToPreview from "@/admin/components/ScrollDownToPreview";
import PreviewWrapper from "@/admin/PreviewWrapper";
import UpcomingEvents from "@/pages/upcomming-events/UpcommingEvents";

interface UpcomingEvent {
  _id?: string;
  title: string;
  path: string;
  date: string;
  description: string;
  image: string;
  postedBy: string;
  file: string;
}

/* ================= CONFIRMATION POPUP ================= */
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
  confirmStyle = "bg-blue-600 hover:bg-blue-700",
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
      <style>{`
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
      `}</style>
    </div>
  );
};

const UpcomingEventsPreviewDataManager: React.FC = () => {
  const [data, setData] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState<UpcomingEvent | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [tempFiles, setTempFiles] = useState<string[]>([]);

  // Popup states
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sessionIdRef = useRef<string>("");
  const collectionName = "events/upcommingeventspreviewdata";

  useEffect(() => {
    const sessionId = `admin_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    sessionIdRef.current = sessionId;
    sessionStorage.setItem("adminSessionId", sessionId);

    const stored = sessionStorage.getItem("tempFiles");
    if (stored) setTempFiles(JSON.parse(stored));

    fetchData();
  }, []);

  const addTempFile = useCallback((fileName: string) => {
    setTempFiles((prev) => {
      const updated = [...prev, fileName];
      sessionStorage.setItem("tempFiles", JSON.stringify(updated));
      return updated;
    });
  }, []);

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

  const processTempFiles = async (): Promise<void> => {
    if (!editItem || tempFiles.length === 0) return;

    const processedFiles: string[] = [];

    for (const fileName of tempFiles) {
      try {
        const res = await axiosInstance.post("/upload/save-temp-file", {
          fileName,
        });
        const finalUrl = res.data.url;

        // Replace temp filenames with final URLs
        if (editItem.image === fileName) {
          editItem.image = finalUrl;
        }
        if (editItem.file === fileName) {
          editItem.file = finalUrl;
        }

        processedFiles.push(fileName);
      } catch (err) {
        console.error("Failed to save temp file:", fileName, err);
      }
    }

    const remaining = tempFiles.filter((f) => !processedFiles.includes(f));
    setTempFiles(remaining);
    if (remaining.length === 0) sessionStorage.removeItem("tempFiles");
    else sessionStorage.setItem("tempFiles", JSON.stringify(remaining));
  };

  const handleSave = async () => {
    if (!editItem) return;
    setShowSavePopup(false);
    setLoading(true);

    try {
      // Process temp files
      for (const fileName of tempFiles) {
        try {
          // Use document endpoint for files, regular endpoint for images
          let finalUrl: string;

          if (editItem.file === fileName) {
            // This is a document file
            const res = await axiosInstance.post(
              "/upload/document/save-temp-document",
              {
                fileName,
              }
            );
            finalUrl = res.data.url;
            editItem.file = finalUrl;
          } else if (editItem.image === fileName) {
            // This is an image
            const res = await axiosInstance.post("/upload/save-temp-file", {
              fileName,
            });
            finalUrl = res.data.url;
            editItem.image = finalUrl;
          }
        } catch (err) {
          console.error("Failed to save temp file:", fileName, err);
        }
      }

      // Clear temp files
      setTempFiles([]);
      sessionStorage.removeItem("tempFiles");

      // Save to backend
      if (isNew) {
        await axiosInstance.post(`/${collectionName}`, editItem);
      } else {
        await axiosInstance.put(`/${collectionName}/${editItem._id}`, editItem);
      }

      setIsEditing(false);
      setEditItem(null);
      fetchData();
      setError("");
    } catch (err: any) {
      setError("Error saving: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setShowDeletePopup(false);
    setLoading(true);

    try {
      await axiosInstance.delete(`/${collectionName}/${deleteId}`);
      fetchData();
      setError("");
    } catch (err: any) {
      setError("Error deleting: " + err.message);
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  const handleCancel = async () => {
    setShowCancelPopup(false);

    try {
      if (tempFiles.length > 0) {
        // For mixed files, try document endpoint (covers most cases)
        await axiosInstance.post("/upload/document/remove-temp-document", {
          files: tempFiles,
          sessionId: sessionIdRef.current,
        });
      }
      setTempFiles([]);
      sessionStorage.removeItem("tempFiles");
    } catch (err) {
      console.error(err);
    }

    setIsEditing(false);
    setEditItem(null);
    setIsNew(false);
  };

  const updateField = (field: keyof UpcomingEvent, value: any) => {
    if (!editItem) return;
    setEditItem({ ...editItem, [field]: value });
  };

  const renderCards = () => {
    return (
      <div className="collection-manager p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="border border-gray-300 rounded-lg p-6 bg-white mb-8">
          <div className="flex justify-between items-center mb-6">
            <Heading title="Upcoming Events" size="lg" align="left" />
            <button
              onClick={() => {
                setEditItem({
                  title: "",
                  path: "",
                  date: "",
                  description: "",
                  image: "",
                  postedBy: "",
                  file: "",
                });
                setIsNew(true);
                setIsEditing(true);
              }}
              className="green-btn flex items-center gap-2"
              disabled={loading}
            >
              <Plus size={20} /> Add New Event
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-200 rounded-lg flex justify-between items-center p-4 hover:shadow-md transition-shadow"
              >
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">
                    Date: {new Date(item.date).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Posted by: {item.postedBy}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditItem(item);
                      setIsNew(false);
                      setIsEditing(true);
                    }}
                    className="blue-btn flex-1"
                    disabled={loading}
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(item._id!);
                      setShowDeletePopup(true);
                    }}
                    className="trash-btn rounded-md p-3"
                                          
                    disabled={loading}
                  >
                    <Trash2Icon size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {data.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No events yet</p>
              <p className="text-sm">Click "Add New Event" to get started</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderForm = () => {
    if (!editItem) return null;

    return (
      <div className="p-6 min-h-screen">
        <button
          onClick={() => setShowCancelPopup(true)}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          disabled={loading}
        >
          <ArrowLeft size={20} />
          Back to Events
        </button>

        <div className="border border-gray-300 rounded-lg p-6 bg-white mb-8">
          <Heading
            title={isNew ? "Create New Event" : "Edit Event"}
            size="lg"
            align="left"
          />

          <div className="mt-6 space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editItem.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Event title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Path
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editItem.path}
                onChange={(e) => updateField("path", e.target.value)}
                placeholder="URL path"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editItem.date}
                onChange={(e) => updateField("date", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editItem.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Event description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Image
              </label>
              <ImageUploadManager
                label="Upload Event Image"
                value={editItem.image}
                addTemp={addTempFile}
                onChange={(value) => updateField("image", value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Document/File
              </label>
              <DocumentUploadManager
                label="Upload Event Document"
                value={editItem.file}
                addTemp={addTempFile}
                onChange={(value) => updateField("file", value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posted By
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editItem.postedBy}
                onChange={(e) => updateField("postedBy", e.target.value)}
                placeholder="Author name"
              />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
            <button
              className="btn btn-primary px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => setShowSavePopup(true)}
              disabled={loading}
            >
              {isNew ? "Create Event" : "Save Changes"}
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
      </div>
    );
  };

  if (loading && data.length === 0) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <>
      {isEditing ? renderForm() : renderCards()}

      {/* Live Preview Section */}
      {isEditing && <ScrollDownToPreview />}

      <div className="py-4 mt-10 border border-gray-300 rounded-2xl p-8 bg-white">
        <Heading title="Live Preview" size="lg" align="left" className="mt-5" />
        <PreviewWrapper
          Component={UpcomingEvents}
          previewData={editItem ? [editItem] : data}
        />
      </div>

      {/* Popups */}
      <ConfirmationPopup
        isOpen={showSavePopup}
        onClose={() => setShowSavePopup(false)}
        onConfirm={handleSave}
        title={isNew ? "Create Event?" : "Save Changes?"}
        message={
          isNew
            ? "Create this new event? This will be saved to the database."
            : "Save all changes to this event? This will update the database."
        }
        confirmText={isNew ? "Create Event" : "Save Changes"}
        confirmStyle="bg-blue-600 hover:bg-blue-700"
      />

      <ConfirmationPopup
        isOpen={showDeletePopup}
        onClose={() => {
          setShowDeletePopup(false);
          setDeleteId(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Event?"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete Event"
        confirmStyle="bg-red-600 hover:bg-red-700"
      />

      <ConfirmationPopup
        isOpen={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
        onConfirm={handleCancel}
        title="Cancel Editing?"
        message="Are you sure you want to cancel? Any unsaved changes will be lost."
        confirmText="Yes, Cancel"
        confirmStyle="bg-gray-600 hover:bg-gray-700"
      />
    </>
  );
};

export default UpcomingEventsPreviewDataManager;

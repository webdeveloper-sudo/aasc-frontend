import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "../../../utils/axiosInstance";
import Heading from "@/components/reusable/Heading";
import ScrollDownToPreview from "../../components/ScrollDownToPreview";
import { Plus, Trash2Icon, AlertCircle, X, Edit2 } from "lucide-react";

/* ================= TYPES ================= */
interface TestimonialsData {
  _id?: string;
  data: {
    title: string;
    videos: string[];
  };
}

/* ================= SANITIZER ================= */
const sanitizeItem = (item: any): TestimonialsData => ({
  _id: item?._id || "",
  data: {
    title: item?.data?.title || "",
    videos: Array.isArray(item?.data?.videos) ? item.data.videos : [],
  },
});

const EMPTY_ITEM: TestimonialsData = {
  data: {
    title: "Testimonials",
    videos: [],
  },
};

/* ================= IFRAME HELPERS ================= */
const getEmbedUrl = (url: string): string | null => {
  if (!url) return null;

  // YouTube
  const ytMatch =
    url.match(/youtube\.com\/watch\?v=([^&]+)/) ||
    url.match(/youtu\.be\/([^?]+)/);

  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return null;
};

/* ================= CONFIRMATION POPUP ================= */
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
        className="absolute inset-0 bg-black/60 transition-opacity"
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
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

const TestimonialsDataManager: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<TestimonialsData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editItem, setEditItem] = useState<TestimonialsData | null>(null);
  const [originalItem, setOriginalItem] = useState<TestimonialsData | null>(
    null
  );
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTestimonial, setNewTestimonial] =
    useState<TestimonialsData>(EMPTY_ITEM);

  // Popup states
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showDeleteVideoPopup, setShowDeleteVideoPopup] = useState(false);
  const [deleteId, setDeleteId] = useState<string>("");
  const [deleteVideoIndex, setDeleteVideoIndex] = useState<number | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const collectionName = "home/testimonialdata";

  /* ================= FETCH ================= */
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(`/${collectionName}`);
      const cleaned = (Array.isArray(res.data) ? res.data : [res.data]).map(
        sanitizeItem
      );
      setData(cleaned);

      // Auto-load first item for editing if not adding new
      if (cleaned.length > 0 && !isAddingNew) {
        const firstItem = cleaned[0];
        setEditItem(firstItem);
        setOriginalItem(JSON.parse(JSON.stringify(firstItem)));
      }
    } catch (e: any) {
      setError("Failed to load data: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= CHANGE DETECTION ================= */
  useEffect(() => {
    if (editItem && originalItem) {
      setHasUnsavedChanges(
        JSON.stringify(editItem) !== JSON.stringify(originalItem)
      );
    }
  }, [editItem, originalItem]);

  /* ================= ADD NEW TESTIMONIAL ================= */
  const handleAddNew = () => {
    setIsAddingNew(true);
    setNewTestimonial({ data: { title: "Testimonials", videos: [] } });
    setEditItem(null);
  };

  const addVideoToNew = () => {
    setNewTestimonial((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        videos: ["", ...prev.data.videos],
      },
    }));
  };

  const updateNewVideo = (index: number, value: string) => {
    setNewTestimonial((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        videos: prev.data.videos.map((v, i) => (i === index ? value : v)),
      },
    }));
  };

  const deleteNewVideo = (index: number) => {
    setNewTestimonial((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        videos: prev.data.videos.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSaveNew = async () => {
    setShowSavePopup(false);
    setLoading(true);

    try {
      const payload = {
        data: {
          title: newTestimonial.data.title,
          videos: newTestimonial.data.videos,
        },
      };

      await axiosInstance.post(`/${collectionName}`, payload);

      setIsAddingNew(false);
      setNewTestimonial(EMPTY_ITEM);
      await fetchData();
      toast({
        title: "Success",
        description: "New testimonial saved successfully!",
      });
    } catch (err: any) {
      setError("Error saving new testimonial: " + err.message);
      toast({
        title: "Error",
        description: "Error saving new testimonial: " + err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelNew = () => {
    setShowCancelPopup(false);
    setIsAddingNew(false);
    setNewTestimonial(EMPTY_ITEM);
  };

  /* ================= SAVE EXISTING ================= */
  const handleSave = async () => {
    if (!editItem || !editItem._id) return;
    setShowSavePopup(false);
    setLoading(true);

    try {
      await axiosInstance.put(`/${collectionName}/${editItem._id}`, {
        data: {
          title: editItem.data.title,
          videos: editItem.data.videos,
        },
      });

      // Update original to match current state
      setOriginalItem(JSON.parse(JSON.stringify(editItem)));
      setHasUnsavedChanges(false);

      // Refresh data from server
      await fetchData();
      toast({
        title: "Success",
        description: "Changes saved successfully!",
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

  const handleCancel = () => {
    setShowCancelPopup(false);
    if (originalItem) {
      setEditItem(JSON.parse(JSON.stringify(originalItem)));
      setHasUnsavedChanges(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    setShowDeletePopup(false);
    setLoading(true);
    try {
      await axiosInstance.delete(`/${collectionName}/${id}`);

      // Clear edit state if we're deleting the currently edited item
      if (editItem?._id === id) {
        setEditItem(null);
        setOriginalItem(null);
        setHasUnsavedChanges(false);
      }

      await fetchData();
      toast({
        title: "Success",
        description: "Testimonial deleted successfully!",
      });
    } catch (err: any) {
      setError("Error deleting: " + err.message);
      toast({
        title: "Error",
        description: "Error deleting: " + err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDeleteId("");
    }
  };

  const confirmDelete = () => {
    if (deleteId) {
      handleDelete(deleteId);
    }
  };

  /* ================= DELETE VIDEO (IMMEDIATE STATE UPDATE) ================= */
  const deleteVideoDirectly = (index: number) => {
    if (!editItem) return;

    setEditItem((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        data: {
          ...prev.data,
          videos: prev.data.videos.filter((_, i) => i !== index),
        },
      };
    });
  };

  const confirmDeleteVideo = () => {
    setShowDeleteVideoPopup(false);
    if (deleteVideoIndex !== null) {
      deleteVideoDirectly(deleteVideoIndex);
    }
    setDeleteVideoIndex(null);
  };

  /* ================= UPDATE FIELD ================= */
  const updateField = (path: string, value: any) => {
    if (!editItem) return;

    const updated = sanitizeItem(editItem);
    const parts = path.split(".");
    let current: any = updated;

    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = value;
    setEditItem(updated);
  };

  /* ================= VIDEO HELPERS (EXISTING) ================= */
  const addVideo = () => {
    if (!editItem) return;

    setEditItem((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        data: {
          ...prev.data,
          videos: ["", ...prev.data.videos],
        },
      };
    });
  };

  const updateVideo = (index: number, value: string) => {
    if (!editItem) return;

    setEditItem((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        data: {
          ...prev.data,
          videos: prev.data.videos.map((v, i) => (i === index ? value : v)),
        },
      };
    });
  };

  /* ================= RENDER NEW TESTIMONIAL FORM ================= */
  const renderNewForm = () => {
    return (
      <div className="border border-gray-300 rounded-lg p-6 bg-white mb-8">
        <div className="flex justify-between items-center mb-6">
          <Heading title="Add New Testimonial Section" size="lg" align="left" />
          <button
            onClick={() => {
              setIsAddingNew(false);
              setNewTestimonial(EMPTY_ITEM);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Videos Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Testimonial Videos ({newTestimonial.data.videos.length})
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Add YouTube or Vimeo URLs for video testimonials
              </p>
            </div>
            <button
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium shadow-sm hover:shadow-md"
              onClick={addVideoToNew}
            >
              <Plus size={20} />
              Add Video
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {newTestimonial.data.videos.map((video, index) => {
              const embedUrl = getEmbedUrl(video);

              return (
                <div
                  key={index}
                  className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <label className="text-sm font-semibold text-gray-900">
                      Testimonial Video {index + 1}
                      {video === "" && index === 0 && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                          New
                        </span>
                      )}
                    </label>
                    <button
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      onClick={() => deleteNewVideo(index)}
                    >
                      <Trash2Icon size={16} />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={video}
                    onChange={(e) => updateNewVideo(index, e.target.value)}
                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                  />

                  <div className="min-h-[240px] border rounded-xl overflow-hidden bg-gray-50">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={`Video preview ${index + 1}`}
                        width="100%"
                        height="240"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-[240px]"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-[240px] text-gray-500">
                        <AlertCircle size={48} className="mb-2 opacity-50" />
                        <p className="text-sm text-center">
                          {video
                            ? "Invalid video URL"
                            : "Enter YouTube/Vimeo URL to preview"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save/Cancel Buttons */}
        <div className="pt-6 border-t border-gray-200 flex gap-4">
          <button
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-lg shadow-sm hover:shadow-md"
            onClick={() => setShowSavePopup(true)}
            disabled={loading || newTestimonial.data.videos.length === 0}
          >
            {loading ? "Saving..." : "Save New Testimonial"}
          </button>
          <button
            className="px-8 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all font-semibold text-lg"
            onClick={() => setShowCancelPopup(true)}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  /* ================= MAIN FORM (EXISTING) ================= */
  const renderForm = () => {
    if (!editItem) return null;

    return (
      <div className="border border-gray-300 rounded-lg p-6 bg-white mb-8">
        <Heading
          title="Testimonials Management"
          size="lg"
          align="left"
          className="mb-8"
        />

        {/* Videos Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Testimonial Videos ({editItem.data.videos.length})
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Add YouTube or Vimeo URLs for video testimonials
              </p>
            </div>
            <button
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50"
              onClick={addVideo}
              disabled={loading}
            >
              <Plus size={20} />
              Add Video
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {editItem.data.videos.map((video, index) => {
              const embedUrl = getEmbedUrl(video);

              return (
                <div
                  key={`${editItem._id}-video-${index}`}
                  className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <label className="text-sm font-semibold text-gray-900">
                      Testimonial Video {index + 1}
                      {video === "" && index === 0 && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                          New
                        </span>
                      )}
                    </label>
                    <button
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                      onClick={() => {
                        setDeleteVideoIndex(index);
                        setShowDeleteVideoPopup(true);
                      }}
                      disabled={loading}
                    >
                      <Trash2Icon size={16} />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={video}
                    onChange={(e) => updateVideo(index, e.target.value)}
                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                  />

                  <div className="min-h-[240px]  rounded-xl overflow-hidden bg-gray-50">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={`Video preview ${index + 1}`}
                        width="100%"
                        height="240"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-[240px]"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-[240px] text-gray-500">
                        <AlertCircle size={48} className="mb-2 opacity-50" />
                        <p className="text-sm text-center">
                          {video
                            ? "Invalid video URL"
                            : "Enter YouTube/Vimeo URL to preview"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save/Cancel Buttons - Show when changes exist */}
        {hasUnsavedChanges && (
          <div className="pt-6 border-t border-gray-200 flex gap-4">
            <button
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold text-lg shadow-sm hover:shadow-md"
              onClick={() => setShowSavePopup(true)}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save All Changes"}
            </button>
            <button
              className="px-8 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all font-semibold text-lg"
              onClick={() => setShowCancelPopup(true)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading && !editItem && !isAddingNew) {
    return <div className="text-center py-12 text-gray-500">Loading...</div>;
  }

  return (
    <div className="collection-manager p-6 min-h-screen">
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Show new form or existing form */}
      {isAddingNew ? renderNewForm() : renderForm()}

      {/* Popups */}
      <ConfirmationPopup
        isOpen={showSavePopup}
        onClose={() => setShowSavePopup(false)}
        onConfirm={isAddingNew ? handleSaveNew : handleSave}
        title={isAddingNew ? "Save New Testimonial?" : "Save Changes?"}
        message={
          isAddingNew
            ? "Save this new testimonial section? This will add it to the live site."
            : "Save all testimonial changes? This will update the live site."
        }
        confirmText={isAddingNew ? "Save New Testimonial" : "Save All Changes"}
        confirmStyle="bg-blue-600 hover:bg-blue-700"
      />

      <ConfirmationPopup
        isOpen={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
        onConfirm={isAddingNew ? handleCancelNew : handleCancel}
        title="Discard Changes?"
        message={
          isAddingNew
            ? "Discard this new testimonial? All unsaved videos will be lost."
            : "Discard all unsaved changes? This action cannot be undone."
        }
        confirmText="Discard Changes"
        confirmStyle="bg-red-600 hover:bg-red-700"
      />

      <ConfirmationPopup
        isOpen={showDeleteVideoPopup}
        onClose={() => {
          setShowDeleteVideoPopup(false);
          setDeleteVideoIndex(null);
        }}
        onConfirm={confirmDeleteVideo}
        title="Delete Video?"
        message="Delete this testimonial video? You need to click 'Save All Changes' to apply this deletion."
        confirmText="Delete Video"
        confirmStyle="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default TestimonialsDataManager;

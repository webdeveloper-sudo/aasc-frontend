import React, { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "../../../utils/axiosInstance";
import Heading from "@/components/reusable/Heading";
import ImageUploadManager from "@/admin/components/ImageUploadManager";
import {
  AlertCircle,
  X,
  Trash2,
  Plus,
  ArrowLeft,
  Edit,
  Image as ImageIcon,
} from "lucide-react";
import ScrollDownToPreview from "@/admin/components/ScrollDownToPreview";
import PreviewWrapper from "@/admin/PreviewWrapper";
import Events from "@/pages/Events/Events";

interface EventData {
  id: string;
  title: string;
  description: string;
  images: string[];
}

interface Event {
  _id?: string;
  data: EventData;
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

/* ================= EXISTING IMAGE CARD (READ-ONLY) ================= */
const ExistingImageCard: React.FC<{
  image: string;
  index: number;
  onDelete: (index: number) => void;
}> = ({ image, index, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  const resolveImageUrl = (img: string) => {
    if (!img) return "";
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    if (!img.includes("/assets/images/")) {
      return `${import.meta.env.VITE_API_URL}/assets/images/temp/${img}`;
    }
    return img;
  };

  const imageUrl = resolveImageUrl(image);

  return (
    <div className="relative border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow group">
      <button
        onClick={() => onDelete(index)}
        className="absolute top-3 right-3 z-20 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
        title="Delete Image"
      >
        <Trash2 size={16} />
      </button>

      <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
        {imageError || !imageUrl ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <ImageIcon size={48} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-red-500">Invalid Image</p>
              <p className="text-xs text-gray-400 mt-1">Failed to load</p>
            </div>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={`Image ${index + 1}`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700">Image {index + 1}</p>
        <p className="text-xs text-gray-500 mt-1 truncate" title={image}>
          {image.includes("/") ? image.split("/").pop() : image}
        </p>
      </div>
    </div>
  );
};

const EventsDataManager: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tempFiles, setTempFiles] = useState<string[]>([]);

  // Navigation
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isNew, setIsNew] = useState(false);

  // Popups
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showDeleteEventPopup, setShowDeleteEventPopup] = useState(false);
  const [showAddImagePopup, setShowAddImagePopup] = useState(false);
  const [showDeleteImagePopup, setShowDeleteImagePopup] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
  const [deleteImageIndex, setDeleteImageIndex] = useState<number | null>(null);
  const [pendingNewImage, setPendingNewImage] = useState<string>("");

  const sessionIdRef = useRef<string>("");
  const collectionName = "events/eventsdata";

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
      const events = Array.isArray(res.data) ? res.data : [res.data];
      setData(events);
      console.log("Data loaded:", events);
    } catch (e: any) {
      setError("Failed to load data: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const processTempFiles = async (images: string[]): Promise<string[]> => {
    let finalImages = [...images];
    const processed: string[] = [];

    for (const fileName of tempFiles) {
      try {
        const res = await axiosInstance.post("/upload/save-temp-file", {
          fileName,
        });
        const finalUrl = res.data.url;
        const idx = finalImages.findIndex((i) => i === fileName);
        if (idx !== -1) finalImages[idx] = finalUrl;
        processed.push(fileName);
      } catch (err) {
        console.error("Temp save failed:", fileName, err);
      }
    }

    const remaining = tempFiles.filter((f) => !processed.includes(f));
    setTempFiles(remaining);
    if (remaining.length === 0) sessionStorage.removeItem("tempFiles");
    else sessionStorage.setItem("tempFiles", JSON.stringify(remaining));

    return finalImages;
  };

  const handleSaveEvent = async () => {
    if (!selectedEvent) return;
    setShowSavePopup(false);
    setLoading(true);

    try {
      const finalImages = await processTempFiles(selectedEvent.data.images);
      const eventToSave = {
        ...selectedEvent,
        data: {
          ...selectedEvent.data,
          images: finalImages,
        },
      };

      if (isNew) {
        await axiosInstance.post(`/${collectionName}`, eventToSave);
      } else {
        await axiosInstance.put(
          `/${collectionName}/${selectedEvent._id}`,
          eventToSave
        );
      }

      await fetchData();
      setSelectedEvent(null);
      setIsNew(false);
      setError("");
      toast({
        title: "Success",
        description: "Event saved successfully!",
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

  const handleDeleteEventConfirm = async () => {
    if (!deleteEventId) return;
    setShowDeleteEventPopup(false);
    setLoading(true);

    try {
      await axiosInstance.delete(`/${collectionName}/${deleteEventId}`);
      await fetchData();
      setError("");
      toast({
        title: "Success",
        description: "Event deleted successfully!",
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
      setDeleteEventId(null);
    }
  };

  const handleCancel = async () => {
    setShowCancelPopup(false);

    try {
      if (tempFiles.length > 0) {
        await axiosInstance.post("/upload/remove-temp", {
          files: tempFiles,
          sessionId: sessionIdRef.current,
        });
      }
      setTempFiles([]);
      sessionStorage.removeItem("tempFiles");
    } catch (err) {
      console.error(err);
    }

    setSelectedEvent(null);
    setIsNew(false);
  };

  const updateField = (field: keyof EventData, value: any) => {
    if (!selectedEvent) return;
    setSelectedEvent({
      ...selectedEvent,
      data: { ...selectedEvent.data, [field]: value },
    });
  };

  // Image operations
  const confirmAddImage = (image: string) => {
    setPendingNewImage(image);
    setShowAddImagePopup(true);
  };

  const handleAddImageConfirm = () => {
    setShowAddImagePopup(false);
    if (!selectedEvent || !pendingNewImage) return;

    setSelectedEvent({
      ...selectedEvent,
      data: {
        ...selectedEvent.data,
        images: [...selectedEvent.data.images, pendingNewImage],
      },
    });
    setPendingNewImage("");
  };

  const requestDeleteImage = (index: number) => {
    setDeleteImageIndex(index);
    setShowDeleteImagePopup(true);
  };

  const confirmDeleteImage = async () => {
    if (deleteImageIndex === null || !selectedEvent) return;
    setShowDeleteImagePopup(false);

    const imageToDelete = selectedEvent.data.images[deleteImageIndex];
    const filtered = selectedEvent.data.images.filter(
      (_, i) => i !== deleteImageIndex
    );

    setSelectedEvent({
      ...selectedEvent,
      data: {
        ...selectedEvent.data,
        images: filtered,
      },
    });

    // If it's a saved file, delete from server
    if (imageToDelete && !tempFiles.includes(imageToDelete)) {
      try {
        await axiosInstance.post("/upload/delete-file", {
          fileUrl: imageToDelete,
        });
        toast({
          title: "Success",
          description: "Image deleted from server!",
        });
      } catch (deleteErr) {
        console.error("Failed to delete file from server:", deleteErr);
        toast({
          title: "Error",
          description: "Failed to delete file from server",
          variant: "destructive",
        });
      }
    }

    setDeleteImageIndex(null);
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
            <Heading title="Events Management" size="lg" align="left" />
            <button
              onClick={() => {
                setSelectedEvent({
                  data: {
                    id: "",
                    title: "",
                    description: "",
                    images: [],
                  },
                });
                setIsNew(true);
              }}
              className="green-btn flex items-center gap-2"
              disabled={loading}
            >
              <Plus size={20} /> Add New Event
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {data.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-200 flex justify-between items-start rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="mb-3 max-w-[70%]">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {item.data.title}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {item.data.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    Images: {item.data.images?.length || 0}
                  </p>
                </div>

                <div className="flex flex-row gap-2">
                  <button
                    onClick={() => {
                      setSelectedEvent(item);
                      setIsNew(false);
                    }}
                    className="blue-btn flex-1"
                    disabled={loading}
                  >
                    <Edit size={14} /> Edit
                  </button>

                  <button
                    onClick={() => {
                      setDeleteEventId(item._id!);
                      setShowDeleteEventPopup(true);
                    }}
                    className="trash-btn rounded-md px-3"
                    disabled={loading}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {data.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No events yet</p>
              <p className="text-sm">Click "Add New Event" to get started</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderForm = () => {
    if (!selectedEvent) return null;

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
            title={
              isNew
                ? "Create New Event"
                : `Edit Event: ${selectedEvent.data.title}`
            }
            size="lg"
            align="left"
          />

          <div className="mt-6 space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event ID
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedEvent.data.id}
                onChange={(e) => updateField("id", e.target.value)}
                placeholder="e.g., national-science-day"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedEvent.data.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Event title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedEvent.data.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Event description"
              />
            </div>
          </div>

          {/* Images Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Heading title="Event Images" size="md" align="left" />

            <div className="flex justify-between items-center mb-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ImageIcon size={16} />
                <span className="font-medium">
                  {selectedEvent.data.images?.length || 0} images
                </span>
              </div>
            </div>

            {selectedEvent.data.images &&
              selectedEvent.data.images.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Existing Images
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    {selectedEvent.data.images.map((img, idx) => (
                      <ExistingImageCard
                        key={idx}
                        image={img}
                        index={idx}
                        onDelete={requestDeleteImage}
                      />
                    ))}
                  </div>
                </>
              )}

            {/* Add New Image Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add New Image
              </h3>
              <div className="max-w-sm">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all group">
                  <div className="mb-3">
                    <div className="w-16 h-16 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                      <Plus size={32} className="text-blue-600" />
                    </div>
                  </div>
                  <ImageUploadManager
                    label=""
                    value=""
                    addTemp={addTempFile}
                    onChange={confirmAddImage}
                  />
                  <p className="text-sm text-gray-500 mt-3 group-hover:text-gray-700 transition-colors">
                    Upload a new image
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Once saved, images cannot be replaced
                  </p>
                </div>
              </div>
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
      {selectedEvent ? renderForm() : renderCards()}

      {/* Live Preview Section */}
      {selectedEvent && <ScrollDownToPreview />}

      <div className="py-4 mt-10 border border-gray-300 rounded-2xl p-8 bg-white">
        <Heading title="Live Preview" size="lg" align="left" className="mt-5" />
        <PreviewWrapper Component={Events} previewData={data} />
      </div>

      {/* Popups */}
      <ConfirmationPopup
        isOpen={showSavePopup}
        onClose={() => setShowSavePopup(false)}
        onConfirm={handleSaveEvent}
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
        isOpen={showDeleteEventPopup}
        onClose={() => {
          setShowDeleteEventPopup(false);
          setDeleteEventId(null);
        }}
        onConfirm={handleDeleteEventConfirm}
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

      <ConfirmationPopup
        isOpen={showAddImagePopup}
        onClose={() => {
          setShowAddImagePopup(false);
          setPendingNewImage("");
        }}
        onConfirm={handleAddImageConfirm}
        title="Add New Image?"
        message="Add this image to the event? Once saved, it cannot be replaced - only deleted."
        confirmText="Add Image"
        confirmStyle="bg-green-600 hover:bg-green-700"
      />

      <ConfirmationPopup
        isOpen={showDeleteImagePopup}
        onClose={() => {
          setShowDeleteImagePopup(false);
          setDeleteImageIndex(null);
        }}
        onConfirm={confirmDeleteImage}
        title="Delete Image Permanently?"
        message="Are you sure you want to delete this image? This will remove it from the database and server. This action cannot be undone."
        confirmText="Delete Permanently"
        confirmStyle="bg-red-600 hover:bg-red-700"
      />
    </>
  );
};

export default EventsDataManager;

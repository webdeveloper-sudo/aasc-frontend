import React, { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "../../../utils/axiosInstance";
import Heading from "@/components/reusable/Heading";
import { AlertCircle, X, Plus, Trash2Icon } from "lucide-react";
import ScrollDownToPreview from "../../components/ScrollDownToPreview";

interface CircularItem {
  id: string;
  title: string;
  path: string;
  file: string;
  description: string;
  date: string;
  postedBy: string;
}

interface EventItem {
  title: string;
  path: string;
  date: string;
  description: string;
  image: string;
  postedBy: string;
  file: string;
}

interface AdmissionItem {
  id: string;
  programme: string;
  degree: string;
  stream: string;
  level: string;
  category: string;
  path: string;
}

interface AnnouncementsData {
  _id?: string;
  data: {
    title: string;
    description: string;
    circulars: {
      title: string;
      items: CircularItem[];
    };
    upcomingEvents: {
      title: string;
      items: EventItem[];
    };
    admissionsOpen: {
      title: string;
      items: AdmissionItem[];
    };
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
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full transform transition-all animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
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
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
      `}</style>
    </div>
  );
};

const AnnouncementsDataManager: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<AnnouncementsData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editItem, setEditItem] = useState<AnnouncementsData | null>(null);
  const [originalItem, setOriginalItem] = useState<AnnouncementsData | null>(
    null
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  const collectionName = "home/announcementsdata";

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0 && !editItem) {
      const firstItem = JSON.parse(JSON.stringify(data[0]));
      setEditItem(firstItem);
      setOriginalItem(JSON.parse(JSON.stringify(data[0])));
    }
  }, [data, editItem]);

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
    setLoading(true);

    try {
      if (editItem._id) {
        await axiosInstance.put(`/${collectionName}/${editItem._id}`, editItem);
      }
      setOriginalItem(JSON.parse(JSON.stringify(editItem)));
      fetchData();
      toast({
        title: "Success",
        description: "Announcements saved successfully!",
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

  // Circular functions
  const addCircular = () => {
    if (!editItem) return;
    const updated = { ...editItem };
    updated.data.circulars.items.push({
      id: `circular-${Date.now()}`,
      title: "",
      path: "",
      file: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      postedBy: "",
    });
    setEditItem(updated);
  };

  const updateCircular = (
    index: number,
    field: keyof CircularItem,
    value: string
  ) => {
    if (!editItem) return;
    const updated = { ...editItem };
    (updated.data.circulars.items[index] as any)[field] = value;
    setEditItem(updated);
  };

  const deleteCircular = (index: number) => {
    if (!editItem) return;
    const updated = { ...editItem };
    updated.data.circulars.items = updated.data.circulars.items.filter(
      (_, i) => i !== index
    );
    setEditItem(updated);
  };

  // Event functions
  const addEvent = () => {
    if (!editItem) return;
    const updated = { ...editItem };
    updated.data.upcomingEvents.items.push({
      title: "",
      path: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
      image: "",
      postedBy: "",
      file: "",
    });
    setEditItem(updated);
  };

  const updateEvent = (
    index: number,
    field: keyof EventItem,
    value: string
  ) => {
    if (!editItem) return;
    const updated = { ...editItem };
    (updated.data.upcomingEvents.items[index] as any)[field] = value;
    setEditItem(updated);
  };

  const deleteEvent = (index: number) => {
    if (!editItem) return;
    const updated = { ...editItem };
    updated.data.upcomingEvents.items =
      updated.data.upcomingEvents.items.filter((_, i) => i !== index);
    setEditItem(updated);
  };

  // Admission functions
  const addAdmission = () => {
    if (!editItem) return;
    const updated = { ...editItem };
    updated.data.admissionsOpen.items.push({
      id: `admission-${Date.now()}`,
      programme: "",
      degree: "",
      stream: "",
      level: "UG",
      category: "existing",
      path: "",
    });
    setEditItem(updated);
  };

  const updateAdmission = (
    index: number,
    field: keyof AdmissionItem,
    value: string
  ) => {
    if (!editItem) return;
    const updated = { ...editItem };
    (updated.data.admissionsOpen.items[index] as any)[field] = value;
    setEditItem(updated);
  };

  const deleteAdmission = (index: number) => {
    if (!editItem) return;
    const updated = { ...editItem };
    updated.data.admissionsOpen.items =
      updated.data.admissionsOpen.items.filter((_, i) => i !== index);
    setEditItem(updated);
  };

  const renderForm = () => {
    if (!editItem) return null;

    return (
      <div style={{ gap: "2rem", position: "relative" }}>
        {hasUnsavedChanges && <ScrollDownToPreview />}

        <div className="form-container border border-gray-300 rounded-lg p-6 bg-white">
          <Heading title="Edit Announcements" size="lg" align="left" />

          {/* Main Fields */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg mt-6">
            <div className="mb-4">
              <label className="form-label block text-sm font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
                value={editItem.data.title}
                onChange={(e) => updateField("data.title", e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="form-label block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                rows={3}
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
                value={editItem.data.description}
                onChange={(e) =>
                  updateField("data.description", e.target.value)
                }
              />
            </div>
          </div>

          {/* Circulars Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <strong>
                E-Circulars ({editItem.data.circulars.items.length})
              </strong>
              <button
                className="btn btn-primary px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm"
                onClick={addCircular}
              >
                + Add Circular
              </button>
            </div>
            {editItem.data.circulars.items.map((circular, index) => (
              <div
                key={index}
                className="mb-4 p-3 bg-white rounded border border-gray-200"
              >
                <div className="flex justify-between mb-2">
                  <strong className="text-sm">Circular {index + 1}</strong>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => deleteCircular(index)}
                  >
                    <Trash2Icon size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Title"
                    className="form-input px-2 py-1 border rounded text-sm"
                    value={circular.title}
                    onChange={(e) =>
                      updateCircular(index, "title", e.target.value)
                    }
                  />
                  <input
                    placeholder="File Path"
                    className="form-input px-2 py-1 border rounded text-sm"
                    value={circular.file}
                    onChange={(e) =>
                      updateCircular(index, "file", e.target.value)
                    }
                  />
                  <input
                    placeholder="Date"
                    type="date"
                    className="form-input px-2 py-1 border rounded text-sm"
                    value={circular.date}
                    onChange={(e) =>
                      updateCircular(index, "date", e.target.value)
                    }
                  />
                  <input
                    placeholder="Posted By"
                    className="form-input px-2 py-1 border rounded text-sm"
                    value={circular.postedBy}
                    onChange={(e) =>
                      updateCircular(index, "postedBy", e.target.value)
                    }
                  />
                  <textarea
                    placeholder="Description"
                    className="form-input px-2 py-1 border rounded text-sm col-span-2"
                    value={circular.description}
                    onChange={(e) =>
                      updateCircular(index, "description", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Events Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <strong>
                Upcoming Events ({editItem.data.upcomingEvents.items.length})
              </strong>
              <button
                className="btn btn-primary px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm"
                onClick={addEvent}
              >
                + Add Event
              </button>
            </div>
            {editItem.data.upcomingEvents.items.map((event, index) => (
              <div
                key={index}
                className="mb-4 p-3 bg-white rounded border border-gray-200"
              >
                <div className="flex justify-between mb-2">
                  <strong className="text-sm">Event {index + 1}</strong>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => deleteEvent(index)}
                  >
                    <Trash2Icon size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Title"
                    className="form-input px-2 py-1 border rounded text-sm"
                    value={event.title}
                    onChange={(e) =>
                      updateEvent(index, "title", e.target.value)
                    }
                  />
                  <input
                    placeholder="Date"
                    type="date"
                    className="form-input px-2 py-1 border rounded text-sm"
                    value={event.date}
                    onChange={(e) => updateEvent(index, "date", e.target.value)}
                  />
                  <input
                    placeholder="Image"
                    className="form-input px-2 py-1 border rounded text-sm"
                    value={event.image}
                    onChange={(e) =>
                      updateEvent(index, "image", e.target.value)
                    }
                  />
                  <input
                    placeholder="Posted By"
                    className="form-input px-2 py-1 border rounded text-sm"
                    value={event.postedBy}
                    onChange={(e) =>
                      updateEvent(index, "postedBy", e.target.value)
                    }
                  />
                  <textarea
                    placeholder="Description"
                    className="form-input px-2 py-1 border rounded text-sm col-span-2"
                    value={event.description}
                    onChange={(e) =>
                      updateEvent(index, "description", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Admissions Open Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <strong>
                Admissions Open ({editItem.data.admissionsOpen.items.length})
              </strong>
              <button
                className="btn btn-primary px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm"
                onClick={addAdmission}
              >
                + Add Program
              </button>
            </div>
            {editItem.data.admissionsOpen.items.map((admission, index) => (
              <div
                key={index}
                className="mb-4 p-3 bg-white rounded border border-gray-200"
              >
                <div className="flex justify-between mb-2">
                  <strong className="text-sm">Program {index + 1}</strong>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => deleteAdmission(index)}
                  >
                    <Trash2Icon size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Programme"
                    className="form-input px-2 py-1 border rounded text-sm"
                    value={admission.programme}
                    onChange={(e) =>
                      updateAdmission(index, "programme", e.target.value)
                    }
                  />
                  <input
                    placeholder="Degree"
                    className="form-input px-2 py-1 border rounded text-sm"
                    value={admission.degree}
                    onChange={(e) =>
                      updateAdmission(index, "degree", e.target.value)
                    }
                  />
                  <input
                    placeholder="Stream"
                    className="form-input px-2 py-1 border rounded text-sm"
                    value={admission.stream}
                    onChange={(e) =>
                      updateAdmission(index, "stream", e.target.value)
                    }
                  />
                  <select
                    className="form-input px-2 py-1 border rounded text-sm"
                    value={admission.level}
                    onChange={(e) =>
                      updateAdmission(index, "level", e.target.value)
                    }
                  >
                    <option value="UG">UG</option>
                    <option value="PG">PG</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Save/Cancel Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-200  gap-4">
            <button
              className="btn btn-primary px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              onClick={() => setShowSavePopup(true)}
              disabled={loading || !hasUnsavedChanges}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              className="btn px-6 py-2.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              onClick={() => setShowCancelPopup(true)}
              disabled={loading || !hasUnsavedChanges}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading && !editItem)
    return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="collection-manager p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      {renderForm()}

      <ConfirmationPopup
        isOpen={showSavePopup}
        onClose={() => setShowSavePopup(false)}
        onConfirm={handleSave}
        title="Save Changes?"
        message="Save all announcements changes? This will update the live site."
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
    </div>
  );
};

export default AnnouncementsDataManager;

import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "../../../utils/axiosInstance";
import Heading from "@/components/reusable/Heading";
import { AlertCircle, X, Edit } from "lucide-react";

interface AllHomeData {
  _id?: string;
  data: {
    welcome: string;
    leadership: { leads: string };
    stats: string;
    campus: string;
    missionVision: string;
    events: string;
    recruiters: string;
    admission: string;
    announcements: string;
    testimonials: string;
    schoolsAndColleges: string;
    carousel: string;
    newsTicker: string;
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

const AllHomeDataManager: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<AllHomeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState<AllHomeData | null>(null);
  const [originalItem, setOriginalItem] = useState<AllHomeData | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  const collectionName = "home/allhomedata";

  useEffect(() => {
    fetchData();
  }, []);

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
      setIsEditing(false);
      fetchData();
      toast({
        title: "Success",
        description: "Home configuration saved successfully!",
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
    setIsEditing(false);
    setEditItem(null);
  };

  const handleEdit = (item: AllHomeData) => {
    setEditItem(JSON.parse(JSON.stringify(item)));
    setOriginalItem(JSON.parse(JSON.stringify(item)));
    setIsEditing(true);
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

  const renderCards = () => {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            All Home Data Configuration
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900">
                  Home Data References
                </h3>
                <p className="text-sm text-gray-600">
                  13 collection references
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  <Edit size={14} /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderForm = () => {
    if (!editItem) return null;

    const fields = [
      { key: "welcome", label: "Welcome Data" },
      { key: "stats", label: "Stats Data" },
      { key: "campus", label: "Campus Data" },
      { key: "missionVision", label: "Mission Vision Data" },
      { key: "events", label: "Events Data" },
      { key: "recruiters", label: "Recruiters Data" },
      { key: "admission", label: "Admission Data" },
      { key: "announcements", label: "Announcements Data" },
      { key: "testimonials", label: "Testimonials Data" },
      { key: "schoolsAndColleges", label: "Schools And Colleges Data" },
      { key: "carousel", label: "Carousel Data" },
      { key: "newsTicker", label: "News Ticker Data" },
    ];

    return (
      <div>
        <div className="form-container border border-gray-300 rounded-lg p-6 bg-white">
          <Heading
            title="Edit Home Data Configuration"
            size="lg"
            align="left"
          />

          <div className="mb-6 p-4 bg-gray-50 rounded-lg mt-6">
            <p className="text-sm text-gray-600 mb-4">
              Configure collection references for home page sections
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => (
                <div key={field.key} className="mb-3">
                  <label className="form-label block text-sm font-medium mb-2">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={(editItem.data as any)[field.key]}
                    onChange={(e) =>
                      updateField(`data.${field.key}`, e.target.value)
                    }
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

      <ConfirmationPopup
        isOpen={showSavePopup}
        onClose={() => setShowSavePopup(false)}
        onConfirm={handleSave}
        title="Save Changes?"
        message="Save home data configuration? This will update collection references."
        confirmText="Save Changes"
        confirmStyle="bg-blue-600 hover:bg-blue-700"
      />

      <ConfirmationPopup
        isOpen={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
        onConfirm={handleCancel}
        title="Discard Changes?"
        message="Discard all unsaved changes?"
        confirmText="Discard Changes"
        confirmStyle="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default AllHomeDataManager;

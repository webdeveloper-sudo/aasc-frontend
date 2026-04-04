import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "../../../utils/axiosInstance";
import Heading from "@/components/reusable/Heading";
import { AlertCircle, X } from "lucide-react";
import ScrollDownToPreview from "../../components/ScrollDownToPreview";

interface WelcomeData {
  _id?: string;
  data: {
    title: string;
    description: string;
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

const WelcomeDataManager: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<WelcomeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editItem, setEditItem] = useState<WelcomeData | null>(null);
  const [originalItem, setOriginalItem] = useState<WelcomeData | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  const collectionName = "home/welcomedata";

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
        description: "Welcome section saved successfully!",
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

  const renderForm = () => {
    if (!editItem) return null;

    return (
      <div style={{ gap: "2rem", position: "relative" }}>
        {hasUnsavedChanges && <ScrollDownToPreview />}

        <div className="form-container border border-gray-300 rounded-lg p-6 bg-white">
          <Heading title="Edit Welcome Section" size="lg" align="left" />

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
                rows={5}
                maxLength={500}
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
                value={editItem.data.description}
                onChange={(e) =>
                  updateField("data.description", e.target.value)
                }
              />
              <span className="text-xs text-gray-500 mt-1">
                {editItem.data.description.length} / 500
              </span>
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
              className="btn px-6 py-2.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              onClick={() => setShowCancelPopup(true)}
              disabled={loading || !hasUnsavedChanges}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Live Preview Section */}
        <div className="py-4 mt-10 border border-gray-300 rounded-2xl p-8 bg-white">
          <Heading
            title="Live Preview"
            size="lg"
            align="left"
            className="mt-5"
          />
          <div className="mt-6 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {editItem.data.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {editItem.data.description}
            </p>
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
        message="Save welcome section changes? This will update the live site."
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

export default WelcomeDataManager;

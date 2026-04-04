import React, { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "../../../utils/axiosInstance";
import Heading from "@/components/reusable/Heading";
import { AlertCircle, Trash2Icon, X } from "lucide-react";
import ScrollDownToPreview from "../../components/ScrollDownToPreview";
import PreviewWrapper from "@/admin/PreviewWrapper";
import NewsTicker from "@/components/common/Header/NewsTicker";

interface NewsTickerData {
  _id?: string;
  data: {
    items: string[];
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
  confirmStyle = "bg-blue-600 hover:bg-blue-700",
}) => {
  if (!isOpen) return null;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-2xl max-w-sm sm:max-w-md w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="p-4 sm:p-6 max-w-full">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 truncate">
                {title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6">
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 text-white rounded-lg font-medium text-sm ${confirmStyle} hover:opacity-90 transition-opacity`}
            >
              {confirmText}
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors"
            >
              Cancel
            </button>
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
    </div>
  );
};

const NewsTickerDataManager: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<NewsTickerData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editItem, setEditItem] = useState<NewsTickerData | null>(null);
  const [originalItem, setOriginalItem] = useState<NewsTickerData | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  // Delete confirmation state
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const sessionId = useRef(
    `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  const collectionName = "home/newstickerdata";

  // All logic identical to ProfileOfCollegeDataManager pattern
  useEffect(() => {
    sessionStorage.setItem("adminSessionId", sessionId.current);
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0 && !editItem) {
      const firstItem = JSON.parse(JSON.stringify(data[0]));
      setEditItem(firstItem);
      setOriginalItem(JSON.parse(JSON.stringify(data[0])));
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

  const handleSave = async () => {
    if (!editItem) return;
    setShowSavePopup(false);
    setLoading(true);

    try {
      if (editItem._id) {
        await axiosInstance.put(`/${collectionName}/${editItem._id}`, {
          data: editItem.data,
        });
      }

      const updatedItem = { ...editItem };
      setData((prev) =>
        prev.map((item) => (item._id === editItem._id ? updatedItem : item))
      );
      setOriginalItem(JSON.parse(JSON.stringify(updatedItem)));
      setError("");
      toast({
        title: "Success",
        description: "News ticker saved successfully!",
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
    setEditItem(null);
    setOriginalItem(null);
    if (data.length > 0) {
      const firstItem = data[0];
      setEditItem(JSON.parse(JSON.stringify(firstItem)));
      setOriginalItem(JSON.parse(JSON.stringify(firstItem)));
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

  const addItem = () => {
    if (!editItem) return;
    setEditItem({
      ...editItem,
      data: { ...editItem.data, items: [...editItem.data.items, ""] },
    });
  };

  const updateItem = (index: number, value: string) => {
    if (!editItem) return;
    const newItems = editItem.data.items.map((item, i) =>
      i === index ? value : item
    );
    updateField("data.items", newItems);
  };

  // Delete handlers with confirmation
  const requestDeleteItem = (index: number) => {
    setDeleteIndex(index);
    setShowDeletePopup(true);
  };

  const confirmDeleteItem = () => {
    if (deleteIndex === null || !editItem) return;
    const newItems = editItem.data.items.filter((_, i) => i !== deleteIndex);
    updateField("data.items", newItems);
    setShowDeletePopup(false);
    setDeleteIndex(null);
  };

  const cancelDeleteItem = () => {
    setShowDeletePopup(false);
    setDeleteIndex(null);
  };

  if (loading && data.length === 0) {
    return (
      <div className="text-center py-12 px-4 min-h-screen max-w-md mx-auto">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-[175vh] overflow-x-hidden p-3 sm:p-6 bg-gray-50">
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 max-w-full overflow-hidden">
          {error}
        </div>
      )}

      {editItem ? (
        <div className="max-w-full mx-auto space-y-6 w-full">
          {hasUnsavedChanges && <ScrollDownToPreview />}

          {/* Form Container - ProfileOfCollegeDataManager Pattern */}
          <div className="form-container border border-gray-300 rounded-xl p-4 sm:p-6 bg-white shadow-sm max-w-full overflow-hidden">
            <Heading title="Edit News Ticker" size="lg" align="left" />

            {/* Ticker Items Section - Fixed responsive grid */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg mt-6 overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                <strong className="text-lg font-medium text-gray-900">
                  Ticker Items ({editItem.data.items.length})
                </strong>
                <button className="green-btn" onClick={addItem}>
                  + Add Item
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 ">
                {editItem.data.items.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors overflow-hidden"
                  >
                    <div className="flex justify-between items-center mb-2 gap-2">
                      <strong className="text-sm font-medium text-gray-900 truncate flex-1 min-w-0">
                        Item {index + 1}
                      </strong>
                      <button
                        className="trash-btn"
                        onClick={() => requestDeleteItem(index)}
                        aria-label="Delete item"
                        title="Delete this item"
                      >
                        <Trash2Icon size={16} />
                      </button>
                    </div>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all box-border max-w-full resize-none"
                      value={item}
                      onChange={(e) => updateItem(index, e.target.value)}
                      placeholder="News ticker item text"
                      maxLength={200}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons - ProfileOfCollegeDataManager Pattern */}
            <div className="pt-6 border-t border-gray-200 space-x-2">
              <button
                className="blue-btn"
                onClick={() => setShowSavePopup(true)}
                disabled={loading || !hasUnsavedChanges}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                className="ash-btn"
                onClick={() => setShowCancelPopup(true)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Preview Section - ProfileOfCollegeDataManager Pattern */}
          <div className="border border-gray-300 rounded-2xl p-4 sm:p-8 bg-white shadow-sm max-w-full overflow-hidden">
            <Heading
              title="Live Preview"
              size="lg"
              align="left"
              className="mb-6"
            />
            <div className="max-w-full overflow-x-auto pb-4">
              <PreviewWrapper
                Component={NewsTicker}
                previewData={editItem.data}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 px-4 max-w-md mx-auto">
          <p className="text-gray-600 text-lg mb-4">
            No News Ticker data found.
          </p>
          <p className="text-gray-500">Please create one first.</p>
        </div>
      )}

      {/* Save Confirmation */}
      <ConfirmationPopup
        isOpen={showSavePopup}
        onClose={() => setShowSavePopup(false)}
        onConfirm={handleSave}
        title="Save Changes?"
        message="Save news ticker changes?"
        confirmText="Save Changes"
        confirmStyle="bg-blue-600 hover:bg-blue-700"
      />

      {/* Cancel Confirmation */}
      <ConfirmationPopup
        isOpen={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
        onConfirm={handleCancel}
        title="Discard Changes?"
        message="Discard all unsaved changes and reload?"
        confirmText="Discard"
        confirmStyle="bg-red-600 hover:bg-red-700"
      />

      {/* Delete Confirmation Popup */}
      <ConfirmationPopup
        isOpen={showDeletePopup}
        onClose={cancelDeleteItem}
        onConfirm={confirmDeleteItem}
        title="Delete Item?"
        message={
          deleteIndex !== null
            ? `Are you sure you want to delete "Item ${
                deleteIndex + 1
              }"? This action cannot be undone.`
            : "Are you sure you want to delete this item?"
        }
        confirmText="Delete"
        confirmStyle="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default NewsTickerDataManager;

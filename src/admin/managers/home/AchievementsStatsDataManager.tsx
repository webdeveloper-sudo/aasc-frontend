import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "../../../utils/axiosInstance";
import Heading from "@/components/reusable/Heading";
import ImageUploadManager from "../../components/ImageUploadManager";
import { AlertCircle, X, Trash2Icon } from "lucide-react";
import ScrollDownToPreview from "../../components/ScrollDownToPreview";
import InputModal from "../../components/InputModal";
import PreviewWrapper from "@/admin/PreviewWrapper";
import AchievementsStats from "@/components/AchievementsStats";

interface StatItem {
  label: string;
  icons: string;
  startValue: number;
  endValue: number;
  suffix: string;
  isDirty?: boolean;
}

interface AchievementsStatsData {
  _id?: string;
  data: {
    items: StatItem[];
  };
}

const EMPTY_ITEM: StatItem = {
  label: "",
  icons: "",
  startValue: 0,
  endValue: 0,
  suffix: "+",
};

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
              className={`flex-1 px-4 py-2.5 text-white rounded-lg font-medium ${confirmStyle} hover:opacity-90`}
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

const AchievementsStatsDataManager: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<AchievementsStatsData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editItem, setEditItem] = useState<AchievementsStatsData | null>(null);
  const [originalItem, setOriginalItem] =
    useState<AchievementsStatsData | null>(null);
  const [tempFiles, setTempFiles] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // per-card confirmations
  const [cardToSave, setCardToSave] = useState<number | null>(null);
  const [cardToCancel, setCardToCancel] = useState<number | null>(null);

  // new stat (InputModal) state
  const [isAddLabelOpen, setIsAddLabelOpen] = useState(false);
  const [pendingNewValue, setPendingNewValue] = useState<number | null>(null);

  const sessionId = React.useRef(
    `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  const collectionName = "home/achievementsstatsdata";

  useEffect(() => {
    sessionStorage.setItem("adminSessionId", sessionId.current);
    const stored = sessionStorage.getItem("tempFiles");
    if (stored) setTempFiles(JSON.parse(stored));
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

  const addTempFile = (fileName: string) => {
    setTempFiles((prev) => {
      const updated = [...prev, fileName];
      sessionStorage.setItem("tempFiles", JSON.stringify(updated));
      return updated;
    });
  };

  // Save only one stat card by index
  const handleSaveCard = async (index: number) => {
    if (!editItem || !editItem._id) return;
    setCardToSave(null);
    setLoading(true);

    try {
      let updatedItems = [...editItem.data.items];

      // temp file handling for that card's icon (if using ImageUploadManager)
      for (const fileName of tempFiles) {
        const res = await axiosInstance.post("/upload/save-temp-file", {
          fileName,
        });
        const finalUrl = res.data.url;
        updatedItems = updatedItems.map((item, i) => ({
          ...item,
          icons: i === index && item.icons === fileName ? finalUrl : item.icons,
        }));
      }

      const payload: AchievementsStatsData = {
        ...editItem,
        data: {
          items: updatedItems.map((item, i) =>
            i === index ? { ...item, isDirty: false } : item
          ),
        },
      };

      await axiosInstance.put(`/${collectionName}/${editItem._id}`, {
        ...payload,
        data: {
          items: payload.data.items.map(({ isDirty, ...rest }) => rest),
        },
      });

      const cleaned: AchievementsStatsData = {
        ...payload,
        data: {
          items: payload.data.items.map((item) => ({
            ...item,
            isDirty: false,
          })),
        },
      };

      setTempFiles([]);
      sessionStorage.removeItem("tempFiles");
      setOriginalItem(JSON.parse(JSON.stringify(cleaned)));
      setEditItem(cleaned);
      fetchData();
      toast({
        title: "Success",
        description: "Stat card saved successfully!",
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

  // Cancel one card -> revert that card from originalItem
  const handleCancelCard = (index: number) => {
    if (!editItem || !originalItem) return;
    setCardToCancel(null);

    const originalItems = originalItem.data.items;
    const newItems = editItem.data.items.map((item, i) =>
      i === index && originalItems[i]
        ? { ...originalItems[i], isDirty: false }
        : item
    );

    setEditItem({
      ...editItem,
      data: { items: newItems },
    });
  };

  const updateStatItem = (index: number, field: keyof StatItem, value: any) => {
    if (!editItem) return;
    const newItems = editItem.data.items.map((item, i) =>
      i === index ? { ...item, [field]: value, isDirty: true } : item
    );
    setEditItem({ ...editItem, data: { items: newItems } });
  };

  const deleteStatItem = async (index: number) => {
    if (!editItem || !editItem._id) return;
    setLoading(true);
    try {
      const newItems = editItem.data.items.filter((_, i) => i !== index);

      const payload: AchievementsStatsData = {
        ...editItem,
        data: {
          items: newItems.map(({ isDirty, ...rest }) => rest),
        },
      };

      await axiosInstance.put(`/${collectionName}/${editItem._id}`, payload);

      const cleaned: AchievementsStatsData = {
        ...payload,
        data: {
          items: payload.data.items.map((item) => ({
            ...item,
            isDirty: false,
          })),
        },
      };

      setOriginalItem(JSON.parse(JSON.stringify(cleaned)));
      setEditItem(cleaned);
      fetchData();
      toast({
        title: "Success",
        description: "Stat item deleted successfully!",
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
    }
  };

  const openAddStatModal = () => {
    setPendingNewValue(null);
    setIsAddLabelOpen(true);
  };

  const handleAddNewStatLabel = async (label: string) => {
    setIsAddLabelOpen(false);
    if (!editItem || !editItem._id) return;
    setLoading(true);

    try {
      const newItem: StatItem = {
        ...EMPTY_ITEM,
        label,
        endValue: 0,
        isDirty: false,
      };

      const newItems = [...editItem.data.items, newItem];

      const payload: AchievementsStatsData = {
        ...editItem,
        data: {
          items: newItems.map(({ isDirty, ...rest }) => rest),
        },
      };

      await axiosInstance.put(`/${collectionName}/${editItem._id}`, payload);

      const cleaned: AchievementsStatsData = {
        ...payload,
        data: {
          items: payload.data.items.map((it) => ({
            ...it,
            isDirty: false,
          })),
        },
      };

      setOriginalItem(JSON.parse(JSON.stringify(cleaned)));
      setEditItem(cleaned);
      fetchData();
      toast({
        title: "Success",
        description: "New stat added successfully!",
      });
    } catch (err: any) {
      setError("Error adding stat: " + err.message);
      toast({
        title: "Error",
        description: "Error adding stat: " + err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (!editItem) return null;

    return (
      <div style={{ gap: "2rem", position: "relative" }}>
        {hasUnsavedChanges && <ScrollDownToPreview />}
        <div className="form-container border border-gray-300 rounded-lg p-6 bg-white">
          <Heading title="Edit Achievements Stats" size="lg" align="left" />

          <div className="mb-6 p-4 bg-gray-50 rounded-lg mt-6">
            <div className="flex justify-between items-center mb-4">
              <strong>Stat Items ({editItem.data.items.length})</strong>
              {/* <button
                className="btn btn-primary px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm"
                onClick={openAddStatModal}
              >
                + Add Stat Item
              </button> */}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {editItem.data.items.map((item, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 bg-white rounded border border-gray-200"
                >
                  <div className="flex justify-between mb-3">
                    <strong className="text-sm">Stat Item {index + 1}</strong>
                    {/* <button
                      className="trash-btn"
                      onClick={() => deleteStatItem(index)}
                    >
                      <Trash2Icon size={16} />
                    </button> */}
                  </div>

                  <div className="mb-3">
                    <label className="form-label block text-xs font-medium mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      className="form-input w-full px-3 py-2 border rounded-md"
                      value={item.label}
                      onChange={(e) =>
                        updateStatItem(index, "label", e.target.value)
                      }
                    />
                  </div>

                  {/* <ImageUploadManager
                    label="Icon Image"
                    value={item.icons}
                    onChange={(v) => updateStatItem(index, "icons", v)}
                    addTemp={addTempFile}
                  /> */}

                  <div className="mt-3">
                    <div>
                      <label className="form-label block text-xs font-medium mb-1">
                        Value
                      </label>
                      <input
                        type="number"
                        className="form-input w-full px-3 py-2 border rounded-md"
                        value={item.endValue}
                        onChange={(e) =>
                          updateStatItem(
                            index,
                            "endValue",
                            parseInt(e.target.value || "0", 10)
                          )
                        }
                      />
                    </div>
                    {/* <div className="mt-2">
                      <label className="form-label block text-xs font-medium mb-1">
                        Suffix
                      </label>
                      <input
                        type="text"
                        className="form-input w-full px-3 py-2 border rounded-md"
                        value={item.suffix}
                        onChange={(e) =>
                          updateStatItem(index, "suffix", e.target.value)
                        }
                      />
                    </div> */}
                  </div>

                  {/* Per-card Save / Cancel with same styling as old global buttons */}
                  <div className="mt-4 pt-3 border-t border-gray-200 space-x-2 items-center">
                    <button
                      className="blue-btn "
                      disabled={loading || !item.isDirty}
                      onClick={() => setCardToSave(index)}
                    >
                      {loading && cardToSave === index
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                    <button
                      className="ash-btn "
                      disabled={loading || !item.isDirty}
                      onClick={() => setCardToCancel(index)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
          <PreviewWrapper
            Component={AchievementsStats}
            previewData={editItem?.data}
          />
        </div>

        {/* Add-new-stat: label via InputModal */}
        <InputModal
          isOpen={isAddLabelOpen}
          onClose={() => setIsAddLabelOpen(false)}
          onConfirm={handleAddNewStatLabel}
          title="Add New Stat"
          message="Enter a label for the new statistic. You can set the value after creating it."
          placeholder="Enter stat label..."
          confirmText="Add Stat"
        />
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

      {/* Per-card confirmation popups */}
      <ConfirmationPopup
        isOpen={cardToSave !== null}
        onClose={() => setCardToSave(null)}
        onConfirm={() => cardToSave !== null && handleSaveCard(cardToSave)}
        title="Save Changes?"
        message="Save changes for this stat item? This will update the live site."
        confirmText="Save Changes"
        confirmStyle="bg-blue-600 hover:bg-blue-700"
      />

      <ConfirmationPopup
        isOpen={cardToCancel !== null}
        onClose={() => setCardToCancel(null)}
        onConfirm={() =>
          cardToCancel !== null && handleCancelCard(cardToCancel)
        }
        title="Discard Changes?"
        message="Discard unsaved changes for this stat item?"
        confirmText="Discard Changes"
        confirmStyle="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default AchievementsStatsDataManager;

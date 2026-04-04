import React, { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "../../utils/axiosInstance";
import Prospectus from "@/pages/academics/Prospectus";
import PreviewWrapper from "@/admin/PreviewWrapper";
import DocumentUploadManager from "../components/DocumentUploadManager";
import Heading from "@/components/reusable/Heading";
import {
  AlertCircle,
  X,
  Trash2,
  Plus,
  ArrowLeft,
  Edit2,
  FileText,
} from "lucide-react";
import ScrollDownToPreview from "../components/ScrollDownToPreview";
import InputModal from "../components/InputModal";

/* ================= TYPES ================= */
interface ProspectusItem {
  year: string;
  doc: string;
}

interface ProspectusData {
  _id?: string;
  data: ProspectusItem[];
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

/* ================= MAIN COMPONENT ================= */
const ProspectusDataManager: React.FC = () => {
  const { toast } = useToast();
  const [doc, setDoc] = useState<ProspectusData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tempFiles, setTempFiles] = useState<string[]>([]);

  // Navigation states
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ProspectusItem | null>(null);
  const [originalItem, setOriginalItem] = useState<ProspectusItem | null>(null);

  // Popups
  const [showAddYearModal, setShowAddYearModal] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteYear, setDeleteYear] = useState<string>("");
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  const sessionIdRef = useRef<string>("");

  const collectionName = "academics/prospectusdata";

  /* ================= SESSION & INIT ================= */
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

  /* ================= FETCH DATA (EXACT PRESSRELEASES PATTERN) ================= */
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(`/${collectionName}`);
      const item = Array.isArray(res.data) ? res.data[0] : res.data;

      setDoc({
        _id: item._id,
        data: item.data || [],
      });
    } catch (e: any) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CHECK IF HAS UNSAVED CHANGES ================= */
  const hasUnsavedChanges = useCallback(() => {
    if (!editingItem || !originalItem) return false;
    return JSON.stringify(editingItem) !== JSON.stringify(originalItem);
  }, [editingItem, originalItem]);

  /* ================= TEMP FILE PROCESSING ================= */
  const processTempFiles = async (
    item: ProspectusItem
  ): Promise<ProspectusItem> => {
    let finalDoc = item.doc;

    for (const fileName of tempFiles) {
      if (item.doc === fileName) {
        try {
          const res = await axiosInstance.post(
            "/upload/document/save-temp-document",
            {
              fileName,
            }
          );
          finalDoc = res.data.url;
        } catch (err) {
          console.error("Failed to save temp file:", fileName, err);
        }
      }
    }

    // Clean up temp files
    setTempFiles([]);
    sessionStorage.removeItem("tempFiles");

    return { ...item, doc: finalDoc };
  };

  /* ================= SAVE DOCUMENT (EXACT PRESSRELEASES PATTERN) ================= */
  const saveDoc = async (updated: ProspectusData) => {
    if (!updated._id) return;

    try {
      await axiosInstance.put(`/${collectionName}/${updated._id}`, {
        data: updated.data,
      });
      setDoc(updated);
    } catch (err: any) {
      setError("Failed to save: " + err.message);
      throw err;
    }
  };

  /* ================= PREVIEW DATA CONSTRUCTION ================= */
  const getPreviewData = () => {
    if (!doc) return [];

    if (selectedYear && editingItem) {
      return doc.data.map((item) =>
        item.year === selectedYear ? editingItem : item
      );
    }
    return doc.data;
  };

  /* ================= YEAR OPERATIONS ================= */
  const addYear = () => {
    setShowAddYearModal(true);
  };

  const confirmAddYear = async (year: string) => {
    setShowAddYearModal(false);

    if (doc?.data.some((item) => item.year === year)) {
      setError(`Year ${year} already exists`);
      return;
    }

    if (!doc) return;

    const newItem: ProspectusItem = { year, doc: "" };
    const updated = {
      ...doc,
      data: [...doc.data, newItem],
    };

    await saveDoc(updated);
    toast({
      title: "Success",
      description: "Year added successfully!",
    });
  };

  const handleDeleteYear = (year: string) => {
    setDeleteYear(year);
    setShowDeletePopup(true);
  };

  const confirmDeleteYear = async () => {
    if (!doc || !deleteYear) return;

    setShowDeletePopup(false);
    const updated = {
      ...doc,
      data: doc.data.filter((item) => item.year !== deleteYear),
    };

    await saveDoc(updated);
    setSelectedYear(null);
    setDeleteYear("");
    toast({
      title: "Success",
      description: "Year deleted successfully!",
    });
  };

  /* ================= EDIT OPERATIONS ================= */
  const handleEditYear = (year: string) => {
    const item = doc?.data.find((i) => i.year === year);
    if (!item) return;

    setSelectedYear(year);
    setEditingItem({ ...item });
    setOriginalItem({ ...item });
    setError("");
  };

  const goBack = async () => {
    try {
      if (tempFiles.length > 0) {
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
    setSelectedYear(null);
    setEditingItem(null);
    setOriginalItem(null);
  };

  const handleSave = async () => {
    if (!editingItem || !doc || !selectedYear) return;

    setShowSavePopup(false);
    setLoading(true);

    try {
      const finalItem = await processTempFiles(editingItem);
      const updated = {
        ...doc,
        data: doc.data.map((item) =>
          item.year === selectedYear ? finalItem : item
        ),
      };

      await saveDoc(updated);
      setDoc(updated);
      setOriginalItem({ ...finalItem });
      setEditingItem({ ...finalItem });
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

  const handleCancel = async () => {
    setShowCancelPopup(false);

    try {
      if (tempFiles.length > 0) {
        await axiosInstance.post("/upload/document/remove-temp-document", {
          files: tempFiles,
          sessionId: sessionIdRef.current,
        });
      }
      setTempFiles([]);
      sessionStorage.removeItem("tempFiles");

      if (originalItem) {
        setEditingItem({ ...originalItem });
      }
    } catch (err: any) {
      console.error("Cancel cleanup failed:", err);
      if (originalItem) {
        setEditingItem({ ...originalItem });
      }
    }
  };

  const updateField = (field: keyof ProspectusItem, value: any) => {
    if (!editingItem) return;
    setEditingItem({ ...editingItem, [field]: value });
  };

  /* ================= RENDERERS ================= */
  const renderYearCard = (item: ProspectusItem) => {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4 gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <FileText size={24} className="text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">{item.year}</h4>
              <p className="text-sm text-gray-600">
                {item.doc ? "PDF uploaded" : "No PDF"}
              </p>
            </div>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <button
              className="btn btn-primary px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2"
              onClick={() => handleEditYear(item.year)}
              disabled={!!selectedYear || loading}
            >
              <Edit2 size={16} />
              Edit
            </button>
            <button
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              onClick={() => handleDeleteYear(item.year)}
              disabled={!!selectedYear || loading}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading && !doc) {
    return <div className="text-center py-8">Loading...</div>;
  }

  /* ================= MAIN LIST VIEW ================= */
  if (!selectedYear) {
    return (
      <div className="collection-manager p-6 min-h-screen mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="form-container border border-gray-300 rounded-lg p-6 bg-white mb-8">
          <Heading title="Prospectus Management" size="lg" align="left" />

          <div className="flex justify-end mb-6">
            <button
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50"
              onClick={addYear}
              disabled={loading}
            >
              <Plus size={20} />
              Add Year
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doc &&
              doc.data
                .sort((a, b) => {
                  const yearA = a.year.match(/\d{4}/)?.[0] || "0";
                  const yearB = b.year.match(/\d{4}/)?.[0] || "0";
                  return Number(yearB) - Number(yearA);
                })
                .map((item) => (
                  <div key={item.year}>{renderYearCard(item)}</div>
                ))}
          </div>

          {(!doc || doc.data.length === 0) && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No prospectus years yet</p>
              <p className="text-sm">Add a year to get started</p>
            </div>
          )}
        </div>

        {/* PREVIEW SECTION - ALWAYS VISIBLE */}
        <div
          className="py-4 mt-10 border border-gray-300 rounded-2xl p-8 bg-white"
          id="preview-section"
        >
          <Heading
            title="Live Preview"
            size="lg"
            align="left"
            className="mt-5"
          />
          {doc && (
            <PreviewWrapper
              Component={Prospectus}
              previewData={getPreviewData()}
            />
          )}
        </div>

        <ConfirmationPopup
          isOpen={showDeletePopup}
          onClose={() => setShowDeletePopup(false)}
          onConfirm={confirmDeleteYear}
          title="Delete Year?"
          message={`Are you sure you want to delete the prospectus for ${deleteYear}? This cannot be undone.`}
          confirmText="Delete Year"
          confirmStyle="bg-red-600 hover:bg-red-700"
        />

        <InputModal
          isOpen={showAddYearModal}
          onClose={() => setShowAddYearModal(false)}
          onConfirm={confirmAddYear}
          title="Add New Year"
          message="Enter the year for the prospectus"
          placeholder="e.g., 2024-2025"
          defaultValue={`${new Date().getFullYear()}-${
            new Date().getFullYear() + 1
          }`}
          confirmText="Add Year"
        />
      </div>
    );
  }

  /* ================= YEAR EDIT VIEW ================= */
  return (
    <div className="p-6 min-h-screen">
      <div className="mx-auto">
        <button
          onClick={goBack}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          disabled={loading}
        >
          <ArrowLeft size={20} />
          Back to Years
        </button>

        <div className="border border-gray-300 rounded-lg p-6 bg-white mb-8">
          <Heading
            title={`Prospectus – ${selectedYear}`}
            size="lg"
            align="left"
          />

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {/* Form Fields */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg mt-6">
            <div className="mb-4">
              <label className="form-label block text-sm font-medium mb-2">
                Year
              </label>
              <input
                type="text"
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                value={editingItem?.year || ""}
                disabled
              />
            </div>

            <DocumentUploadManager
              label="Prospectus PDF"
              value={editingItem?.doc || ""}
              onChange={(v) => updateField("doc", v)}
              addTemp={addTempFile}
            />
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
            <button
              className="btn btn-primary px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setShowSavePopup(true)}
              disabled={loading || !hasUnsavedChanges()}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              className="btn px-6 py-2.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setShowCancelPopup(true)}
              disabled={loading || !hasUnsavedChanges()}
            >
              Cancel Changes
            </button>
          </div>
        </div>

        {/* SCROLL DOWN TO PREVIEW BUTTON */}
        {hasUnsavedChanges() && <ScrollDownToPreview />}

        {/* PREVIEW SECTION - ALWAYS VISIBLE EVEN WHEN EDITING */}
        <div
          className="py-4 mt-10 border border-gray-300 rounded-2xl p-8 bg-white"
          id="preview-section"
        >
          <Heading
            title="Live Preview"
            size="lg"
            align="left"
            className="mt-5"
          />
          {doc && (
            <PreviewWrapper
              Component={Prospectus}
              previewData={getPreviewData()}
            />
          )}
        </div>
      </div>

      {/* Popups */}
      <ConfirmationPopup
        isOpen={showSavePopup}
        onClose={() => setShowSavePopup(false)}
        onConfirm={handleSave}
        title="Save Changes?"
        message="Save all changes to this prospectus? This will update the data permanently."
        confirmText="Save Changes"
        confirmStyle="bg-blue-600 hover:bg-blue-700"
      />

      <ConfirmationPopup
        isOpen={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
        onConfirm={handleCancel}
        title="Discard Changes?"
        message="Discard all unsaved changes? This cannot be undone and all your edits will be lost."
        confirmText="Discard Changes"
        confirmStyle="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default ProspectusDataManager;

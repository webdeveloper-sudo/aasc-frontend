import React, { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "../../../utils/axiosInstance";
import AASCBeats from "@/pages/aasc-beats/AASCBeats";
import PreviewWrapper from "@/admin/PreviewWrapper";
import ImageUploadManager from "../../components/ImageUploadManager";
import Heading from "@/components/reusable/Heading";
import ScrollDownToPreview from "../../components/ScrollDownToPreview";
import {
  AlertCircle,
  X,
  Trash2,
  Plus,
  ArrowLeft,
  Edit2,
  Image as ImageIcon,
} from "lucide-react";
import InputModal from "../../components/InputModal";

/* ================= TYPES ================= */
interface Entry {
  title: string;
  images: string[];
}

interface MonthSection {
  sectiontitle: string;
  entries: Entry[];
}

interface AASCBeatsDoc {
  _id?: string;
  data: Record<string, MonthSection>; // month -> MonthSection
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
const AascBeatsDataManager: React.FC = () => {
  const { toast } = useToast();
  const [doc, setDoc] = useState<AASCBeatsDoc | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tempFiles, setTempFiles] = useState<string[]>([]);

  // Navigation states
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<number | null>(null);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

  // Popups
  const [showDeleteMonthPopup, setShowDeleteMonthPopup] = useState(false);
  const [deleteMonth, setDeleteMonth] = useState<string>("");
  const [showDeleteEntryPopup, setShowDeleteEntryPopup] = useState(false);
  const [deleteEntryIndex, setDeleteEntryIndex] = useState<number | null>(null);
  const [showDeleteImagePopup, setShowDeleteImagePopup] = useState(false);
  const [deleteImageIndex, setDeleteImageIndex] = useState<number | null>(null);
  const [showAddImagePopup, setShowAddImagePopup] = useState(false);
  const [pendingNewImage, setPendingNewImage] = useState<string>("");
  const [showReplaceImagePopup, setShowReplaceImagePopup] = useState(false);
  const [replaceImageIndex, setReplaceImageIndex] = useState<number | null>(
    null
  );
  const [pendingReplaceImage, setPendingReplaceImage] = useState<string>("");

  // Input Modals
  const [showAddMonthModal, setShowAddMonthModal] = useState(false);
  const [showAddEntryModal, setShowAddEntryModal] = useState(false);

  const sessionIdRef = useRef<string>("");

  const collectionName = "aasc-beats/aascbeatsdata";

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

  /* ================= FETCH DATA ================= */
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(`/${collectionName}`);
      const item = Array.isArray(res.data) ? res.data[0] : res.data;

      setDoc({
        _id: item._id,
        data: item.data || {},
      });
    } catch (e: any) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UTILITY - PROCESS TEMP FILES ================= */
  const processTempFiles = async (images: string[]): Promise<string[]> => {
    let finalImages = [...images];
    const processedTempFiles: string[] = [];

    for (const fileName of tempFiles) {
      try {
        const res = await axiosInstance.post("/upload/save-temp-file", {
          fileName,
        });
        const finalUrl = res.data.url;
        const tempIndex = finalImages.findIndex((img) => img === fileName);
        if (tempIndex !== -1) {
          finalImages[tempIndex] = finalUrl;
        }
        processedTempFiles.push(fileName);
      } catch (err) {
        console.error("Failed to save temp file:", fileName, err);
      }
    }

    const remainingTempFiles = tempFiles.filter(
      (f) => !processedTempFiles.includes(f)
    );
    setTempFiles(remainingTempFiles);
    if (remainingTempFiles.length === 0) {
      sessionStorage.removeItem("tempFiles");
    } else {
      sessionStorage.setItem("tempFiles", JSON.stringify(remainingTempFiles));
    }

    return finalImages;
  };

  /* ================= PREVIEW DATA CONSTRUCTION ================= */
  const getPreviewData = () => {
    if (!doc) return undefined;
    return doc.data;
  };

  /* ================= MONTH OPERATIONS ================= */
  const addMonth = () => {
    setShowAddMonthModal(true);
  };

  const confirmAddMonth = async (monthName: string) => {
    setShowAddMonthModal(false);
    const month = monthName.toLowerCase();

    if (doc?.data[month]) {
      setError(`Month ${monthName} already exists`);
      return;
    }

    if (!doc) return;

    const updated = {
      ...doc,
      data: {
        ...doc.data,
        [month]: {
          sectiontitle: `${
            monthName.charAt(0).toUpperCase() + monthName.slice(1)
          } 2025`,
          entries: [],
        },
      },
    };

    await saveDoc(updated);
    toast({
      title: "Success",
      description: "Month added successfully!",
    });
  };

  const handleDeleteMonth = (month: string) => {
    setDeleteMonth(month);
    setShowDeleteMonthPopup(true);
  };

  const confirmDeleteMonth = async () => {
    if (!doc || !deleteMonth) return;

    setShowDeleteMonthPopup(false);
    const updated = { ...doc };
    delete updated.data[deleteMonth];

    setSelectedMonth(null);
    setDeleteMonth("");
    toast({
      title: "Success",
      description: "Month deleted successfully!",
    });
  };

  /* ================= ENTRY OPERATIONS ================= */
  const handleEditMonth = (month: string) => {
    setSelectedMonth(month);
    setSelectedEntry(null);
    setEditingEntry(null);
    setError("");
  };

  const addEntry = () => {
    if (!doc || !selectedMonth) return;
    setShowAddEntryModal(true);
  };

  const confirmAddEntry = async (title: string) => {
    setShowAddEntryModal(false);
    if (!doc || !selectedMonth) return;

    const updated = {
      ...doc,
      data: {
        ...doc.data,
        [selectedMonth]: {
          ...doc.data[selectedMonth],
          entries: [...doc.data[selectedMonth].entries, { title, images: [] }],
        },
      },
    };

    await saveDoc(updated);
    toast({
      title: "Success",
      description: "Entry added successfully!",
    });
  };

  const handleEditEntry = (entryIndex: number) => {
    if (!doc || !selectedMonth) return;
    setSelectedEntry(entryIndex);
    setEditingEntry({ ...doc.data[selectedMonth].entries[entryIndex] });
  };

  const goBackToMonth = async () => {
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
    setSelectedEntry(null);
    setEditingEntry(null);
  };

  const goBackToMonths = async () => {
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
    setSelectedMonth(null);
    setSelectedEntry(null);
    setEditingEntry(null);
  };

  const requestDeleteEntry = (entryIndex: number) => {
    setDeleteEntryIndex(entryIndex);
    setShowDeleteEntryPopup(true);
  };

  const confirmDeleteEntry = async () => {
    if (deleteEntryIndex === null || !doc || !selectedMonth) return;

    setShowDeleteEntryPopup(false);

    const updated = {
      ...doc,
      data: {
        ...doc.data,
        [selectedMonth]: {
          ...doc.data[selectedMonth],
          entries: doc.data[selectedMonth].entries.filter(
            (_, i) => i !== deleteEntryIndex
          ),
        },
      },
    };

    await saveDoc(updated);
    setDeleteEntryIndex(null);

    setEditingEntry(null);

    toast({
      title: "Success",
      description: "Entry deleted successfully!",
    });
  };

  const updateEntryTitle = async (newTitle: string) => {
    if (!doc || !selectedMonth || selectedEntry === null || !editingEntry)
      return;

    const updated = {
      ...doc,
      data: {
        ...doc.data,
        [selectedMonth]: {
          ...doc.data[selectedMonth],
          entries: doc.data[selectedMonth].entries.map((entry, i) =>
            i === selectedEntry ? { ...entry, title: newTitle } : entry
          ),
        },
      },
    };

    await saveDoc(updated);
    setEditingEntry({ ...editingEntry, title: newTitle });
  };

  /* ================= IMAGE OPERATIONS ================= */
  const confirmAddImage = (image: string) => {
    setPendingNewImage(image);
    setShowAddImagePopup(true);
  };

  const handleAddImageConfirm = async () => {
    setShowAddImagePopup(false);
    if (
      !doc ||
      !selectedMonth ||
      selectedEntry === null ||
      !pendingNewImage ||
      !editingEntry
    )
      return;

    const imagesWithNew = [...editingEntry.images, pendingNewImage];
    const finalImages = await processTempFiles(imagesWithNew);

    const updated = {
      ...doc,
      data: {
        ...doc.data,
        [selectedMonth]: {
          ...doc.data[selectedMonth],
          entries: doc.data[selectedMonth].entries.map((entry, i) =>
            i === selectedEntry ? { ...entry, images: finalImages } : entry
          ),
        },
      },
    };

    await saveDoc(updated);
    setDoc(updated);
    setEditingEntry({ ...editingEntry, images: finalImages });
    setPendingNewImage("");
    toast({
      title: "Success",
      description: "Image added successfully!",
    });
  };

  const confirmReplaceImage = (index: number, image: string) => {
    setReplaceImageIndex(index);
    setPendingReplaceImage(image);
    setShowReplaceImagePopup(true);
  };

  const handleReplaceImageConfirm = async () => {
    setShowReplaceImagePopup(false);
    if (
      !doc ||
      !selectedMonth ||
      selectedEntry === null ||
      replaceImageIndex === null ||
      !pendingReplaceImage ||
      !editingEntry
    )
      return;

    const imagesWithReplace = [...editingEntry.images];
    imagesWithReplace[replaceImageIndex] = pendingReplaceImage;
    const finalImages = await processTempFiles(imagesWithReplace);

    const updated = {
      ...doc,
      data: {
        ...doc.data,
        [selectedMonth]: {
          ...doc.data[selectedMonth],
          entries: doc.data[selectedMonth].entries.map((entry, i) =>
            i === selectedEntry ? { ...entry, images: finalImages } : entry
          ),
        },
      },
    };

    await saveDoc(updated);
    setDoc(updated);
    setEditingEntry({ ...editingEntry, images: finalImages });
    setReplaceImageIndex(null);
    setPendingReplaceImage("");
    toast({
      title: "Success",
      description: "Image replaced successfully!",
    });
  };

  const requestDeleteImage = (index: number) => {
    setDeleteImageIndex(index);
    setShowDeleteImagePopup(true);
  };

  const confirmDeleteImage = async () => {
    if (
      deleteImageIndex === null ||
      !doc ||
      !selectedMonth ||
      selectedEntry === null ||
      !editingEntry
    )
      return;

    setShowDeleteImagePopup(false);

    // Get the image to delete
    const imageToDelete = editingEntry.images[deleteImageIndex];

    const imagesWithoutDeleted = editingEntry.images.filter(
      (_, i) => i !== deleteImageIndex
    );
    const finalImages = await processTempFiles(imagesWithoutDeleted);

    const updated = {
      ...doc,
      data: {
        ...doc.data,
        [selectedMonth]: {
          ...doc.data[selectedMonth],
          entries: doc.data[selectedMonth].entries.map((entry, i) =>
            i === selectedEntry ? { ...entry, images: finalImages } : entry
          ),
        },
      },
    };

    await saveDoc(updated);
    setDoc(updated);
    setEditingEntry({ ...editingEntry, images: finalImages });

    // Delete from server if it's a saved file (not a temp file)
    if (imageToDelete && !tempFiles.includes(imageToDelete)) {
      try {
        await axiosInstance.post("/upload/delete-file", {
          fileUrl: imageToDelete,
        });
      } catch (deleteErr) {
        console.error("Failed to delete file from server:", deleteErr);
        // Continue anyway - DB update succeeded
      }
    }

    setDeleteImageIndex(null);
    toast({
      title: "Success",
      description: "Image deleted successfully!",
    });
  };

  /* ================= SAVE DOCUMENT ================= */
  const saveDoc = async (updated: AASCBeatsDoc) => {
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

  /* ================= RENDERERS ================= */
  const renderMonthCard = (month: string) => {
    const monthData = doc?.data[month];
    if (!monthData) return null;

    const entryCount = monthData.entries.length;
    const imageCount = monthData.entries.reduce(
      (sum, entry) => sum + entry.images.length,
      0
    );

    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4 gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div>
              <h4 className="font-semibold text-lg">
                {monthData.sectiontitle}
              </h4>
              <p className="text-sm text-gray-600">
                {entryCount} entries, {imageCount} images
              </p>
            </div>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <button
              className="btn btn-primary px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2"
              onClick={() => handleEditMonth(month)}
              disabled={!!selectedMonth || loading}
            >
              <Edit2 size={16} />
              Edit
            </button>
            <button
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              onClick={() => handleDeleteMonth(month)}
              disabled={!!selectedMonth || loading}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderEntryCard = (entry: Entry, index: number) => (
    <div className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4 gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div>
            <h4 className="font-semibold text-lg">{entry.title}</h4>
            <p className="text-sm text-gray-600">
              {entry.images.length} images
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-shrink-0">
          <button
            className="btn btn-primary px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2"
            onClick={() => handleEditEntry(index)}
            disabled={selectedEntry !== null || loading}
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button
            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            onClick={() => requestDeleteEntry(index)}
            disabled={selectedEntry !== null || loading}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );

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
                <p className="text-sm font-medium text-red-500">
                  Invalid Image
                </p>
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

  if (loading && !doc) {
    return <div className="text-center py-8">Loading...</div>;
  }

  /* ================= MAIN LIST VIEW - MONTHS ================= */
  if (!selectedMonth) {
    return (
      <div className="collection-manager p-6 min-h-screen mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="form-container border border-gray-300 rounded-lg p-6 bg-white mb-8">
          <Heading title="AASC Beats Management" size="lg" align="left" />

          <div className="flex justify-end mb-6">
            <button
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50"
              onClick={addMonth}
              disabled={loading}
            >
              <Plus size={20} />
              Add Month
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doc &&
              Object.keys(doc.data)
                .sort((a, b) => {
                  const months = [
                    "january",
                    "february",
                    "march",
                    "april",
                    "may",
                    "june",
                    "july",
                    "august",
                    "september",
                    "october",
                    "november",
                    "december",
                  ];
                  return months.indexOf(b) - months.indexOf(a);
                })
                .map((month) => renderMonthCard(month))}
          </div>

          {(!doc || Object.keys(doc.data).length === 0) && (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No months yet</p>
              <p className="text-sm">Add a month to get started</p>
            </div>
          )}
        </div>

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
              Component={AASCBeats}
              previewData={getPreviewData()}
            />
          )}
        </div>

        <ConfirmationPopup
          isOpen={showDeleteMonthPopup}
          onClose={() => setShowDeleteMonthPopup(false)}
          onConfirm={confirmDeleteMonth}
          title="Delete Month?"
          message={`Are you sure you want to delete all entries and images for ${deleteMonth}? This cannot be undone.`}
          confirmText="Delete Month"
          confirmStyle="bg-red-600 hover:bg-red-700"
        />

        <InputModal
          isOpen={showAddMonthModal}
          onClose={() => setShowAddMonthModal(false)}
          onConfirm={confirmAddMonth}
          title="Add New Month"
          message="Enter the month name for AASC Beats"
          placeholder="e.g., January"
          defaultValue=""
          confirmText="Add Month"
        />
      </div>
    );
  }

  /* ================= MONTH VIEW - ENTRIES LIST ================= */
  if (selectedMonth && selectedEntry === null) {
    const monthData = doc?.data[selectedMonth];

    return (
      <div className="p-6 min-h-screen">
        <div className="mx-auto">
          <button
            onClick={goBackToMonths}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            disabled={loading}
          >
            <ArrowLeft size={20} />
            Back to Months
          </button>

          <div className="border border-gray-300 rounded-lg p-6 bg-white mb-8">
            <Heading
              title={`${monthData?.sectiontitle} - Entries`}
              size="lg"
              align="left"
            />

            <div className="flex justify-end mb-6 pt-6 border-t border-gray-200">
              <button
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50"
                onClick={addEntry}
                disabled={loading}
              >
                <Plus size={20} />
                Add Entry
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {monthData?.entries.map((entry, idx) =>
                renderEntryCard(entry, idx)
              )}
            </div>

            {(!monthData?.entries || monthData.entries.length === 0) && (
              <div className="text-center py-12 text-gray-500">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No entries yet</p>
                <p className="text-sm">Add an entry to get started</p>
              </div>
            )}
          </div>

          <ScrollDownToPreview />

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
                Component={AASCBeats}
                previewData={getPreviewData()}
              />
            )}
          </div>
        </div>

        <ConfirmationPopup
          isOpen={showDeleteEntryPopup}
          onClose={() => {
            setShowDeleteEntryPopup(false);
            setDeleteEntryIndex(null);
          }}
          onConfirm={confirmDeleteEntry}
          title="Delete Entry?"
          message="Are you sure you want to delete this entry and all its images? This cannot be undone."
          confirmText="Delete Entry"
          confirmStyle="bg-red-600 hover:bg-red-700"
        />

        <InputModal
          isOpen={showAddEntryModal}
          onClose={() => setShowAddEntryModal(false)}
          onConfirm={confirmAddEntry}
          title="Add New Entry"
          message="Enter the entry title"
          placeholder="e.g., Star Performers"
          defaultValue=""
          confirmText="Add Entry"
        />
      </div>
    );
  }

  /* ================= ENTRY EDIT VIEW ================= */
  return (
    <div className="p-6 min-h-screen">
      <div className="mx-auto">
        <button
          onClick={goBackToMonth}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          disabled={loading}
        >
          <ArrowLeft size={20} />
          Back to Entries
        </button>

        <div className="border border-gray-300 rounded-lg p-6 bg-white mb-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entry Title
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={editingEntry?.title || ""}
              onChange={(e) => updateEntryTitle(e.target.value)}
              placeholder="Entry Title"
            />
          </div>

          <Heading title="Images" size="md" align="left" />

          <div className="flex justify-between items-center mb-8 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ImageIcon size={16} />
              {editingEntry?.images.length || 0} images
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {/* Existing Images */}
          {editingEntry?.images && editingEntry.images.length > 0 && (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Existing Images
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {editingEntry.images.map((img, idx) => (
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

        <ScrollDownToPreview />

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
              Component={AASCBeats}
              previewData={getPreviewData()}
            />
          )}
        </div>
      </div>

      {/* Popups */}
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

      <ConfirmationPopup
        isOpen={showAddImagePopup}
        onClose={() => {
          setShowAddImagePopup(false);
          setPendingNewImage("");
        }}
        onConfirm={handleAddImageConfirm}
        title="Add New Image?"
        message="Add this image to the entry? Once saved, it cannot be replaced - only deleted."
        confirmText="Add Image"
        confirmStyle="bg-green-600 hover:bg-green-700"
      />
    </div>
  );
};

export default AascBeatsDataManager;

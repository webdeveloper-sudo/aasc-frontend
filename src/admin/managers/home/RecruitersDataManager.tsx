import React, { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "../../../utils/axiosInstance";
import Heading from "@/components/reusable/Heading";
import ImageUploadManager from "../../components/ImageUploadManager";
import ScrollDownToPreview from "../../components/ScrollDownToPreview";
import { AlertCircle, X, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import PreviewWrapper from "@/admin/PreviewWrapper";
import OurRecruiters from "@/components/OurRecruiters";

/* ================= TYPES ================= */
interface RecruitersData {
  _id?: string;
  data: {
    title: string;
    logos: string[];
  };
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
            {showCancel && (
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
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

/* ================= READ-ONLY IMAGE CARD ================= */
const ExistingLogoCard: React.FC<{
  logo: string;
  index: number;
  onDelete: (index: number) => void;
}> = ({ logo, index, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  // Helper to resolve image URL (SAME AS CAROUSEL)
  const resolveImageUrl = (img: string) => {
    if (!img) return "";
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    if (!img.includes("/assets/images/")) {
      return `${import.meta.env.VITE_API_URL}/assets/images/temp/${img}`;
    }
    return img;
  };

  const imageUrl = resolveImageUrl(logo);

  return (
    <div className="relative border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow group">
      {/* Delete Button (SAME AS CAROUSEL) */}
      <button
        onClick={() => onDelete(index)}
        className="absolute top-3 right-3 z-20 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
        title="Delete Logo"
      >
        <Trash2 size={16} />
      </button>

      {/* Logo Preview (SAME AS CAROUSEL - aspect-video) */}
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
        {imageError || !imageUrl ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <ImageIcon size={48} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-red-500">Invalid Logo</p>
              <p className="text-xs text-gray-400 mt-1">Failed to load</p>
            </div>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={`Logo ${index + 1}`}
            className="w-full h-full object-contain"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* Logo Info (SAME AS CAROUSEL) */}
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700">Logo {index + 1}</p>
        <p className="text-xs text-gray-500 mt-1 truncate" title={logo}>
          {logo.includes("/") ? logo.split("/").pop() : logo}
        </p>
      </div>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */
const RecruitersDataManager: React.FC = () => {
  const { toast } = useToast();
  const [doc, setDoc] = useState<RecruitersData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tempFiles, setTempFiles] = useState<string[]>([]);

  // popups (SAME AS CAROUSEL)
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [pendingNewLogo, setPendingNewLogo] = useState<string>("");

  const sessionIdRef = useRef<string>("");
  const collectionName = "home/recruitersdata";

  /* ================= INIT ================= */
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

  /* ================= FETCH ================= */
  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(`/${collectionName}`);
      const item = Array.isArray(res.data) ? res.data[0] : res.data;
      setDoc(item);
    } catch (e: any) {
      setError(e.message || "Failed to load recruiters data");
    } finally {
      setLoading(false);
    }
  };

  /* ================= TEMP FILE PROCESS ================= */
  const processTempFiles = async (logos: string[]): Promise<string[]> => {
    let finalLogos = [...logos];
    const processed: string[] = [];

    for (const fileName of tempFiles) {
      try {
        const res = await axiosInstance.post("/upload/save-temp-file", {
          fileName,
        });
        const finalUrl = res.data.url;
        const idx = finalLogos.findIndex((i) => i === fileName);
        if (idx !== -1) finalLogos[idx] = finalUrl;
        processed.push(fileName);
      } catch (err) {
        console.error("Temp save failed:", fileName, err);
      }
    }

    const remaining = tempFiles.filter((f) => !processed.includes(f));
    setTempFiles(remaining);
    if (remaining.length === 0) sessionStorage.removeItem("tempFiles");
    else sessionStorage.setItem("tempFiles", JSON.stringify(remaining));

    return finalLogos;
  };

  /* ================= SAVE ================= */
  const saveLogos = async (updatedData: any) => {
    if (!doc?._id) return;
    try {
      await axiosInstance.put(`/${collectionName}/${doc._id}`, {
        data: updatedData,
      });
      setDoc({ ...doc, data: updatedData });
    } catch (err: any) {
      setError("Save failed: " + err.message);
      throw err;
    }
  };

  /* ================= DELETE LOGO ================= */
  const requestDeleteLogo = (index: number) => {
    setDeleteIndex(index);
    setShowDeletePopup(true);
  };

  const confirmDeleteLogo = async () => {
    if (deleteIndex === null || !doc) return;
    setShowDeletePopup(false);
    setLoading(true);

    try {
      // Get the logo to delete
      const logoToDelete = doc.data.logos[deleteIndex];

      // Filter out the deleted logo
      const filtered = doc.data.logos.filter((_, i) => i !== deleteIndex);
      const finalLogos = await processTempFiles(filtered);

      // Save to database
      await saveLogos({ ...doc.data, logos: finalLogos });

      // Delete from server if it's a saved file (not a temp file)
      if (logoToDelete && !tempFiles.includes(logoToDelete)) {
        try {
          await axiosInstance.post("/upload/delete-file", {
            fileUrl: logoToDelete,
          });
        } catch (deleteErr) {
          console.error("Failed to delete file from server:", deleteErr);
          // Continue anyway - DB update succeeded
        }
      }

      toast({
        title: "Success",
        description: "Recruiter logo deleted successfully!",
      });
      setError("");
    } catch (err: any) {
      setError("Failed to delete logo: " + err.message);
      toast({
        title: "Error",
        description: "Failed to delete logo: " + err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setDeleteIndex(null);
    }
  };

  /* ================= ADD LOGO ================= */
  const confirmAddLogo = (img: string) => {
    setPendingNewLogo(img);
    setShowAddPopup(true);
  };

  const handleAddLogoConfirm = async () => {
    setShowAddPopup(false);
    if (!doc || !pendingNewLogo) return;
    setLoading(true);

    try {
      const withNew = [...doc.data.logos, pendingNewLogo];
      const finalLogos = await processTempFiles(withNew);
      await saveLogos({ ...doc.data, logos: finalLogos });
      setError("");
      toast({
        title: "Success",
        description: "Recruiter logo added successfully!",
      });
    } catch (err: any) {
      setError("Failed to add logo: " + err.message);
      toast({
        title: "Error",
        description: "Failed to add logo: " + err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setPendingNewLogo("");
    }
  };

  if (loading && !doc)
    return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="collection-manager p-6 min-h-screen mx-auto">
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="border border-gray-300 rounded-lg p-6 bg-white mb-8">
        <Heading title="Recruiters Logos Management" size="lg" align="left" />

        <div className="flex items-center justify-between mb-6 pt-4 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ImageIcon size={16} />
            <span className="font-medium">
              {doc?.data.logos.length || 0} logos
            </span>
          </div>
          <a href="#addnew" className="green-btn">
            + Add New Logo
          </a>
        </div>

        {/* EXISTING LOGOS GRID (EXACT SAME AS CAROUSEL) */}
        {doc?.data.logos && doc.data.logos.length > 0 && (
          <>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Existing Logos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {doc.data.logos.map((logo, idx) => (
                <ExistingLogoCard
                  key={idx}
                  logo={logo}
                  index={idx}
                  onDelete={requestDeleteLogo}
                />
              ))}
            </div>
          </>
        )}

        {/* ADD NEW LOGO SECTION (EXACT SAME AS CAROUSEL) */}
        <div id="addnew" className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Add New Logo
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
                onChange={confirmAddLogo}
              />
              <p className="text-sm text-gray-500 mt-3 group-hover:text-gray-700 transition-colors">
                Upload a new recruiter logo
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Once saved, logos cannot be replaced
              </p>
            </div>
          </div>
        </div>
      </div>

      <ScrollDownToPreview />

      <div className="py-4 mt-10 border border-gray-300 rounded-2xl p-8 bg-white max-w-7xl mx-auto">
        <Heading title="Live Preview" size="lg" align="left" className="mt-5" />
        <PreviewWrapper Component={OurRecruiters} previewData={doc?.data} />
      </div>

      {/* POPUPS (EXACT SAME AS CAROUSEL) */}
      <ConfirmationPopup
        isOpen={showDeletePopup}
        onClose={() => {
          setShowDeletePopup(false);
          setDeleteIndex(null);
        }}
        onConfirm={confirmDeleteLogo}
        title="Delete Logo Permanently?"
        message="Are you sure you want to delete this logo? This will remove it from the database and server. This action cannot be undone."
        confirmText="Delete Permanently"
        confirmStyle="bg-red-600 hover:bg-red-700"
      />

      <ConfirmationPopup
        isOpen={showAddPopup}
        onClose={() => {
          setShowAddPopup(false);
          setPendingNewLogo("");
        }}
        onConfirm={handleAddLogoConfirm}
        title="Add New Logo?"
        message="Add this logo to the recruiters section? Once saved, it cannot be replaced - only deleted."
        confirmText="Add Logo"
        confirmStyle="bg-green-600 hover:bg-green-700"
      />
    </div>
  );
};

export default RecruitersDataManager;

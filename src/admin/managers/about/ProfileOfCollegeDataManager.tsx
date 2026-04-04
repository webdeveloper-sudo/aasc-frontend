import React, { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "../../../utils/axiosInstance";
import ProfileOfCollege from "@/pages/about/ProfileOfCollege";
import PreviewWrapper from "@/admin/PreviewWrapper";
import ImageUploadManager from "../../components/ImageUploadManager";
import Heading from "@/components/reusable/Heading";
import { ChevronsDown, AlertCircle, X, Trash2Icon } from "lucide-react";
import ScrollDownToPreview from "../../components/ScrollDownToPreview";

interface DetailItem {
  label: string;
  value: string;
}

interface DetailSection {
  title: string;
  icon: string;
  items: DetailItem[];
}

interface ProfileOfCollegeData {
  _id?: string;
  data: {
    banner: {
      title: string;
      image: string;
    };
    header: {
      logo: string;
      title: string;
      description: string;
    };
    details: DetailSection[];
  };
}

// Confirmation Popup Component (unchanged)
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
        className="absolute inset-0 bg-black/60 bg-opacity-10 transition-opacity"
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
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

const ProfileOfCollegeDataManager: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<ProfileOfCollegeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [editItem, setEditItem] = useState<ProfileOfCollegeData | null>(null);
  const [originalItem, setOriginalItem] = useState<ProfileOfCollegeData | null>(
    null
  );
  const [isNew, setIsNew] = useState(false);
  const [tempFiles, setTempFiles] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track changes per section
  const [headerChanged, setHeaderChanged] = useState(false);
  const [detailSectionsChanged, setDetailSectionsChanged] = useState<boolean[]>(
    []
  );

  // Popup states
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>("");

  const isSavingRef = useRef(false);
  const sessionId = useRef(
    `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );

  const maxChars = 1000;

  const collectionName = "about/profileofcollegedata";

  useEffect(() => {
    sessionStorage.setItem("adminSessionId", sessionId.current);
    const stored = sessionStorage.getItem("tempFiles");
    if (stored) {
      setTempFiles(JSON.parse(stored));
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0 && !editItem) {
      const firstItem = JSON.parse(JSON.stringify(data[0]));
      setEditItem(firstItem);
      setOriginalItem(JSON.parse(JSON.stringify(data[0])));
      setIsNew(false);
      setIsEditing(true);
      setDetailSectionsChanged(
        new Array(firstItem.data.details?.length || 0).fill(false)
      );
    }
  }, [data, editItem]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (tempFiles.length > 0 && !isSavingRef.current) {
        const formData = new FormData();
        formData.append("files", JSON.stringify(tempFiles));
        formData.append("sessionId", sessionId.current);
        navigator.sendBeacon(
          `${import.meta.env.VITE_API_URL}/api/upload/remove-temp`,
          formData
        );
        sessionStorage.removeItem("tempFiles");
        sessionStorage.removeItem("adminSessionId");
      }
    };

    const cleanupOnRouteChange = async () => {
      if (tempFiles.length > 0 && !isSavingRef.current) {
        try {
          await axiosInstance.post("/upload/remove-temp", {
            files: tempFiles,
            sessionId: sessionId.current,
          });
          sessionStorage.removeItem("tempFiles");
        } catch (err) {
          console.error("Route change cleanup failed:", err);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (tempFiles.length > 0 && !isSavingRef.current) {
        cleanupOnRouteChange();
      }
    };
  }, [tempFiles]);

  const addTempFile = (fileName: string) => {
    setTempFiles((prev) => {
      const updated = [...prev, fileName];
      sessionStorage.setItem("tempFiles", JSON.stringify(updated));
      return updated;
    });
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(`/${collectionName}`);
      setData(Array.isArray(res.data) ? res.data : [res.data]);
      console.log("Data loaded:", res);
    } catch (e: any) {
      setError("Failed to load data: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = useCallback(() => {
    if (!editItem || !originalItem) return false;
    return JSON.stringify(editItem) !== JSON.stringify(originalItem);
  }, [editItem, originalItem]);

  useEffect(() => {
    setHasUnsavedChanges(hasChanges());
  }, [editItem, hasChanges]);

  // Check if header section changed
  const checkHeaderChanged = useCallback(() => {
    if (!editItem || !originalItem) return false;
    return (
      JSON.stringify(editItem.data.header) !==
      JSON.stringify(originalItem.data.header)
    );
  }, [editItem, originalItem]);

  // Check if specific detail section changed
  const checkDetailSectionChanged = useCallback(
    (index: number) => {
      if (!editItem || !originalItem) return false;
      return (
        JSON.stringify(editItem.data.details[index]) !==
        JSON.stringify(originalItem.data.details[index])
      );
    },
    [editItem, originalItem]
  );

  useEffect(() => {
    setHeaderChanged(checkHeaderChanged());
    if (editItem && originalItem) {
      const changedSections =
        editItem.data.details?.map((_, idx) =>
          checkDetailSectionChanged(idx)
        ) || [];
      setDetailSectionsChanged(changedSections);
    }
  }, [editItem, originalItem, checkHeaderChanged, checkDetailSectionChanged]);

  const handleSectionSave = async (section: string) => {
    setShowSavePopup(true);
    setCurrentSection(section);
  };

  const handleOverallSave = () => {
    setShowSavePopup(true);
    setCurrentSection("overall");
  };

  const handleSave = async () => {
    if (!editItem) return;

    setShowSavePopup(false);
    isSavingRef.current = true;
    setLoading(true);

    try {
      for (const fileName of tempFiles) {
        const res = await axiosInstance.post("/upload/save-temp-file", {
          fileName,
        });
        const finalUrl = res.data.url;

        if (editItem.data.banner.image === fileName) {
          editItem.data.banner.image = finalUrl;
        }
        if (editItem.data.header.logo === fileName) {
          editItem.data.header.logo = finalUrl;
        }
      }

      if (isNew) {
        await axiosInstance.post(`/${collectionName}`, editItem);
      } else if (editItem._id) {
        await axiosInstance.put(`/${collectionName}/${editItem._id}`, editItem);
      }

      setTempFiles([]);
      sessionStorage.removeItem("tempFiles");
      setIsEditing(true);
      setOriginalItem(JSON.parse(JSON.stringify(editItem)));
      setHeaderChanged(false);
      setDetailSectionsChanged(
        new Array(editItem.data.details?.length || 0).fill(false)
      );
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      fetchData();
    } catch (err: any) {
      setError("Error saving: " + err.message);
      toast({
        title: "Error",
        description: "Save failed: " + err.message,
        variant: "destructive",
      });
    } finally {
      isSavingRef.current = false;
      setLoading(false);
      setCurrentSection("");
    }
  };

  const handleSectionCancel = (section: string) => {
    setShowCancelPopup(true);
    setCurrentSection(section);
  };

  const handleOverallCancel = () => {
    setShowCancelPopup(true);
    setCurrentSection("overall");
  };

  const handleCancel = async () => {
    setShowCancelPopup(false);

    try {
      if (tempFiles.length > 0) {
        await axiosInstance.post("/upload/remove-temp", {
          files: tempFiles,
          sessionId: sessionId.current,
        });
      }

      setTempFiles([]);
      sessionStorage.removeItem("tempFiles");

      if (originalItem) {
        setEditItem(JSON.parse(JSON.stringify(originalItem)));
        setHeaderChanged(false);
        setDetailSectionsChanged(
          new Array(originalItem.data.details?.length || 0).fill(false)
        );
      }
      setIsEditing(true);
    } catch (err: any) {
      console.error("Cancel cleanup failed:", err);
      if (originalItem) {
        setEditItem(JSON.parse(JSON.stringify(originalItem)));
        setHeaderChanged(false);
        setDetailSectionsChanged(
          new Array(originalItem.data.details?.length || 0).fill(false)
        );
      }
      setIsEditing(true);
    } finally {
      setCurrentSection("");
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

  const addDetailSection = () => {
    if (!editItem) return;
    const updated = { ...editItem };
    if (!updated.data.details) updated.data.details = [];
    updated.data.details.push({ title: "", icon: "", items: [] });
    setEditItem(updated);
  };

  const deleteDetailSection = (index: number) => {
    if (!editItem) return;
    const updated = { ...editItem };
    updated.data.details = updated.data.details.filter((_, i) => i !== index);
    setEditItem(updated);
  };

  const updateDetailSection = (index: number, field: string, value: any) => {
    if (!editItem) return;
    const updated = { ...editItem };
    (updated.data.details[index] as any)[field] = value;
    setEditItem(updated);
  };

  const addDetailItem = (sectionIndex: number) => {
    if (!editItem) return;
    const updated = { ...editItem };
    if (!updated.data.details[sectionIndex].items) {
      updated.data.details[sectionIndex].items = [];
    }
    updated.data.details[sectionIndex].items.push({ label: "", value: "" });
    setEditItem(updated);
  };

  const deleteDetailItem = (sectionIndex: number, itemIndex: number) => {
    if (!editItem) return;
    const updated = { ...editItem };
    updated.data.details[sectionIndex].items = updated.data.details[
      sectionIndex
    ].items.filter((_, i) => i !== itemIndex);
    setEditItem(updated);
  };

  const updateDetailItem = (
    sectionIndex: number,
    itemIndex: number,
    field: string,
    value: string
  ) => {
    if (!editItem) return;
    const updated = { ...editItem };
    (updated.data.details[sectionIndex].items[itemIndex] as any)[field] = value;
    setEditItem(updated);
  };

  const renderForm = () => {
    if (!editItem) return null;

    return (
      <div style={{ gap: "2rem", position: "relative" }}>
        {hasUnsavedChanges && <ScrollDownToPreview />}

        <style>{`
          @keyframes pulse-custom {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          .animate-pulse-custom {
            animation: pulse-custom 2s infinite;
          }
        `}</style>

        <div className="form-container border border-gray-300 rounded-lg p-6 bg-white">
          <Heading
            title={isNew ? "Create New" : "Edit Profile of College"}
            size="lg"
            align="left"
          />

          {/* Header Section */}
          <div className="mb-4 p-4 bg-gray-50 rounded-lg mt-6">
            <div className="mb-4">
              <label className="form-label block text-sm font-medium mb-2">
                Header Title
              </label>
              <input
                type="text"
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editItem.data.header.title}
                onChange={(e) =>
                  updateField("data.header.title", e.target.value)
                }
              />
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <strong className="text-sm">Description</strong>
              </div>

              <div className="mb-4 ">
                <div className="relative">
                  <textarea
                    className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                    rows={4}
                    value={editItem.data.header.description || ""}
                    maxLength={maxChars}
                    onChange={(e) =>
                      updateField("data.header.description", e.target.value)
                    }
                  />

                  <span
                    className={`absolute bottom-2 right-3 text-xs ${
                      (editItem.data.header.description?.length || 0) >=
                      maxChars
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {editItem.data.header.description?.length || 0} / {maxChars}
                  </span>
                </div>
              </div>
            </div>

            <ImageUploadManager
              label="Header Image"
              value={editItem.data.header.logo}
              onChange={(v) => updateField("data.header.logo", v)}
              addTemp={addTempFile}
            />

            {headerChanged && (
              <div className="mt-4 pt-4 border-t border-gray-200 flex gap-4">
                <button
                  className="btn btn-primary px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleSectionSave("header")}
                  disabled={loading}
                >
                  {loading && currentSection === "header"
                    ? "Saving..."
                    : "Save Changes"}
                </button>
                <button
                  className="btn px-6 py-2.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleSectionCancel("header")}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Details Sections */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg scale-in">
            <div className="grid grid-cols-2 gap-4 ">
              {editItem.data.details?.map((section, sIndex) => (
                <div
                  key={sIndex}
                  className="mb-6 p-4 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-3">
                    <strong className="text-sm">Section {sIndex + 1}</strong>
                  </div>

                  <div className=" mb-3">
                    <div>
                      <label className="form-label block text-xs font-medium mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={section.title}
                        onChange={(e) =>
                          updateDetailSection(sIndex, "title", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <strong className="text-xs text-gray-600">
                        Items ({section.items?.length || 0})
                      </strong>
                      <button
                        className="btn px-2 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors text-xs"
                        onClick={() => addDetailItem(sIndex)}
                      >
                        + Add Item
                      </button>
                    </div>

                    {section.items?.map((item, iIndex) => (
                      <div
                        key={iIndex}
                        className="flex gap-2 mb-2 items-center"
                      >
                        <input
                          type="text"
                          placeholder="Label"
                          className="form-input flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm"
                          value={item.label}
                          onChange={(e) =>
                            updateDetailItem(
                              sIndex,
                              iIndex,
                              "label",
                              e.target.value
                            )
                          }
                        />
                        <input
                          type="text"
                          placeholder="Value"
                          className="form-input flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm"
                          value={item.value}
                          onChange={(e) =>
                            updateDetailItem(
                              sIndex,
                              iIndex,
                              "value",
                              e.target.value
                            )
                          }
                        />
                        <button
                          className="btn p-1 text-red-500 hover:text-red-700"
                          onClick={() => deleteDetailItem(sIndex, iIndex)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Detail Section Save/Cancel Buttons */}
                  {detailSectionsChanged[sIndex] && (
                    <div className="mt-4 pt-4 border-t border-gray-200 flex gap-4">
                      <button
                        className="btn btn-primary px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleSectionSave(`detail-${sIndex}`)}
                        disabled={loading}
                      >
                        {loading && currentSection === `detail-${sIndex}`
                          ? "Saving..."
                          : "Save Changes"}
                      </button>
                      <button
                        className="btn px-6 py-2.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleSectionCancel(`detail-${sIndex}`)}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2 p-6 rounded-xl">
            <div className="mt-2 pt-6 border-t border-gray-200 flex gap-4">
              <button
                className="btn btn-primary px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleOverallSave}
                disabled={loading || !hasUnsavedChanges}
              >
                {loading ? "Saving..." : "Save All Changes"}
              </button>

              <button
                className="btn px-6 py-2.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleOverallCancel}
                disabled={loading || !hasUnsavedChanges}
              >
                Cancel All Changes
              </button>
            </div>
          </div>
        </div>

        <div className="py-4 mt-10 border border-gray-300 rounded-2xl p-8 bg-white">
          <Heading
            title="Live Preview"
            size="lg"
            align="left"
            className="mt-5"
          />
          <PreviewWrapper
            Component={ProfileOfCollege}
            previewData={editItem.data}
          />
        </div>
      </div>
    );
  };

  if (loading && !editItem) {
    return <div className="text-center py-8">Loading…</div>;
  }

  return (
    <div className="collection-manager p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {renderForm()}

      {/* Save Confirmation Popup */}
      <ConfirmationPopup
        isOpen={showSavePopup}
        onClose={() => {
          setShowSavePopup(false);
          setCurrentSection("");
        }}
        onConfirm={handleSave}
        title="Save Changes?"
        message={
          currentSection === "overall"
            ? "Save all changes across all sections? This will update the entire Profile of College data."
            : "Are you sure you want to save these changes? This will update the Profile of College data permanently."
        }
        confirmText={
          currentSection === "overall" ? "Save All Changes" : "Save Changes"
        }
        confirmStyle="bg-blue-600 hover:bg-blue-700"
        showCancel={true}
      />

      {/* Cancel Confirmation Popup */}
      <ConfirmationPopup
        isOpen={showCancelPopup}
        onClose={() => {
          setShowCancelPopup(false);
          setCurrentSection("");
        }}
        onConfirm={handleCancel}
        title="Discard Changes?"
        message={
          currentSection === "overall"
            ? "Discard ALL unsaved changes across every section? This cannot be undone."
            : "Are you sure you want to discard all unsaved changes? This action cannot be undone and all your edits will be lost."
        }
        confirmText={
          currentSection === "overall"
            ? "Discard All Changes"
            : "Discard Changes"
        }
        confirmStyle="bg-red-600 hover:bg-red-700"
        showCancel={true}
      />
    </div>
  );
};

export default ProfileOfCollegeDataManager;

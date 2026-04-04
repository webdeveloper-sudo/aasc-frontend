import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import Heading from "@/components/reusable/Heading";
import ImageUploadManager from "../../components/ImageUploadManager";
import DocumentUploadManager from "../../components/DocumentUploadManager";
import TopHeaderBar from "@/components/common/Header/TopHeadBar";
import PreviewWrapper from "@/admin/PreviewWrapper";
import { AlertCircle, X, Trash2Icon } from "lucide-react";
import ScrollDownToPreview from "../../components/ScrollDownToPreview";

interface CertificationItem {
  id: string;
  label: string;
  file: string;
  type: "text" | "img";
  img?: string;
  imgAlt?: string;
  rounded?: boolean;
}

interface TopHeaderData {
  _id?: string;
  data: CertificationItem[];
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
      <style>{`@keyframes scale-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } } .animate-scale-in { animation: scale-in 0.2s ease-out; }`}</style>
    </div>
  );
};

const TopHeaderDataManager: React.FC = () => {
  const [data, setData] = useState<TopHeaderData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editItem, setEditItem] = useState<TopHeaderData | null>(null);
  const [originalItem, setOriginalItem] = useState<TopHeaderData | null>(null);
  const [tempFiles, setTempFiles] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);

  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  const sessionId = React.useRef(
    `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  const collectionName = "home/topheaderdata";

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

  const handleSave = async () => {
    if (!editItem) return;
    setShowSavePopup(false);
    setLoading(true);

    try {
      for (const fileName of tempFiles) {
        // Check if it's a document (PDF) or image
        const isDocument =
          fileName.toLowerCase().endsWith(".pdf") ||
          fileName.toLowerCase().endsWith(".doc") ||
          fileName.toLowerCase().endsWith(".docx");

        const endpoint = isDocument
          ? "/upload/document/save-temp-document"
          : "/upload/save-temp-file";

        const res = await axiosInstance.post(endpoint, {
          fileName,
        });
        const finalUrl = res.data.url;

        editItem.data = editItem.data.map((item) => ({
          ...item,
          img: item.img === fileName ? finalUrl : item.img,
          file: item.file === fileName ? finalUrl : item.file,
        }));
      }

      if (editItem._id) {
        await axiosInstance.put(`/${collectionName}/${editItem._id}`, editItem);
      }

      setTempFiles([]);
      sessionStorage.removeItem("tempFiles");
      setOriginalItem(JSON.parse(JSON.stringify(editItem)));
      setShowNewForm(false);
      fetchData();
    } catch (err: any) {
      setError("Error saving: " + err.message);
    } finally {
      setLoading(false);
    }
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
      }
      setShowNewForm(false);
    } catch (err: any) {
      console.error("Cancel cleanup failed:", err);
    }
  };

  // NEW FORM STATE AND FUNCTIONS
  const [newCert, setNewCert] = useState<CertificationItem>({
    id: `new-${Date.now()}`,
    label: "",
    file: "",
    type: "text",
  });

  const addCertification = () => {
    setShowNewForm(true);
  };

  const saveNewCertification = () => {
    if (!editItem || !newCert.label || !newCert.file) return;

    const updated = JSON.parse(JSON.stringify(editItem));
    // ADD AT TOP (unshift)
    updated.data.unshift(newCert);
    setEditItem(updated);
    setShowNewForm(false);
    setNewCert({
      id: `new-${Date.now()}`,
      label: "",
      file: "",
      type: "text",
    });
  };

  const cancelNewCertification = () => {
    setShowNewForm(false);
    setNewCert({
      id: `new-${Date.now()}`,
      label: "",
      file: "",
      type: "text",
    });
  };

  const updateNewCert = (field: keyof CertificationItem, value: any) => {
    setNewCert((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateCertification = (
    index: number,
    field: keyof CertificationItem,
    value: any
  ) => {
    if (!editItem) return;
    const updated = JSON.parse(JSON.stringify(editItem));
    (updated.data[index] as any)[field] = value;
    setEditItem(updated);
  };

  const deleteCertification = (index: number) => {
    if (!editItem) return;
    const updated = JSON.parse(JSON.stringify(editItem));
    updated.data = updated.data.filter((_, i) => i !== index);
    setEditItem(updated);
  };

  const renderForm = () => {
    if (!editItem) return null;

    return (
      <div style={{ gap: "2rem", position: "relative" }}>
        {hasUnsavedChanges && <ScrollDownToPreview />}

        <div className="form-container border border-gray-300 rounded-lg p-6 bg-white">
          <Heading
            title="Edit Top Header Certifications"
            size="lg"
            align="left"
          />

          <div className="mb-6 p-4 bg-gray-50 rounded-lg mt-6">
            <div className="flex justify-between items-center mb-4">
              <strong>Documents ({editItem.data.length})</strong>
              <button className="green-btn" onClick={addCertification}>
                + Add Certification
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* ✅ NEW FORM AT TOP */}
              {showNewForm && (
                <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <div className="flex justify-between mb-3">
                    <strong className="text-sm font-semibold text-blue-800">
                      New Certification ✨
                    </strong>
                    <button
                      className="trash-btn text-blue-600 hover:text-blue-800"
                      onClick={cancelNewCertification}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="mb-3">
                    <label className="form-label block text-xs font-medium mb-1 text-blue-800">
                      Label
                    </label>
                    <input
                      type="text"
                      className="form-input w-full px-3 py-2 border rounded-md border-blue-300"
                      value={newCert.label}
                      onChange={(e) => updateNewCert("label", e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label block text-xs font-medium mb-1 text-blue-800">
                      PDF File Path
                    </label>
                    <input
                      type="text"
                      className="form-input w-full px-3 py-2 border rounded-md border-blue-300"
                      value={newCert.file}
                      onChange={(e) => updateNewCert("file", e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label block text-xs font-medium mb-1 text-blue-800">
                      Type
                    </label>
                    <select
                      className="form-input w-full px-3 py-2 border rounded-md border-blue-300"
                      value={newCert.type}
                      onChange={(e) =>
                        updateNewCert("type", e.target.value as "text" | "img")
                      }
                    >
                      <option value="text">Text Badge</option>
                      <option value="img">Image Logo</option>
                    </select>
                  </div>

                  {newCert.type === "img" && (
                    <>
                      <ImageUploadManager
                        label="Logo Image"
                        value={newCert.img || ""}
                        onChange={(v) => updateNewCert("img", v)}
                        addTemp={addTempFile}
                      />
                      <div className="mt-3">
                        <label className="form-label block text-xs font-medium mb-1 text-blue-800">
                          Image Alt Text
                        </label>
                        <input
                          type="text"
                          className="form-input w-full px-3 py-2 border rounded-md border-blue-300"
                          value={newCert.imgAlt || ""}
                          onChange={(e) =>
                            updateNewCert("imgAlt", e.target.value)
                          }
                        />
                      </div>
                      <div className="mt-3 flex items-center">
                        <input
                          type="checkbox"
                          id="new-rounded"
                          checked={newCert.rounded || false}
                          onChange={(e) =>
                            updateNewCert("rounded", e.target.checked)
                          }
                          className="mr-2"
                        />
                        <label
                          htmlFor="new-rounded"
                          className="text-sm text-blue-800"
                        >
                          Rounded Image
                        </label>
                      </div>
                    </>
                  )}

                  <div className="mt-4 pt-3 border-t border-blue-200 flex gap-3">
                    <button
                      className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                      onClick={saveNewCertification}
                      disabled={!newCert.label || !newCert.file}
                    >
                      Add Certification
                    </button>
                    <button
                      className="flex-1 px-3 py-1.5 bg-gray-300 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-400"
                      onClick={cancelNewCertification}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* ✅ EXISTING ITEMS (unchanged) */}
              {editItem.data.map((cert, index) => (
                <div
                  key={cert.id}
                  className="mb-4 p-4 bg-white rounded border border-gray-200"
                >
                  <div className="flex justify-between mb-3">
                    <strong className="text-sm">
                      {cert.label || `Certification ${index + 1}`}
                    </strong>
                    <button
                      className="trash-btn"
                      onClick={() => deleteCertification(index)}
                    >
                      <Trash2Icon size={16} />
                    </button>
                  </div>

                  <div className="mb-3">
                    <label className="form-label block text-xs font-medium mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      className="form-input w-full px-3 py-2 border rounded-md"
                      value={cert.label}
                      onChange={(e) =>
                        updateCertification(index, "label", e.target.value)
                      }
                    />
                  </div>

                  <DocumentUploadManager
                    label="PDF Document"
                    value={cert.file || ""}
                    onChange={(v) => updateCertification(index, "file", v)}
                    addTemp={addTempFile}
                  />

                  <div className="mb-3">
                    <label className="form-label block text-xs font-medium mb-1">
                      Type
                    </label>
                    <select
                      className="form-input w-full px-3 py-2 border rounded-md"
                      value={cert.type}
                      onChange={(e) =>
                        updateCertification(
                          index,
                          "type",
                          e.target.value as "text" | "img"
                        )
                      }
                    >
                      <option value="text">Text Badge</option>
                      <option value="img">Image Logo</option>
                    </select>
                  </div>

                  {cert.type === "img" && (
                    <>
                      <ImageUploadManager
                        label="Logo Image"
                        value={cert.img || ""}
                        onChange={(v) => updateCertification(index, "img", v)}
                        addTemp={addTempFile}
                      />

                      <div className="mt-3">
                        <label className="form-label block text-xs font-medium mb-1">
                          Image Alt Text
                        </label>
                        <input
                          type="text"
                          className="form-input w-full px-3 py-2 border rounded-md"
                          value={cert.imgAlt || ""}
                          onChange={(e) =>
                            updateCertification(index, "imgAlt", e.target.value)
                          }
                        />
                      </div>

                      <div className="mt-3 flex items-center">
                        <input
                          type="checkbox"
                          id={`rounded-${index}`}
                          checked={cert.rounded || false}
                          onChange={(e) =>
                            updateCertification(
                              index,
                              "rounded",
                              e.target.checked
                            )
                          }
                          className="mr-2"
                        />
                        <label htmlFor={`rounded-${index}`} className="text-sm">
                          Rounded Image
                        </label>
                      </div>
                    </>
                  )}
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
          <PreviewWrapper
            Component={TopHeaderBar}
            previewData={editItem.data}
          />
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
        message="Save all certification changes? This will update the top header on the live site."
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

export default TopHeaderDataManager;

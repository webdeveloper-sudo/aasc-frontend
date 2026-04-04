import React, { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "../../../utils/axiosInstance";
import OurTeamFacultyProfile from "@/components/faculty/OurTeamFacultyProfile";
import PreviewWrapper from "@/admin/PreviewWrapper";
import ImageUploadManager from "../../components/ImageUploadManager";
import Heading from "@/components/reusable/Heading";
import { ChevronsDown, AlertCircle, X, Trash2, Plus } from "lucide-react";
import ScrollDownToPreview from "../../components/ScrollDownToPreview";
import GoverningBodyCouncil from "@/pages/about/GoverningBodyCouncil";

interface GoverningBodyMember {
  _id?: string;
  id: number;
  image: string;
  name: string;
  department: string;
  designation: string;
  phone: string;
  email: string;
}

// Confirmation Popup Component
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

const GoverningBodyCouncilDataManager: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<GoverningBodyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tempFiles, setTempFiles] = useState<string[]>([]);

  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editItems, setEditItems] = useState<
    Record<string, GoverningBodyMember>
  >({});
  const [originalItems, setOriginalItems] = useState<
    Record<string, GoverningBodyMember>
  >({});

  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState<GoverningBodyMember>({
    id: Date.now(),
    image: "",
    name: "",
    department: "",
    designation: "",
    phone: "",
    email: "",
  });

  const isSavingRef = useRef(false);
  const sessionId = useRef(
    `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );

  const collectionName = "about/governingbodycouncildata";

  useEffect(() => {
    sessionStorage.setItem("adminSessionId", sessionId.current);
    const stored = sessionStorage.getItem("tempFiles");
    if (stored) {
      setTempFiles(JSON.parse(stored));
    }
    fetchData();
  }, []);

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
    } catch (e: any) {
      setError("Failed to load data: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const hasChangesForMember = useCallback(
    (memberId: string) => {
      const editItem = editItems[memberId];
      const originalItem = originalItems[memberId];
      return (
        editItem &&
        originalItem &&
        JSON.stringify(editItem) !== JSON.stringify(originalItem)
      );
    },
    [editItems, originalItems]
  );

  const handleEdit = (member: GoverningBodyMember) => {
    setEditingMemberId(member._id || null);
    setEditItems((prev) => ({
      ...prev,
      [member._id || ""]: JSON.parse(JSON.stringify(member)),
    }));
    setOriginalItems((prev) => ({
      ...prev,
      [member._id || ""]: JSON.parse(JSON.stringify(member)),
    }));
  };

  const handleSave = async () => {
    if (!editingMemberId) return;

    setShowSavePopup(false);
    isSavingRef.current = true;
    setLoading(true);

    try {
      const editItem = editItems[editingMemberId];
      if (editItem && editItem._id) {
        for (const fileName of tempFiles) {
          const res = await axiosInstance.post("/upload/save-temp-file", {
            fileName,
          });
          const finalUrl = res.data.url;
          if (editItem.image === fileName) {
            editItem.image = finalUrl;
          }
        }

        await axiosInstance.put(`/${collectionName}/${editItem._id}`, editItem);
      }

      setTempFiles([]);
      sessionStorage.removeItem("tempFiles");
      setEditingMemberId(null);
      setEditItems({});
      setOriginalItems({});
      toast({
        title: "Success",
        description: "Member updated successfully",
      });
      fetchData();
    } catch (err: any) {
      setError("Error saving: " + err.message);
      toast({
        title: "Error",
        description: "Error saving: " + err.message,
        variant: "destructive",
      });
    } finally {
      isSavingRef.current = false;
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
      setEditingMemberId(null);
      setEditItems({});
      setOriginalItems({});
    } catch (err: any) {
      console.error("Cancel cleanup failed:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteItemId) return;

    setShowDeletePopup(false);

    try {
      await axiosInstance.delete(`/${collectionName}/${deleteItemId}`);
      toast({
        title: "Success",
        description: "Member deleted successfully",
      });
      fetchData();
    } catch (err: any) {
      setError("Error deleting: " + err.message);
      toast({
        title: "Error",
        description: "Error deleting: " + err.message,
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
    }
  };

  const updateField = (field: keyof GoverningBodyMember, value: any) => {
    if (!editingMemberId) return;
    setEditItems((prev) => ({
      ...prev,
      [editingMemberId]: {
        ...prev[editingMemberId],
        [field]: value,
      },
    }));
  };

  const handleAddMember = async () => {
    if (!newMember.name.trim() || !newMember.designation.trim()) {
      setError("Please fill in at least Name and Designation");
      return;
    }

    try {
      setLoading(true);

      // Create WITHOUT id field (database handles _id)
      const memberToSave = {
        image: newMember.image || "",
        name: newMember.name.trim(),
        department: newMember.department.trim(),
        designation: newMember.designation.trim(),
        phone: newMember.phone.trim(),
        email: newMember.email.trim(),
      };

      // 1. Save to DB first to get _id
      const response = await axiosInstance.post(
        `/${collectionName}`,
        memberToSave
      );
      const createdMemberId = response.data._id || response.data.id;

      // 2. Process image temp files if any
      let finalImageUrl = memberToSave.image;
      if (newMember.image && tempFiles.length > 0) {
        const relevantTempFiles = tempFiles.filter(
          (file) => file === newMember.image
        );

        for (const fileName of relevantTempFiles) {
          const res = await axiosInstance.post("/upload/save-temp-file", {
            fileName,
          });
          finalImageUrl = res.data.url;
        }
      }

      // 3. Update with final image URL if changed
      if (finalImageUrl !== memberToSave.image) {
        await axiosInstance.put(`/${collectionName}/${createdMemberId}`, {
          ...memberToSave,
          image: finalImageUrl,
        });
      }

      // 4. Cleanup
      setTempFiles([]);
      sessionStorage.removeItem("tempFiles");

      setNewMember({
        _id: undefined,
        id: Date.now(),
        image: "",
        name: "",
        department: "",
        designation: "",
        phone: "",
        email: "",
      });
      setShowAddForm(false);
      setError("");

      await fetchData();
      toast({
        title: "Success",
        description: "Member added successfully",
      });
    } catch (err: any) {
      console.error("Add member error:", err);
      setError(
        "Error adding member: " + (err.response?.data?.message || err.message)
      );
      toast({
        title: "Error",
        description:
          "Error adding member: " +
          (err.response?.data?.message || err.message),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderMemberCard = (member: GoverningBodyMember, index: number) => {
    const isEditing = editingMemberId === member._id;
    const hasUnsavedChanges = hasChangesForMember(member._id || "");

    if (isEditing) {
      return (
        <div
          key={member._id || member.id}
          className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-300"
        >
          <div className="mb-6">
            <h4 className="font-semibold text-lg mb-3">
              Edit {editItems[member._id || ""]?.name || ""} Details
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label block text-sm font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={editItems[member._id || ""]?.name || ""}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>

              <div>
                <label className="form-label block text-sm font-medium mb-2">
                  Designation *
                </label>
                <input
                  type="text"
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={editItems[member._id || ""]?.designation || ""}
                  onChange={(e) => updateField("designation", e.target.value)}
                />
              </div>

              <div>
                <label className="form-label block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={editItems[member._id || ""]?.email || ""}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>

              <div>
                <label className="form-label block text-sm font-medium mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={editItems[member._id || ""]?.phone || ""}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="form-label block text-sm font-medium mb-2">
                  Department
                </label>
                <textarea
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                  rows={3}
                  value={editItems[member._id || ""]?.department || ""}
                  onChange={(e) => updateField("department", e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4">
              <ImageUploadManager
                label="Profile Image"
                value={editItems[member._id || ""]?.image || ""}
                onChange={(v) => updateField("image", v)}
                addTemp={addTempFile}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              className="btn btn-primary px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setShowSavePopup(true)}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              className="btn px-6 py-2.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setShowCancelPopup(true)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        key={member._id || member.id}
        className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start mb-4 gap-4">
          <div className="flex items-center gap-3 flex-1">
            <img
              src={member.image || "https://via.placeholder.com/80"}
              className="w-20 h-20 rounded-full object-cover flex-shrink-0 border-2 border-gray-200"
              alt={member.name}
            />
            <div>
              <h4 className="font-semibold text-lg">{member.name}</h4>
              <p className="text-sm text-gray-600">{member.designation}</p>
              {member.department && (
                <p className="text-xs text-gray-500 mt-1">
                  {member.department}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <button
              className="btn btn-primary px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              onClick={() => handleEdit(member)}
            >
              Edit
            </button>
            <button
              className="btn p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              onClick={() => {
                setDeleteItemId(member._id || null);
                setShowDeletePopup(true);
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading && data.length === 0) {
    return <div className="text-center py-8">Loading…</div>;
  }

  return (
    <div className="collection-manager p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="form-container border border-gray-300 rounded-lg p-6 bg-white">
        <Heading
          title="Governing Body Council Members"
          size="lg"
          align="left"
        />

        <div className="flex justify-end mb-6">
          <button
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm hover:shadow-md"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={20} />
            {showAddForm ? "Close Form" : "Add Member"}
          </button>
        </div>

        {showAddForm && (
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
            <h3 className="text-lg font-semibold mb-4">Add New Member</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label block text-sm font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newMember.name}
                  onChange={(e) =>
                    setNewMember({ ...newMember, name: e.target.value })
                  }
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="form-label block text-sm font-medium mb-2">
                  Designation *
                </label>
                <input
                  type="text"
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newMember.designation}
                  onChange={(e) =>
                    setNewMember({ ...newMember, designation: e.target.value })
                  }
                  placeholder="Enter designation"
                />
              </div>

              <div>
                <label className="form-label block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newMember.email}
                  onChange={(e) =>
                    setNewMember({ ...newMember, email: e.target.value })
                  }
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="form-label block text-sm font-medium mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newMember.phone}
                  onChange={(e) =>
                    setNewMember({ ...newMember, phone: e.target.value })
                  }
                  placeholder="+91 94422 44168"
                />
              </div>

              <div className="md:col-span-2">
                <label className="form-label block text-sm font-medium mb-2">
                  Department
                </label>
                <textarea
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                  rows={3}
                  value={newMember.department}
                  onChange={(e) =>
                    setNewMember({ ...newMember, department: e.target.value })
                  }
                  placeholder="Enter department details"
                />
              </div>
            </div>

            <div className="mt-4">
              <ImageUploadManager
                label="Profile Image"
                value={newMember.image}
                onChange={(v) => setNewMember({ ...newMember, image: v })}
                addTemp={addTempFile}
              />
            </div>

            <div className="mt-6 pt-6 border-t border-blue-200 flex gap-3 justify-end">
              <button
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddMember}
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Member"}
              </button>
              <button
                className="px-6 py-2.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                onClick={() => {
                  setShowAddForm(false);
                  setNewMember({
                    id: Date.now(),
                    image: "",
                    name: "",
                    department: "",
                    designation: "",
                    phone: "",
                    email: "",
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((member, index) => renderMemberCard(member, index))}
        </div>

        {data.length === 0 && !showAddForm && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No members found</p>
            <p className="text-sm">
              Click "Add Member" to create your first member
            </p>
          </div>
        )}

        {editingMemberId && <ScrollDownToPreview />}

        <div className="py-4 mt-10 border border-gray-300 rounded-2xl p-8 bg-white">
          <Heading
            title="Live Preview"
            size="lg"
            align="left"
            className="mt-5"
          />
          {editingMemberId && editItems[editingMemberId] ? (
            <PreviewWrapper
              Component={GoverningBodyCouncil}
              previewData={data.map((member) =>
                member._id === editingMemberId
                  ? editItems[editingMemberId]
                  : member
              )}
            />
          ) : data[0] ? (
            <PreviewWrapper
              Component={GoverningBodyCouncil}
              previewData={data} // 🔥 FIXED: Pass FULL array, not data[0]
            />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No preview available
            </div>
          )}
        </div>
      </div>

      <ConfirmationPopup
        isOpen={showSavePopup}
        onClose={() => setShowSavePopup(false)}
        onConfirm={handleSave}
        title="Save Changes?"
        message="Are you sure you want to save these changes?"
        confirmText="Save Changes"
        confirmStyle="bg-blue-600 hover:bg-blue-700"
        showCancel={true}
      />

      <ConfirmationPopup
        isOpen={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
        onConfirm={handleCancel}
        title="Discard Changes?"
        message="Are you sure you want to discard all unsaved changes?"
        confirmText="Discard Changes"
        confirmStyle="bg-red-600 hover:bg-red-700"
        showCancel={true}
      />

      <ConfirmationPopup
        isOpen={showDeletePopup}
        onClose={() => {
          setShowDeletePopup(false);
          setDeleteItemId(null);
        }}
        onConfirm={handleDelete}
        title="Delete Member?"
        message="Are you sure you want to delete this member? This action cannot be undone."
        confirmText="Delete"
        confirmStyle="bg-red-600 hover:bg-red-700"
        showCancel={true}
      />
    </div>
  );
};

export default GoverningBodyCouncilDataManager;

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "../../../utils/axiosInstance";
import OurTeam from "@/pages/about/our-team/OurTeam";
import PreviewWrapper from "@/admin/PreviewWrapper";
import ImageUploadManager from "../../components/ImageUploadManager";
import Heading from "@/components/reusable/Heading";
import { AlertCircle, X, Trash2, Plus, Edit2 } from "lucide-react";
import ScrollDownToPreview from "../../components/ScrollDownToPreview";

// Types
interface TeamMember {
  name: string;
  designation: string;
  email: string;
  department?: string;
  image?: string;
  phone?: string;
}

interface OurTeamData {
  _id?: string;
  data: {
    faculty: TeamMember[];
    administrative: TeamMember[];
    media: TeamMember[];
  };
}

// Confirmation Popup Component (Reused from GoverningBodyCouncilDataManager)
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

const OurTeamDataManager: React.FC = () => {
  const { toast } = useToast();
  // Main Data State
  // We store the full document here.
  const [fullData, setFullData] = useState<OurTeamData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tempFiles, setTempFiles] = useState<string[]>([]);

  // Editing State
  // editingId format: "category-index" (e.g., "faculty-0")
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMember, setEditMember] = useState<TeamMember | null>(null);

  // New Member State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemberCategory, setNewMemberCategory] = useState<
    "faculty" | "administrative" | "media"
  >("faculty");
  const [newMember, setNewMember] = useState<TeamMember>({
    name: "",
    designation: "",
    email: "",
    department: "",
    phone: "",
    image: "",
  });

  // Popups
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const isSavingRef = useRef(false);
  const sessionId = useRef(
    `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );

  const collectionName = "about/ourteamdata";

  // Init & Cleanup
  useEffect(() => {
    sessionStorage.setItem("adminSessionId", sessionId.current);
    const stored = sessionStorage.getItem("tempFiles");
    if (stored) setTempFiles(JSON.parse(stored));
    fetchData();
  }, []);

  useEffect(() => {
    // Standard cleanup pattern
    const handleBeforeUnload = () => {
      if (tempFiles.length > 0 && !isSavingRef.current) {
        const formData = new FormData();
        formData.append("files", JSON.stringify(tempFiles));
        formData.append("sessionId", sessionId.current);
        navigator.sendBeacon(
          `${import.meta.env.VITE_API_URL}/api/upload/remove-temp`,
          formData
        );
        sessionStorage.removeItem("tempFiles");
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
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
      let data = Array.isArray(res.data) ? res.data[0] : res.data;

      // Ensure structure exists
      if (!data) {
        data = { data: { faculty: [], administrative: [], media: [] } };
      }
      if (!data.data) {
        data.data = { faculty: [], administrative: [], media: [] };
      }

      setFullData(data);
    } catch (e: any) {
      setError("Failed to load data: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------------
  // Logic Helpers
  // ------------------------------------------------------------------

  const getMemberById = (
    id: string,
    sourceData: OurTeamData | null
  ): TeamMember | null => {
    if (!sourceData) return null;
    const [category, indexStr] = id.split("-");
    const index = parseInt(indexStr, 10);
    const cat = category as keyof typeof sourceData.data;
    return sourceData.data[cat]?.[index] || null;
  };

  const hasChanges = () => {
    if (!editingId || !editMember || !fullData) return false;
    const original = getMemberById(editingId, fullData);
    return JSON.stringify(editMember) !== JSON.stringify(original);
  };

  // ------------------------------------------------------------------
  // CRUD Actions
  // ------------------------------------------------------------------

  const handleEdit = (category: string, index: number, member: TeamMember) => {
    setEditingId(`${category}-${index}`);
    setEditMember(JSON.parse(JSON.stringify(member))); // Deep copy
  };

  const handleSave = async () => {
    if (!editingId || !editMember || !fullData) return;

    setShowSavePopup(false);
    isSavingRef.current = true;
    setLoading(true);

    try {
      // 1. Process Images
      let finalMember = { ...editMember };
      if (tempFiles.length > 0) {
        // If image is in tempFiles, make it permanent
        // Note: We blindly process all temp files.
        // If editMember.image matches one, we update it.
        for (const fileName of tempFiles) {
          const res = await axiosInstance.post("/upload/save-temp-file", {
            fileName,
          });
          if (finalMember.image === fileName) {
            finalMember.image = res.data.url;
          }
        }
      }

      // 2. Update Local State
      const [category, indexStr] = editingId.split("-");
      const index = parseInt(indexStr, 10);
      const cat = category as keyof typeof fullData.data;

      const newData = JSON.parse(JSON.stringify(fullData));
      newData.data[cat][index] = finalMember;

      // 3. Save to DB
      if (newData._id) {
        await axiosInstance.put(`/${collectionName}/${newData._id}`, newData);
      } else {
        const res = await axiosInstance.post(`/${collectionName}`, newData);
        newData._id = res.data._id || res.data.id;
      }

      // 4. Cleanup
      setTempFiles([]);
      sessionStorage.removeItem("tempFiles");
      setEditingId(null);
      setEditMember(null);
      setFullData(newData); // Optimistic update or fetch
      toast({
        title: "Success",
        description: "Member updated successfully",
      });
      fetchData(); // Safety fetch
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
      setEditingId(null);
      setEditMember(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !fullData) return;
    setShowDeletePopup(false);

    try {
      const [category, indexStr] = deleteId.split("-");
      const index = parseInt(indexStr, 10);
      const cat = category as keyof typeof fullData.data;

      const newData = JSON.parse(JSON.stringify(fullData));
      newData.data[cat].splice(index, 1);

      if (newData._id) {
        await axiosInstance.put(`/${collectionName}/${newData._id}`, newData);
      }

      setFullData(newData);
      setDeleteId(null);
      // If we deleted the item being edited (unlikely UI flow but possible via bugs), clear edit
      if (editingId === deleteId) {
        setEditingId(null);
        setEditMember(null);
      }
      fetchData();
      toast({
        title: "Success",
        description: "Member deleted successfully",
      });
    } catch (err: any) {
      setError("Error deleting: " + err.message);
      toast({
        title: "Error",
        description: "Error deleting: " + err.message,
        variant: "destructive",
      });
    }
  };

  const handleAddMember = async () => {
    if (!newMember.name.trim() || !newMember.designation.trim()) {
      setError("Please fill in at least Name and Designation");
      return;
    }

    setLoading(true);
    try {
      // 1. Process Image
      let finalImage = newMember.image;
      if (tempFiles.length > 0 && newMember.image) {
        const relevant = tempFiles.filter((f) => f === newMember.image);
        for (const fileName of relevant) {
          const res = await axiosInstance.post("/upload/save-temp-file", {
            fileName,
          });
          finalImage = res.data.url;
        }
      }

      const memberToAdd = { ...newMember, image: finalImage };

      // 2. Update DB
      const newData = fullData
        ? JSON.parse(JSON.stringify(fullData))
        : { data: { faculty: [], administrative: [], media: [] } };

      const cat = newMemberCategory as keyof typeof newData.data;
      newData.data[cat].push(memberToAdd);

      if (newData._id) {
        await axiosInstance.put(`/${collectionName}/${newData._id}`, newData);
      } else {
        await axiosInstance.post(`/${collectionName}`, newData);
      }

      setTempFiles([]);
      sessionStorage.removeItem("tempFiles");
      setNewMember({
        name: "",
        designation: "",
        email: "",
        department: "",
        phone: "",
        image: "",
      });
      setShowAddForm(false);
      fetchData();
      toast({
        title: "Success",
        description: "Member added successfully",
      });
    } catch (err: any) {
      setError("Error adding: " + err.message);
      toast({
        title: "Error",
        description: "Error adding: " + err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------------
  // Live Preview Construction
  // ------------------------------------------------------------------

  const getPreviewData = () => {
    if (!fullData) return undefined;
    if (!editingId || !editMember) return fullData.data;

    // Construct preview data with the edited member swapped in
    const [category, indexStr] = editingId.split("-");
    const index = parseInt(indexStr, 10);
    const cat = category as keyof typeof fullData.data;

    const modifiedList = [...fullData.data[cat]];
    modifiedList[index] = editMember;

    return {
      ...fullData.data,
      [cat]: modifiedList,
    };
  };

  // ------------------------------------------------------------------
  // Renderers
  // ------------------------------------------------------------------

  const renderEditForm = () => {
    if (!editMember || !editingId) return null;

    return (
      <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-300">
        <div className="mb-6">
          <h4 className="font-semibold text-lg mb-3">Edit Details</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label block text-sm font-medium mb-2">
                Name *
              </label>
              <input
                type="text"
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editMember.name}
                onChange={(e) =>
                  setEditMember({ ...editMember, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="form-label block text-sm font-medium mb-2">
                Designation *
              </label>
              <input
                type="text"
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editMember.designation}
                onChange={(e) =>
                  setEditMember({ ...editMember, designation: e.target.value })
                }
              />
            </div>

            <div>
              <label className="form-label block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editMember.email}
                onChange={(e) =>
                  setEditMember({ ...editMember, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="form-label block text-sm font-medium mb-2">
                Phone
              </label>
              <input
                type="text"
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={editMember.phone || ""}
                onChange={(e) =>
                  setEditMember({ ...editMember, phone: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="form-label block text-sm font-medium mb-2">
                Department
              </label>
              <textarea
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                rows={2}
                value={editMember.department || ""}
                onChange={(e) =>
                  setEditMember({ ...editMember, department: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-4">
            <ImageUploadManager
              label="Profile Image"
              value={editMember.image || ""}
              onChange={(v) => setEditMember({ ...editMember, image: v })}
              addTemp={addTempFile}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            className="btn btn-primary px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            onClick={() => setShowSavePopup(true)}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            className="btn px-6 py-2.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors font-medium"
            onClick={() => setShowCancelPopup(true)}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const renderCard = (member: TeamMember, category: string, index: number) => {
    const id = `${category}-${index}`;
    const isEditing = editingId === id;

    if (isEditing) {
      return (
        <div key={id} className="col-span-1 md:col-span-2">
          {renderEditForm()}
        </div>
      );
    }

    return (
      <div
        key={id}
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
              onClick={() => handleEdit(category, index, member)}
              disabled={!!editingId} // Disable other edits while one is active
            >
              <Edit2 size={16} />
              Edit
            </button>
            <button
              className="btn p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              onClick={() => {
                setDeleteId(id);
                setShowDeletePopup(true);
              }}
              disabled={!!editingId}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSection = (
    title: string,
    category: "faculty" | "administrative" | "media"
  ) => {
    if (!fullData) return null;
    const items = fullData.data[category] || [];

    return (
      <div className="mb-10">
        <div className="flex items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <span className="ml-3 px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
            {items.length}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((member, index) => renderCard(member, category, index))}
        </div>
        {items.length === 0 && (
          <p className="text-gray-500 italic text-sm">
            No members in this category.
          </p>
        )}
      </div>
    );
  };

  if (loading && !fullData) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="collection-manager p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="form-container border border-gray-300 rounded-lg p-6 bg-white">
        <Heading title="Our Team Management" size="lg" align="left" />

        <div className="flex justify-end mb-6 sticky top-10 z-10">
          <button
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm hover:shadow-md"
            onClick={() => setShowAddForm(!showAddForm)}
            disabled={!!editingId}
          >
            <Plus size={20} />
            {showAddForm ? "Close Form" : "Add Member"}
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
            <h3 className="text-lg font-semibold mb-4">Add New Member</h3>

            <div className="mb-4">
              <label className="form-label block text-sm font-medium mb-2">
                Category *
              </label>
              <select
                className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
                value={newMemberCategory}
                onChange={(e) => setNewMemberCategory(e.target.value as any)}
              >
                <option value="faculty">Faculty</option>
                <option value="administrative">Administrative</option>
                <option value="media">Media</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label block text-sm font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
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
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md resize-y"
                  rows={2}
                  value={newMember.department}
                  onChange={(e) =>
                    setNewMember({ ...newMember, department: e.target.value })
                  }
                  placeholder="Enter department"
                />
              </div>
            </div>

            <div className="mt-4">
              <ImageUploadManager
                label="Profile Image"
                value={newMember.image || ""}
                onChange={(v) => setNewMember({ ...newMember, image: v })}
                addTemp={addTempFile}
              />
            </div>

            <div className="mt-6 pt-6 border-t border-blue-200 flex gap-3 justify-end">
              <button
                className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
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
                    name: "",
                    designation: "",
                    email: "",
                    department: "",
                    phone: "",
                    image: "",
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* List of Members */}
        {renderSection("Faculty", "faculty")}
        {renderSection("Administrative Staff", "administrative")}
        {renderSection("Media Team", "media")}

        {editingId && <ScrollDownToPreview />}

        <div className="py-4 mt-10 border border-gray-300 rounded-2xl p-8 bg-white">
          <Heading
            title="Live Preview"
            size="lg"
            align="left"
            className="mt-5"
          />
          {fullData && (
            <PreviewWrapper
              Component={OurTeam}
              previewData={getPreviewData()}
            />
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
        message="Are you sure you want to discard unsaved changes?"
        confirmText="Discard Changes"
        confirmStyle="bg-red-600 hover:bg-red-700"
        showCancel={true}
      />

      <ConfirmationPopup
        isOpen={showDeletePopup}
        onClose={() => {
          setShowDeletePopup(false);
          setDeleteId(null);
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

export default OurTeamDataManager;

import React, { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import Heading from "@/components/reusable/Heading";
import ImageUploadManager from "@/admin/components/ImageUploadManager";
import {
  AlertCircle,
  X,
  Trash2,
  Plus,
  Edit2,
  ListTodo,
  Users,
} from "lucide-react";
import ScrollDownToPreview from "@/admin/components/ScrollDownToPreview";
import PreviewWrapper from "@/admin/PreviewWrapper";
import TrainingAndPlacementsCell from "@/pages/placements/TrainingAndPlacementsCell";

// Types
interface TeamMember {
  name: string;
  designation: string;
  email: string;
  department?: string;
  image?: string;
}

interface Activity {
  id: number;
  text: string;
}

interface TrainingData {
  _id?: string;
  data: {
    TrainingAndPlacementsFacultyData: TeamMember[];
    activities: Activity[];
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

const TrainingAndPlacementsDataManager: React.FC = () => {
  const [data, setData] = useState<TrainingData | null>(null);
  const [editData, setEditData] = useState<TrainingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tempFiles, setTempFiles] = useState<string[]>([]);

  // Faculty editing
  const [editingFacultyIndex, setEditingFacultyIndex] = useState<number | null>(
    null
  );
  const [showAddFacultyForm, setShowAddFacultyForm] = useState(false);

  // Popups
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showDeleteFacultyPopup, setShowDeleteFacultyPopup] = useState(false);
  const [deleteFacultyIndex, setDeleteFacultyIndex] = useState<number | null>(
    null
  );

  const sessionIdRef = useRef<string>("");
  const collectionName = "placements/trainingandplacementsdata";

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

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(`/${collectionName}`);
      let fetchedData = Array.isArray(res.data) ? res.data[0] : res.data;

      if (!fetchedData) {
        fetchedData = {
          data: { TrainingAndPlacementsFacultyData: [], activities: [] },
        };
      }
      if (!fetchedData.data) {
        fetchedData.data = {
          TrainingAndPlacementsFacultyData: [],
          activities: [],
        };
      }
      if (!fetchedData.data.TrainingAndPlacementsFacultyData) {
        fetchedData.data.TrainingAndPlacementsFacultyData = [];
      }
      if (!fetchedData.data.activities) {
        fetchedData.data.activities = [];
      }

      setData(fetchedData);
      setEditData(JSON.parse(JSON.stringify(fetchedData))); // Deep copy for editing
    } catch (e: any) {
      setError("Failed to load data: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const processTempFiles = async (): Promise<void> => {
    if (!editData || tempFiles.length === 0) return;

    const processedFiles: string[] = [];

    for (const fileName of tempFiles) {
      try {
        const res = await axiosInstance.post("/upload/save-temp-file", {
          fileName,
        });
        const finalUrl = res.data.url;

        // Update faculty images
        editData.data.TrainingAndPlacementsFacultyData.forEach((member) => {
          if (member.image === fileName) {
            member.image = finalUrl;
          }
        });

        processedFiles.push(fileName);
      } catch (err) {
        console.error("Failed to save temp file:", fileName, err);
      }
    }

    const remaining = tempFiles.filter((f) => !processedFiles.includes(f));
    setTempFiles(remaining);
    if (remaining.length === 0) sessionStorage.removeItem("tempFiles");
    else sessionStorage.setItem("tempFiles", JSON.stringify(remaining));
  };

  // Save all data (faculty + activities)
  const handleSave = async () => {
    if (!editData) return;
    setShowSavePopup(false);
    setLoading(true);

    try {
      await processTempFiles();

      if (editData._id) {
        await axiosInstance.put(`/${collectionName}/${editData._id}`, editData);
      } else {
        await axiosInstance.post(`/${collectionName}`, editData);
      }

      setData(JSON.parse(JSON.stringify(editData)));
      setEditingFacultyIndex(null);
      setShowAddFacultyForm(false);
      await fetchData();
      setError("");
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
          sessionId: sessionIdRef.current,
        });
      }
      setTempFiles([]);
      sessionStorage.removeItem("tempFiles");
    } catch (err) {
      console.error(err);
    }

    setEditingFacultyIndex(null);
    setShowAddFacultyForm(false);
    await fetchData(); // Refresh to discard changes
  };

  // Faculty Updates
  const updateFacultyField = (
    index: number,
    field: keyof TeamMember,
    value: string
  ) => {
    if (!editData) return;
    const updated = { ...editData };
    updated.data.TrainingAndPlacementsFacultyData[index] = {
      ...updated.data.TrainingAndPlacementsFacultyData[index],
      [field]: value,
    };
    setEditData(updated);
  };

  const handleDeleteFaculty = () => {
    if (!editData || deleteFacultyIndex === null) return;
    setShowDeleteFacultyPopup(false);

    const updatedFaculty =
      editData.data.TrainingAndPlacementsFacultyData.filter(
        (_, idx) => idx !== deleteFacultyIndex
      );

    setEditData({
      ...editData,
      data: {
        ...editData.data,
        TrainingAndPlacementsFacultyData: updatedFaculty,
      },
    });

    setDeleteFacultyIndex(null);
  };

  const handleAddFaculty = () => {
    if (!editData) return;

    const newFaculty: TeamMember = {
      name: "",
      designation: "",
      email: "",
      department: "",
      image: "",
    };

    setEditData({
      ...editData,
      data: {
        ...editData.data,
        TrainingAndPlacementsFacultyData: [
          ...editData.data.TrainingAndPlacementsFacultyData,
          newFaculty,
        ],
      },
    });

    setShowAddFacultyForm(false);
    setEditingFacultyIndex(
      editData.data.TrainingAndPlacementsFacultyData.length
    );
  };

  // Activity Updates
  const updateActivity = (index: number, text: string) => {
    if (!editData) return;
    const updated = { ...editData };
    updated.data.activities[index].text = text;
    setEditData(updated);
  };

  const addActivity = () => {
    if (!editData) return;
    const newId =
      editData.data.activities.length > 0
        ? Math.max(...editData.data.activities.map((a) => a.id)) + 1
        : 1;

    setEditData({
      ...editData,
      data: {
        ...editData.data,
        activities: [...editData.data.activities, { id: newId, text: "" }],
      },
    });
  };

  const deleteActivity = (index: number) => {
    if (!editData) return;
    setEditData({
      ...editData,
      data: {
        ...editData.data,
        activities: editData.data.activities.filter((_, idx) => idx !== index),
      },
    });
  };

  const renderFacultyCard = (member: TeamMember, index: number) => {
    const isEditing = editingFacultyIndex === index;

    if (isEditing) {
      return (
        <div
          key={index}
          className="col-span-1 md:col-span-2 mb-8 p-6 bg-gray-50 rounded-lg border border-gray-300"
        >
          <h4 className="font-semibold text-lg mb-4">Edit Faculty Details</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={member.name}
                onChange={(e) =>
                  updateFacultyField(index, "name", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Designation *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={member.designation}
                onChange={(e) =>
                  updateFacultyField(index, "designation", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={member.email}
                onChange={(e) =>
                  updateFacultyField(index, "email", e.target.value)
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Department
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={member.department || ""}
                onChange={(e) =>
                  updateFacultyField(index, "department", e.target.value)
                }
              />
            </div>

            <div className="md:col-span-2">
              <ImageUploadManager
                label="Profile Image"
                value={member.image || ""}
                onChange={(v) => updateFacultyField(index, "image", v)}
                addTemp={addTempFile}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => setEditingFacultyIndex(null)}
            >
              Done Editing
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        key={index}
        className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3 flex-1">
            <img
              src={member.image || "https://via.placeholder.com/80"}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              alt={member.name}
            />
            <div>
              <h4 className="font-semibold text-lg">
                {member.name || "Unnamed"}
              </h4>
              <p className="text-sm text-gray-600">
                {member.designation || "No designation"}
              </p>
              {member.department && (
                <p className="text-xs text-gray-500 mt-1">
                  {member.department}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              className="blue-btn"
              onClick={() => setEditingFacultyIndex(index)}
            >
              <Edit2 size={16} />
              Edit
            </button>
            <button
              className="p-2 px-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={() => {
                setDeleteFacultyIndex(index);
                setShowDeleteFacultyPopup(true);
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading && !editData) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="collection-manager p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="form-container border border-gray-300 rounded-lg p-6 bg-white mb-8">
        <Heading
          title="Training & Placements Management"
          size="lg"
          align="left"
        />

        {/* Faculty Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
            <div className="flex items-center gap-3">
              {/* <Users className="w-6 h-6 text-blue-600" /> */}
              <h3 className="text-xl font-bold text-gray-800">Faculty</h3>
              <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                {editData?.data.TrainingAndPlacementsFacultyData?.length || 0}
              </span>
            </div>
            <button
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={handleAddFaculty}
            >
              <Plus size={20} />
              Add Faculty
            </button>
          </div>

          {/* Faculty List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {editData?.data.TrainingAndPlacementsFacultyData?.map(
              (member, index) => renderFacultyCard(member, index)
            )}
          </div>
          {(!editData?.data.TrainingAndPlacementsFacultyData ||
            editData.data.TrainingAndPlacementsFacultyData.length === 0) && (
            <p className="text-gray-500 italic text-sm">
              No faculty members added yet.
            </p>
          )}
        </div>

        {/* Activities Section */}
        <div className="mt-12 pt-8 border-t-2 border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {/* <ListTodo className="w-6 h-6 text-green-600" /> */}
              <h3 className="text-xl font-bold text-gray-800">
                Training Activities
              </h3>
              <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                {editData?.data.activities?.length || 0}
              </span>
            </div>
            <button
              className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={addActivity}
            >
              <Plus size={20} />
              Add Activity
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {editData?.data.activities?.map((activity, index) => (
              <div
                key={activity.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-2">
                      Activity {index + 1}
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md resize-y"
                      rows={3}
                      value={activity.text}
                      onChange={(e) => updateActivity(index, e.target.value)}
                      placeholder="Enter activity description"
                    />
                  </div>
                  <button
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 mt-8"
                    onClick={() => deleteActivity(index)}
                    title="Delete Activity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {(!editData?.data.activities ||
            editData.data.activities.length === 0) && (
            <p className="text-gray-500 italic text-sm">
              No activities added yet.
            </p>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
          <button
            className="btn btn-primary px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg"
            onClick={() => setShowSavePopup(true)}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save All Changes"}
          </button>
          <button
            className="btn px-8 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 text-lg"
            onClick={() => setShowCancelPopup(true)}
            disabled={loading}
          >
            Discard Changes
          </button>
        </div>
      </div>

      {/* Live Preview Section */}
      <div className="py-4 mt-10 border border-gray-300 rounded-2xl p-8 bg-white">
        <Heading title="Live Preview" size="lg" align="left" className="mt-5" />
        <PreviewWrapper
          Component={TrainingAndPlacementsCell}
          previewData={editData?.data}
        />
      </div>

      {/* Popups */}
      <ConfirmationPopup
        isOpen={showSavePopup}
        onClose={() => setShowSavePopup(false)}
        onConfirm={handleSave}
        title="Save All Changes?"
        message="This will save all faculty and activity changes to the database."
        confirmText="Save Changes"
        confirmStyle="bg-blue-600 hover:bg-blue-700"
      />

      <ConfirmationPopup
        isOpen={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
        onConfirm={handleCancel}
        title="Discard Changes?"
        message="Are you sure you want to discard all unsaved changes? This action cannot be undone."
        confirmText="Discard"
        confirmStyle="bg-gray-600 hover:bg-gray-700"
      />

      <ConfirmationPopup
        isOpen={showDeleteFacultyPopup}
        onClose={() => {
          setShowDeleteFacultyPopup(false);
          setDeleteFacultyIndex(null);
        }}
        onConfirm={handleDeleteFaculty}
        title="Delete Faculty?"
        message="Are you sure you want to remove this faculty member? You must click 'Save All Changes' to make this permanent."
        confirmText="Delete"
        confirmStyle="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default TrainingAndPlacementsDataManager;

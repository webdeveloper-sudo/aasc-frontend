import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "../../../utils/axiosInstance";
import Heading from "@/components/reusable/Heading";
import DocumentUploadManager from "@/admin/components/DocumentUploadManager";
import InputModal from "@/admin/components/InputModal";
import {
  AlertCircle,
  X,
  Edit,
  Trash2Icon,
  Plus,
  ArrowLeft,
} from "lucide-react";
import ScrollDownToPreview from "@/admin/components/ScrollDownToPreview";
import PreviewWrapper from "@/admin/PreviewWrapper";
import Committees from "@/pages/committies/Committies";

interface Member {
  id: number;
  name: string;
  designation: string;
  email: string;
  image: string;
}

interface Circular {
  title: string;
  file: string;
}

interface Objective {
  id: number;
  text: string;
}

interface CommitteeData {
  _id: string;
  _sourceFile?: string;
  exportName?: string;
  importedAt?: { $date: string };
  data: {
    members: Member[];
    circulars: Circular[];
    objectives: Objective[];
  };
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

const CommittiesDataManager: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<CommitteeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tempFiles, setTempFiles] = useState<string[]>([]);

  // Navigation state
  const [selectedCommittee, setSelectedCommittee] =
    useState<CommitteeData | null>(null);
  const [selectedSection, setSelectedSection] = useState<
    "members" | "circulars" | "objectives" | null
  >(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Popup states
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: string;
    id?: string | number;
  } | null>(null);

  // Add new committee modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCommitteeType, setNewCommitteeType] = useState<
    "committee" | "cell" | "club"
  >("committee");

  const collectionName = "commitees__committiesdata";

  useEffect(() => {
    const sessionId = `admin_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    sessionStorage.setItem("adminSessionId", sessionId);

    const stored = sessionStorage.getItem("tempFiles");
    if (stored) setTempFiles(JSON.parse(stored));

    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(`/${collectionName}`);
      let rawData = Array.isArray(res.data) ? res.data : [res.data];

      // Filter out the first three sidebar menu items
      const realCommittees = rawData
        .slice(3)
        .filter(
          (item: any) =>
            item.data &&
            item.data.members &&
            item.data.circulars &&
            item.data.objectives
        ) as CommitteeData[];

      setData(realCommittees);
    } catch (e: any) {
      setError("Failed to load data: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to classify committee type
  const getCommitteeType = (exportName: string | undefined): string => {
    if (!exportName) return "Other";
    const name = exportName.toLowerCase();
    if (name.includes("cell")) return "Cells";
    if (name.includes("club")) return "Clubs";
    return "Committees";
  };

  // Categorize committees
  const categorizedCommittees = {
    Committees: data.filter(
      (c) => getCommitteeType(c.exportName) === "Committees"
    ),
    Cells: data.filter((c) => getCommitteeType(c.exportName) === "Cells"),
    Clubs: data.filter((c) => getCommitteeType(c.exportName) === "Clubs"),
  };

  // CRUD Operations
  const handleSaveChanges = async () => {
    if (!selectedCommittee) return;
    setShowSavePopup(false);
    setLoading(true);

    try {
      // Process temp files for circulars
      for (const fileName of tempFiles) {
        const res = await axiosInstance.post(
          "/upload/document/save-temp-document",
          {
            fileName,
          }
        );
        const finalUrl = res.data.url;

        // Update circular file paths
        selectedCommittee.data.circulars.forEach((circular) => {
          if (circular.file === fileName) {
            circular.file = finalUrl;
          }
        });
      }

      // Clear temp files
      setTempFiles([]);
      sessionStorage.removeItem("tempFiles");

      await axiosInstance.put(
        `/${collectionName}/${selectedCommittee._id}`,
        selectedCommittee
      );
      await fetchData();
      toast({
        title: "Success",
        description: "Committee saved successfully!",
      });
      setError("");
    } catch (err: any) {
      setError("Error saving: " + err.message);
      toast({
        title: "Error",
        description: "Error saving: " + err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setEditingIndex(null);
      setSelectedSection(null);
      setSelectedCommittee(null);
    }
  };

  const handleDeleteConfirm = async () => {
    setShowDeletePopup(false);

    if (deleteTarget?.type === "committee" && deleteTarget.id) {
      try {
        await axiosInstance.delete(`/${collectionName}/${deleteTarget.id}`);
        await fetchData();
        setSelectedCommittee(null);
        setSelectedSection(null);
        toast({
          title: "Success",
          description: "Committee deleted successfully!",
        });
      } catch (err: any) {
        setError("Error deleting: " + err.message);
        toast({
          title: "Error",
          description: "Error deleting: " + err.message,
          variant: "destructive",
        });
      }
    } else if (
      selectedCommittee &&
      deleteTarget?.type &&
      typeof deleteTarget.id === "number"
    ) {
      const updated = { ...selectedCommittee };

      if (deleteTarget.type === "member") {
        updated.data.members = updated.data.members.filter(
          (_, i) => i !== deleteTarget.id
        );
      } else if (deleteTarget.type === "circular") {
        updated.data.circulars = updated.data.circulars.filter(
          (_, i) => i !== deleteTarget.id
        );
      } else if (deleteTarget.type === "objective") {
        updated.data.objectives = updated.data.objectives.filter(
          (_, i) => i !== deleteTarget.id
        );
      }

      setSelectedCommittee(updated);
    }

    setDeleteTarget(null);
  };

  // Create New Committee/Cell/Club
  const handleCreateNewCommittee = async (name: string) => {
    setShowAddModal(false);
    setLoading(true);

    try {
      // Create the proper export name based on type
      let exportName = name;
      if (newCommitteeType === "cell" && !name.toLowerCase().includes("cell")) {
        exportName = `${name} Cell`;
      } else if (
        newCommitteeType === "club" &&
        !name.toLowerCase().includes("club")
      ) {
        exportName = `${name} Club`;
      }

      const newCommittee: Partial<CommitteeData> = {
        exportName: exportName,
        data: {
          members: [],
          circulars: [],
          objectives: [],
        },
      };

      await axiosInstance.post(`/${collectionName}`, newCommittee);
      await fetchData();
      toast({
        title: "Success",
        description: "Committee created successfully!",
      });
      setError("");
    } catch (err: any) {
      setError("Error creating new committee: " + err.message);
      toast({
        title: "Error",
        description: "Error creating new committee: " + err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add Operations
  const handleAddMember = () => {
    if (!selectedCommittee) return;
    const updated = { ...selectedCommittee };
    const newId =
      updated.data.members.length > 0
        ? Math.max(...updated.data.members.map((m) => m.id)) + 1
        : 1;

    updated.data.members.push({
      id: newId,
      name: "",
      designation: "",
      email: "",
      image: "",
    });

    setSelectedCommittee(updated);
    setEditingIndex(updated.data.members.length - 1);
  };

  const handleAddCircular = () => {
    if (!selectedCommittee) return;
    const updated = { ...selectedCommittee };
    updated.data.circulars.push({ title: "", file: "" });
    setSelectedCommittee(updated);
    setEditingIndex(updated.data.circulars.length - 1);
  };

  const handleAddObjective = () => {
    if (!selectedCommittee) return;
    const updated = { ...selectedCommittee };
    const newId =
      updated.data.objectives.length > 0
        ? Math.max(...updated.data.objectives.map((o) => o.id)) + 1
        : 1;

    updated.data.objectives.push({ id: newId, text: "" });
    setSelectedCommittee(updated);
    setEditingIndex(updated.data.objectives.length - 1);
  };

  // Update Operations
  const updateMember = (index: number, field: keyof Member, value: any) => {
    if (!selectedCommittee) return;
    const updated = { ...selectedCommittee };
    (updated.data.members[index] as any)[field] = value;
    setSelectedCommittee(updated);
  };

  const updateCircular = (
    index: number,
    field: keyof Circular,
    value: string
  ) => {
    if (!selectedCommittee) return;
    const updated = { ...selectedCommittee };
    updated.data.circulars[index][field] = value;
    setSelectedCommittee(updated);
  };

  const updateObjective = (
    index: number,
    field: keyof Objective,
    value: any
  ) => {
    if (!selectedCommittee) return;
    const updated = { ...selectedCommittee };
    (updated.data.objectives[index] as any)[field] = value;
    setSelectedCommittee(updated);
  };

  // ============================================
  // RENDER: Committee List View (Main View)
  // ============================================
  const renderCommitteeList = () => {
    return (
      <div className="collection-manager p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="form-container border border-gray-300 rounded-lg p-6 bg-white mb-8">
          <div className="flex justify-between items-center mb-6">
            <Heading title="Committee Management" size="lg" align="left" />
          </div>

          {Object.entries(categorizedCommittees).map(
            ([category, committees]) => (
              <div key={category} className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {category} ({committees.length})
                  </h3>
                  <button
                    onClick={() => {
                      const type =
                        category === "Committees"
                          ? "committee"
                          : category === "Cells"
                          ? "cell"
                          : "club";
                      setNewCommitteeType(type);
                      setShowAddModal(true);
                    }}
                    className="green-btn flex items-center gap-2"
                  >
                    <Plus size={16} /> Add New{" "}
                    {category === "Committees"
                      ? "Committee"
                      : category === "Cells"
                      ? "Cell"
                      : "Club"}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {committees.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {item.exportName || "Committee"}
                          </h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Members: {item.data.members?.length || 0}</p>
                            <p>Circulars: {item.data.circulars?.length || 0}</p>
                            <p>
                              Objectives: {item.data.objectives?.length || 0}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setSelectedCommittee(item)}
                            className="blue-btn flex items-center gap-2"
                          >
                            <Edit size={14} /> Edit
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTarget({
                                type: "committee",
                                id: item._id,
                              });
                              setShowDeletePopup(true);
                            }}
                            className="trash-btn rounded-md px-3"
                          >
                            <Trash2Icon size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER: CommitteeDetails View (Shows Members/Circulars/Objectives Lists)
  // ============================================
  const renderCommitteeDetails = () => {
    if (!selectedCommittee) return null;

    return (
      <div className="p-6 min-h-screen">
        <button
          onClick={() => setSelectedCommittee(null)}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Committees
        </button>

        <div className="border border-gray-300 rounded-lg p-6 bg-white mb-8">
          <Heading
            title={`${selectedCommittee.exportName || "Committee"} - Details`}
            size="lg"
            align="left"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Members Card */}
            <div
              className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedSection("members")}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Members</h3>
              <p className="text-gray-700 text-3xl font-semibold">
                {selectedCommittee.data.members?.length || 0}
              </p>
              <p className="text-sm text-gray-600 mt-2">Click to manage →</p>
            </div>

            {/* Circulars Card */}
            <div
              className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedSection("circulars")}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Circulars
              </h3>
              <p className="text-gray-700 text-3xl font-semibold">
                {selectedCommittee.data.circulars?.length || 0}
              </p>
              <p className="text-sm text-gray-600 mt-2">Click to manage →</p>
            </div>

            {/* Objectives Card */}
            <div
              className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedSection("objectives")}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Objectives
              </h3>
              <p className="text-gray-700 text-3xl font-semibold">
                {selectedCommittee.data.objectives?.length || 0}
              </p>
              <p className="text-sm text-gray-600 mt-2">Click to manage →</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER: Section List View (Members/Circulars/Objectives)
  // ============================================
  const renderSectionList = () => {
    if (!selectedCommittee || !selectedSection) return null;

    const sectionConfig = {
      members: {
        title: "Members",
        items: selectedCommittee.data.members,
        add: handleAddMember,
        renderCard: (item: Member, index: number) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">
                  {item.name || "Unnamed"}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {item.designation || "No designation"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {item.email || "No email"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingIndex(index)}
                  className="blue-btn"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => {
                    setDeleteTarget({ type: "member", id: index });
                    setShowDeletePopup(true);
                  }}
                  className="trash-btn rounded-md px-3"
                >
                  <Trash2Icon size={16} />
                </button>
              </div>
            </div>
          </div>
        ),
      },
      circulars: {
        title: "Circulars",
        items: selectedCommittee.data.circulars,
        add: handleAddCircular,
        renderCard: (item: Circular, index: number) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">
                  {item.title || "Untitled"}
                </h4>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {item.file || "No file"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingIndex(index)}
                  className="blue-btn"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => {
                    setDeleteTarget({ type: "circular", id: index });
                    setShowDeletePopup(true);
                  }}
                  className="trash-btn rounded-md px-3"
                >
                  <Trash2Icon size={16} />
                </button>
              </div>
            </div>
          </div>
        ),
      },
      objectives: {
        title: "Objectives",
        items: selectedCommittee.data.objectives,
        add: handleAddObjective,
        renderCard: (item: Objective, index: number) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="text-gray-900">{item.text || "No text"}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingIndex(index)}
                  className="blue-btn"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={() => {
                    setDeleteTarget({ type: "objective", id: index });
                    setShowDeletePopup(true);
                  }}
                  className="trash-btn rounded-md px-3"
                >
                  <Trash2Icon size={16} />
                </button>
              </div>
            </div>
          </div>
        ),
      },
    };

    const config = sectionConfig[selectedSection];

    return (
      <div className="p-6 min-h-screen">
        <button
          onClick={() => {
            setSelectedSection(null);
            setEditingIndex(null);
          }}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Committee Details
        </button>

        <div className="border border-gray-300 rounded-lg p-6 bg-white mb-8">
          <div className="flex justify-between items-center mb-6">
            <Heading
              title={`${config.title} (${config.items.length})`}
              size="lg"
              align="left"
            />
            <button onClick={config.add} className="green-btn">
              <Plus size={16} /> Add{" "}
              {selectedSection === "members"
                ? "Member"
                : selectedSection === "circulars"
                ? "Circular"
                : "Objective"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.items.map((item: any, index: number) =>
              config.renderCard(item, index)
            )}
          </div>

          {config.items.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No {config.title.toLowerCase()} yet</p>
              <p className="text-sm">
                Click "Add{" "}
                {selectedSection === "members"
                  ? "Member"
                  : selectedSection === "circulars"
                  ? "Circular"
                  : "Objective"}
                " to get started
              </p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
            <button
              className="btn btn-primary px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => setShowSavePopup(true)}
            >
              Save All Changes
            </button>
            <button
              className="btn px-6 py-2.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
              onClick={async () => {
                try {
                  if (tempFiles.length > 0) {
                    await axiosInstance.post(
                      "/upload/document/remove-temp-document",
                      {
                        files: tempFiles,
                        sessionId:
                          sessionStorage.getItem("adminSessionId") || "",
                      }
                    );
                  }
                  setTempFiles([]);
                  sessionStorage.removeItem("tempFiles");
                } catch (err) {
                  console.error("Temp cleanup failed:", err);
                }

                setSelectedSection(null);
                setEditingIndex(null);
                fetchData();
                setSelectedCommittee(
                  data.find((c) => c._id === selectedCommittee._id) || null
                );
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER: Item Edit Form
  // ============================================
  const renderEditForm = () => {
    if (!selectedCommittee || !selectedSection || editingIndex === null)
      return null;

    const handleBack = () => setEditingIndex(null);

    // Member Form
    if (selectedSection === "members") {
      const member = selectedCommittee.data.members[editingIndex];
      if (!member) return null;

      return (
        <div className="p-6 min-h-screen">
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Members List
          </button>

          <div className="border border-gray-300 rounded-lg p-6 bg-white max-w-2xl">
            <Heading
              title={`Edit Member ${editingIndex + 1}`}
              size="lg"
              align="left"
            />

            <div className="mt-6 space-y-4">
              <div>
                <label className="form-label block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={member.name}
                  onChange={(e) =>
                    updateMember(editingIndex, "name", e.target.value)
                  }
                  placeholder="Member name"
                />
              </div>

              <div>
                <label className="form-label block text-sm font-medium mb-2">
                  Designation
                </label>
                <input
                  type="text"
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={member.designation}
                  onChange={(e) =>
                    updateMember(editingIndex, "designation", e.target.value)
                  }
                  placeholder="e.g., Chairperson"
                />
              </div>

              <div>
                <label className="form-label block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={member.email}
                  onChange={(e) =>
                    updateMember(editingIndex, "email", e.target.value)
                  }
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="form-label block text-sm font-medium mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={member.image}
                  onChange={(e) =>
                    updateMember(editingIndex, "image", e.target.value)
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
              <button
                className="btn btn-primary px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => setShowSavePopup(true)}
              >
                Save Changes
              </button>
              <button
                className="btn px-6 py-2.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={handleBack}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Circular Form
    if (selectedSection === "circulars") {
      const circular = selectedCommittee.data.circulars[editingIndex];
      if (!circular) return null;

      return (
        <div className="p-6 min-h-screen">
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Circulars List
          </button>

          <div className="border border-gray-300 rounded-lg p-6 bg-white max-w-2xl">
            <Heading
              title={`Edit Circular ${editingIndex + 1}`}
              size="lg"
              align="left"
            />

            <div className="mt-6 space-y-4">
              <div>
                <label className="form-label block text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={circular.title}
                  onChange={(e) =>
                    updateCircular(editingIndex, "title", e.target.value)
                  }
                  placeholder="Circular title"
                />
              </div>

              <div>
                <label className="form-label block text-sm font-medium mb-2">
                  File (PDF Document)
                </label>
                <DocumentUploadManager
                  label="Upload Circular Document"
                  value={circular.file}
                  addTemp={(fileName) => {
                    setTempFiles((prev) => {
                      const updated = [...prev, fileName];
                      sessionStorage.setItem(
                        "tempFiles",
                        JSON.stringify(updated)
                      );
                      return updated;
                    });
                  }}
                  onChange={(value) =>
                    updateCircular(editingIndex, "file", value)
                  }
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
              <button
                className="btn btn-primary px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => setShowSavePopup(true)}
              >
                Save Changes
              </button>
              <button
                className="btn px-6 py-2.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={handleBack}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Objective Form
    if (selectedSection === "objectives") {
      const objective = selectedCommittee.data.objectives[editingIndex];
      if (!objective) return null;

      return (
        <div className="p-6 min-h-screen">
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Objectives List
          </button>

          <div className="border border-gray-300 rounded-lg p-6 bg-white max-w-2xl">
            <Heading
              title={`Edit Objective ${editingIndex + 1}`}
              size="lg"
              align="left"
            />

            <div className="mt-6 space-y-4">
              <div>
                <label className="form-label block text-sm font-medium mb-2">
                  Objective Text
                </label>
                <textarea
                  rows={4}
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={objective.text}
                  onChange={(e) =>
                    updateObjective(editingIndex, "text", e.target.value)
                  }
                  placeholder="Enter objective description"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
              <button
                className="btn btn-primary px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={() => setShowSavePopup(true)}
              >
                Save Changes
              </button>
              <button
                className="btn px-6 py-2.5 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                onClick={handleBack}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // ============================================
  // MAIN RENDER LOGIC
  // ============================================
  if (loading && data.length === 0) {
    return <div className="text-center py-8">Loading...</div>;
  }

  // Determine which view to show
  let currentView;
  if (editingIndex !== null && selectedSection && selectedCommittee) {
    currentView = renderEditForm();
  } else if (selectedSection && selectedCommittee) {
    currentView = renderSectionList();
  } else if (selectedCommittee) {
    currentView = renderCommitteeDetails();
  } else {
    currentView = renderCommitteeList();
  }

  return (
    <>
      {currentView}

      {/* Live Preview Section */}
      {selectedSection && <ScrollDownToPreview />}

      <div className="py-4 mt-10 border border-gray-300 rounded-2xl p-8 bg-white">
        <Heading title="Live Preview" size="lg" align="left" className="mt-5" />
        <PreviewWrapper Component={Committees} previewData={data} />
      </div>

      {/* Popups */}
      <ConfirmationPopup
        isOpen={showSavePopup}
        onClose={() => setShowSavePopup(false)}
        onConfirm={handleSaveChanges}
        title="Save Changes?"
        message="Save all changes to this committee? This will update the database."
        confirmText="Save Changes"
        confirmStyle="bg-blue-600 hover:bg-blue-700"
      />

      <ConfirmationPopup
        isOpen={showDeletePopup}
        onClose={() => {
          setShowDeletePopup(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${
          deleteTarget?.type === "committee"
            ? "Committee"
            : deleteTarget?.type || "Item"
        }?`}
        message={`Are you sure you want to delete this ${
          deleteTarget?.type || "item"
        }? This action cannot be undone.`}
        confirmText="Delete"
        confirmStyle="bg-red-600 hover:bg-red-700"
      />

      <InputModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onConfirm={handleCreateNewCommittee}
        title={`Add New ${
          newCommitteeType === "committee"
            ? "Committee"
            : newCommitteeType === "cell"
            ? "Cell"
            : "Club"
        }`}
        message={`Enter the name for the new ${newCommitteeType}`}
        placeholder={`e.g., ${
          newCommitteeType === "committee"
            ? "Academic Committee"
            : newCommitteeType === "cell"
            ? "Innovation"
            : "Sports"
        }`}
        confirmText={`Create ${
          newCommitteeType === "committee"
            ? "Committee"
            : newCommitteeType === "cell"
            ? "Cell"
            : "Club"
        }`}
        defaultValue=""
      />
    </>
  );
};

export default CommittiesDataManager;

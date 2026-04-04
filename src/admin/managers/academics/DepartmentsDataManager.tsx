import React, { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import Heading from "@/components/reusable/Heading";
import ImageUploadManager from "@/admin/components/ImageUploadManager";
import InputModal from "@/admin/components/InputModal";
import {
  AlertCircle,
  X,
  Edit,
  Trash2Icon,
  Plus,
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// ---------------------------------------------------------------------
// INTERFACES
// ---------------------------------------------------------------------

interface Program {
  degree: string;
  duration: string;
  description: string;
}

interface Activity {
  programTitle: string;
  date: string;
  location: string;
  aboutProgram: string[];
  programOutcomes: string[];
}

interface AboutDepartment {
  history: string;
  overview: string;
  strengths: string[];
}

interface Department {
  slug?: string; // Internal use for the key
  name: string;
  image: string;
  departmentGallery: string[];
  about: string;
  aboutDepartment: AboutDepartment;
  vision: string;
  mission: string[];
  objectives: string[];
  programsOffered: Program[];
  certificateCourses: string[];
  skillPrograms: string[];
  departmentActivities: Activity[];
  faculty?: any[];
}

// ---------------------------------------------------------------------
// READ-ONLY IMAGE CARD (Adapted from Carousel)
// ---------------------------------------------------------------------
const GalleryImageCard: React.FC<{
  image: string;
  index: number;
  onDelete: (index: number) => void;
}> = ({ image, index, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  // Helper to resolve image URL
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
      {/* Delete Button */}
      <button
        onClick={() => onDelete(index)}
        className="absolute top-3 right-3 z-20 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
        title="Delete Image"
      >
        <Trash2Icon size={16} />
      </button>

      {/* Image Preview */}
      <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
        {imageError || !imageUrl ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <ImageIcon size={48} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-red-500">Invalid Image</p>
              <p className="text-xs text-gray-400 mt-1">Failed to load</p>
            </div>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={`Gallery ${index + 1}`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* Image Info */}
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-700">Image {index + 1}</p>
        <p className="text-xs text-gray-500 mt-1 truncate" title={image}>
          {image.includes("/") ? image.split("/").pop() : image}
        </p>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// CONFIRMATION POPUP (Reused verbatim)
// ---------------------------------------------------------------------
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

// ---------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------

const DepartmentsDataManager: React.FC = () => {
  const { toast } = useToast();
  // State from CommitteeManager
  const [data, setData] = useState<Department[]>([]); // We work with array for easier mapping
  const [rawDataMap, setRawDataMap] = useState<Record<string, Department>>({}); // Keep original map
  const [docId, setDocId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tempFiles, setTempFiles] = useState<string[]>([]);

  // Navigation state
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  // Sections: "general", "programs", "activities", "courses", "skills", "gallery"
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Popup states
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: string;
    id?: string | number; // id can be slug (string) or index (number)
  } | null>(null);

  // Add new modal
  const [showAddModal, setShowAddModal] = useState(false);

  // Image states for Gallery Add
  const [pendingGalleryImage, setPendingGalleryImage] = useState<string>("");

  const collectionName = "academics/departmentsdata";

  useEffect(() => {
    fetchData();
    const stored = sessionStorage.getItem("tempFiles");
    if (stored) setTempFiles(JSON.parse(stored));
  }, []);

  // -------------------------------------------------------------------
  // DATA FETCHING & HELPERS
  // -------------------------------------------------------------------

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(`/${collectionName}`);
      const rawRes = Array.isArray(res.data) ? res.data[0] : res.data;

      if (!rawRes) throw new Error("No data found");
      setDocId(rawRes._id);

      let deptsMap: Record<string, Department> = {};

      if (rawRes.data && typeof rawRes.data === "object" && !rawRes.data.name) {
        deptsMap = rawRes.data;
      } else {
        Object.keys(rawRes).forEach((key) => {
          if (
            key !== "_id" &&
            key !== "createdAt" &&
            key !== "updatedAt" &&
            key !== "__v" &&
            typeof rawRes[key] === "object"
          ) {
            deptsMap[key] = rawRes[key];
          }
        });
      }

      setRawDataMap(deptsMap);

      // Convert to Array for Committee-like handling
      const deptArray: Department[] = Object.entries(deptsMap).map(
        ([key, val]) => ({
          ...val,
          slug: key,
        })
      );

      setData(deptArray);

      // Restore selection if exists
      if (selectedDepartment && selectedDepartment.slug) {
        const found = deptArray.find((d) => d.slug === selectedDepartment.slug);
        if (found) setSelectedDepartment(found);
      }
    } catch (e: any) {
      setError("Failed to load data: " + e.message);
      toast({
        title: "Error",
        description: "Failed to load data: " + e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTempFile = useCallback((fileName: string) => {
    setTempFiles((prev) => {
      const updated = [...prev, fileName];
      sessionStorage.setItem("tempFiles", JSON.stringify(updated));
      return updated;
    });
  }, []);

  // -------------------------------------------------------------------
  // TEMP FILE PROCESSING (From Carousel)
  // -------------------------------------------------------------------

  const processSpecificFile = async (fileName: string): Promise<string> => {
    if (!fileName || !tempFiles.includes(fileName)) return fileName; // Already saved or empty

    try {
      const res = await axiosInstance.post("/upload/save-temp-file", {
        fileName,
      });
      const finalUrl = res.data.url;

      // Remove from tempFiles
      setTempFiles((prev) => {
        const updated = prev.filter((f) => f !== fileName);
        if (updated.length === 0) sessionStorage.removeItem("tempFiles");
        else sessionStorage.setItem("tempFiles", JSON.stringify(updated));
        return updated;
      });

      return finalUrl;
    } catch (err) {
      console.error("Temp save failed for", fileName, err);
      return fileName; // Return original on error to avoid losing it
    }
  };

  // -------------------------------------------------------------------
  // CRUD OPERATIONS
  // -------------------------------------------------------------------

  const handleSaveChanges = async () => {
    if (!selectedDepartment || !selectedDepartment.slug || !docId) return;

    setShowSavePopup(false);
    setLoading(true);

    try {
      // 1. Process Images
      // Process main image
      let updatedImage = selectedDepartment.image;
      if (tempFiles.includes(updatedImage)) {
        updatedImage = await processSpecificFile(updatedImage);
      }

      // Process gallery images
      const updatedGallery = [...selectedDepartment.departmentGallery];
      for (let i = 0; i < updatedGallery.length; i++) {
        if (tempFiles.includes(updatedGallery[i])) {
          updatedGallery[i] = await processSpecificFile(updatedGallery[i]);
        }
      }

      // Update local object first
      const updatedDept = {
        ...selectedDepartment,
        image: updatedImage,
        departmentGallery: updatedGallery,
      };

      // 2. Prepare full map
      const updatedMap = { ...rawDataMap };
      const { slug, ...deptData } = updatedDept;
      updatedMap[slug!] = deptData as Department;

      // 3. PUT request
      await axiosInstance.put(`/${collectionName}/${docId}`, {
        data: updatedMap,
      });

      // Update state
      setSelectedDepartment(updatedDept);

      await fetchData();
      toast({
        title: "Success",
        description: "Department changes saved successfully!",
        variant: "default",
      });
    } catch (err: any) {
      setError("Error saving: " + err.message);
      toast({
        title: "Error Saving",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewDepartment = async (name: string) => {
    setShowAddModal(false);
    if (!docId) return;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    if (rawDataMap[slug]) {
      toast({
        title: "Error",
        description: "Department already exists!",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const newDept: Department = {
        name: name,
        image: "",
        departmentGallery: [],
        about: "",
        aboutDepartment: { history: "", overview: "", strengths: [] },
        vision: "",
        mission: [],
        objectives: [],
        programsOffered: [],
        certificateCourses: [],
        skillPrograms: [],
        departmentActivities: [],
        faculty: [],
      };

      const updatedMap = { ...rawDataMap, [slug]: newDept };
      await axiosInstance.put(`/${collectionName}/${docId}`, {
        data: updatedMap,
      });

      await fetchData();
      toast({
        title: "Success",
        description: "Created new department: " + name,
      });
    } catch (err: any) {
      setError("Error creating: " + err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setShowDeletePopup(false);

    // CASE 1: Delete Entire Department
    if (
      deleteTarget?.type === "department" &&
      typeof deleteTarget.id === "string"
    ) {
      if (!docId) return;
      const slugToDelete = deleteTarget.id;

      setLoading(true);
      try {
        const updatedMap = { ...rawDataMap };
        delete updatedMap[slugToDelete];

        await axiosInstance.put(`/${collectionName}/${docId}`, {
          data: updatedMap,
        });

        setSelectedDepartment(null);
        await fetchData();
        toast({
          title: "Success",
          description: "Department deleted successfully",
        });
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    // CASE 2: Delete Item inside Selected Department
    else if (selectedDepartment && typeof deleteTarget?.id === "number") {
      const idx = deleteTarget.id;
      const updatedDept = { ...selectedDepartment };

      if (deleteTarget.type === "program") {
        updatedDept.programsOffered = updatedDept.programsOffered.filter(
          (_, i) => i !== idx
        );
      } else if (deleteTarget.type === "activity") {
        updatedDept.departmentActivities =
          updatedDept.departmentActivities.filter((_, i) => i !== idx);
      } else if (deleteTarget.type === "course") {
        updatedDept.certificateCourses = updatedDept.certificateCourses.filter(
          (_, i) => i !== idx
        );
      } else if (deleteTarget.type === "skill") {
        updatedDept.skillPrograms = updatedDept.skillPrograms.filter(
          (_, i) => i !== idx
        );
      } else if (deleteTarget.type === "gallery") {
        updatedDept.departmentGallery = updatedDept.departmentGallery.filter(
          (_, i) => i !== idx
        );
      } else if (deleteTarget.type === "mission") {
        updatedDept.mission = updatedDept.mission.filter((_, i) => i !== idx);
      }

      setSelectedDepartment(updatedDept); // Local update, waiting for "Save Changes"
      toast({
        title: "Item Removed",
        description: "Don't forget to Save Changes to persist this deletion.",
      });
    }
    setDeleteTarget(null);
  };

  // -------------------------------------------------------------------
  // HELPER UPDATERS
  // -------------------------------------------------------------------

  const updateGeneralField = (field: keyof Department, value: any) => {
    if (!selectedDepartment) return;
    setSelectedDepartment({ ...selectedDepartment, [field]: value });
  };

  const updateAboutField = (field: keyof AboutDepartment, value: any) => {
    if (!selectedDepartment) return;
    setSelectedDepartment({
      ...selectedDepartment,
      aboutDepartment: {
        ...selectedDepartment.aboutDepartment,
        [field]: value,
      },
    });
  };

  // -------------------------------------------------------------------
  // RENDER: LIST VIEW (Main Grid)
  // -------------------------------------------------------------------
  const renderDepartmentList = () => {
    return (
      <div className="collection-manager p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="form-container border border-gray-300 rounded-lg p-6 bg-white mb-8">
          <div className="flex justify-between items-center mb-6">
            <Heading title="Departments Management" size="lg" align="left" />
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2 font-medium"
            >
              <Plus size={16} /> Add New Department
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {data.map((dept) => (
              <div
                key={dept.slug}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="flex justify-between items-center">
                  <div className="w-[70%]">
                    <div className="flex items-start justify-between">
                      <h3
                        className="font-bold text-lg text-gray-900 line-clamp-1"
                        title={dept.name}
                      >
                        {dept.name} Department
                      </h3>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                      <p>Programs: {dept.programsOffered?.length || 0}</p>
                      <p>
                        Activities: {dept.departmentActivities?.length || 0}
                      </p>
                      <p>Faculty: {dept.faculty?.length || 0}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-between">
                    <button
                      onClick={() => setSelectedDepartment(dept)}
                      className="blue-btn"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setDeleteTarget({
                            type: "department",
                            id: dept.slug,
                          });
                          setShowDeletePopup(true);
                        }}
                        className="trash-btn rounded-md px-3"
                      >
                        <Trash2Icon size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------------
  // RENDER: DEPARTMENT DETAILS
  // -------------------------------------------------------------------
  const renderDepartmentDetails = () => {
    if (!selectedDepartment) return null;

    return (
      <div className="p-6 min-h-screen">
        <button
          onClick={() => setSelectedDepartment(null)}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Departments
        </button>

        <div className="border border-gray-300 rounded-lg p-6 bg-white mb-8">
          <div className="flex justify-between items-center mb-6">
            <Heading
              title={`${selectedDepartment.name} Department Details`}
              size="lg"
              align="left"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* General Info Card */}
            <div
              className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedSection("general")}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                General Info
              </h3>
              <p className="text-gray-600 text-sm">
                Name, About, Vision, Mission
              </p>
              <p className="text-sm text-blue-600 mt-4 font-medium">
                Click to manage →
              </p>
            </div>

            {/* Programs Card */}
            <div
              className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedSection("programs")}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Programs Offered
              </h3>
              <p className="text-gray-700 text-3xl font-semibold">
                {selectedDepartment.programsOffered?.length || 0}
              </p>
              <p className="text-sm text-green-700 mt-2 font-medium">
                Click to manage →
              </p>
            </div>

            {/* Activities Card */}
            <div
              className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedSection("activities")}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Activities
              </h3>
              <p className="text-gray-700 text-3xl font-semibold">
                {selectedDepartment.departmentActivities?.length || 0}
              </p>
              <p className="text-sm text-purple-700 mt-2 font-medium">
                Click to manage →
              </p>
            </div>

            {/* Certificate Courses Card */}
            <div
              className="bg-orange-50 border-l-4 border-orange-600 p-6 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedSection("courses")}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Certificate Courses
              </h3>
              <p className="text-gray-700 text-3xl font-semibold">
                {selectedDepartment.certificateCourses?.length || 0}
              </p>
              <p className="text-sm text-orange-700 mt-2 font-medium">
                Click to manage →
              </p>
            </div>

            {/* Skill Programs Card */}
            <div
              className="bg-teal-50 border-l-4 border-teal-600 p-6 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedSection("skills")}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Skill Programs
              </h3>
              <p className="text-gray-700 text-3xl font-semibold">
                {selectedDepartment.skillPrograms?.length || 0}
              </p>
              <p className="text-sm text-teal-700 mt-2 font-medium">
                Click to manage →
              </p>
            </div>

            {/* Gallery Card */}
            <div
              className="bg-pink-50 border-l-4 border-pink-600 p-6 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedSection("gallery")}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Gallery</h3>
              <p className="text-gray-700 text-3xl font-semibold">
                {selectedDepartment.departmentGallery?.length || 0}
              </p>
              <p className="text-sm text-pink-700 mt-2 font-medium">
                Click to manage →
              </p>
            </div>
          </div>

          <div className="pt-10 space-x-2">
            <button onClick={() => setShowSavePopup(true)} className="blue-btn">
              Save All Changes
            </button>
            <button
              onClick={() => setSelectedDepartment(null)}
              className="ash-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------------
  // RENDER: SECTION LISTS (Equivalent to renderSectionList)
  // -------------------------------------------------------------------
  const renderSectionList = () => {
    if (!selectedDepartment || !selectedSection) return null;

    const handleBack = () => {
      setSelectedSection(null);
      setEditingIndex(null);
      setPendingGalleryImage("");
    };

    // GENERAL INFO FORM
    if (selectedSection === "general") {
      return (
        <div className="p-6 min-h-screen">
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft size={20} /> Back to Dashboard
          </button>
          <div className="border border-gray-300 rounded-lg p-6 bg-white mx-auto">
            <Heading
              title="General Information"
              size="lg"
              align="left"
              className="mb-6"
            />

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Department Name
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={selectedDepartment.name}
                    onChange={(e) => updateGeneralField("name", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Banner Image
                  </label>
                  <ImageUploadManager
                    value={selectedDepartment.image}
                    label="Add Image"
                    onChange={(url) => {
                      updateGeneralField("image", url);
                      addTempFile(url);
                    }}
                    addTemp={addTempFile}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">About</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md h-24"
                  value={selectedDepartment.about}
                  onChange={(e) => updateGeneralField("about", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  History
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md h-24"
                  value={selectedDepartment.aboutDepartment.history}
                  onChange={(e) => updateAboutField("history", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Overview
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md h-24"
                  value={selectedDepartment.aboutDepartment.overview}
                  onChange={(e) => updateAboutField("overview", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Vision</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={selectedDepartment.vision}
                  onChange={(e) => updateGeneralField("vision", e.target.value)}
                />
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200 justify-start space-x-2">
              <button
                onClick={() => setShowSavePopup(true)}
                className="blue-btn"
              >
                Save Changes
              </button>
              <button onClick={handleBack} className="ash-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    // GALLERY SECTION (Special Grid View)
    if (selectedSection === "gallery") {
      return (
        <div className="p-6 min-h-screen">
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            {" "}
            <ArrowLeft size={20} /> Back to Dashboard{" "}
          </button>
          <div className="border border-gray-300 rounded-lg p-6 bg-white">
            <div className="flex justify-between items-center mb-6">
              <Heading
                title={`Gallery (${selectedDepartment.departmentGallery.length} images)`}
                size="lg"
                align="left"
              />
            </div>

            {/* EXISTING IMAGES */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {selectedDepartment.departmentGallery.map((img, idx) => (
                <GalleryImageCard
                  key={idx}
                  image={img}
                  index={idx}
                  onDelete={(i) => {
                    setDeleteTarget({ type: "gallery", id: i });
                    setShowDeletePopup(true);
                  }}
                />
              ))}

              {/* Add New Badge */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all min-h-[200px]">
                <ImageUploadManager
                  label=""
                  value=""
                  onChange={(url) => {
                    const updated = { ...selectedDepartment };
                    updated.departmentGallery.push(url);
                    setSelectedDepartment(updated);
                    addTempFile(url);
                    toast({
                      title: "Image Added",
                      description: "Image added to list. Save to persist.",
                    });
                  }}
                  addTemp={addTempFile}
                  showPreview={false}
                />
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Add New Image
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 space-x-2">
              <button
                onClick={() => setShowSavePopup(true)}
                className="blue-btn"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Generic List Configuration
    let title = "";
    let items: any[] = [];
    let onAdd = () => {};
    let renderCard: (item: any, idx: number) => React.ReactNode = () => null;

    if (selectedSection === "programs") {
      title = "Programs Offered";
      items = selectedDepartment.programsOffered || [];
      onAdd = () => {
        const updated = { ...selectedDepartment };
        updated.programsOffered.push({
          degree: "New Program",
          duration: "3 Years",
          description: "",
        });
        setSelectedDepartment(updated);
        setEditingIndex(updated.programsOffered.length - 1);
      };
      renderCard = (item: Program, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{item.degree}</h4>
              <p className="text-sm text-gray-600">{item.duration}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingIndex(idx)} className="blue-btn">
                <Edit size={14} /> Edit
              </button>
              <button
                onClick={() => {
                  setDeleteTarget({ type: "program", id: idx });
                  setShowDeletePopup(true);
                }}
                className="trash-btn px-3"
              >
                <Trash2Icon size={16} />
              </button>
            </div>
          </div>
        </div>
      );
    } else if (selectedSection === "activities") {
      title = "Department Activities";
      items = selectedDepartment.departmentActivities || [];
      onAdd = () => {
        const updated = { ...selectedDepartment };
        updated.departmentActivities.push({
          programTitle: "New Activity",
          date: "",
          location: "",
          aboutProgram: [],
          programOutcomes: [],
        });
        setSelectedDepartment(updated);
        setEditingIndex(updated.departmentActivities.length - 1);
      };
      renderCard = (item: Activity, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">
                {item.programTitle}
              </h4>
              <p className="text-sm text-gray-500">
                {item.date} • {item.location}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingIndex(idx)} className="blue-btn">
                <Edit size={14} /> Edit
              </button>
              <button
                onClick={() => {
                  setDeleteTarget({ type: "activity", id: idx });
                  setShowDeletePopup(true);
                }}
                className="trash-btn px-3"
              >
                <Trash2Icon size={16} />
              </button>
            </div>
          </div>
        </div>
      );
    } else if (selectedSection === "courses" || selectedSection === "skills") {
      const field =
        selectedSection === "courses" ? "certificateCourses" : "skillPrograms";
      title =
        selectedSection === "courses"
          ? "Certificate Courses"
          : "Skill Programs";
      items = (selectedDepartment[field] as string[]) || [];

      onAdd = () => {
        const updated = { ...selectedDepartment };
        (updated[field] as string[]).push("New Item");
        setSelectedDepartment(updated);
        setEditingIndex(items.length); // Push adds to end
      };

      renderCard = (item: string, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex justify-between items-center"
        >
          <span className="font-medium text-gray-900">{item}</span>
          <div className="flex gap-2">
            <button onClick={() => setEditingIndex(idx)} className="blue-btn">
              <Edit size={14} />
            </button>
            <button
              onClick={() => {
                setDeleteTarget({
                  type: selectedSection === "courses" ? "course" : "skill",
                  id: idx,
                });
                setShowDeletePopup(true);
              }}
              className="trash-btn px-3"
            >
              <Trash2Icon size={16} />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 min-h-screen">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>
        <div className="border border-gray-300 rounded-lg p-6 bg-white mb-8">
          <div className="flex justify-between items-center mb-6">
            <Heading
              title={`${title} (${items.length})`}
              size="lg"
              align="left"
            />
            <button
              onClick={onAdd}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2 font-medium"
            >
              <Plus size={16} /> Add New
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item, idx) => renderCard(item, idx))}
          </div>
          {items.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No items yet</p>
              <p className="text-sm">Click "Add New" to get started</p>
            </div>
          )}
          <div className="mt-8 pt-6 border-t space-x-2">
            <button onClick={() => setShowSavePopup(true)} className="blue-btn">
              Save All Changes
            </button>
            <button onClick={handleBack} className="ash-btn">
              Back
            </button>
          </div>
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------------
  // RENDER: EDIT FORM (Detail Edit)
  // -------------------------------------------------------------------
  const renderEditForm = () => {
    if (!selectedDepartment || !selectedSection || editingIndex === null)
      return null;

    const handleBack = () => setEditingIndex(null);

    // PROGRAMS
    if (selectedSection === "programs") {
      const prog = selectedDepartment.programsOffered[editingIndex];
      if (!prog) return null;

      const updateProg = (field: keyof Program, val: string) => {
        const updated = { ...selectedDepartment };
        updated.programsOffered[editingIndex] = { ...prog, [field]: val };
        setSelectedDepartment(updated);
      };

      return (
        <div className="p-6 min-h-screen">
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <div className="border border-gray-300 rounded-lg p-6 bg-white max-w-2xl">
            <Heading
              title="Edit Program"
              size="lg"
              align="left"
              className="mb-6"
            />
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Degree</label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={prog.degree}
                  onChange={(e) => updateProg("degree", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Duration
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={prog.duration}
                  onChange={(e) => updateProg("duration", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md h-32"
                  value={prog.description}
                  onChange={(e) => updateProg("description", e.target.value)}
                />
              </div>
            </div>
            <div className="mt-6 pt-6 border-t space-x-2">
              <button
                onClick={() => setShowSavePopup(true)}
                className="blue-btn"
              >
                Save Changes
              </button>
              <button onClick={handleBack} className="ash-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    // ACTIVITIES
    if (selectedSection === "activities") {
      const act = selectedDepartment.departmentActivities[editingIndex];
      if (!act) return null;

      const updateAct = (field: keyof Activity, val: any) => {
        const updated = { ...selectedDepartment };
        updated.departmentActivities[editingIndex] = { ...act, [field]: val };
        setSelectedDepartment(updated);
      };

      return (
        <div className="p-6 min-h-screen">
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <div className="border border-gray-300 rounded-lg p-6 bg-white max-w-3xl">
            <Heading
              title="Edit Activity"
              size="lg"
              align="left"
              className="mb-6"
            />
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={act.programTitle}
                    onChange={(e) => updateAct("programTitle", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={act.date}
                    onChange={(e) => updateAct("date", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Location
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={act.location}
                  onChange={(e) => updateAct("location", e.target.value)}
                />
              </div>

              {/* Lists inside Activity */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium">
                    About Program
                  </label>
                </div>
                {act.aboutProgram?.map((pt, i) => (
                  <div key={i} className="flex gap-2 space-y-2 mb-3">
                    <input
                      className="w-full p-2 border border-gray-300 rounded-md py-1"
                      value={pt}
                      onChange={(e) => {
                        const pts = [...act.aboutProgram];
                        pts[i] = e.target.value;
                        updateAct("aboutProgram", pts);
                      }}
                    />
                    <button
                      onClick={() => {
                        const pts = [...act.aboutProgram];
                        pts.splice(i, 1);
                        updateAct("aboutProgram", pts);
                      }}
                      className="bg-gray-200 p-3 rounded-full text-red-600"
                    >
                      <Trash2Icon size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    updateAct("aboutProgram", [...(act.aboutProgram || []), ""])
                  }
                  className="green-btn text-xs"
                >
                  + Add Point
                </button>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium">
                    Outcomes (Points)
                  </label>
                </div>
                {act.programOutcomes?.map((pt, i) => (
                  <div key={i} className="flex gap-2 mb-2 space-y-2">
                    <input
                      className="w-full p-2 border border-gray-300 rounded-md py-1"
                      value={pt}
                      onChange={(e) => {
                        const pts = [...act.programOutcomes];
                        pts[i] = e.target.value;
                        updateAct("programOutcomes", pts);
                      }}
                    />
                    <button
                      onClick={() => {
                        const pts = [...act.programOutcomes];
                        pts.splice(i, 1);
                        updateAct("programOutcomes", pts);
                      }}
                      className="bg-gray-200 p-3 rounded-full text-red-600"
                    >
                      <Trash2Icon size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    updateAct("programOutcomes", [
                      ...(act.programOutcomes || []),
                      "",
                    ])
                  }
                  className="green-btn text-xs"
                >
                  + Add Point
                </button>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t space-x-2">
              <button
                onClick={() => setShowSavePopup(true)}
                className="blue-btn"
              >
                Save Changes
              </button>
              <button onClick={handleBack} className="ash-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    // COURSES OR SKILLS
    if (selectedSection === "courses" || selectedSection === "skills") {
      const field =
        selectedSection === "courses" ? "certificateCourses" : "skillPrograms";
      const val = (selectedDepartment[field] as string[])[editingIndex];

      return (
        <div className="p-6 min-h-screen">
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <div className="border border-gray-300 rounded-lg p-6 bg-white max-w-xl">
            <Heading
              title="Edit Item"
              size="lg"
              align="left"
              className="mb-6"
            />
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                className="w-full p-2 border border-gray-300 rounded-md"
                value={val}
                onChange={(e) => {
                  const updated = { ...selectedDepartment };
                  (updated[field] as string[])[editingIndex] = e.target.value;
                  setSelectedDepartment(updated);
                }}
              />
            </div>
            <div className="mt-6 pt-6 border-t space-x-2">
              <button
                onClick={() => setShowSavePopup(true)}
                className="blue-btn"
              >
                Save Changes
              </button>
              <button onClick={handleBack} className="ash-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // -------------------------------------------------------------------
  // MAIN SCENE SWITCHER
  // -------------------------------------------------------------------

  if (loading && data.length === 0)
    return <div className="text-center py-8">Loading...</div>;

  let currentView;
  if (editingIndex !== null && selectedSection && selectedDepartment) {
    if (selectedSection === "gallery") {
      currentView = renderSectionList(); // Gallery handles own edit/add in list view
    } else {
      currentView = renderEditForm();
    }
  } else if (selectedSection && selectedDepartment) {
    currentView = renderSectionList();
  } else if (selectedDepartment) {
    currentView = renderDepartmentDetails();
  } else {
    currentView = renderDepartmentList();
  }

  return (
    <>
      {currentView}

      {/* Popups reuse strictly from Committee pattern except tailored text */}

      <ConfirmationPopup
        isOpen={showSavePopup}
        onClose={() => setShowSavePopup(false)}
        onConfirm={handleSaveChanges}
        title="Save Changes?"
        message="Save changes to this Department? This will update the database."
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
        title="Delete Item?"
        message="Are you sure you want to delete this item? If it is a saved image, it will be removed permanently upon saving. This action cannot be undone."
        confirmText="Delete"
        confirmStyle="bg-red-600 hover:bg-red-700"
      />

      {/* Add Department Modal uses InputModal */}
      <InputModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onConfirm={handleCreateNewDepartment}
        title="Add New Department"
        message="Enter the name for the new department"
        placeholder="e.g., Physics"
        confirmText="Create Department"
        defaultValue=""
      />
    </>
  );
};

export default DepartmentsDataManager;

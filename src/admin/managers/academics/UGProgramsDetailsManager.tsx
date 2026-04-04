import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "../../../utils/axiosInstance";
import Heading from "@/components/reusable/Heading";
import { ArrowLeft, Plus, Edit2, Trash2, GraduationCap } from "lucide-react";

interface UGProgram {
  _id?: string;
  id: number | string;
  programme: string;
  degree: string;
  stream: string;
  category: string;
}

const UGProgramsDetailsManager: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<UGProgram[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [editItem, setEditItem] = useState<UGProgram | null>(null);

  const collectionName = "academics/ugprogramsdatadetails";

  // ---------------------------
  // FETCH DATA
  // ---------------------------
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.get(`/${collectionName}`);

      // Clean API structure: extract "data" if nested, otherwise use as is
      // Handles both { data: {...} } and flat objects if needed
      const cleaned = Array.isArray(res.data)
        ? res.data.map((item: any) => ({
            _id: item._id,
            ...(item.data || item),
          }))
        : [];

      setData(cleaned);
    } catch (e: any) {
      setError("Failed to load: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // SAVE (Create / Update)
  // ---------------------------
  const handleSave = async () => {
    if (!editItem) return;

    // Use consistent structure wrapping in "data" property if backend expects it
    const payload = { data: editItem };

    try {
      if (isNew) {
        await axiosInstance.post(`/${collectionName}`, payload);
      } else {
        await axiosInstance.put(`/${collectionName}/${editItem._id}`, payload);
      }

      toast({
        title: "Success",
        description: isNew
          ? "Programme created successfully"
          : "Programme updated successfully",
      });
      setIsEditing(false);
      fetchData();
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Error saving: " + err.message,
        variant: "destructive",
      });
    }
  };

  // ---------------------------
  // DELETE
  // ---------------------------
  const handleDelete = async (id: string) => {
    if (!window.confirm("Do you want to delete this programme?")) return;

    try {
      await axiosInstance.delete(`/${collectionName}/${id}`);
      fetchData();
      toast({
        title: "Success",
        description: "Programme deleted successfully",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Error deleting: " + err.message,
        variant: "destructive",
      });
    }
  };

  // ---------------------------
  // NAVIGATION
  // ---------------------------
  const handleBack = () => {
    setIsEditing(false);
    setEditItem(null);
    setIsNew(false);
  };

  const handleAddNew = () => {
    setEditItem({
      id: "",
      programme: "",
      degree: "",
      stream: "",
      category: "",
    });
    setIsNew(true);
    setIsEditing(true);
  };

  const handleEdit = (item: UGProgram) => {
    setEditItem({ ...item });
    setIsNew(false);
    setIsEditing(true);
  };

  // ---------------------------
  // FORM FIELD UPDATER
  // ---------------------------
  const updateField = (field: keyof UGProgram, value: any) => {
    if (!editItem) return;
    setEditItem({ ...editItem, [field]: value });
  };

  // ---------------------------
  // RENDER FORM
  // ---------------------------
  const renderForm = () => {
    if (!editItem) return null;

    return (
      <div className="p-6">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="form-container border border-gray-300 rounded-lg p-6 bg-white max-w-4xl shadow-sm">
          <Heading
            title={isNew ? "Add New UG Programme" : "Edit UG Programme"}
            size="lg"
            align="left"
          />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Programme Name */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Programme Name
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={editItem.programme}
                onChange={(e) => updateField("programme", e.target.value)}
                placeholder="e.g. Bachelor of Computer Applications"
              />
            </div>

            {/* Degree */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Degree
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={editItem.degree}
                onChange={(e) => updateField("degree", e.target.value)}
                placeholder="e.g. BCA"
              />
            </div>

            {/* Stream */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stream
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={editItem.stream}
                onChange={(e) => updateField("stream", e.target.value)}
                placeholder="e.g. Computer Science"
              />
            </div>

            {/* Category */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={editItem.category}
                onChange={(e) => updateField("category", e.target.value)}
                placeholder="e.g. Existing"
              />
            </div>
          </div>

           <div className="mt-8 pt-6 border-t border-gray-200 space-x-2">
            <button className="blue-btn" onClick={handleSave}>
              Save Changes
            </button>
            <button className="ash-btn" onClick={handleBack}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ---------------------------
  // MAIN RENDER
  // ---------------------------
  if (loading && !data.length && !isEditing)
    return <div className="text-center py-10">Loading...</div>;

  if (isEditing) {
    return renderForm();
  }

  return (
    <div className="collection-manager p-6 min-h-screen">
      <div className=" mx-auto">
        {/* We can add a top-level back button if needed, but usually listing is the root */}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
                     <Heading title="UG Programmes Management" size="lg" align="left" />

            <p className="text-sm text-gray-500 mt-1">
              Manage undergraduate courses and details
            </p>
          </div>

          <button
            className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium shadow-sm hover:shadow-md"
            onClick={handleAddNew}
          >
            <Plus size={20} />
            Add New Programme
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {data.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg text-gray-500">No programmes found</p>
            <p className="text-sm text-gray-400">
              Add a new programme to get started
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {data.map((item) => (
                       <div
                         key={item._id}
                         className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
                       >
                         <div className="flex justify-between items-start">
                           <div className="pr-12">
                             
                             <h3 className="text-lg font-bold text-purple  mb-1 leading-tight">
                               {item.programme}
                             </h3>
         
                             <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                               <span className="font-medium text-gray-700">Stream:</span>{" "}
                               {item.stream}
                             </div>
         
                             <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                               <span className="font-medium text-gray-700">Degree:</span>{" "}
                                  {item.degree}
                             </div>
         
                             <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                               <span className="font-medium text-gray-700">Category:</span>{" "}
                               {item.category}
                             </div>
                             {/* <div className="flex items-center gap-2 mt-2">
                               <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
                           
                               </span>
                               {item.category && (
                                 <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                                   {item.category}
                                 </span>
                               )}
                             </div> */}
         
                           </div>
         
                           <div className="absolute top-5 right-5 flex items-center gap-2 opacity-100 transition-opacity">
                             <button
                               className="blue-btn flex items-center gap-2"
                               onClick={() => handleEdit(item)}
                               title="Edit"
                             >
                               <Edit2 size={16} /> Edit
                             </button>
                             <button
                               className="trash-btn p-3 rounded-md"
                               onClick={() => item._id && handleDelete(item._id)}
                               title="Delete"
                             >
                               <Trash2 size={16} /> 
                             </button>
                           </div>
                         </div>
                       </div>
                     ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UGProgramsDetailsManager;

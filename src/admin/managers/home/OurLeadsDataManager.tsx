import React, { useState, useEffect, useRef, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import axiosInstance from "../../../utils/axiosInstance";
import Heading from "@/components/reusable/Heading";
import ImageUploadManager from "../../components/ImageUploadManager";
import PreviewWrapper from "@/admin/PreviewWrapper";
import OurLeadership from "@/components/OurLeadership";
import { AlertCircle, X, Trash2, AlertTriangle } from "lucide-react";
import ScrollDownToPreview from "../../components/ScrollDownToPreview";

/* ========================= TYPES ========================= */

interface Lead {
  _id?: string;
  name: string;
  role: string;
  img: string;
  path: string;
}

interface LeadsDoc {
  _id?: string;
  data: Lead[];
}

/* ========================= CONFIRMATION POPUP ========================= */

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
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X />
        </button>

        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
            <AlertCircle className="text-yellow-600" />
          </div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onConfirm}
            className={`flex-1 text-white py-2 rounded ${confirmStyle}`}
          >
            {confirmText}
          </button>
          {showCancel && (
            <button onClick={onClose} className="flex-1 bg-gray-200 rounded">
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ========================= MAIN COMPONENT ========================= */

const OurLeadsDataManager: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<LeadsDoc[]>([]);
  const [editItem, setEditItem] = useState<LeadsDoc | null>(null);
  const [originalItem, setOriginalItem] = useState<LeadsDoc | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tempFiles, setTempFiles] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  const isSavingRef = useRef(false);
  const collectionName = "home/ourleads";

  /* ========================= FETCH (FIXED) ========================= */

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/${collectionName}`);

      // 🔥 FIX: normalize backend array → LeadsDoc
      const normalized: LeadsDoc = {
        data: Array.isArray(res.data) ? res.data : [],
      };

      setData([normalized]);
      setEditItem(JSON.parse(JSON.stringify(normalized)));
      setOriginalItem(JSON.parse(JSON.stringify(normalized)));

      console.log("Normalized Data:", normalized);
    } catch (e: any) {
      setError("Failed to load leadership data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ========================= CHANGE DETECTION ========================= */

  useEffect(() => {
    if (!editItem || !originalItem) return;
    setHasUnsavedChanges(
      JSON.stringify(editItem) !== JSON.stringify(originalItem)
    );
  }, [editItem, originalItem]);

  /* ========================= UPDATE LEAD ========================= */

  const updateLead = (index: number, field: keyof Lead, value: string) => {
    if (!editItem) return;
    const updated = structuredClone(editItem);
    updated.data[index][field] = value;
    setEditItem(updated);
  };

  const deleteLead = (index: number) => {
    if (!editItem || editItem.data.length <= 1) return;
    const updated = structuredClone(editItem);
    updated.data.splice(index, 1);
    setEditItem(updated);
  };

  /* ========================= SAVE ========================= */

  const handleSave = async () => {
    if (!editItem) return;
    isSavingRef.current = true;
    setShowSavePopup(false);

    try {
      await axiosInstance.put(`/${collectionName}`, editItem.data);
      setOriginalItem(structuredClone(editItem));
      setTempFiles([]);
      toast({
        title: "Success",
        description: "Leadership data saved successfully!",
      });
    } catch (e: any) {
      setError("Save failed");
      toast({
        title: "Error",
        description: "Error saving: " + (e.message || "Unknown error"),
        variant: "destructive",
      });
    } finally {
      isSavingRef.current = false;
    }
  };

  const handleCancel = () => {
    setShowCancelPopup(false);
    setEditItem(structuredClone(originalItem!));
  };

  /* ========================= RENDER ========================= */

  if (loading && !editItem) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded mb-4 flex gap-2">
          <AlertTriangle /> {error}
        </div>
      )}

      {hasUnsavedChanges && <ScrollDownToPreview />}

      <Heading title="Our Leadership" size="lg" />

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {editItem?.data.map((lead, index) => (
          <div key={lead._id || index} className="p-6 border rounded-lg">
            <div className="flex justify-between mb-4">
              <h4 className="font-semibold">Member {index + 1}</h4>
              <button onClick={() => deleteLead(index)}>
                <Trash2 />
              </button>
            </div>

            <input
              className="input mb-3"
              value={lead.name}
              onChange={(e) => updateLead(index, "name", e.target.value)}
              placeholder="Name"
            />

            <input
              className="input mb-3"
              value={lead.role}
              onChange={(e) => updateLead(index, "role", e.target.value)}
              placeholder="Role"
            />

            <ImageUploadManager
              label="Profile Image"
              value={lead.img}
              onChange={(v) => updateLead(index, "img", v)}
              addTemp={(f) => setTempFiles((p) => [...p, f])}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        <button className="blue-btn" onClick={() => setShowSavePopup(true)}>
          Save Changes
        </button>
        <button className="ash-btn" onClick={() => setShowCancelPopup(true)}>
          Cancel
        </button>
      </div>

      <div className="mt-10 border rounded p-6">
        <Heading title="Live Preview" size="lg" />
        <PreviewWrapper
          Component={OurLeadership}
          previewData={{ leads: editItem?.data || [] }}
        />
      </div>

      <ConfirmationPopup
        isOpen={showSavePopup}
        onClose={() => setShowSavePopup(false)}
        onConfirm={handleSave}
        title="Save changes?"
        message="This will update the site permanently."
        confirmText="Save"
      />

      <ConfirmationPopup
        isOpen={showCancelPopup}
        onClose={() => setShowCancelPopup(false)}
        onConfirm={handleCancel}
        title="Discard changes?"
        message="All changes will be lost."
        confirmText="Discard"
        confirmStyle="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default OurLeadsDataManager;

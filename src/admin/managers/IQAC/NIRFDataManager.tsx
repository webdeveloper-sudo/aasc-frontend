import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { useToast } from "@/components/ui/use-toast";

interface NIRFData {
  _id?: string;
  id: number;
  text: string;
}

// ---------------- SANITIZER ----------------
const sanitize = (item: any): NIRFData => ({
  _id: item?._id || "",
  id: item?.id ?? 0,
  text: item?.text ?? "",
});

// Default safe object
const EMPTY_ITEM: NIRFData = {
  id: 1,
  text: "",
};

const NIRFDataManager: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<NIRFData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState<NIRFData | null>(null);
  const [isNew, setIsNew] = useState(false);

  const collectionName = "iqac/nirfdata";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.get(`/${collectionName}`);

      const cleaned = (Array.isArray(res.data) ? res.data : [res.data]).map(
        sanitize
      );

      setData(cleaned);
    } catch (e: any) {
      setError("Failed to load data: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editItem) return;

    const safe = sanitize(editItem);

    try {
      if (isNew) {
        await axiosInstance.post(`/${collectionName}`, safe);
      } else {
        await axiosInstance.put(`/${collectionName}/${safe._id}`, safe);
      }

      toast({
        title: "Success",
        description: "Saved successfully",
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

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await axiosInstance.delete(`/${collectionName}/${id}`);
      fetchData();
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Error deleting: " + err.message,
        variant: "destructive",
      });
    }
  };

  const updateField = (field: keyof NIRFData, value: any) => {
    if (!editItem) return;
    setEditItem(sanitize({ ...editItem, [field]: value }));
  };

  const renderForm = () => {
    if (!editItem) return null;

    const safe = sanitize(editItem);

    return (
      <div className="form-container" style={{ maxWidth: 800 }}>
        <h3 style={{ marginBottom: "1.5rem" }}>
          {isNew ? "Create New NIRF Data" : "Edit NIRF Data"}
        </h3>

        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label className="form-label">ID</label>
          <input
            type="number"
            value={safe.id}
            onChange={(e) => updateField("id", parseInt(e.target.value))}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label className="form-label">Text</label>
          <textarea
            rows={6}
            value={safe.text}
            onChange={(e) => updateField("text", e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            gap: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <button className="btn btn-primary" onClick={handleSave}>
            Save Changes
          </button>
          <button
            className="btn"
            style={{ background: "#ccc" }}
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div className="collection-manager">
      <div
        className="admin-header"
        style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
      >
        <h2>NIRF Data</h2>
        {!isEditing && (
          <button
            className="btn btn-primary"
            style={{ marginLeft: 12 }}
            onClick={() => {
              setEditItem({ ...EMPTY_ITEM, id: data.length + 1 });
              setIsNew(true);
              setIsEditing(true);
            }}
          >
            + Add New
          </button>
        )}
      </div>

      {error && <div style={{ marginTop: 8, color: "red" }}>{error}</div>}

      {isEditing ? (
        renderForm()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {data.map((raw) => {
            const item = sanitize(raw);

            return (
              <div
                key={item._id}
                style={{
                  padding: "1rem",
                  border: "1px solid #e2e8f0",
                  borderRadius: 6,
                  background: "white",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: 8 }}>
                  NIRF Info #{item.id}
                </div>

                <div
                  style={{
                    color: "#64748b",
                    fontSize: "0.85rem",
                    marginBottom: 4,
                  }}
                >
                  {item.text
                    ? item.text.substring(0, 100) + "..."
                    : "(No text available)"}
                </div>

                <div style={{ color: "#64748b", fontSize: "0.85rem" }}>
                  ID: {item._id}
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button
                    className="btn"
                    onClick={() => {
                      setEditItem(item);
                      setIsNew(false);
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="btn"
                    style={{ background: "#fee2e2", color: "#dc2626" }}
                    onClick={() => item._id && handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NIRFDataManager;

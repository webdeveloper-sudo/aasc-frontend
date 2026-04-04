import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useToast } from "@/components/ui/use-toast";

interface SeedData {
  _id?: string;
  id: number;
  image: string;
  text: string;
}

const SeedDataManager: React.FC = () => {
  const { toast } = useToast();
  const collection = "campus-life/seeddata";

  const [items, setItems] = useState<SeedData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [editItem, setEditItem] = useState<SeedData | null>(null);

  // -----------------------------------------------------------
  // FETCH ALL
  // -----------------------------------------------------------
  const fetchItems = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axiosInstance.get(`/${collection}`);
      const arr = Array.isArray(res.data) ? res.data : [res.data];

      setItems(arr.filter(Boolean));
    } catch (err: any) {
      setError("Failed to load data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // -----------------------------------------------------------
  // CREATE / UPDATE
  // -----------------------------------------------------------
  const saveItem = async () => {
    if (!editItem) return;

    try {
      if (isNew) {
        await axiosInstance.post(`/${collection}`, editItem);
      } else {
        await axiosInstance.put(`/${collection}/${editItem._id}`, editItem);
      }

      toast({
        title: "Success",
        description: "Saved successfully",
      });
      setIsEditing(false);
      fetchItems();
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Save failed: " + err.message,
        variant: "destructive",
      });
    }
  };

  // -----------------------------------------------------------
  // DELETE
  // -----------------------------------------------------------
  const deleteItem = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this item?")) return;

    try {
      await axiosInstance.delete(`/${collection}/${id}`);
      toast({
        title: "Success",
        description: "Deleted successfully",
      });
      fetchItems();
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Delete failed: " + err.message,
        variant: "destructive",
      });
    }
  };

  // -----------------------------------------------------------
  // UPDATE FIELD IN FORM
  // -----------------------------------------------------------
  const updateField = (field: keyof SeedData, value: any) => {
    if (!editItem) return;
    setEditItem({ ...editItem, [field]: value });
  };

  // -----------------------------------------------------------
  // FORM UI
  // -----------------------------------------------------------
  const renderForm = () => {
    if (!editItem) return null;

    return (
      <div style={{ maxWidth: 700 }}>
        <h3>{isNew ? "Create New SEED Data" : "Edit SEED Data"}</h3>

        <label>ID</label>
        <input
          type="number"
          value={editItem.id}
          onChange={(e) => updateField("id", Number(e.target.value))}
          style={{ width: "100%", padding: 8, margin: "8px 0" }}
        />

        <label>Image</label>
        <input
          type="text"
          value={editItem.image}
          onChange={(e) => updateField("image", e.target.value)}
          style={{ width: "100%", padding: 8, margin: "8px 0" }}
        />

        <label>Text</label>
        <textarea
          value={editItem.text}
          rows={5}
          onChange={(e) => updateField("text", e.target.value)}
          style={{ width: "100%", padding: 8, margin: "8px 0" }}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
          <button className="btn btn-primary" onClick={saveItem}>
            Save
          </button>
          <button className="btn" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      </div>
    );
  };

  // -----------------------------------------------------------
  // MAIN UI
  // -----------------------------------------------------------
  if (loading) return <div>Loading…</div>;

  return (
    <div className="collection-manager">
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <h2>SEED Data</h2>

        {!isEditing && (
          <button
            className="btn btn-primary"
            style={{ marginLeft: 12 }}
            onClick={() => {
              setEditItem({
                id: items.length + 1,
                image: "",
                text: "",
              });
              setIsNew(true);
              setIsEditing(true);
            }}
          >
            + Add New
          </button>
        )}
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {isEditing ? (
        renderForm()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <div
              key={item._id}
              style={{
                padding: 16,
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                background: "#fff",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: 8 }}>
                SEED Item #{item.id}
              </div>

              <div style={{ color: "#555", fontSize: 14 }}>
                {(item?.text ?? "").substring(0, 100)}...
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#999",
                  marginTop: 8,
                }}
              >
                DB ID: {item._id}
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
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
                  onClick={() => deleteItem(item._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeedDataManager;

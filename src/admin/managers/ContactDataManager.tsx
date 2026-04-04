import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useToast } from "@/components/ui/use-toast";

interface ContactData {
  _id?: string;
  data: {
    facebook: {
      label: string;
      path: string;
    };
    instagram: {
      label: string;
      path: string;
    };
    youtube: {
      label: string;
      path: string;
    };
  };
}

const ContactDataManager: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<ContactData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState<ContactData | null>(null);
  const [isNew, setIsNew] = useState(false);

  const collectionName = "contact/contactdata";

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleSave = async () => {
    if (!editItem) return;
    try {
      if (isNew) {
        await axiosInstance.post(`/${collectionName}`, editItem);
      } else {
        await axiosInstance.put(`/${collectionName}/${editItem._id}`, editItem);
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
    if (!window.confirm("Delete this contact data?")) return;
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

  const updateField = (path: string, value: any) => {
    if (!editItem) return;
    const updated = { ...editItem };
    const parts = path.split(".");
    let current: any = updated;

    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = value;
    setEditItem(updated);
  };

  const renderForm = () => {
    if (!editItem) return null;

    return (
      <div className="form-container" style={{ maxWidth: 800 }}>
        <h3 style={{ marginBottom: "1.5rem" }}>
          {isNew ? "Create New" : "Edit Contact/Social Links"}
        </h3>

        {/* Facebook */}
        <div
          style={{
            marginBottom: "2rem",
            padding: "1rem",
            background: "#f9fafb",
            borderRadius: 6,
          }}
        >
          <strong style={{ display: "block", marginBottom: "1rem" }}>
            Facebook
          </strong>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Label</label>
            <input
              type="text"
              value={editItem.data.facebook.label}
              onChange={(e) =>
                updateField("data.facebook.label", e.target.value)
              }
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">URL</label>
            <input
              type="text"
              value={editItem.data.facebook.path}
              onChange={(e) =>
                updateField("data.facebook.path", e.target.value)
              }
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>

        {/* Instagram */}
        <div
          style={{
            marginBottom: "2rem",
            padding: "1rem",
            background: "#f9fafb",
            borderRadius: 6,
          }}
        >
          <strong style={{ display: "block", marginBottom: "1rem" }}>
            Instagram
          </strong>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Label</label>
            <input
              type="text"
              value={editItem.data.instagram.label}
              onChange={(e) =>
                updateField("data.instagram.label", e.target.value)
              }
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">URL</label>
            <input
              type="text"
              value={editItem.data.instagram.path}
              onChange={(e) =>
                updateField("data.instagram.path", e.target.value)
              }
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>

        {/* YouTube */}
        <div
          style={{
            marginBottom: "2rem",
            padding: "1rem",
            background: "#f9fafb",
            borderRadius: 6,
          }}
        >
          <strong style={{ display: "block", marginBottom: "1rem" }}>
            YouTube
          </strong>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">Label</label>
            <input
              type="text"
              value={editItem.data.youtube.label}
              onChange={(e) =>
                updateField("data.youtube.label", e.target.value)
              }
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label className="form-label">URL</label>
            <input
              type="text"
              value={editItem.data.youtube.path}
              onChange={(e) => updateField("data.youtube.path", e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          </div>
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
        <h2>Contact/Social Links</h2>
        {!isEditing && (
          <button
            className="btn btn-primary"
            style={{ marginLeft: 12 }}
            onClick={() => {
              setEditItem({
                data: {
                  facebook: { label: "Facebook", path: "" },
                  instagram: { label: "Instagram", path: "" },
                  youtube: { label: "YouTube", path: "" },
                },
              });
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
          {data.map((item) => (
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
                Social Links
              </div>
              <div
                style={{
                  color: "#64748b",
                  fontSize: "0.85rem",
                  marginBottom: 4,
                }}
              >
                Facebook: {item?.data?.facebook?.path ?? "N/A"}
              </div>

              <div
                style={{
                  color: "#64748b",
                  fontSize: "0.85rem",
                  marginBottom: 4,
                }}
              >
                Instagram: {item?.data?.instagram?.path ?? "N/A"}
              </div>

              <div
                style={{
                  color: "#64748b",
                  fontSize: "0.85rem",
                  marginBottom: 4,
                }}
              >
                YouTube: {item?.data?.youtube?.path ?? "N/A"}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactDataManager;

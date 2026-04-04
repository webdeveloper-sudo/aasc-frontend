import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useToast } from "@/components/ui/use-toast";

interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  profileImage: string | null;
}

const UsersManager: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState<User | null>(null);
  const [isNew, setIsNew] = useState(false);

  const collectionName = "users";

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
        // Don't send password if it's empty (means no change)
        const payload = { ...editItem };
        if (!payload.password) {
          delete payload.password;
        }
        await axiosInstance.put(`/${collectionName}/${editItem._id}`, payload);
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
    if (!window.confirm("Delete this user? This action cannot be undone."))
      return;
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

  const updateField = (field: keyof User, value: any) => {
    if (!editItem) return;
    setEditItem({ ...editItem, [field]: value });
  };

  const renderForm = () => {
    if (!editItem) return null;

    return (
      <div className="form-container" style={{ maxWidth: 800 }}>
        <h3 style={{ marginBottom: "1.5rem" }}>
          {isNew ? "Create New User" : "Edit User"}
        </h3>

        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label className="form-label">Name</label>
          <input
            type="text"
            value={editItem.name}
            onChange={(e) => updateField("name", e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label className="form-label">Email</label>
          <input
            type="email"
            value={editItem.email}
            onChange={(e) => updateField("email", e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label className="form-label">
            Password {!isNew && "(leave blank to keep current)"}
          </label>
          <input
            type="password"
            value={editItem.password}
            onChange={(e) => updateField("password", e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
            placeholder={
              isNew ? "Enter password" : "Leave blank to keep current password"
            }
          />
        </div>

        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label className="form-label">Role</label>
          <select
            value={editItem.role}
            onChange={(e) => updateField("role", e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <input
              type="checkbox"
              checked={editItem.isActive}
              onChange={(e) => updateField("isActive", e.target.checked)}
            />
            <span>Active</span>
          </label>
        </div>

        <div className="form-group" style={{ marginBottom: "1rem" }}>
          <label className="form-label">Profile Image</label>
          <input
            type="text"
            value={editItem.profileImage || ""}
            onChange={(e) =>
              updateField("profileImage", e.target.value || null)
            }
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
            placeholder="Optional profile image URL"
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
        <h2>Users</h2>
        {!isEditing && (
          <button
            className="btn btn-primary"
            style={{ marginLeft: 12 }}
            onClick={() => {
              setEditItem({
                name: "",
                email: "",
                password: "",
                role: "viewer",
                isActive: true,
                profileImage: null,
              });
              setIsNew(true);
              setIsEditing(true);
            }}
          >
            + Add New User
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
                {item.name}
              </div>
              <div
                style={{
                  color: "#64748b",
                  fontSize: "0.85rem",
                  marginBottom: 4,
                }}
              >
                Email: {item.email}
              </div>
              <div
                style={{
                  color: "#64748b",
                  fontSize: "0.85rem",
                  marginBottom: 4,
                }}
              >
                Role: {item.role}
              </div>
              <div
                style={{
                  color: "#64748b",
                  fontSize: "0.85rem",
                  marginBottom: 4,
                }}
              >
                Status: {item.isActive ? "Active" : "Inactive"}
              </div>
              <div style={{ color: "#64748b", fontSize: "0.85rem" }}>
                ID: {item._id}
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button
                  className="btn"
                  onClick={() => {
                    setEditItem({ ...item, password: "" }); // Don't show password
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

export default UsersManager;

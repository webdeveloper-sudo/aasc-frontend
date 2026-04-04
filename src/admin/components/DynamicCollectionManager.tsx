import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { COLLECTIONS } from "../constants";
import { useToast } from "@/components/ui/use-toast";

// Fallback local imports
const dataFiles = import.meta.glob("../../data/**/*.{js,ts}", { eager: true });

// --------------------------------------
// Fields we must hide from UI completely
// --------------------------------------
const META_FIELDS = new Set([
  "_id",
  "_sourceFile",
  "exportName",
  "importedAt",
  "__origin_export",
  "__origin_file",
  "__v",
  "createdAt",
  "updatedAt",
]);

// Recursive helper to extract only editable fields from data
const extractEditableFields = (obj: any): any => {
  if (!obj || typeof obj !== "object") return obj;

  const result: any = {};
  for (const key in obj) {
    if (META_FIELDS.has(key)) continue; // Skip metadata

    const value = obj[key];

    // If nested object, extract recursively
    if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = extractEditableFields(value);
    } else {
      result[key] = value;
    }
  }

  return result;
};

// Detect if item has flat structure (fields at root) or nested (fields in data)
const isNestedStructure = (item: any): boolean => {
  return item && typeof item.data === "object" && item.data !== null;
};

// Get editable data from item (handles both formats)
const getEditableData = (item: any): any => {
  if (isNestedStructure(item)) {
    return extractEditableFields(item.data || {});
  } else {
    return extractEditableFields(item);
  }
};

// --------------------------------------
// Modal Component
// --------------------------------------
const CenteredModal: React.FC<{
  open: boolean;
  title?: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={onCancel}
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: "blur(6px)",
          background: "rgba(15,23,42,0.35)",
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "relative",
          background: "white",
          borderRadius: 12,
          padding: "1.25rem",
          width: "min(600px, 90%)",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 8px 30px rgba(2,6,23,0.2)",
        }}
      >
        {title && <h3 style={{ marginBottom: 8 }}>{title}</h3>}
        <div style={{ marginBottom: 16 }}>{message}</div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button
            className="btn"
            onClick={onCancel}
            style={{ background: "#e6eef8" }}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={onConfirm}
            style={{ background: "#ef4444", color: "white" }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// --------------------------------------
// Main Component
// --------------------------------------
interface DynamicCollectionManagerProps {
  collectionId?: string;
}

const DynamicCollectionManager: React.FC<DynamicCollectionManagerProps> = ({
  collectionId: propCollectionId,
}) => {
  const { toast } = useToast();
  const { collectionId: paramCollectionId } = useParams<{
    collectionId: string;
  }>();
  const collectionId = propCollectionId || paramCollectionId;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [isNew, setIsNew] = useState(false);
  const [itemStructure, setItemStructure] = useState<"flat" | "nested">(
    "nested"
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // For array item editing
  const [arrayItemModal, setArrayItemModal] = useState<{
    open: boolean;
    path: string;
    index: number | null;
    item: any;
  }>({ open: false, path: "", index: null, item: null });

  const collectionLabel =
    COLLECTIONS.find((c) => c.id === collectionId)?.label || collectionId;

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    if (!collectionId) return;
    fetchData();
    return () => {
      setSelectedIds(new Set());
      setSelectAll(false);
    };
  }, [collectionId]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    setData(null);
    setIsEditing(false);

    try {
      const res = await axiosInstance.get(`/${collectionId}`);
      setData(res.data);
      console.log(res);
    } catch (e) {
      console.warn("Backend failed. Trying fallback…");
      try {
        const fallback = loadFallbackData(collectionId!);
        if (fallback) {
          setData(fallback);
          setError(
            "Backend unavailable — showing local static data (read-only)."
          );
          setIsReadOnly(true);
        }
      } catch {
        setError("Unable to load backend or fallback data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackData = (col: string) => {
    for (const path in dataFiles) {
      const normalized = path
        .replace("../../data/", "")
        .replace(/\.(js|ts)$/, "")
        .split("/")
        .join("__")
        .toLowerCase();
      if (normalized === col) return dataFiles[path].default;
    }
    return null;
  };

  // ---------------- SAVE ----------------
  const handleSave = async () => {
    if (!editItem) return;

    const cleanData = getEditableData(editItem);

    try {
      if (isNew) {
        const payload =
          itemStructure === "nested" ? { data: cleanData } : cleanData;
        await axiosInstance.post(`/${collectionId}`, payload);
      } else {
        const payload = isNestedStructure(editItem)
          ? { data: cleanData }
          : cleanData;
        await axiosInstance.put(`/${collectionId}/${editItem._id}`, payload);
      }

      toast({
        variant: "success",
        title: "Success!",
        description: "Item created successfully.",
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

  // ---------------- DELETE ----------------
  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this item?")) return;
    await axiosInstance.delete(`/${collectionId}/${id}`);
    fetchData();
  };

  const handleDeleteSelected = async () => {
    const ids = Array.from(selectedIds);
    await Promise.all(
      ids.map((id) => axiosInstance.delete(`/${collectionId}/${id}`))
    );
    setSelectedIds(new Set());
    setShowDeleteModal(false);
    fetchData();
  };

  // ---------------- FIELD UPDATE HELPERS ----------------
  const getNestedValue = (obj: any, path: string) => {
    const parts = path.split(".");
    let current = obj;
    for (const part of parts) {
      if (current === undefined || current === null) return undefined;
      current = current[part];
    }
    return current;
  };

  const updateField = (path: string, newVal: any) => {
    const updated = { ...editItem };
    const parts = path.split(".");

    let cur = itemStructure === "nested" ? updated.data : updated;

    for (let i = 0; i < parts.length - 1; i++) {
      if (!cur[parts[i]]) cur[parts[i]] = {};
      cur = cur[parts[i]];
    }

    cur[parts[parts.length - 1]] = newVal;
    setEditItem(updated);
  };

  // ---------------- ARRAY OPERATIONS ----------------
  const addArrayItem = (path: string) => {
    const array = getNestedValue(
      itemStructure === "nested" ? editItem.data : editItem,
      path
    );

    if (!Array.isArray(array)) return;

    // Create empty object with same structure as first item
    const template = array.length > 0 ? array[0] : {};
    const newItem: any = {};

    for (const key in template) {
      if (typeof template[key] === "number") newItem[key] = 0;
      else if (typeof template[key] === "boolean") newItem[key] = false;
      else newItem[key] = "";
    }

    setArrayItemModal({
      open: true,
      path,
      index: null,
      item: newItem,
    });
  };

  const editArrayItem = (path: string, index: number) => {
    const array = getNestedValue(
      itemStructure === "nested" ? editItem.data : editItem,
      path
    );

    if (!Array.isArray(array) || !array[index]) return;

    setArrayItemModal({
      open: true,
      path,
      index,
      item: { ...array[index] },
    });
  };

  const deleteArrayItem = (path: string, index: number) => {
    if (!window.confirm("Delete this item from the array?")) return;

    const array = getNestedValue(
      itemStructure === "nested" ? editItem.data : editItem,
      path
    );

    if (!Array.isArray(array)) return;

    const newArray = array.filter((_, i) => i !== index);
    updateField(path, newArray);
  };

  const saveArrayItem = () => {
    const { path, index, item } = arrayItemModal;

    const array = getNestedValue(
      itemStructure === "nested" ? editItem.data : editItem,
      path
    );

    if (!Array.isArray(array)) return;

    let newArray;
    if (index === null) {
      // Add new
      newArray = [...array, item];
    } else {
      // Update existing
      newArray = array.map((el, i) => (i === index ? item : el));
    }

    updateField(path, newArray);
    setArrayItemModal({ open: false, path: "", index: null, item: null });
  };

  const updateArrayItemField = (key: string, value: any) => {
    setArrayItemModal((prev) => ({
      ...prev,
      item: { ...prev.item, [key]: value },
    }));
  };

  // ---------------- FORM RENDERER ----------------
  const renderArrayItemForm = () => {
    const { item } = arrayItemModal;
    if (!item) return null;

    return Object.keys(item).map((key) => {
      const value = item[key];
      const label = key
        .replace(/[_-]/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      // Handle arrays and objects with JSON editor
      if (Array.isArray(value) || (value && typeof value === "object")) {
        return (
          <div
            key={key}
            className="form-group"
            style={{ marginBottom: "1rem" }}
          >
            <label
              className="form-label"
              style={{ display: "block", marginBottom: "0.25rem" }}
            >
              {label}
            </label>
            <textarea
              className="form-input"
              rows={6}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: 4,
                border: "1px solid #ccc",
                fontFamily: "monospace",
                fontSize: "0.85rem",
              }}
              value={JSON.stringify(value, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  updateArrayItemField(key, parsed);
                } catch {
                  // Invalid JSON, show error or don't update
                }
              }}
            />
            <small style={{ color: "#64748b", fontSize: "0.8rem" }}>
              Edit as JSON. Must be valid JSON format.
            </small>
          </div>
        );
      }

      // Handle primitives
      return (
        <div key={key} className="form-group" style={{ marginBottom: "1rem" }}>
          <label
            className="form-label"
            style={{ display: "block", marginBottom: "0.25rem" }}
          >
            {label}
          </label>
          <input
            type="text"
            className="form-input"
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
            value={value ?? ""}
            onChange={(e) => updateArrayItemField(key, e.target.value)}
          />
        </div>
      );
    });
  };

  const renderArrayField = (array: any[], path: string, label: string) => {
    return (
      <div style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <strong>
            {label} ({array.length})
          </strong>
          <button
            className="btn btn-primary"
            style={{ fontSize: "0.85rem", padding: "0.25rem 0.75rem" }}
            onClick={() => addArrayItem(path)}
          >
            + Add {label.slice(0, -1)}
          </button>
        </div>

        <div
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: 6,
            padding: "0.75rem",
            background: "#f9fafb",
          }}
        >
          {array.length === 0 ? (
            <div style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
              No items yet
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {array.map((item, index) => {
                const displayText =
                  item.name ||
                  item.title ||
                  item.text?.substring(0, 50) ||
                  `Item ${index + 1}`;

                return (
                  <div
                    key={index}
                    style={{
                      background: "white",
                      padding: "0.75rem",
                      borderRadius: 4,
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ flex: 1, fontSize: "0.9rem" }}>
                      {displayText}
                      {displayText.length > 50 && "..."}
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        className="btn"
                        style={{
                          fontSize: "0.8rem",
                          padding: "0.25rem 0.5rem",
                        }}
                        onClick={() => editArrayItem(path, index)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn"
                        style={{
                          fontSize: "0.8rem",
                          padding: "0.25rem 0.5rem",
                          background: "#fee2e2",
                          color: "#dc2626",
                        }}
                        onClick={() => deleteArrayItem(path, index)}
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
      </div>
    );
  };

  const renderEditableFields = (obj: any, path = "") => {
    return Object.keys(obj).map((key) => {
      const fullPath = path ? `${path}.${key}` : key;
      const value = obj[key];

      const label = key
        .replace(/[_-]/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      // Handle arrays
      if (Array.isArray(value)) {
        // Check if array contains objects
        if (
          value.length > 0 &&
          typeof value[0] === "object" &&
          value[0] !== null
        ) {
          return (
            <div key={fullPath}>{renderArrayField(value, fullPath, label)}</div>
          );
        } else {
          // Simple array (strings, numbers)
          return (
            <div key={fullPath} style={{ marginBottom: "1rem" }}>
              <label className="form-label">{label}</label>
              <textarea
                className="form-input"
                rows={4}
                style={{ width: "100%", fontFamily: "monospace" }}
                value={JSON.stringify(value, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    updateField(fullPath, parsed);
                  } catch {
                    // Invalid JSON, don't update
                  }
                }}
              />
            </div>
          );
        }
      }

      // Handle nested objects
      if (value && typeof value === "object" && !Array.isArray(value)) {
        return (
          <div key={fullPath} style={{ marginBottom: "1rem" }}>
            <strong style={{ display: "block", marginBottom: "0.5rem" }}>
              {label}
            </strong>
            <div
              style={{ paddingLeft: "1rem", borderLeft: "2px solid #e2e8f0" }}
            >
              {renderEditableFields(value, fullPath)}
            </div>
          </div>
        );
      }

      // Handle primitives
      return (
        <div
          key={fullPath}
          className="form-group"
          style={{ marginBottom: "1rem" }}
        >
          <label
            className="form-label"
            style={{ display: "block", marginBottom: "0.25rem" }}
          >
            {label}
          </label>
          <input
            type="text"
            className="form-input"
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
            value={value ?? ""}
            onChange={(e) => updateField(fullPath, e.target.value)}
          />
        </div>
      );
    });
  };

  const renderForm = () => {
    if (!editItem) return null;

    const editable = getEditableData(editItem);

    return (
      <div className="form-container" style={{ maxWidth: 800 }}>
        <h3 style={{ marginBottom: "1.5rem" }}>
          {isNew ? "Create New" : "Edit Item"}
        </h3>

        {renderEditableFields(editable)}

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

  // --------------------------------------
  // RENDER SECTION
  // --------------------------------------
  if (loading) return <div>Loading…</div>;

  return (
    <div className="collection-manager">
      <div
        className="admin-header"
        style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
      >
        <h2>{collectionLabel}</h2>

        {Array.isArray(data) && !isEditing && (
          <>
            <button
              className="btn btn-primary"
              style={{ marginLeft: 12 }}
              onClick={() => {
                const structure =
                  data.length > 0 && isNestedStructure(data[0])
                    ? "nested"
                    : "flat";
                setItemStructure(structure);

                const newItem = structure === "nested" ? { data: {} } : {};

                setEditItem(newItem);
                setIsNew(true);
                setIsEditing(true);
              }}
            >
              + Add New
            </button>

            <button
              className="btn"
              disabled={!selectedIds.size || isReadOnly}
              onClick={() => setShowDeleteModal(true)}
              style={{ marginLeft: 8 }}
            >
              Delete Selected ({selectedIds.size})
            </button>

            <label style={{ marginLeft: 8 }}>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={() => {
                  if (selectAll) {
                    setSelectedIds(new Set());
                    setSelectAll(false);
                  } else {
                    const ids = new Set(data.map((d: any) => d._id));
                    setSelectedIds(ids);
                    setSelectAll(true);
                  }
                }}
              />
              Select All
            </label>
          </>
        )}
      </div>

      {error && <div style={{ marginTop: 8, color: "red" }}>{error}</div>}

      {isEditing ? (
        renderForm()
      ) : Array.isArray(data) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {data.map((item: any) => {
            const displayData = isNestedStructure(item) ? item.data : item;
            const displayTitle =
              displayData?.title ||
              displayData?.name ||
              displayData?.heading ||
              "Item";

            return (
              <div
                key={item._id}
                style={{
                  padding: "1rem",
                  border: "1px solid #e2e8f0",
                  borderRadius: 6,
                  background: "white",
                  position: "relative",
                }}
              >
                <input
                  type="checkbox"
                  disabled={isReadOnly}
                  checked={selectedIds.has(item._id)}
                  onChange={() => {
                    const next = new Set(selectedIds);
                    next.has(item._id)
                      ? next.delete(item._id)
                      : next.add(item._id);
                    setSelectedIds(next);
                  }}
                  style={{ position: "absolute", top: 8, right: 8 }}
                />

                <div style={{ fontWeight: "bold", marginBottom: 8 }}>
                  {displayTitle}
                </div>
                <div style={{ color: "#64748b", fontSize: "0.85rem" }}>
                  ID: {item._id}
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button
                    className="btn"
                    onClick={() => {
                      setItemStructure(
                        isNestedStructure(item) ? "nested" : "flat"
                      );
                      setEditItem(item);
                      setIsNew(false);
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn"
                    disabled={isReadOnly}
                    style={{ background: "#fee2e2", color: "#dc2626" }}
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>No data found</div>
      )}

      {/* Delete Confirmation Modal */}
      <CenteredModal
        open={showDeleteModal}
        title={`Delete ${selectedIds.size} items?`}
        message="This action cannot be undone."
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={() => !isReadOnly && handleDeleteSelected()}
      />

      {/* Array Item Edit Modal */}
      <CenteredModal
        open={arrayItemModal.open}
        title={arrayItemModal.index === null ? "Add New Item" : "Edit Item"}
        message={renderArrayItemForm()}
        onCancel={() =>
          setArrayItemModal({ open: false, path: "", index: null, item: null })
        }
        onConfirm={saveArrayItem}
      />
    </div>
  );
};

export default DynamicCollectionManager;

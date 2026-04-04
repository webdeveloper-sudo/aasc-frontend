import React from "react";
import { useParams, Link } from "react-router-dom";
import { useAdminData, useAdminMutation } from "../hooks/useAdminData";
import { Edit, Trash2, Plus } from "lucide-react";

const DataTable = () => {
  const { entity } = useParams<{ entity: string }>();
  // Handle nested routes like 'academics/departments'
  // If the route is /admin/academics/departments, entity param will be 'departments'
  // but we might need the full path for the API.
  // However, my AdminDashboard routing setup passes 'entity' correctly for top-level routes.
  // For nested routes, I might need to adjust.
  // Let's assume 'entity' matches the API endpoint for now.

  const { data: response, isLoading, error } = useAdminData(entity || "");
  const { deleteMutation } = useAdminMutation(entity || "");

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error loading data</div>;

  let items = response?.data || [];

  // Normalize items if response is wrapped (e.g. { events: [...], pagination: ... })
  if (!Array.isArray(items)) {
    if (items.events) items = items.events;
    else if (items.faculty) items = items.faculty;
    else if (items.departments) items = items.departments;
    else if (items.data) items = items.data;
  }

  // Ensure items is an array
  if (!Array.isArray(items)) items = [];

  if (!items.length) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold capitalize">{entity}</h2>
          <Link
            to="new"
            className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-purple-700"
          >
            <Plus size={18} /> Add New
          </Link>
        </div>
        <p className="text-gray-500">No records found.</p>
      </div>
    );
  }

  // Auto-detect columns from the first item, excluding complex objects/arrays
  const columns = Object.keys(items[0])
    .filter((key) => {
      const val = items[0][key];
      return (
        typeof val !== "object" &&
        key !== "__v" &&
        key !== "_id" &&
        key !== "password"
      );
    })
    .slice(0, 5); // Limit to 5 columns

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold capitalize">{entity}</h2>
        <Link
          to="new"
          className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-purple-700"
        >
          <Plus size={18} /> Add New
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item: any) => (
              <tr key={item._id || item.id}>
                {columns.map((col) => (
                  <td
                    key={col}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {String(item[col])}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`${item._id || item.id}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id || item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;

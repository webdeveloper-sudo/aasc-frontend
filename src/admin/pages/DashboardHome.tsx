import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Database, Users, FileText, Activity } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { COLLECTIONS } from "../constants";

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState({
    totalCollections: COLLECTIONS.length,
    totalRecords: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch counts from a few collections as sample
      const sampleCollections = COLLECTIONS.slice(0, 5);
      let totalCount = 0;

      for (const col of sampleCollections) {
        try {
          const response = await axiosInstance.get(`/${col.id}`);
          if (Array.isArray(response.data)) {
            totalCount += response.data.length;
          }
        } catch (err) {
          console.warn(`Failed to fetch ${col.id}`);
        }
      }

      setStats((prev) => ({ ...prev, totalRecords: totalCount }));
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="admin-header">
        <h1 className="admin-title">Dashboard</h1>
        <p className="text-gray-600">Welcome to AASC Admin Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Collections</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalCollections}
              </p>
            </div>
            <Database className="text-blue-500" size={40} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Sample Records</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "..." : stats.totalRecords}
              </p>
            </div>
            <FileText className="text-green-500" size={40} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Admin Users</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
            <Users className="text-purple-500" size={40} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Status</p>
              <p className="text-2xl font-bold text-green-600">Active</p>
            </div>
            <Activity className="text-orange-500" size={40} />
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COLLECTIONS.slice(0, 9).map((collection) => (
            <Link
              key={collection.id}
              to={`/admin/collection/${collection.id}`}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900">
                {collection.label}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Manage {collection.label.toLowerCase()}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900 mb-2">Getting Started</h3>
        <ul className="list-disc list-inside text-blue-800 space-y-1">
          <li>Use the sidebar to navigate between collections</li>
          <li>Click on any collection to view and edit data</li>
          <li>All changes are saved directly to the database</li>
          <li>
            If backend is unavailable, local fallback data will be shown
            (read-only)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardHome;

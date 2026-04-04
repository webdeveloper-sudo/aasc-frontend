import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Calendar,
  GraduationCap,
  Image,
  Briefcase,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { COLLECTIONS } from "../constants";

const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  // Group collections by category
  const groupedCollections = COLLECTIONS.reduce((acc, collection) => {
    const category = collection.id.split("__")[0];
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(collection);
    return acc;
  }, {} as Record<string, typeof COLLECTIONS>);

  const categoryIcons: Record<string, any> = {
    home: Home,
    about: Users,
    academics: GraduationCap,
    events: Calendar,
    placements: Briefcase,
    "campus-life": Image,
    commitees: Users,
    committees: Users,
    iqac: Settings,
    contact: Users,
    users: Users,
  };

  const isActive = (path: string) => location.pathname === path;

  const sidebarContent = (
    <>
      {/* Logo/Header */}
      <div className="admin-sidebar-header">
        <h2 className="admin-sidebar-title">AASC Admin</h2>
        <button
          className="admin-mobile-close"
          onClick={() => setIsMobileOpen(false)}
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar-nav">
        {/* Dashboard Home */}
        <Link
          to="/admin/dashboard"
          className={`admin-nav-item ${
            isActive("/admin/dashboard") ? "active" : ""
          }`}
          onClick={() => setIsMobileOpen(false)}
        >
          <Home size={20} />
          <span>Dashboard</span>
        </Link>

        {/* Grouped Collections */}
        {Object.entries(groupedCollections).map(([category, collections]) => {
          const Icon = categoryIcons[category] || Settings;
          const isExpanded = expandedSections.includes(category);

          return (
            <div key={category} className="admin-nav-section">
              <button
                className="admin-nav-section-header"
                onClick={() => toggleSection(category)}
              >
                <div className="admin-nav-section-title">
                  <Icon size={20} />
                  <span className="capitalize">
                    {category.replace(/-/g, " ")}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>

              {isExpanded && (
                <div className="admin-nav-subsection">
                  {collections.map((collection) => (
                    <Link
                      key={collection.id}
                      to={`/admin/collection/${collection.id}`}
                      className={`admin-nav-subitem ${
                        isActive(`/admin/collection/${collection.id}`)
                          ? "active"
                          : ""
                      }`}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      {collection.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Logout */}
        <button className="admin-nav-item admin-logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="admin-mobile-toggle"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Desktop Sidebar */}
      <aside className="admin-sidebar">{sidebarContent}</aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <div
            className="admin-sidebar-overlay"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="admin-sidebar admin-sidebar-mobile">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
};

export default AdminSidebar;

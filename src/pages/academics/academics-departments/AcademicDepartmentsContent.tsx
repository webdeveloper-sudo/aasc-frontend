// AcademicDepartmentsContent.jsx
import React from "react";
import { BookOpen, GraduationCap } from "lucide-react";

const AcademicDepartmentsContent = ({ department, departments, setActiveDept }) => {
  // Show all departments in grid view
  if (department === "all") {
    return (
      <div className="flex-1 p-6 border-r border-gray-400">
        <h1 className="text-3xl font-bold text-purple mb-6">
          All Academic Departments
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              onClick={() => setActiveDept(dept.id)}
              className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group"
            >
              {/* Department Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={dept.image}
                  alt={dept.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              {/* Department Info */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-purple mb-2 group-hover:text-purple-900">
                  {dept.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {dept.about}
                </p>
                <button className="mt-4 text-purple font-semibold hover:text-purple-800 flex items-center gap-2">
                  View Details
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show individual department details
  if (!department) {
    return (
      <div className="flex-1 p-6 border-r border-gray-400 text-center">
        <p className="text-gray-500">Select a department to view details</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 border-r border-gray-400">
      {/* Department Title */}
      <h1 className="text-3xl font-bold text-purple mb-4">
        {department.name}
      </h1>
      
      {/* Banner Image */}
      <div className="relative w-full h-[40vh] aspect-video overflow-hidden shadow-lg rounded-lg mb-6">
        <img
          src={department.image}
          alt={department.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Description Sections */}
      <div className="space-y-6">
        {department.description.map((section, idx) => (
          <div key={idx} className="border-l-2 border-gray-300 pl-4">
            <h3 className="text-xl font-semibold text-purple mb-3 flex items-center gap-2">
              {idx % 2 === 0 ? (
                <BookOpen size={20} className="text-purple" />
              ) : (
                <GraduationCap size={20} className="text-purple" />
              )}
              {section.title}
            </h3>
            <p className="text-gray-700 leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>

      {/* Learn More Button */}
      <div className="mt-8">
        
          href={`/academics/departments/${department.name.toLowerCase().replace(/\s+/g, "-")}`}
          className="red-btn inline-block"
        <a>
          Explore More
        </a>
      </div>
    </div>
  );
};

export default AcademicDepartmentsContent;
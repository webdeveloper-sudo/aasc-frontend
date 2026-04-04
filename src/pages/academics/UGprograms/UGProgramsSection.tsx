import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Search } from "lucide-react";
import ugprogramsdatadetails from "@/data/academics/ugprogramsdatadetails.js";
import HeadingUnderline from "@/components/reusable/HeadingUnderline";
import CourseSelectionForm from "@/components/forms/CourseSelectionForm";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
} from "lucide-react";

const UGProgramsSection = () => {
  const { programType } = useParams();
  const activeCategory = programType || "existing";

  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    const data = ugprogramsdatadetails.filter(
      (item) => item.category === activeCategory
    );
    setList(data);
    setFiltered(data);
    setSearch(""); // Reset search when category changes
  }, [activeCategory]);

  // SEARCH FILTER
  useEffect(() => {
    if (search.trim()) {
      const text = search.toLowerCase();
      const result = list.filter(
        (item) =>
          item.programme.toLowerCase().includes(text) ||
          item.degree.toLowerCase().includes(text) ||
          item.stream.toLowerCase().includes(text)
      );
      setFiltered(result);
    } else {
      setFiltered(list);
    }
  }, [search, list]);

  // Handle Apply Now button click for each row
  const handleApplyNow = (item: any) => {
    setSelectedCourse(`${item.degree} ${item.stream}`);
    setShowForm(true);
  };

  return (
    <div className="flex-1 md:p-6 p-2 py-6">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div className="mx-auto md:mx-0">
          <h1 className="text-2xl font-bold text-purple mx-auto md:mx-0 capitalize">
            {activeCategory === "existing"
              ? "Existing Programs"
              : "Proposed Programs"}
          </h1>
          <HeadingUnderline width={150} align="left" />
        </div>
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by programme, degree, or stream..."
            className="w-full px-4 py-2 pl-10 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>

      {/* Programs Table */}
      {filtered.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-purple text-white text-left">
                <th className="md:block hidden py-3 px-4 border-r border-gray-400">
                  S.No
                </th>
                <th className="py-3 px-4 border-r border-gray-400">
                  Programme
                </th>
                <th className="py-3 px-4 border-r border-gray-400">Degree</th>
                <th className="py-3 px-4 border-r border-gray-400">Stream</th>
                <th className="py-3 px-4 md:w-32 w-24">Action</th>
              </tr>
            </thead>

            <tbody className="text-[12px] md:text-[14px]">
              {filtered.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-300 hover:bg-gray-50"
                >
                  <td className="md:block hidden py-3 px-4 border-r border-gray-300 text-center">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 border-r border-gray-300">
                    {item.programme}
                  </td>
                  <td className="py-3 px-4 border-r border-gray-300">
                    {item.degree}
                  </td>
                  <td className="py-3 px-4 border-r border-gray-300">
                    {item.stream}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Button
                      onClick={() => handleApplyNow(item)}
                      size="sm"
                      className="red-btn w-full text-white flex gap-1 h-9 text-xs px-3"
                    >
                      <span>Apply Now</span> <ArrowRight />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No programs found.</p>
      )}

      {/* Total Count */}
      {filtered.length > 0 && (
        <p className="text-sm text-end text-gray-600 mt-4">
          Showing {filtered.length} of {list.length} programs
        </p>
      )}

      <Link to="/academics/pg-programs" className="flex gap-1 items-center justify-start text-purple py-3 underline">
   
        <p className="text-purple">Check Our <b>PG Programs </b> </p> <ArrowRight size={16} />
      </Link>
      {/* ✅ CourseSelectionForm with AUTO-CLOSE support */}
      <CourseSelectionForm
        course={selectedCourse}
        isOpen={showForm}
        onClose={() => setShowForm(false)}
      />
    </div>
  );
};

export default UGProgramsSection;

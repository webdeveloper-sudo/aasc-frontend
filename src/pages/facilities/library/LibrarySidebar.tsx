import React from "react";
import GlobalSidebar from "@/components/sidebar/GlobalSidebar";

const categories = [
  {
    title: "Profile of the Library",
    items: [
      { key: "profile", label: "Profile" },
      { key: "library", label: "Library" },
      { key: "sections", label: "Sections" },
      { key: "book-collection", label: "Book Collection (Random)" },
      { key: "map", label: "Map" },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        key: "print-resources",
        label: "Print Resources (OPAC) - { How to use }",
      },
      { key: "e-resources", label: "E-Resources - { How to use }" },
      { key: "ugc-inflibnet", label: "UGC-INFLIBNET Corner" },
      { key: "shodhganga", label: "Shodhganga" },
      { key: "eshodhsindhu", label: "E-ShodhSindhu (UGC N-List)" },
    ],
  },
  {
    title: "Faculty",
    items: [
      { key: "vidwan", label: "Vidwan (Expert Database)" },
      { key: "irins", label: "IRINS (Research Information System)" },
    ],
  },
  {
    title: "Guidelines",
    items: [
      { key: "library-hours", label: "Library Hours" },
      { key: "book-lending", label: "Book Lending" },
      { key: "membership", label: "Membership" },
      { key: "facilities", label: "Facilities" },
    ],
  },
];

const LibrarySidebar = ({ activeKey, setActiveKey }) => {
  const menuItems = categories.map((cat) => ({
    id: cat.title,
    label: cat.title,
    children: cat.items.map((item) => ({
      id: item.key,
      label: item.label,
      onClick: () => setActiveKey(item.key),
      isActive: activeKey === item.key,
    })),
  }));

  return (
    <div>
      <GlobalSidebar title="Library" type="dropdown" menu={menuItems} />
    </div>
  );
};

export default LibrarySidebar;

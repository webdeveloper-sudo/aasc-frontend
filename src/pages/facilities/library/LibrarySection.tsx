import React from "react";

const LibrarySection = ({ activeKey }) => {
  const content = {
    profile: "This is the library profile section.",
    library: "Welcome to the library main section.",
    sections: "Details about sections available in the library.",
    "book-collection": "Random book collection details.",
    map: "Library map and floor layout.",

    "print-resources": "How to use OPAC print resources.",
    "e-resources": "How to use online E-Resources.",
    "ugc-inflibnet": "UGC-INFLIBNET Corner information.",
    shodhganga: "Access and details about Shodhganga.",
    eshodhsindhu: "UGC N-List E-ShodhSindhu access.",

    vidwan: "Information about Vidwan Expert Database.",
    irins: "IRINS Research Information System details.",

    "library-hours": "Library Hours & timings.",
    "book-lending": "Guidelines for Book Lending.",
    membership: "Library membership details.",
    facilities: "Facilities available in the library.",
  };

  return (
    <div className="flex-1 p-6 border-r border-gray-400">
      <h1 className="text-2xl font-bold text-purple capitalize">
        {activeKey.replace(/-/g, " ")}
      </h1>

      <div className="mt-4 text-gray-700 leading-7">
        {content[activeKey] || "Content not found."}
      </div>
    </div>
  );
};

export default LibrarySection;

import React, { useState } from "react";
import LibrarySidebar from "./LibrarySidebar";
import LibrarySection from "./LibrarySection";
import campus from '@/assets/images/aasc_building.webp';
import BannerAndBreadCrumb from '@/components/BannerAndBreadCrumb';

const Library = () => {
  const [activeKey, setActiveKey] = useState("profile");

  return (<>
    <div>
        <BannerAndBreadCrumb img={campus} title='Academic Calendar'/>
    </div>
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <LibrarySidebar activeKey={activeKey} setActiveKey={setActiveKey} />
      <LibrarySection activeKey={activeKey} />
    </div>
    </>
  );
};

export default Library;
    
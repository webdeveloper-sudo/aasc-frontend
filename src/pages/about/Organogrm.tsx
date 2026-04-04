import React from "react";
import Xarrow from "react-xarrows";
import {
  Users,
  UserCheck,
  FileSpreadsheet,
  Library,
  GraduationCap,
  Building2,
  Briefcase,
  Wrench,
  Bed,
  Bus,
} from "lucide-react";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import campus from "@/assets/images/aasc_building.webp";
import Heading from "@/components/reusable/Heading";
import HeadingUnderline from "@/components/reusable/HeadingUnderline";
import { organogram } from "@/data/about/organogram.ts";
const boxBase =
  "bg-white p-4 border border-gray-300 shadow-sm text-center text-[15px] tracking-wide";


const Organogram = () => {
  return (
    <>
      <BannerAndBreadCrumb title="Organogram" img={campus} />

      <section className="bg-background container py-10 relative">
       <img src={organogram[0].image} className="w-full h-full" alt="" />
        <hr className="mt-12" />
      </section>
    </>
  );
};

export default Organogram;

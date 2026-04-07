import React from "react";
import AdmissionForm from "@/components/forms/ForAdmissionForm";
import HeadingUnderline from "./reusable/HeadingUnderline";
import Heading from "./reusable/Heading";

interface ForAdmissionProps {
  data: {
    title: string;
    formTitle: string;
    paragraphs: string[];
  };
}

const ForAdmission: React.FC<ForAdmissionProps> = ({ data }) => {
  return (
    <section className="">
      <div className="flex flex-col md:flex-row  gap-10 ">
        {/* 🏫 Left Content Section */}
        <div className="md:w-1/2 text-center md:text-left space-y-4">
          <div>
            <Heading title={data.title} size="lg" align="left" />
            <HeadingUnderline width={150} align="left" />
          </div>
          {data.paragraphs.map((paragraph, index) => (
            <p key={index} className="leading-relaxed text-justify  ">
              {paragraph}
            </p>
          ))}
        </div>

        {/* 📝 Right Form Section */}
        <div className="md:w-1/2 w-full rounded-xl  md:px-8 ">
          <div>
            <Heading title={data.formTitle} size="lg" align="left" />
            <HeadingUnderline width={150} align="left" />
          </div>
          <AdmissionForm />
        </div>
      </div>
    </section>
  );
};

export default ForAdmission;

import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import React from "react";
import campus from "@/assets/images/aasc_building.webp";
import HeadingUnderline from "@/components/reusable/HeadingUnderline";
import FacultyProfile from "@/components/FacultyProfile";
import addoncourseddata from "@/data/academics/ValueAddedCoursesData.js";
import { Phone, Mail } from "lucide-react";

const ValueAddedCourses = () => {
  const {
    AdditionalCoursesData = [],
    AdditionalCoursesDataGeneralIncharge = [],
  } = addoncourseddata || {};

  const overallIncharge = AdditionalCoursesDataGeneralIncharge[0] || null;

  return (
    <div>
      <BannerAndBreadCrumb img={campus} title="Value Added Courses" />

      <div className="container">
        <section className="py-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-purple capitalize">
            Value Added Courses
          </h1>
          <HeadingUnderline width={250} />
          <p className="text-base leading-relaxed max-w-6xl mx-auto mt-4">
            Value added courses, supplements the learner centric aspects of
            students along with the regular curriculum with the sole notion of
            providing skill-oriented training programs for improving the
            employability skills of students. It is the need of the hour for all
            the Higher Education Institutions to enrich the academic-curriculum
            with value added courses to develop the technical skills of the
            students to meet the current industry demands.
          </p>
        </section>

        {/* Courses Details */}
        <section className="py-10">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold">Courses We Provide</h2>
            <HeadingUnderline width={150} align="center" />
          </div>

          {AdditionalCoursesData.map((course, index) => {
            const faculty = course.faculty?.[0] || null;

            return (
              <div
                key={index}
                className="grid grid-cols-3 md:grid-cols-3 md:border-b-0 border-b border-gray-300 mb-4"
              >
                {/* LEFT — ICON / IMAGE */}
                <div className="flex items-center justify-center col-span-1 md:border-r border-gray-300 px-4 py-4">
                  <img
                    src={course.icon}
                    alt={course.title}
                    className="w-20 h-20 md:w-24 md:h-24 object-contain"
                  />
                </div>

                {/* CENTER — COURSE TITLE + DESCRIPTION */}
                <div className="flex flex-col justify-center col-span-2 md:col-span-1 md:border-r border-gray-300 px-4 py-4">
                  <h2 className="text-xl font-semibold">{course.title}</h2>
                  <p className="text-sm text-gray-600 mt-2">
                    {course.courseDescription}
                  </p>
                </div>

                {/* RIGHT — FACULTY INFO for md+ */}
                {!faculty && (
                  <div className="hidden md:flex flex-col justify-center px-4 py-4 text-left text-gray-400">
                    {AdditionalCoursesDataGeneralIncharge.map((faculty, index) => (
                      <div key={index} className="hidden md:flex flex-col justify-center text-left">
                        <p className="text-sm font-medium">{faculty.name}</p>
                        <p className="text-sm text-gray-600">
                          {faculty.department}
                        </p>
                        <p className="flex items-center gap-2 text-gray-700 text-sm mt-2">
                          {faculty.phone && (
                            <>
                              <Phone size={17} />
                              <a
                                href={`tel:${faculty.phone}`}
                                className="hover:text-black duration-200"
                              >
                                {faculty.phone}
                              </a>
                            </>
                          )}
                        </p>
                        {faculty.email && (
                          <p className="flex items-center gap-2 text-gray-700 text-sm break-all">
                            <Mail size={17} />
                            <a
                              href={`mailto:${faculty.email}`}
                              className="hover:text-black duration-200"
                            >
                              {faculty.email}
                            </a>
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {faculty && (
                  <div className="hidden md:flex flex-col justify-center px-4 py-4 text-left">
                    <p className="text-sm font-medium">{faculty.name}</p>
                    <p className="text-sm text-gray-600">
                      {faculty.department}
                    </p>
                    <p className="flex items-center gap-2 text-gray-700 text-sm mt-2">
                      {faculty.phone && (
                        <>
                          <Phone size={17} />
                          <a
                            href={`tel:${faculty.phone}`}
                            className="hover:text-black duration-200"
                          >
                            {faculty.phone}
                          </a>
                        </>
                      )}
                    </p>
                    {faculty.email && (
                      <p className="flex items-center gap-2 text-gray-700 text-sm break-all">
                        <Mail size={17} />
                        <a
                          href={`mailto:${faculty.email}`}
                          className="hover:text-black duration-200"
                        >
                          {faculty.email}
                        </a>
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* Overall / General Incharge */}
        <section className="py-10">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold">For More Enquiry</h2>
            <HeadingUnderline width={150} align="center" />
          </div>

          {AdditionalCoursesDataGeneralIncharge.map((fac, index) => (
            <FacultyProfile
              key={index}
              name={fac.name}
              department={fac.department}
              designation={fac.designation}
              image={fac.image}
              email={fac.email}
            />
          ))}
        </section>
      </div>
    </div>
  );
};

export default ValueAddedCourses;

import React from "react";
import Heading from "@/components/reusable/Heading";
import HeadingUnderline from "@/components/reusable/HeadingUnderline";
import OurTeamFacultyProfile from "@/components/faculty/OurTeamFacultyProfile";
import {
  BookOpen,
  Landmark,
  Target,
  Compass,
  GraduationCap,
  Calendar,
  MapPin,
  Award,
  Sparkles,
  GraduationCapIcon,
} from "lucide-react";
import feather from "@/assets/icons/feather.png";
import Foradmissionsbutton from "@/components/Foradmissionsbutton";

const AcademicDepartmentsSection = ({ departmentData }) => {
  if (!departmentData) return null;

  const handleClick = () => {
    navigate("/");

    setTimeout(() => {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const {
    name,
    image,
    about,
    aboutDepartment,
    vision,
    mission,
    objectivesImage,
    missionImage,
    objectives,
    programsOffered,
    faculty,
    departmentActivities,
  } = departmentData;

  return (
    <div className="flex-1  pb-24 border-r border-gray-200">
      <div className="p-3">
        {/* DEPARTMENT HERO HEADER */}
        {image && (
          <div className="relative w-full h-[400px]  overflow-hidden">
            {/* Background Image */}
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />

            {/* Right-side Gradient Overlay */}
            <div
              className="absolute top-0 right-0 h-[100%] w-[60%] 
      bg-gradient-to-l from-black/60 via-black/30 to-transparent"
            />

            {/* Overlay Content (Right aligned) */}
            <div className="absolute inset-0 flex items-start py-10 justify-end px-6 md:px-12">
              <div className="text-right max-w-xl">
                <h1
                  className="text-white max-w-lg flex flex-row items-center gap-2 text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide"
                  style={{ textShadow: "0 2px 6px rgba(0,0,0,0.65)" }}
                >
                  <span>{name}</span>{" "}
                  <img src={feather} width={40} height={40} alt="feather" />
                </h1>

                {/* <div className="mt-3 flex justify-end">
                  <HeadingUnderline width={180} align="end" />
                </div> */}
              </div>
            </div>
          </div>
        )}

        {/* ABOUT + HISTORY */}
        {/* {(about || aboutDepartment?.history) && (
          <section className=" gap-8 mt-14 max-w-4xl mx-auto">
            {/* {about && (
              <div className="bg-white p-6 rounded-xl border">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="text-[#16611C]" />
                  <h3 className="font-semibold text-lg">About</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">{about}</p>
              </div>
            )} */}
        {/* 
            {aboutDepartment?.history && (
              <div className="bg-white px-8 py-4 text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Heading
                    title={`History Of ${name} Department`}
                    size="md"
                    align="left"
                  />
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {aboutDepartment.history}
                </p>
              </div>
            )}
          </section>
        )} */}

        {/* <hr className="container my-8" /> */}

        {/* DEPARTMENT OVERVIEW */}
        {aboutDepartment?.overview && (
          <section className=" px-8 pt-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              {/* <Sparkles className="text-[#16611C]" /> */}
              <Heading title="Department Overview" size="md" align="center" />
            </div>
            <div className="space-y-2">
              {/* <p className="text-gray-700 text-center max-w-4xl mx-auto leading-relaxed">
              {aboutDepartment.overview}
            </p> */}
              <p className="text-gray-700 text-center max-w-4xl mx-auto leading-relaxed">
                {aboutDepartment.overview}
              </p>
              <Foradmissionsbutton />
            </div>
          </section>
        )}
        <hr className="container mt-8" />
        {/* OBJECTIVES */}
        {objectives?.length > 0 && (
          <section className="bg-background container py-10 mt-10">
            <div className="flex flex-col md:flex-row gap-10 items-stretch">
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch w-full">
                {/* IMAGE SIDE */}
                <div className="w-full lg:w-1/2 flex">
                  <div className="w-full h-full overflow-hidden shadow-lg ">
                    <img
                      src={objectivesImage || image}
                      alt="Chief Mentor"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* CONTENT SIDE */}
                <div className="w-full lg:w-1/2 flex flex-col flex-1 text-center lg:text-left">
                  <Heading title="Objectives" size="md" align="left" />
                  <HeadingUnderline width={120} align="left" />

                  <div className="gap-4 flex-1">
                    {objectives.map((obj, i) => (
                      <div key={i} className="px-4 py-2 rounded-xl group">
                        <div className="flex gap-3 items-start">
                          <Target className="w-5 h-5 text-[#16611C] mt-1 shrink-0 group-hover:scale-110 transition-transform duration-200" />
                          <p className="text-gray-700 text-sm text-justify leading-relaxed group-hover:text-gray-900">
                            {obj}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="my-8 bg-gray-200">
          {vision && (
            <div className="p-6 text-center max-w-3xl mx-auto">
              <div className=" mb-3">
                <Heading title="Vision" size="md" align="center" />
                <HeadingUnderline width={120} align="center" />{" "}
              </div>
              <p className="italic text-gray-700 leading-relaxed">
                {Array.isArray(vision) ? vision.join(" ") : vision}
              </p>
            </div>
          )}
        </section>

        {/* VISION & MISSION */}

        {mission?.length > 0 && (
          <section className="bg-background container py-10 mt-10">
            <div className="flex flex-col md:flex-row gap-10 items-stretch">
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch w-full">
                {/* CONTENT SIDE */}
                <div className="w-full lg:w-1/2 flex flex-col flex-1 text-center lg:text-left">
                  <Heading title="Mission" size="md" align="left" />
                  <HeadingUnderline width={120} align="left" />

                  <div className="gap-4 flex-1">
                    {mission.map((obj, i) => (
                      <div key={i} className="px-4 py-2 rounded-xl group">
                        <div className="flex gap-3 items-start">
                          <GraduationCap className="w-5 h-5 text-[#16611C] mt-1 shrink-0 group-hover:scale-110 transition-transform duration-200" />
                          <p className="text-gray-700 text-justify text-sm leading-relaxed group-hover:text-gray-900">
                            {obj}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* IMAGE SIDE */}
                <div className="w-full lg:w-1/2 flex">
                  <div className="w-full h-full overflow-hidden shadow-lg ">
                    <img
                      src={missionImage || image}
                      alt="Chief Mentor"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <hr className="container my-8" />

        {/* PROGRAMS OFFERED */}
        {programsOffered?.length > 0 && (
          <section className="mt-16">
            <Heading title="Programmes Offered" size="md" align="center" />
            <HeadingUnderline width={140} align="center" />
            <div className="flex flex-col md:flex-row gap-3 justify-center items-stretch mx-3">
              {programsOffered.map((p, i) => (
                <div
                  key={i}
                  className="p-6 rounded-md border text-center border-gray-300 bg-white md:w-1/2 w-full"
                >
                  <h4 className="font-semibold text-xl text-purple mb-1">
                    {p.degree}
                  </h4>
                  <p className="text-xs text-gray-500 mb-3">
                    Duration: {p.duration}
                  </p>
                  <p className="text-sm mx-auto max-w-[400px] text-gray-700 leading-relaxed">
                    {p.description}
                  </p>

                  <Foradmissionsbutton />
                </div>
              ))}
            </div>
          </section>
        )}
        {/* FACULTY */}
        {faculty?.length > 0 && (
          <section className="mt-20">
            <Heading title="Our Faculty" size="md" align="center" />
            <HeadingUnderline width={120} align="center" />
            <div className="mt-10 space-y-4">
              {faculty.map((f, i) => (
                <OurTeamFacultyProfile key={i} {...f} />
              ))}
            </div>
          </section>
        )}
        {/* DEPARTMENT ACTIVITIES */}
        {departmentActivities?.length > 0 && (
          <section className="mt-20">
            <Heading title="Department Activities" size="md" align="center" />
            <HeadingUnderline width={160} align="center" />

            <div className="mt-10 mb-12 grid md:grid-cols-2 gap-6">
              {departmentActivities.map((act, i) => (
                <div
                  key={i}
                  className="border border-gray-300 p-6 hover:shadow-xl shadow-md hover:scale-105 rounded-lg transition"
                >
                  <h4 className="font-semibold text-lg text-gray-800">
                    {act.programTitle}
                  </h4>
                  <div className="space-y-5">
                    <div className="flex gap-6 mt-2 text-sm text-purple-900">
                      <span className="flex gap-1 items-center">
                        <Calendar className="w-4 h-4" /> {act.date}
                      </span>
                      <span className="flex gap-1 items-center">
                        <MapPin className="w-4 h-4" /> {act.location}
                      </span>
                    </div>

                    <div>
                      <p className="font-medium text-gray-800 mb-2">
                        Program Summary
                      </p>
                      {act.aboutProgram.map((p, pi) => (
                        <div className="flex flex-row gap-3">
                          <GraduationCapIcon
                            className="text-purple-900"
                            size={20}
                          />
                          <p key={pi} className="text-sm text-gray-600 mb-2">
                            {p}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="font-medium text-gray-800 mb-2">
                        Key Outcomes
                      </p>
                      {act.programOutcomes.map((o, oi) => (
                        <div key={oi} className="flex gap-2 mb-2">
                          <Award className="w-4 h-4 text-orange-500 mt-1" />
                          <p className="text-sm text-gray-700">{o}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AcademicDepartmentsSection;

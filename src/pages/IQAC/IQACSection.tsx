import React from "react";
import Heading from "@/components/reusable/Heading";
import HeadingUnderline from "@/components/reusable/HeadingUnderline";
import { Construction, GraduationCap, Home, Target } from "lucide-react";
import { iqacInfo, iqacVision, iqacMission } from "@/data/iqac/iqacdata.js";
import campus from "@/assets/images/aasc_building.webp";
import UnderConstruction from "@/components/common/UnderConstruction";
import naacPlaceholder from "@/assets/images/NAAC/NAAC-Logo.webp";
import { Link } from "react-router-dom";

interface IQACSectionProps {
  activeTab: string;
  hideBanner?: boolean;
}

const IQACSection: React.FC<IQACSectionProps> = ({ activeTab, hideBanner = false }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "mission-vision":
        return (
          <div className="space-y-10 animate-in fade-in duration-500">
            {/* IQAC Info Section */}
            <section className="bg-background py-8">
              <div className="flex flex-col md:flex-row gap-10">
                {/* Content Section */}
                <div className="md:w-1/2 text-center md:text-left space-y-4">
                  <div>
                    <Heading
                      title="Internal Quality Assurance Cell (IQAC)"
                      size="lg"
                      align="left"
                    />
                    <HeadingUnderline width={200} align="left" />
                  </div>

                  {/* Info List */}
                  <ul className="space-y-4">
                    {iqacInfo.map((item: any) => (
                      <li key={item.id} className="flex text-start gap-3">
                        <div className="w-5 h-5 flex items-start justify-center pt-1">
                          <GraduationCap className="w-4 h-4 text-purple/80" />
                        </div>
                        <span className="text-justify">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Image Section */}
                <div className="relative w-full md:w-1/2 aspect-video overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={campus}
                    alt="IQAC"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </section>

            {/* Vision & Mission Section */}
            <section className="bg-background py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Mission Section */}
                <div className="text-center md:text-left space-y-4">
                  <div>
                    <Heading title="Mission of IQAC" size="lg" align="left" />
                    <HeadingUnderline width={120} align="left" />
                  </div>

                  <ul className="space-y-4">
                    {iqacMission.map((item: any) => (
                      <li key={item.id} className="flex text-start gap-3">
                        <div className="w-5 h-5 flex items-start justify-center pt-1">
                          <Target className="w-4 h-4 text-[#16611C]" />
                        </div>
                        <span className="text-justify">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Vision Section */}
                <div className="text-center md:text-left space-y-4">
                  <div>
                    <Heading title="Vision of IQAC" size="lg" align="left" />
                    <HeadingUnderline width={120} align="left" />
                  </div>

                  <ul className="space-y-4">
                    {iqacVision.map((item: any) => (
                      <li key={item.id} className="flex text-start gap-3">
                        <div className="w-5 h-5 flex items-start justify-center pt-1">
                          <Target className="w-4 h-4 text-[#16611C]" />
                        </div>
                        <span className="text-justify">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        );
      case "naac":
        return (
          <div className="animate-in fade-in duration-500">
             <section className="bg-background py-8">
              <div className="flex flex-col md:flex-row gap-10">
                
                {/* Image Section */}
                <div className="relative w-full md:w-1/2 aspect-video overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={naacPlaceholder}
                    alt="NAAC"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content Section */}
                <div className="md:w-1/2 text-center md:text-left space-y-4">
                  <div>
                    <Heading
                      title="National Assessment and Accreditation Council (NAAC)"
                      size="lg"
                      align="left"
                    />
                    <HeadingUnderline width={200} align="left" />
                  </div>

                  {/* Info List */}
                  <ul className="space-y-3">
                    {[
                      "The National Assessment and Accreditation Council (NAAC) is an autonomous body established by the UGC to assess and accredit higher education institutions in India.",
                      "NAAC promotes quality assurance, continuous improvement, and academic excellence in higher education.",
                      "The accreditation process evaluates institutions based on curricular aspects, teaching-learning processes, research, infrastructure, governance, and student support.",
                      "NAAC accreditation enhances institutional credibility and helps stakeholders—including students, parents, employers, and policymakers—assess the quality and performance of higher education institutions."
                    ].map((text, idx) => (
                      <li key={idx} className="flex text-start gap-3">
                        <div className="w-5 h-5 flex items-start justify-center pt-1">
                          <GraduationCap className="w-4 h-4 text-purple/80" />
                        </div>
                        <span className="text-justify">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        );
      case "composition":
      case "mom":
      case "green-audit":
      case "aaa":
      case "best-practices":
      case "research-achievements":
      case "events-iqac":
      case "strategic-plan":
      case "short-term-plan":
      case "long-term-plan":
      case "iso":
        return (
          <div className="animate-in fade-in duration-500 bg-white ">
            <section className="bg-white md:container md:py-20 py-10 min-h-[60vh] flex flex-col items-center justify-center">
                    <div className="max-w-2xl w-full text-center space-y-10 px-4">
                      {/* HEADER */}
                      <div className="text-center space-y-2">
                        <Heading title="Page Under Construction" size="lg" align="center" />
                        <HeadingUnderline width={200} align="center" />
                        <p className="text-lg md:text-xl text-gray-600 font-medium">
                          We're building something great for you!
                        </p>
                      </div>
            
                      {/* Animated Icon Container */}
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-purple/10 rounded-full animate-ping scale-150 opacity-20"></div>
                        <div className="relative bg-white p-8 rounded-full shadow-2xl border-4 border-purple/5">
                          <Construction className="w-24 h-24 text-purple animate-bounce" />
                        </div>
                      </div>
            
                      {/* Text Content */}
                      <div className="space-y-6">
                        <p className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto">
                          This page is currently being developed by our team. 
                          We'll have it ready for you very soon. Thank you for your patience!
                        </p>
                      </div>
            
                      {/* Progress Indicator */}
                      <div className="max-w-md mx-auto">
                        <div className="flex justify-between mb-2 text-sm font-semibold text-purple">
                          <span>Development Progress</span>
                          <span>75%</span>
                        </div>
                        <div className="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple via-purple-600 to-purple rounded-full transition-all duration-1000 ease-out"
                            style={{ width: '75%' }}
                          ></div>
                        </div>
                      </div>
            
                      {/* Back to Home Button */}
                      <div className="pt-4">
                        <Link
                          to="/"
                          className="inline-flex items-center gap-3 bg-purple hover:bg-purple/80 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl uppercase tracking-wider text-sm"
                        >
                          <Home className="w-5 h-5" />
                          Return to Homepage
                        </Link>
                      </div>
            
                      {/* Decorative Pattern */}
                      <div className="flex justify-center gap-2 pt-10">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className={`h-1.5 rounded-full bg-purple/${i * 10}`} style={{ width: `${i * 15}px` }}></div>
                        ))}
                      </div>
                    </div>
                  </section>
          </div>
        );
      default:
        return <UnderConstruction hideBanner={hideBanner} />;
    }

  };

  return (
    <div className="flex-1 md:px-8 px-4 py-8 bg-white min-h-screen">
      {renderContent()}
    </div>
  );
};

export default IQACSection;


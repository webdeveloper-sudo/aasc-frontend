import React from "react";
import AASClogo from "@/assets/images/common/AASC-Logo.webp";
import Achariyalogo from "@/assets/images/common/achariya-logo-300x300.webp";
import { Facebook, Instagram, Youtube, ExternalLink } from "lucide-react";
import campus from "@/assets/images/aasc_building.webp";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import Heading from "@/components/reusable/Heading";

const socialMediaLinks = [
  {
    label: "AASC in Facebook",
    path: "https://www.facebook.com/AchariyaAASC/",
    icon: Facebook,
    color: "text-blue-600",
    hoverColor: "hover:bg-blue-50",
    description: "Follow us for daily updates, events, and campus life",
    btn: "Follow Us",
  },
  {
    label: "AASC in Instagram",
    path: "https://www.instagram.com/achariya_arts_and_science",
    icon: Instagram,
    color: "text-pink-600",
    hoverColor: "hover:bg-pink-50",
    description: "Explore our visual stories and student achievements",
    btn: "Follow Us",
  },
  {
    label: "AASC in Youtube",
    path: "https://www.youtube.com/@ACHARIYA.ArtsandScience",
    icon: Youtube,
    color: "text-red-600",
    hoverColor: "hover:bg-red-50",
    description: "Watch our events, seminars, and educational content",
    btn: "Subscribe Now",
  },
];

const MediaTalks = () => {
  return (
    <>
      <BannerAndBreadCrumb title="Media Talks" img={campus} />

      <div className="flex flex-col container">
        <main className="flex-grow">
          <section>
            {/* <div className="flex justify-end">
              <img src={Achariyalogo} className="pt-7" width={90} alt="Achariya Logo" />
            </div> */}
          </section>

          <section className="bg-secondary border-border py-10">
            <div className="text-center">
              <img
                src={AASClogo}
                className="mx-auto pb-7"
                width={250}
                alt="AASC Logo"
              />
              <Heading
                title="Connect With Us"
                size="lg"
                align="center"
                className="mb-4 capitalize"
              />
              <p className="text-base leading-relaxed max-w-3xl mx-auto px-4">
                Stay connected with Achariya Arts and Science College through
                our social media channels. Get the latest updates on events,
                achievements, campus life, and much more. Follow us to be part
                of our vibrant community.
              </p>
            </div>
          </section>

          <section>
            <div className="grid grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto px-4">
              {socialMediaLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group p-6 border-r border-l border-gray-300  transition-all duration-300 ${social.hoverColor} hover:shadow-lg hover:border-purple-500`}
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* Icon */}
                      <div
                        className={`${social.color} mb-4 transform group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon size={48} />
                      </div>

                      {/* Title */}
                      <Heading
                        title={
                          <span className="flex items-center justify-center gap-2">
                            {social.label}
                            <ExternalLink
                              size={16}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          </span>
                        }
                        size="sm"
                        align="center"
                        className="text-gray-800 mb-2 font-semibold"
                      />

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4">
                        {social.description}
                      </p>

                      {/* Visit Button */}
                      <button className="red-btn">{social.btn}</button>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>

          {/* Additional Info Section */}
          <section className="py-8 mt-6">
            <div className="text-center max-w-4xl mx-auto px-4">
              <Heading
                title="Stay Updated"
                size="md"
                align="center"
                className="mb-4"
              />
              <p className="text-gray-700 leading-relaxed">
                Join thousands of students, alumni, and education enthusiasts
                who follow us on social media. Be the first to know about
                admission updates, cultural events, academic achievements, and
                inspiring student stories. Your engagement helps us build a
                stronger community!
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default MediaTalks;

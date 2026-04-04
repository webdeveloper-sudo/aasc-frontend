import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import { principalData } from "@/data/about/principaldata";
import Heading from "@/components/reusable/Heading";
import HeadingUnderline from "@/components/reusable/HeadingUnderline";
import React from "react";

interface PrincipalDeskProps {
  overrideData?: {
    banner?: {
      title: string;
      image: string;
    };
    content?: {
      title: string;
      image: string;
      paragraphs: string[];
      signOff: {
        text: string;
        name: string;
        title: string;
      };
    };
  };
}

const PrincipalDesk: React.FC<PrincipalDeskProps> = ({ overrideData }) => {
  // STATIC banner always from data file
  const banner = principalData.banner;

  // Dynamic content for preview OR static for public
  const content = overrideData?.content || principalData.content;

  // detect admin live preview mode
  const isPreview = Boolean(overrideData);

  // static image (public)
  const staticImage = principalData.content.image;

  // ----------------------------------------
  //  UNIVERSAL IMAGE URL RESOLVER (same as ChiefMentor)
  // ----------------------------------------
  function resolveImageUrl(img: string) {
    if (!img) return "";

    // If already a final URL
    if (img.startsWith("http://") || img.startsWith("https://")) {
      return img;
    }

    // If temp upload: filename only
    if (!img.includes("/assets/images/")) {
      return `${import.meta.env.VITE_API_URL}/assets/images/temp/${img}`;
    }

    // Already a complete relative asset path
    return img;
  }

  // Final image used in UI
  const imageUrl = isPreview ? resolveImageUrl(content.image) : staticImage;

  return (
    <>
      <BannerAndBreadCrumb title={banner.title} img={banner.image} />

      <section className="bg-background container py-4 md:py-10 mt-10">
        <div className="flex flex-col md:flex-row gap-10 items-stretch">
          {/* mobile screen heading */}
          <div className="md:hidden block">
            <Heading title={content.title} size="lg" align="left" />
            <HeadingUnderline width={150} align="start" />
          </div>

          {/* IMAGE */}
          <div className="relative w-full md:w-1/2 overflow-hidden shadow-lg rounded-lg">
            <img
              src={imageUrl}
              alt="Principal"
              className="w-full h-full object-cover"
            />
          </div>

          {/* CONTENT */}
          <div className="md:w-1/2 text-center md:text-left">
            {/* Large screen heading */}
            <div className="md:block hidden">
              <Heading title={content.title} size="lg" align="left" />
              <HeadingUnderline width={200} align="left" />
            </div>

            {content.paragraphs.map((paragraph, index) => (
              <React.Fragment key={index}>
                <p className="leading-relaxed text-justify">{paragraph}</p>
                {index < content.paragraphs.length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* SIGN OFF */}
        <div className="flex flex-col text-right py-6">
          <p>{content.signOff.text}</p>
          <h4 className="md:text-xl text-md font-bold">
            {content.signOff.name}
          </h4>
          <em>{content.signOff.title}</em>
        </div>
      </section>

      <hr className="container" />
    </>
  );
};

export default PrincipalDesk;

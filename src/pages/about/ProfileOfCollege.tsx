import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import { resolveImageUrl } from "@/utils/imageUtils";
import { profileOfCollegeData } from "@/data/about/profileofcollegedata";
import Heading from "@/components/reusable/Heading";

interface ProfileOfCollegeProps {
  overrideData?: {
    banner: {
      title: string;
      image: string;
    };
    header: {
      logo: string;
      title: string;
      description: string;
    };
    details: Array<{
      title: string;
      icon: any;
      items: Array<{
        label: string;
        value: string;
      }>;
    }>;
  };
}

const ProfileOfCollege: React.FC<ProfileOfCollegeProps> = ({
  overrideData,
}) => {
  // STATIC banner → always from data file (like ChiefMentorDesk)
  const banner = profileOfCollegeData.banner;

  // DYNAMIC data = overrideData in preview, staticData in public view (header + details only)
  const staticData = profileOfCollegeData;
  const dynamicData = overrideData || staticData;
  const { header, details } = dynamicData;

  // detect admin live preview mode
  const isPreview = Boolean(overrideData);

  // RESOLVED IMAGE URLS
  const headerLogoUrl = resolveImageUrl(header.logo);

  // BANNER IMAGE → ALWAYS STATIC (never dynamic)
  const bannerImageUrl = banner.image;

  console.log("ProfileOfCollege - Resolved URLs:", {
    bannerImageUrl: "STATIC",
    headerLogoUrl,
    isPreview,
  });

  // ---- GROUPING LOGIC (UNCHANGED) ----
  const firstGroup = details.slice(0, 3); // first three items
  const remaining = details.slice(3); // others

  return (
    <>
      {/* BANNER → ALWAYS STATIC (exact ChiefMentorDesk pattern) */}
      <BannerAndBreadCrumb img={bannerImageUrl} title={banner.title} />

      <div className="flex flex-col container pt-10">
        <main className="flex-grow">
          {/* HEADER → DYNAMIC */}
          <section className="border-border">
            <div className="text-center">
              <img
                src={headerLogoUrl}
                className="mx-auto pb-7 md:w-[300px] w-48"
                alt=""
              />

              <Heading
                title={header.title}
                size="lg"
                align="center"
                className="mb-4 capitalize"
              />

              {header.description.slice(0, 2).map((desc, i) => (
                <p
                  key={i}
                  className="text-base leading-relaxed mb-4 md:max-w-6xl max-w-full mx-auto"
                >
                  {desc}
                </p>
              ))}
            </div>
          </section>

          {/* DETAILS → DYNAMIC */}
          <section className="py-5 text-center">
            <div className="grid grid-cols-1 md:grid-cols-4 border-gray-300">
              {/* 🔥 FIRST COLUMN — FIRST THREE ITEMS COMBINED */}
              <div className="p-5  md:border-r border-gray-300">
                {firstGroup.map((section, i) => (
                  <div
                    key={i}
                    className="mb-4 border-b border-gray-300 md:border-b-0 md:py-0 py-3"
                  >
                    <Heading
                      title={
                        <span className="flex md:flex-row flex-wrap justify-center items-center gap-2">
                          <span className="text-purple">
                            <section.icon />
                          </span>
                          {section.title}
                        </span>
                      }
                      size="sm"
                      align="center"
                      className="font-semibold"
                    />

                    {section.items.map((item, idx) => (
                      <div key={idx} className="mt-1 mb-3">
                        {item.label !== "Type" &&
                          item.label !== "Category" &&
                          item.label !== "Area" && (
                            <p className="mt-1 font-semibold">{item.label}</p>
                          )}
                        <p>{item.value}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* 🔥 REMAINING ITEMS AS INDIVIDUAL GRID BOXES */}
              {remaining.map((section, index) => (
                <div
                  key={index}
                  className={`p-5 ${
                    index < remaining.length - 1
                      ? "border-b md:border-b-0 md:border-r"
                      : ""
                  } border-gray-300`}
                >
                  <Heading
                    title={
                      <span className="flex md:flex-row flex-wrap  justify-center items-center gap-2">
                        <span className="text-purple">
                          <section.icon />
                        </span>
                        {section.title}
                      </span>
                    }
                    size="sm"
                    align="center"
                    className="font-semibold"
                  />

                  {section.items.map((item, idx) => (
                    <div key={idx} className="mt-1 mb-3">
                      {item.label !== "Type" &&
                        item.label !== "Category" &&
                        item.label !== "Area" && (
                          <p className="mt-1 font-semibold">{item.label}</p>
                        )}
                      <p>{item.value}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {header.description
            .slice(2, header.description.length)
            .map((desc, i) => (
              <p
                key={i}
                className="text-base leading-relaxed mb-4 md:max-w-6xl max-w-full mx-auto text-center"
              >
                {desc}
              </p>
            ))}
        </main>
      </div>
    </>
  );
};

export default ProfileOfCollege;

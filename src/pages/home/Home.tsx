import Carousel from "./Carousel";
import EventsHighlightsPreview from "@/components/EventsHighlightsPreview";
import GalleryPreviewSlider from "@/components/GalleryPreviewSlider";
import OurLeadership from "@/components/OurLeadership";
import AchievementsStats from "@/components/AchievementsStats";
import OurCampus from "@/components/OurCampus";
import ForAdmission from "@/components/ForAdmission";
import MissionVision from "@/components/MissionVision";
import Testimonials from "@/components/Testimonials";
import OurRecruiters from "@/components/OurRecruiters";
import AchariyaSchoolsAndColleges from "@/components/AchariyaSchoolsAndColleges";
import NewsTicker from "@/components/common/Header/NewsTicker";
import HeadingUnderline from "@/components/reusable/HeadingUnderline";
import Heading from "@/components/reusable/Heading";
import { useHomeData } from "@/hooks/useHomeData";
import LeftRightBorder from "@/components/common/LeftRightBorder";
import HomeAdmissionPopup from "@/components/HomeAdmissionPopup";
import HomeTabs from "@/components/HomeTabs";


const Home = () => {

  
  const { data: homeData, isLoading, error } = useHomeData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !homeData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading data
      </div>
    );
  }

  return (
    <>
      <Carousel overrideData={homeData.carousel} />
      <NewsTicker overrideData={homeData.newsTicker} />
      <HomeTabs />

      <div className="min-h-screen flex flex-col bg-hat-pattern">
        <main className="flex-grow space-y-6">
          <section className="  py-6 px-8 md:py-12 md:px-0 mt-6 border-border">
            <div className="text-center">
              <Heading
                title={homeData.welcome.title}
                size="lg"
                align="center"
                className="capitalize"
              />
              <HeadingUnderline width={250} />
              <div className="text-base max-w-6xl text-center mx-auto leading-relaxed">
                {homeData.welcome.description.slice(0, 1).map((desc, i) => (
                  <p key={i}>{desc}</p>
                ))}
              </div>
            </div>
            <div>
              <OurLeadership />
            </div>
            <div className="text-base leading-relaxed max-w-6xl text-center mx-auto mt-4">
              {homeData.welcome.description
                .slice(1, homeData.welcome.description.length)
                .map((desc, i) => (
                  <p key={i} className="mb-3">
                    {desc}
                  </p>
                ))}
            </div>
          </section>

          <section className="py-6 md:py-12 bg-gray-200">
            <AchievementsStats overrideData={homeData.stats} />
          </section>

          <section className="container py-6 md:py-12 mt-6 border-border">
            <OurCampus overrideData={homeData.campus} />
          </section>
          <hr className=" container" />

          <section className="py-6 md:py-10 container">
            <MissionVision overrideData={homeData.missionVision} />
          </section>

          <section className="py-6 md:py-12 pb-14 px-6 bg-gray-200">
            {/* <EventsHighlightsPreview events={homeData.events} /> */}
            <GalleryPreviewSlider />
          </section>

          {/* <section className="">
            <GalleryPreviewSlider />
          </section> */}
          <section className="container py-6 md:py-12">
            <OurRecruiters overrideData={homeData.recruiters} />
          </section>
          <hr className=" container" />

          <section id="contact" className="py-6 md:py-12 container">
            <ForAdmission data={homeData.admission} />
          </section>
          {/*          <hr className="text-gray-200 container" />
 <section className="py-6 md:py-12 container">
            <CircularAndUpcomingEvents data={homeData.announcements} />
          </section> */}

          <section className="py-6 md:py-12 bg-gray-200 ">
            <Testimonials
              title={homeData.testimonials.title}
              videos={homeData.testimonials.videos}
            />
          </section>

          <section className="py-6 md:py-12 container">
            <AchariyaSchoolsAndColleges overrideData={homeData.schoolsAndColleges} />
          </section>
        </main>
      </div>
      <HomeAdmissionPopup />
    </>
  );
};

export default Home;

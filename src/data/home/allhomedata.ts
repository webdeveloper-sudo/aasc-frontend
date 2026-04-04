import OurLeads from "@/data/home/OurLeads.js";
import welcomeData from "@/data/home/welcomedata";
import statsData from "@/data/home/achievementsstatsdata";
import campusData from "@/data/home/ourcampusdata";
import missionVisionData from "@/data/home/missionvissiondata";
import recruitersData from "@/data/home/recruitersdata";
import admissionData from "@/data/home/admissionsdata";
import announcementsData from "@/data/home/announcementsdata";
import testimonialsData from "@/data/home/testimonialdata";
import schoolsAndCollegesData from "@/data/home/ourschoolscollegesdata";
import carouselData from "@/data/home/carouseldata";
import newsTickerData from "@/data/home/newstickerdata";
import eventsData from "@/data/events/eventsdata.js";

export const homeData = {
  // Welcome Section
  welcome: welcomeData,

  // Leadership Section
  leadership: {
    leads: OurLeads,
  },

  // Stats Section
  stats: statsData,

  // Our Campus Section
  campus: campusData,

  // Mission & Vision Section
  missionVision: missionVisionData,

  // Gallery Section
  events: eventsData,

  // Our Recruiters Section
  recruiters: recruitersData,

  // For Admission Section
  admission: admissionData,

  // Circulars & Events Section
  announcements: announcementsData,

  // Testimonials Section
  testimonials: testimonialsData,

  // Schools and Colleges Section
  schoolsAndColleges: schoolsAndCollegesData,

  // Carousel Section
  carousel: carouselData,

  // News Ticker Section
  newsTicker: newsTickerData,
};

export default homeData;

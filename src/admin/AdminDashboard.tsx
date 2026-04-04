import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";
import AdminLogin from "./pages/AdminLogin";
import DashboardHome from "./pages/DashboardHome";
import ProtectedRoute from "./components/ProtectedRoute";
import "./admin.css";

// Import all dedicated collection managers
// About Section
import ChiefMentorDataManager from "./managers/about/ChiefMentorDataManager";
import GoverningBodyCouncilDataManager from "./managers/about/GoverningBodyCouncilDataManager";
import PrincipalDataManager from "./managers/about/PrincipalDataManager";
import ProfileOfCollegeDataManager from "./managers/about/ProfileOfCollegeDataManager";
import OurTeamDataManager from "./managers/about/OurTeamDataManager";
import PressReleasesDataManager from "./managers/about/PressReleasesDataManager";

// Academics Section
import AcademicCalendarDataManager from "./managers/academics/AcademicCalendarDataManager";
import DepartmentsDataManager from "./managers/academics/DepartmentsDataManager";
import ProspectusDataManager from "./managers/ProspectusDataManager";
import PGProgramsDetailsManager from "./managers/academics/PGProgramsDetailsManager";
import UGProgramsDetailsManager from "./managers/academics/UGProgramsDetailsManager";
import ValueAddedCoursesDataManager from "./managers/academics/ValueAddedCoursesDataManager";

// Campus Life Section
import SeedDataManager from "./managers/SeedDataManager";

// Committees Section
import CommittiesDataManager from "./managers/committies/CommittiesDataManager";

// Contact Section
import ContactDataManager from "./managers/ContactDataManager";

// Events Section
import UpcomingEventsPreviewDataManager from "./managers/upcomming-events/UpcomingEventsPreviewDataManager";
import CircularPreviewDataManager from "./managers/circulars/CircularPreviewDataManager";
import EventsDataManager from "./managers/Events/EventsDataManager";

// Home Section
import AchievementsStatsDataManager from "./managers/home/AchievementsStatsDataManager";
import AdmissionsDataManager from "./managers/home/AdmissionsDataManager";
import AllHomeDataManager from "./managers/home/AllHomeDataManager";
import CarouselDataManager from "./managers/home/CarouselDataManager";
import MissionVisionDataManager from "./managers/home/MissionVisionDataManager";
import NewsTickerDataManager from "./managers/home/NewsTickerDataManager";
import OurCampusDataManager from "./managers/home/OurCampusDataManager";
import OurLeadsDataManager from "./managers/home/OurLeadsDataManager";
import OurSchoolsCollegesDataManager from "./managers/home/OurSchoolsCollegesDataManager";
import RecruitersDataManager from "./managers/home/RecruitersDataManager";
import TestimonialsDataManager from "./managers/home/TestimonialsDataManager";
import WelcomeDataManager from "./managers/home/WelcomeDataManager";
import AnnouncementsDataManager from "./managers/home/AnnouncementsDataManager";
import TopHeaderDataManager from "./managers/home/TopHeaderDataManager";
import AascBeatsDataManager from "./managers/aasc-beats/AascBeatsDataManager";

// IQAC Section
import NIRFDataManager from "./managers/IQAC/NIRFDataManager";

// Placements Section
import PlacementRecordsManager from "./managers/placements/PlacementRecordsManager";
import TrainingAndPlacementsDataManager from "./managers/placements/TrainingAndPlacementsDataManager";

// Users
import UsersManager from "./managers/UsersManager";

// Generic Manager
import DynamicCollectionManager from "./components/DynamicCollectionManager";

const AdminDashboard: React.FC = () => {
  return (
    <Routes>
      {/* Login - no sidebar */}
      <Route path="/login" element={<AdminLogin />} />

      {/* Protected Admin Area */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="admin-layout w-full">
              <AdminSidebar />
              <main className="admin-main w-full">
                <Routes>
                  {/* Dashboard */}
                  <Route path="/dashboard" element={<DashboardHome />} />

                  {/* About Section Routes */}
                  <Route
                    path="/collection/about__chiefmentordata"
                    element={<ChiefMentorDataManager />}
                  />
                  <Route
                    path="/collection/about__governingbodycouncildata"
                    element={<GoverningBodyCouncilDataManager />}
                  />
                  <Route
                    path="/collection/about__principaldata"
                    element={<PrincipalDataManager />}
                  />
                  <Route
                    path="/collection/about__profileofcollegedata"
                    element={<ProfileOfCollegeDataManager />}
                  />
                  <Route
                    path="/collection/about__ourteamdata"
                    element={<OurTeamDataManager />}
                  />
                  <Route
                    path="/collection/about__pressreleasesdata"
                    element={<PressReleasesDataManager />}
                  />

                  {/* Academics Section Routes */}
                  <Route
                    path="/collection/academics__academiccalendardata"
                    element={<AcademicCalendarDataManager />}
                  />
                  <Route
                    path="/collection/academics__departmentsdata"
                    element={<DepartmentsDataManager />}
                  />
                  <Route
                    path="/collection/academics__prospectusdata"
                    element={<ProspectusDataManager />}
                  />
                  <Route
                    path="/collection/academics__pgprogrammsdetails"
                    element={<PGProgramsDetailsManager />}
                  />
                  <Route
                    path="/collection/academics__ugprogramsdatadetails"
                    element={<UGProgramsDetailsManager />}
                  />
                  <Route
                    path="/collection/academics__valueaddedcoursesdata"
                    element={<ValueAddedCoursesDataManager />}
                  />

                  {/* Campus Life Section Routes */}
                  <Route
                    path="/collection/campus-life__seeddata"
                    element={<SeedDataManager />}
                  />

                  {/* Committees Section Routes */}
                  <Route
                    path="/collection/commitees__committiesdata"
                    element={<CommittiesDataManager />}
                  />

                  {/* Contact Section Routes */}
                  <Route
                    path="/collection/contact__contactdata"
                    element={<ContactDataManager />}
                  />

                  {/* Events Section Routes */}
                  <Route
                    path="/collection/events__upcommingeventspreviewdata"
                    element={<UpcomingEventsPreviewDataManager />}
                  />
                  <Route
                    path="/collection/circular__circularpreviewdata"
                    element={<CircularPreviewDataManager />}
                  />
                  <Route
                    path="/collection/events__eventsdata"
                    element={<EventsDataManager />}
                  />

                  {/* Home Section Routes */}
                  <Route
                    path="/collection/home__achievementsstatsdata"
                    element={<AchievementsStatsDataManager />}
                  />
                  <Route
                    path="/collection/home__admissionsdata"
                    element={<AdmissionsDataManager />}
                  />
                  <Route
                    path="/collection/home__allhomedata"
                    element={<AllHomeDataManager />}
                  />
                  <Route
                    path="/collection/home__carouseldata"
                    element={<CarouselDataManager />}
                  />
                  <Route
                    path="/collection/home__missionvisiondata"
                    element={<MissionVisionDataManager />}
                  />
                  <Route
                    path="/collection/home__newstickerdata"
                    element={<NewsTickerDataManager />}
                  />
                  <Route
                    path="/collection/home__ourcampusdata"
                    element={<OurCampusDataManager />}
                  />
                  <Route
                    path="/collection/home__ourleads"
                    element={<OurLeadsDataManager />}
                  />
                  <Route
                    path="/collection/home__ourschoolscollegesdata"
                    element={<OurSchoolsCollegesDataManager />}
                  />
                  <Route
                    path="/collection/home__recruitersdata"
                    element={<RecruitersDataManager />}
                  />
                  <Route
                    path="/collection/home__testimonialdata"
                    element={<TestimonialsDataManager />}
                  />
                  <Route
                    path="/collection/home__welcomedata"
                    element={<WelcomeDataManager />}
                  />
                  <Route
                    path="/collection/home__announcementsdata"
                    element={<AnnouncementsDataManager />}
                  />
                  <Route
                    path="/collection/documents"
                    element={<TopHeaderDataManager />}
                  />
                  <Route
                    path="/collection/aasc-beats__aascbeatsdata"
                    element={<AascBeatsDataManager />}
                  />

                  {/* IQAC Section Routes */}
                  <Route
                    path="/collection/iqac__nirfdata"
                    element={<NIRFDataManager />}
                  />

                  {/* Placements Section Routes */}
                  <Route
                    path="/collection/placements__placementrecords"
                    element={<PlacementRecordsManager />}
                  />
                  <Route
                    path="/collection/placements__trainingandplacementsdata"
                    element={<TrainingAndPlacementsDataManager />}
                  />

                  {/* Users Route */}
                  <Route path="/collection/users" element={<UsersManager />} />

                  {/* Generic Route for all other collections */}
                  <Route
                    path="/collection/:collectionId"
                    element={<DynamicCollectionManager />}
                  />

                  {/* Default redirect */}
                  <Route
                    path="/"
                    element={<Navigate to="/admin/dashboard" replace />}
                  />

                  <Route
                    path="*"
                    element={<Navigate to="/admin/dashboard" replace />}
                  />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AdminDashboard;

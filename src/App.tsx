import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { galleryData } from "@/data/gallery/gallerydata.js";
import eventsData from "@/data/events/eventsdata.js";
import { departmentDataMapper } from "@/data/academics/departmentsdata.js";
import Home from "./pages/home/Home";
import NotFound from "./pages/NotFound";
import Navbar from "./components/common/Header/Navbar";
import Footer from "./components/common/Footer";
import "./App.css";
import ProfileOfCollege from "./pages/about/ProfileOfCollege";
import CheifMentorDesk from "./pages/about/CheifMentorDesk";
import OurTeam from "./pages/about/our-team/OurTeam";
import PrincipalDesk from "./pages/about/PrincipalDesk";
import Organogrm from "./pages/about/Organogrm";
import GoverningBodyCouncil from "./pages/about/GoverningBodyCouncil";
import MediaTalks from "./pages/about/MediaTalks";
import PressReleases from "./pages/about/press-releases/PressReleases";
import AcademicDepartments from "./pages/academics/academics-departments/AcademicDepartments";
import UGPrograms from "./pages/academics/UGprograms/UGPrograms";
import PGPrograms from "./pages/academics/PGprograms/PGprograms";
import Library from "./pages/facilities/library/Library";
import TrainingAndPlacementsCell from "./pages/placements/TrainingAndPlacementsCell";
import PlacementRecords from "./pages/placements/PlacementRecords";
import KeyRecruiters from "./pages/placements/KeyCollaboratorsRecruiters";
import KeyCollaboratorsRecruiters from "./pages/placements/KeyCollaboratorsRecruiters";
import PlacementsGalleryPage from "./pages/placements/placements-gallery/PlacementsGalleryPage";
import ValueAddedCourses from "./pages/campus-life/ValueAddedCourses";
import Sports from "./pages/campus-life/Sports";
import SEED from "./pages/campus-life/SEED";
import TopHeaderBar from "./components/common/Header/TopHeadBar";
import ScrollToTop from "./components/ScrollTop";
import UpcomingEvents from "./pages/upcomming-events/UpcommingEvents";
import Circular from "./pages/circlulars/Circulars";
import NIRF from "./pages/IQAC/NIRF/NIRF";
import AcademicCalendar from "./pages/academics/AcademicCalendar";
import Prospectus from "./pages/academics/Prospectus";
import Cafeteria from "./pages/facilities/cafeteria/Cafeteria";
import Hostel from "./pages/facilities/hostel/Hostel";
import ICTFacilites from "./pages/facilities/ICT/ICTFacilites";
import Infrasctructe from "./pages/facilities/infrastructure/Infrasctructe";
import Laboratories from "./pages/facilities/labs/Laboratories";
import Transports from "./pages/facilities/transports/Transports";
import Cultural from "./pages/campus-life/Cultural";
import DepartmentsClubs from "./pages/campus-life/DepartmentClubs";
import NAAC from "./pages/IQAC/NAAC";
import CirclularsIQAC from "./pages/IQAC/CirclularsIQAC";
import AboutNaac from "./pages/IQAC/AboutIQAC";
import AboutIQAC from "./pages/IQAC/AboutIQAC";
import Committees from "./pages/committies/Committies";
import Events from "./pages/Events/Events";
import Gallery from "./pages/gallery/Gallery";
import FloatingPwrdBadge2 from "./components/test/Test2";
import FloatingPwrdBadge from "./components/test/Test";
import { committeeDataMapper } from "@/data/commitees/committiesdata.js";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLogin from "./admin/pages/AdminLogin";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import AASCBeats from "./pages/aasc-beats/AASCBeats";
import LeftRightBorder from "./components/common/LeftRightBorder";
import PosterCampaign from "./pages/IQAC/bestpractices/PosterCampaign";
import SpritualityInAASC from "./pages/IQAC/bestpractices/SpritualityInAASC";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
    
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Admin Routes - No Navbar/Footer */}
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* Public Routes - With Navbar/Footer */}
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  {/* Abou US Pages Routes */}
                  <Route
                    path="/about/profile-of-the-college"
                    element={<ProfileOfCollege />}
                  />
                  <Route
                    path="/about/chief-mentors-desk"
                    element={<CheifMentorDesk />}
                  />
                  <Route
                    path="/about/our-team/:teamType"
                    element={<OurTeam />}
                  />
                  <Route path="/about/our-team" element={<OurTeam />} />
                  <Route
                    path="/about/principal-desk"
                    element={<PrincipalDesk />}
                  />
                  <Route path="/about/organogram" element={<Organogrm />} />
                  <Route
                    path="/about/governing-body-counsil"
                    element={<GoverningBodyCouncil />}
                  />
                  <Route
                    path="/about/press-releases/:year?"
                    element={<PressReleases />}
                  />

                  <Route path="/about/media-talks" element={<MediaTalks />} />
                  {/* Academic Pages START*/}
                  <Route
                    path="/academics/departments"
                    element={
                      <Navigate
                        to={`/academics/departments/${
                          Object.keys(departmentDataMapper)[0]
                        }`}
                        replace
                      />
                    }
                  />
                  <Route
                    path="/academics/departments/:slug"
                    element={<AcademicDepartments />}
                  />
                  <Route
                    path="/academics/ug-programs"
                    element={
                      <Navigate to="/academics/ug-programs/existing" replace />
                    }
                  />
                  <Route
                    path="/academics/ug-programs/:programType"
                    element={<UGPrograms />}
                  />
                  <Route
                    path="/academics/pg-programs"
                    element={
                      <Navigate to="/academics/pg-programs/existing" replace />
                    }
                  />
                  <Route
                    path="/academics/pg-programs/:programType"
                    element={<PGPrograms />}
                  />
                  <Route
                    path="/academics/academic-calendar"
                    element={<AcademicCalendar />}
                  />
                  <Route
                    path="/academics/prospectus"
                    element={<Prospectus />}
                  />
                  {/* Academic Pages END*/}
                  {/* FACILITIES Pages START*/}
                  <Route path="/facilities/library/" element={<Library />} />
                  <Route path="/facilities/cafeteria" element={<Cafeteria />} />
                  <Route
                    path="/facilities/hostel-facilities"
                    element={<Hostel />}
                  />
                  <Route
                    path="/facilities/ict-facilities"
                    element={<ICTFacilites />}
                  />
                  <Route path="/facilities/sports" element={<Sports />} />
                  <Route
                    path="/facilities/infrastructure"
                    element={<Infrasctructe />}
                  />
                  <Route
                    path="/facilities/laboratories"
                    element={<Laboratories />}
                  />
                  <Route
                    path="/facilities/transport-facilities"
                    element={<Transports />}
                  />
                  {/* FACILITIES Pages END*/}
                  {/* Placements Pages START*/}
                  <Route
                    path="/placements/training-and-placement-cell"
                    element={<TrainingAndPlacementsCell />}
                  />
                  <Route
                    path="/placements/records"
                    element={<PlacementRecords />}
                  />
                  <Route
                    path="/placements/key-collaborators-recruiters"
                    element={<KeyCollaboratorsRecruiters />}
                  />
                  <Route
                    path="/placements/gallery/:galleryId?"
                    element={<PlacementsGalleryPage />}
                  />
                  {/* Placements Pages END*/}
                  {/* Campus Life pages START*/}
                  <Route
                    path="/campus-life/value-added-courses"
                    element={<ValueAddedCourses />}
                  />
                  <Route path="/campus-life/seed" element={<SEED />} />
                  <Route
                    path="/campus-life/events"
                    element={
                      <Navigate
                        to={`/campus-life/events/${eventsData[0].id}`}
                        replace
                      />
                    }
                  />
                  <Route
                    path="/campus-life/events/:eventId"
                    element={<Events />}
                  />
                  <Route path="/campus-life/sports" element={<Sports />} />
                  <Route path="/campus-life/cultural" element={<Cultural />} />
                  <Route
                    path="/campus-life/department-clubs"
                    element={<DepartmentsClubs />}
                  />
                    {/* Gallery Pages START */}
                  <Route path="/campus-life/gallery" element={<Gallery />} />
                  {/* Gallery Pages END */}
                  {/* Campus Life pages END*/}
                  {/* IQAC & NIRF Pages START */}
                  <Route
                    path="/national-institutional-ranking-framework"
                    element={<NIRF />}
                  />
                  <Route path="/iqac/naac" element={<NAAC />} />
                  <Route path="/iqac/circulars" element={<CirclularsIQAC />} />
                  <Route path="/iqac/about-iqac" element={<AboutIQAC />} />
                  <Route
                    path="/iqac/best-practices/poster-campaign"
                    element={<PosterCampaign />}
                  />
                  <Route
                    path="/iqac/best-practices/spirituality-in-aasc"
                    element={<SpritualityInAASC />}
                  />
                  {/* IQAC & NIRF Pages END */}

                  {/* Committies pages START*/}
                  <Route path="/committees/:slug" element={<Committees />} />
                  <Route path="/cells/:slug" element={<Committees />} />
                  <Route path="/clubs/:slug" element={<Committees />} />
                  <Route
                    path="/committees"
                    element={
                      <Navigate
                        to={`/cells/training-placement`}
                      />
                    }
                  />
                  {/* Committies pages END*/}

                  {/* AASC Beats Pages START */}
                  <Route path="/aasc-beats" element={<AASCBeats />} />
                  <Route path="/aasc-beats/:month" element={<AASCBeats />} />
                  {/*  AASC Beats Pages END */}

                
                  {/* 404 error */}
                  <Route path="*" element={<NotFound />} />
                  <Route
                    path="/upcomming-events"
                    element={<UpcomingEvents />}
                  />
                  <Route path="/circulars" element={<Circular />} />
                </Routes>
                <Footer />
              </>
            }
          />
        </Routes>

        {/*test badge*/}
        <FloatingPwrdBadge2 />
        {/* <FloatingPwrdBadge/> */}
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

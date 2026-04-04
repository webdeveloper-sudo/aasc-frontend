import { CircularPreviewData } from "@/data/home/CircularPreviewData.js";
import { UpcommingEventsPreviewData } from "@/data/events/UpcommingEventsPreviewData.js";
import ugprogramsdatadetails from "@/data/academics/ugprogramsdatadetails.js";
import pgprogrammsdetails from "@/data/academics/pgprogrammsdetails.js";

export const announcementsData = {
  title: "Important Announcements",
  description:
    "Achariya Arts and Science College, Puducherry, is one of the premier institutions under the Achariya Group of Educational Institutions. Established with a vision to provide holistic education and empower students with academic excellence, values, and skills, Achariya offers a wide range of undergraduate and postgraduate programs in arts, science, and commerce. The college fosters innovation, discipline, and leadership among its students.",
  circulars: {
    title: "E-Circulars",
    items: CircularPreviewData,
  },
  upcomingEvents: {
    title: "Upcoming Events",
    items: UpcommingEventsPreviewData,
  },
  admissionsOpen: {
    title: "Admissions Open",
    items: [
      ...ugprogramsdatadetails.map((item) => ({
        id: `UG-${item.id}`,
        programme: item.programme,
        degree: item.degree,
        stream: item.stream,
        level: "UG",
        category: item.category,
        path: `/programs/ug/${item.id}`,
      })),
      ...pgprogrammsdetails.map((item) => ({
        id: `PG-${item.id}`,
        programme: item.programme,
        degree: item.degree,
        stream: item.stream,
        level: "PG",
        category: item.category,
        path: `/programs/pg/${item.id}`,
      })),
    ],
  },
};

export default announcementsData;

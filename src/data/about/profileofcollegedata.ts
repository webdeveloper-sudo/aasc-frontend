import AASClogo from "@/assets/images/common/AASC-Logo.webp";
import campus from "@/assets/images/aasc_building.webp";
import {
  Building,
  Wallet,
  MapPin,
  ScanSearch,
  School,
  Layers,
} from "lucide-react";

export const profileOfCollegeData = {
  banner: {
    title: "Profile Of The College",
    image: campus,
  },
  header: {
    logo: AASClogo,
    title: "Achariya Arts and Science College",
    description: [
      `Achariya Arts and Science College is a World Class Educational Institute and a proud symbol of the Union Territory, Puducherry - a first-grade college established in the year 2004, which is a felicitous outcome of the honourable Managing Trustee Dr. J. Arawindhan of Achariya Educational Public Trust.`,
      
      `Being affiliated to Pondicherry Central University; recognised under Section-2f of the UGC Act of 1956 and with 17 years of glorious excellence, the institution has been catering to all the sections of this society by imparting the need-based quality higher education through 10 Undergraduate (UG) programs, 2 Postgraduate (PG) programs, in Arts, Science, Commerce, Economics, and Business Administration. Plans are on the unveil to float the innovative programs such as Analytics, and a gamut of other areas. This college stands out as a niche for itself in the educational scenario of Puducherry.`,
      
      `Surrounded by luxuriant vegetation, distant from the clamour and confusion of the city, and also renowned for its picturesque landscape and tranquil serenity, the college provides a congenial ambience for the students to pursue their studies.`,
      
      `The institution aims at enabling the students especially from the rural neighbourhood to accept new challenges and also imparts education by inculcating the moral values in the young minds. Since its establishment, the college has been a reputed and socially responsible institution in all the spheres such as academic, sport, and cultural fields. The vision of the institution is to provide need-based, skill-integrated, cost-effective, quality and holistic education to transform the students into globally competitive, employable and responsible citizens. It is achieved with the relevant curricula, pedagogic innovations, various collaborations and also with the best infrastructure.`,
      
      `Achariya Arts and Science College is indeed a 'Diamond in the Crown' of the Achariya Group of Institutions.`
    ],
  },
  details: [
    {
      title: "Type of College",
      icon: Building,
      items: [{ label: "Type", value: "Co-education" }],
    },
    {
      title: "Financial Category",
      icon: Wallet,
      items: [{ label: "Category", value: "Self-Financing" }],
    },
    {
      title: "Area of Campus",
      icon: ScanSearch,
      items: [{ label: "Area", value: "52274.16 sq. mts." }],
    },
    {
      title: "Location Information",
      icon: MapPin,
      items: [
        { label: "Place", value: "ACHARIYAPURAM, VILLIANUR, PUDUCHERRY" },
        { label: "State", value: "Puducherry" },
        { label: "Location", value: "Urban" },
      ],
    },
    {
      title: "Academic Affiliation",
      icon: School,
      items: [
        { label: "Affiliating University", value: "Pondicherry University" },
        {
          label: "Status of the College",
          value: "Affiliated to Pondicherry University",
        },
        { label: "Medium of Instruction", value: "English" },
      ],
    },
    {
      title: "Programs & Establishment",
      icon: Layers,
      items: [
        { label: "No. of Programs", value: "UG 10 | PG 2" },
        { label: "Year of Establishment", value: "2004" },
        { label: "Telephone Number", value: "+91 94422 44168, +91 94422 55861" },
      ],
    },
  ],
} as const;

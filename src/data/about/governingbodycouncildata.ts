import placeholderImg from "@/assets/images/17122.webp";
import chairman from "@/assets/images/cheif-mentor/Dr.-J.arawindhan.webp";
import { principalData } from "@/data/about/principaldata";
import { chiefMentorData } from "@/data/about/chiefmentordata";
import vicePrincipalNetraPrakash from "@/assets/images/our-team/faculty/Vice Principal/Mr. Netra Prakash.B.webp";

export const governingBodyMembersData = [
  {
    id: 1,
    image: chiefMentorData?.content?.ourleadsimage,
    name: chiefMentorData?.content?.signOff?.name || "Dr. J. Arawindhan",
    department:
      "Managing Trustee, Achariya Group of Educational Institutions, Puducherry – 605110.",
    designation: "Chairman",
    phone: "+91 94422 44168",
    email: "info@achariya.in",
  },
  {
    id: 2,
    image: placeholderImg,
    name: "Smt. Vinothini A",
    department:
      "Trustee, Achariya Group of Educational Institutions, Puducherry – 605110.",
    designation: "Member",
    phone: "+91 94422 44168",
    email: "info@achariya.in",
  },
  {
    id: 3,
    image: placeholderImg,
    name: "Dr. Kalpana H",
    department: "Professor, Department of English, Pondicherry University.",
    designation: "Member / University Nominee",
    phone: "+91 94422 44168",
    email: "kalpana@pondiuni.ac.in",
  },
  {
    id: 4,
    image: placeholderImg,
    name: "Dr. Jaswinder Singh",
    department:
      "Principal, SCTP Khalsa College, University of Delhi, Delhi – 110007.",
    designation: "Member / University Nominee",
    phone: "+91 94422 44168",
    email: "principal@khalsacollege.edu",
  },
  {
    id: 5,
    name: principalData?.content?.signOff?.name || "Dr. Ushadevi R",
    email: principalData?.content?.email || "aaschead@achariya.org",
    department:
      "Principal, Achariya Arts and Science College, Villianur, Puducherry – 605110.",
    designation: "Member / Secretary",
    image: principalData?.content?.image,
  },
  {
    id: 6,
    image: vicePrincipalNetraPrakash,
    name: "Mr. Netra Prakash B",
    department:
      "Vice Principal, Achariya Arts and Science College, Villianur, Puducherry – 605110.",
    designation: "Teacher Representative / Member",
    phone: "+91 94422 44168",
    email: "vp.aasc@achariya.org",
  },
  // {
  //   id: 7,
  //   image: vicePrincipalNetraPrakash,
  //   name: "Mr. Netra Prakash B",
  //   department:
  //     "Head, Department of Management Studies (BBA), Achariya Arts and Science College, Villianur, Puducherry – 605110.",
  //   designation: "Teacher Representative / Member",
  //   phone: "+91 94422 44168",
  //   email: "b.netraprakash.aasc@achariya.org",
  // },
];
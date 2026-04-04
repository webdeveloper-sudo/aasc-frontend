import { chiefMentorData } from "@/data/about/chiefmentordata";
import { principalData } from "@/data/about/principaldata";

export const OurLeads = [
  {
    role: "Chief Mentor",
    img: chiefMentorData?.content?.ourleadsimage,
    path: "/about/chief-mentors-desk",
    name: chiefMentorData?.content?.signOff?.name,
  },
  {
    role: "Principal",
    img: principalData?.content?.image,
    path: "/about/principal-desk",
    name: principalData?.content?.signOff?.name,

  },
];

export default OurLeads;

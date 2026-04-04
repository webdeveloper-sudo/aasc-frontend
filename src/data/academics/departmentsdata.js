import history from "@/assets/images/academic-departments/history-dept.webp";
import ourTeamData from "@/data/about/OurTeamData.js";

import viscomMissionImage from "@/assets/images/departments/VISCOM/mission.webp";
import viscomObjectivesImage from "@/assets/images/departments/VISCOM/objectives.webp";
import csMissionImage from "@/assets/images/departments/computer-science/mission.webp";
import csObjectivesImage from "@/assets/images/departments/computer-science/objectives.webp";
import bcaBannerImage from "@/assets/images/departments/computerapplication/banner.webp"
import bcaMissionImage from "@/assets/images/departments/computerapplication/mission.webp";
import bcaObjectivesImage from "@/assets/images/departments/computerapplication/objectives.webp";
import englishMissionImage from "@/assets/images/departments/english/mission.webp";
import englishObjectivesImage from "@/assets/images/departments/english/objectives.webp";
import mathsMissionImage from "@/assets/images/departments/maths/mission.webp";
import mathsObjectivesImage from "@/assets/images/departments/maths/objectives.webp";
import commerceMissionImage from "@/assets/images/departments/commerce/mission.webp";
import commerceObjectivesImage from "@/assets/images/departments/commerce/objectives.webp";
import managementMissionImage from "@/assets/images/departments/management/mission.webp";
import managementObjectivesImage from "@/assets/images/departments/management/objectives.webp";
import itimg1 from "@/assets/images/departments/it/IT 1.webp"
import itimg2 from "@/assets/images/departments/it/IT2.webp"
import itimg3 from "@/assets/images/departments/it/IT 3.webp"
import bioimg1 from "@/assets/images/departments/BIOTECH/BIO-TECH.webp";
import bioimg2 from "@/assets/images/departments/BIOTECH/BIOTECH-1.webp";
import bioimg3 from "@/assets/images/departments/BIOTECH/BIOTECH.webp";
import csimg1 from "@/assets/images/departments/computer-science/CS 1.webp"
import csimg2 from "@/assets/images/departments/computer-science/CS2.webp"

// Helper function to get faculty by department
const getFacultyByDepartment = (departmentName) => {
  return ourTeamData.faculty.filter(
    (faculty) => faculty.department === departmentName
  );
};
// Placeholder Gallery Array
const placeholderGallery = [history, history, history, history, history];

// =========================
// SIDEBAR MENU STRUCTURE
// =========================
export const departmentsSidebarMenu = [
  {
    id: "computer-science",
    title: "Computer Science",
    url: "/academics/departments/computer-science",
  },
  {
    id: "computer-application",
    title: "Computer Application (BCA)",
    url: "/academics/departments/computer-application",
  },
  {
    id: "information-technology",
    title: "Information Technology",
    url: "/academics/departments/information-technology",
  },
  {
    id: "bio-technology",
    title: "Bio-Technology",
    url: "/academics/departments/bio-technology",
  },
  { id: "english", title: "English", url: "/academics/departments/english" },
  // {
  //   id: "language",
  //   title: "Languages",
  //   url: "/academics/departments/language",
  // },
  {
    id: "mathematics",
    title: "Mathematics",
    url: "/academics/departments/mathematics",
  },
  {
    id: "commerce-and-management",
    title: "Commerce",
    url: "/academics/departments/commerce-and-management",
  },
  {
    id: "management",
    title: "Management",
    url: "/academics/departments/management",
  },
  {
    id: "corporate-secretaryship",
    title: "Corporate Secretaryship",
    url: "/academics/departments/corporate-secretaryship",
  },
  {
    id: "visual-communication",
    title: "Visual Communication",
    url: "/academics/departments/visual-communication",
  },
  // { id: "library", title: "Library"url: "/academics/departments/library" },
];
// ⭐ REST OF DEPARTMENTS (DUMMY SKELETON)
const genericActivities = [
  {
    programTitle: "Annual Seminar",
    date: "Upcoming",
    location: "Main Hall",
    aboutProgram: ["Scheduled academic session for departmental growth."],
    programOutcomes: ["Networking and subject knowledge."],
  },
];
// =====================================================
// ===============  DEPARTMENT DATA  =================
// =====================================================

// ⭐ 1. Visual Communication (Multimedia)
export const visualCommunicationDepartment = {
  name: "Visual Communication",
  image: viscomMissionImage,
  departmentGallery: placeholderGallery,
  about:
    "The Visual Communication Department fosters excellence in creative and media education, blending artistic expression with professional advancement.",
  aboutDepartment: {
    history:
      "The Visual Communication Department was founded with the aim of fostering excellence in creative and media education. It has grown into a vibrant space where artistic expression meets academic and professional advancement.",
    overview:
      "Our programs are thoughtfully crafted to keep pace with the latest developments in media, design, and digital platforms. We emphasize a student-focused learning environment, providing hands-on experience in areas like photography, filmmaking, animation, graphic design, and advertising. This is further enhanced through project-based learning and internship opportunities supported by our experienced teaching team of educators and media professionals.",
    strengths: [
      "Experienced educators and professionals from the media and creative industries.",
      "Hands-on experience in photography, filmmaking, animation, and graphic design.",
      "Strong partnerships with production houses, studios, and creative agencies.",
      "Collaborative learning environment emphasizing industry practices and innovation.",
    ],
  },
  vision: [
    "To be a pioneering department in Visual Communication, cultivating a culture of creative excellence and empowering students to become leaders in the global media and design industry.",
    "To foster a vibrant academic environment that blends artistic expression with technology, preparing students to craft impactful visual narratives that inspire and inform society.",
  ],
  mission: [
    "To deliver quality education in visual communication by combining creative skills, technical knowledge, and ethical values.",
    "To nurture talented professionals through hands-on training, research, and industry exposure.",
    "To empower students with the ability to think visually, communicate effectively, and innovate across media platforms.",
    "To bridge academics with industry needs through experiential learning and creative exploration.",
  ],
  missionImage: viscomMissionImage,
  objectives: [
    "To strengthen practical training through workshops and hands-on sessions in photography, video production, and graphic design.",
    "To organize guest lectures and seminars with media professionals and industry experts.",
    "To enhance student participation in short film contests, design exhibitions, and creative competitions.",
    "To upgrade lab infrastructure and software tools to meet current industry standards.",
    "To encourage students to undertake internships with reputed media houses and design studios for real-time experience.",
    // "To establish the department as a recognized centre for excellence in media education, research, and creative innovation.",
    // "To build strong industry-academic partnerships for collaborative projects and placements.",
    // "To introduce advanced diploma and postgraduate programs in specialized areas like animation and film production.",
    // "To create a vibrant alumni network that supports mentoring and career opportunities.",
    // "To publish student-led media content such as short films and digital magazines on national and international platforms.",
  ],
  objectivesImage: viscomObjectivesImage,
  programsOffered: [
    {
      degree: "B.Sc. Visual Communication",
      duration: "3 Years",
      description:
        "A comprehensive program keeping pace with media and digital platforms.",
    },
  ],
  certificateCourses: ["Digital Photography", "Graphic Designing"],
  skillPrograms: ["Short film making", "Video Editing"],
  faculty: getFacultyByDepartment("Visual Communication"),
  departmentActivities: [
    {
      programTitle: "Field Visit to Eden Beach",
      date: "06.08.2024",
      location: "Eden Beach - Pondicherry",
      aboutProgram: [
        "The Department visited Eden Beach (Chinna Veerampattinam), a Blue Flag-certified beach known for sparkling white sand and backwaters.",
        "Purpose: Photography for core subjects: Basics of Photography, Page Layout and Design, and Documentary Production.",
        "25 students participated, capturing sunrise views, the Chunnambar river backwaters, and thick palm groves.",
      ],
      programOutcomes: [
        "Students gained real-world experience and improved social relations outside the classroom.",
        "Performed tasks with various photographic cameras and learned time-of-day shooting skills.",
        "Composed frames using different lenses and lighting conditions.",
        "Contextualized knowledge of natural light, strobe lighting, and supplemental flash.",
        "Understood report writing for various tourist spots.",
      ],
    },
    {
      programTitle: "Visual Storytelling Photojournalism Workshop",
      date: "16.10.2024",
      location: "Pondicherry University (DEMMC)",
      aboutProgram: [
        "Workshop by Mr. Pattabi Raman (Photojournalist) exploring storytelling in editorial contexts.",
        "Discussed narratives in reporting personal stories and field assignments.",
        "27 students and 2 faculty members participated in this one-day participative experience.",
      ],
      programOutcomes: [
        "Discussed history of photography, moving images, and photojournalism.",
        "Demonstrated understanding of news values and sources.",
        "Explored legal and ethical aspects of photography.",
        "Assessed digital technology importance and aesthetic principles in composition.",
      ],
    },
    {
      programTitle: "World Photography Day Workshop",
      date: "19.08.2024",
      location: "Achariya Conference Hall",
      aboutProgram: [
        "Organized by AVM Club and Canon Company featuring Mr. Karthikeyan (Canon Trainer).",
        "Hands-on experience with DSLRs and mirrorless cameras, angles, and lighting.",
        "50 pupils attended the informative and interactive session.",
      ],
      programOutcomes: [
        "Demonstrated artistry by creating images that evoke emotional responses.",
        "Applied principles of composition to produce professional images.",
        "Applied mechanics of exposure to control light and influence the final product.",
      ],
    },
    {
      programTitle: "Television Production Workshop",
      date: "24.10.2024",
      location: "Achariya Conference Hall",
      aboutProgram: [
        "Session led by Associate Directors Mr. Jagan and Mr. Pushparaj.",
        "Insights into scripting, camera techniques, lighting, sound, and editing.",
        "30 pupils attended practical demonstrations and a Q&A session.",
      ],
      programOutcomes: [
        "Provided hands-on experience in various stages of TV production.",
        "Applied principles of composition and exposure mechanics to final products.",
      ],
    },
    {
      programTitle: "3D Animation Workshop (Blender)",
      date: "28.08.2024 - 30.08.2024",
      location: "Multimedia Lab",
      aboutProgram: [
        "Three-day workshop led by Mr. K. Gokul focusing on the 3D pipeline: modelling, rigging, animation, and rendering.",
        "25 members learned modelling and developed animation skills.",
      ],
      programOutcomes: [
        "Learned how to create 3D models.",
        "Discovered applications of 3D modelling.",
        "Designed and created original 3D models.",
      ],
    },
    {
      programTitle: "Field Trip to Art & Craft Village",
      date: "09.04.2025",
      location: "Art & Craft Village - Pondicherry",
      aboutProgram: [
        "Trip to enhance aesthetic knowledge. Students observed clay sculptures, kalamkari-style bags, coconut shell crafts, and leather work.",
        "25 students captured the tradition and modern meet of the village scenery.",
      ],
      programOutcomes: [
        "Students understood real-world experience and social relations.",
        "Improved creative and aesthetic thinking through artisan observation.",
      ],
    },
    {
      programTitle: "Field Visit to Pondy Marina and Auroville",
      date: "12.02.2025",
      location: "Pondy Marina and Auroville - Pondicherry",
      aboutProgram: [
        "Photography visit to Pondy Marina (food-based theme beach) and Auroville (universal township).",
        "Captured river mouths, sandy beaches, and the Matrimandir concept.",
      ],
      programOutcomes: [
        "Contextualized knowledge of documentary production in a global township setting.",
        "Learned to find subjects for photography in architectural and natural environments.",
      ],
    },
    {
      programTitle: "Photography Exhibition: Aesthetics of Achariya",
      date: "17.03.2025",
      location: "College Campus",
      aboutProgram: [
        "Inaugurated by Mr. Senthil Joseph and Mr. Arul Raj.",
        "250 students engaged with diverse creative exhibits showcasing exceptional photography skills.",
      ],
      programOutcomes: [
        "Fostered creativity and artistic expression.",
        "Showcased student talent to industry professionals.",
      ],
    },
    {
      programTitle: "MOU and Grand Screening (RIFF)",
      date: "30.04.2025",
      location: "Main Auditorium",
      aboutProgram: [
        "Collaboration with Rameshwaram International Film Festival (RIFF) and IGFS.",
        "Screening of 'The Little Moon' (USA) and 'Khadima' (India).",
        "MoU signed for monthly international film screenings and virtual interactions.",
        "Virtual interaction with filmmakers from UK, Mexico, and USA.",
      ],
      programOutcomes: [
        "Exposure to diverse cinematic narratives from across the globe.",
        "Direct engagement with acclaimed international filmmakers.",
      ],
    },
    {
      programTitle: "Guest Lecture: Intercultural Communication",
      date: "19.02.2025",
      location: "Seminar Hall",
      aboutProgram: [
        "Expert Dr. S. Anand Lenin Vethanayagam delivered a session on 'Developing Multicultural Competency'.",
        "Discussed Forest Theory and Synergy Theory.",
      ],
      programOutcomes: [
        "Enhanced understanding of cultural perspectives in visual media.",
      ],
    },
    {
      programTitle: "Animation and VFX Orientation",
      date: "28.11.2024",
      location: "Conference Hall",
      aboutProgram: [
        "Session by Mr. Thamizhvanan D. from Image Institute.",
        "Exploration of latest technological advancements and career paths in VFX.",
      ],
      programOutcomes: [
        "Equipped students with industry expectations for the VFX industry.",
      ],
    },
  ],
};

// ⭐ 2. Information Technology
export const informationTechnologyDepartment = {
  name: "Information Technology",
  image: itimg2,
  departmentGallery: placeholderGallery,
  about:
    "Founded in 2005, our department has grown into a vibrant center of innovation, learning, and career-focused education.",
  aboutDepartment: {
    history:
      "Since its establishment in 2005, the department has consistently aligned with current tech trends and industry needs.",
    overview:
      "Our curriculum blends computer science foundations with domains like networking, cybersecurity, data analytics, software development, and cloud computing. We provide hands-on lab sessions, real-world industry projects, and internships designed to sharpen technical curiosity.",
    strengths: [
      "Strong ties with industry and research institutions",
      "Excellent placement record in MNCs like Sutherland, Iamneo, and Edutech",
      "Focus on diverse domains: IT Support, Data Analytics, and Cloud Computing",
      "Hands-on learning through hackathons and skill-building workshops",
    ],
  },
  vision:
    "To be a leading Department of Information Technology that imparts quality education, fosters innovation, and develops skilled professionals to meet global technological challenges.",
  mission: [
    "To provide strong academic foundations in information technology through effective teaching and learning practices.",
    "To equip students with practical skills in programming, networking, web technologies, and emerging IT trends.",
    "To promote innovation, research, and ethical values among students.",
    "To prepare graduates for successful careers and lifelong learning in the IT industry.",
  ],
  missionImage: itimg3,
  objectives: [
    "Align student skills with professional expectations and future technologies.",
    "Facilitate high-tier placements in national and multinational organizations.",
    "Encourage research publishing and participation in technical hackathons.",
    "Empower students to stand out in competitive hiring assessments.",
  ],
  objectivesImage: itimg1,
  programsOffered: [
    {
      degree: "B.Sc. Information Technology",
      duration: "3 Years",
      description:
        "Focus on networking, web technologies, and software engineering.",
    },
  ],
  certificateCourses: ["SWAYAM–NPTEL Online Courses", "Power BI Certification"],
  skillPrograms: [
    "AI Data Mining Tools",
    "IoT Automation using Raspberry Pi",
    "Azure with AI",
  ],
  faculty: getFacultyByDepartment("Information Technology"),
  departmentActivities: [
    {
      programTitle:
        "An one day workshop on AI Data mining Tools - a comprehensive approach",
      date: "18.09.2025",
      location: "Conference Hall & IT Lab",
      aboutProgram: [
        "Led by Dr. C. Bhuvaneswari (Govt. Arts and Science College).",
        "Focused on leveraging AI-powered analytics for decision-making.",
        "Included hands-on experience in analyzing and interpreting data using Power BI.",
      ],
      programOutcomes: [
        "Equipped students with practical skills in AI-powered data visualization.",
        "Boosted student confidence in experimenting with modern AI techniques.",
      ],
    },
    {
      programTitle: "Club Inauguration – Achariya Syntax Squad",
      date: "18.09.2025",
      location: "Conference Hall",
      aboutProgram: [
        "Official launch of the IT Club and unveiling of the club logo.",
        "Investiture ceremony to induct student office bearers (President, VP, Treasurer, and Secretaries).",
        "Aimed at fostering innovation and collaboration among IT students.",
      ],
      programOutcomes: [
        "Established a leadership structure for organizing technical club activities.",
        "Created a platform for student-led innovation and peer learning.",
      ],
    },
    {
      programTitle:
        "Achariya Syntax squad - Power BI UI/UX Design Roadmap Session",
      date: "09.10.2025",
      location: "IT Lab (Online - Mind Luster)",
      aboutProgram: [
        "Introduced students to data visualization and interactive dashboard creation.",
        "Focused on visual design principles, layout consistency, and user interaction.",
        "Explored visualization types like charts, graphs, and slicers.",
      ],
      programOutcomes: [
        "Provided practical knowledge of Power BI tools and customization.",
        "Improved students' ability to combine technical data handling with creative design.",
      ],
    },
    {
      programTitle: "Achariya Syntax Squad - FunFinity",
      date: "11.11.2025",
      location: "IT Lab",
      aboutProgram: [
        "A series of engaging activities including Group Discussion, Technical Quiz, Bug Hunt, and Musical Chairs.",
        "Designed to blend technical knowledge with entertainment.",
      ],
      programOutcomes: [
        "Enhanced logical thinking and technical communication.",
        "Promoted teamwork and individual excellence in a competitive environment.",
      ],
    },
    {
      programTitle: "Guest Lecture: Emerging Technologies in Data Science",
      date: "17.10.2025",
      location: "AASC Conference Hall",
      aboutProgram: [
        "Delivered by Mrs. S. Divya (Christ Arts and Science College).",
        "Explored advancements in AI, ML, Big Data, and Cloud Computing.",
        "Focused on real-world industrial applications and data-driven decision-making.",
      ],
      programOutcomes: [
        "Gained insights into the evolving landscape of Data Science and Big Data Analytics.",
        "Increased awareness of ethical practices and career opportunities in the field.",
      ],
    },
    {
      programTitle: "Guest Lecture: Network Firewall",
      date: "Academic Session 2024-25",
      location: "Campus",
      aboutProgram: [
        "Speaker: Mr. N. Ravi Bharathi (Accenture Chennai) regarding cross-sector deployment of firewalls.",
      ],
      programOutcomes: [
        "Understanding of security protocols in modern networking.",
      ],
    },
    {
      programTitle: "Field Trip for Community Engagement Service",
      date: "26.05.2025",
      location: "Sri Ganga Varaaha Nadheeswarar Temple",
      aboutProgram: [
        "Social internship to identify community problems and social responsibilities.",
      ],
      programOutcomes: [
        "Developed awareness of real-time social challenges and social responsibility.",
      ],
    },
  ],
};

// ⭐ Computer Science Department
export const computerScienceDepartment = {
  name: "Computer Science",
  image: csimg1,
  departmentGallery: placeholderGallery,
  about:
    "The Department of Computer Science (UG) was established in the year 2004 with B.Sc. Computer Science.",
  aboutDepartment: {
    history:
      "The Department of Computer Science (UG) was established in the year 2004 with the introduction of two courses in B.Sc. Computer Science. Since its inception, the department has made an everlasting impression in the world of computer education in the region.",
    overview:
      "The department is well-equipped with all the basic and latest technical resources and comprises a well-qualified, dedicated faculty team. The academic performance has been consistently outstanding. We regularly organize seminars, guest lectures, workshops, internships, in-plant training, and symposiums to improve our students' skillset. Our graduates are successfully placed in reputed multinational IT companies worldwide, securing highly competitive career paths.",
    strengths: [
      "Well-qualified and dedicated faculty team focused on student success.",
      "Outstanding academic performance records and global alumni network.",
      "Equipped with basic and latest technical resources for practical learning.",
      "Adherence to Choice Based Credit System (CBCS) as recommended by Pondicherry University since 2017-2018.",
    ],
  },
  vision:
    "To excel in transforming the graduates to be proficient in Computer Technology and Application that generates competent IT professionals, researchers and entrepreneurs globally.",
  mission: [
    "M1 - Excellence in Education: To impart quality education by instilling confidence towards taking up various challenges in the ever growing Industrial sectors.",
    "M2 - Research and Modernization: To indoctrinate innovative research programs through enhancing technical competencies to balance the upgrading industrial and societal needs.",
    "M3 - Placement and Entrepreneurship: To be recognized as experts by creating extensive global opportunities in placements and cultivating entrepreneurship skills for effective dissemination of creative ideas in business ventures.",
    "M4 - Moral Ethics: To produce ethically strong professionals by infusing optimistic approach for the significant contribution to the society.",
  ],
  missionImage: csimg2,
  objectives: [
    "To bring Innovation in technology and go beyond fundamentals to build interest in specialized research.",
    "To guide students in the development of new languages and instill interest in hardware production.",
    "To invent new operating systems and develop database languages.",
    "To introduce innovative need-based and skill-based courses through the Choice Based Credit System (CBCS).",
  ],
  objectivesImage: csimg1,
  programsOffered: [
    {
      degree: "B.Sc. Computer Science",
      duration: "3 Years",
      description:
        "Standard curriculum focusing on core software principles, hardware production, and system development under the CBCS system.",
    },
  ],
  certificateCourses: ["Skill-based credits", "UI/UX Design Process"],
  skillPrograms: [
    "AWS Cloud Computing",
    "Robotics Process Automation (RPA)",
    "AI Fundamentals",
  ],
  faculty: getFacultyByDepartment("Computer Science"),
  departmentActivities: [
    {
      programTitle: "National Workshop on AWS (Amazon Web Services)",
      date: "25.10.2024",
      location: "AASC Conference Hall",
      aboutProgram: [
        "Led by Mrs. K. Vijayalakshmi, DevOps Engineer at Sivisoft Solutions.",
        "Morning Session: Comprehensive introduction to AWS key aspects: Compute, Storage, Security, and Identity Compliance.",
        "Afternoon Session: Hands-on workshop focusing on practical topics: EC2 (Virtual Machines), S3 (Simple Storage Service), and IAM (Identity and Access Management) using Putty.",
        "77 participants from regional colleges (Saradha Gangadharan, St. Joseph’s, Immaculate, Idhaya, and ACET) attended.",
      ],
      programOutcomes: [
        "Enabled participants to apply cloud knowledge in real-world scenarios.",
        "Gained practical knowledge in creating virtual machines across different operating systems.",
        "Learned to manage datasets with S3 and attach security roles/policies through IAM.",
      ],
    },
    {
      programTitle: "National Workshop on Robotics Process Automation (RPA)",
      date: "10.11.2023",
      location: "Achariya Arts & Science College, Conference Hall",
      aboutProgram: [
        "Resource Person: Mrs. A. Kavitha, Solution Architect at Wipro Limited.",
        "Session I: Comprehensive introduction to RPA and deep dive into Automation using UI Path.",
        "Session II: Hands-on workshop allowing attendees to apply knowledge in a practical setting.",
        "76 students registered from various institutions including Mailam Engineering, Loyola Chennai, and Sri Manakula Vinayakar.",
      ],
      programOutcomes: [
        "Fostered a deep understanding of automated workflows through UI Path.",
        "Ability to apply RPA knowledge in practical business automation settings.",
      ],
    },
    {
      programTitle: "Guest Lecture on UI/UX Design Process",
      date: "04.04.2024",
      location: "Campus",
      aboutProgram: [
        "Resource Person: Mr. U. Sakthivelu, Technical Staff, Institute of Media Arts & Graphics Effects (IMAGE).",
        "Focused on recent trends in the UI/UX design field and shared insights from the professional work field.",
        "Included interactive sessions on current techniques and design challenges.",
        "75 participants involved enthusiastically.",
      ],
      programOutcomes: [
        "Inspired students to think creatively and push boundaries of traditional design practices.",
        "Guided students in navigating career paths and developing skills for UI/UX design journey.",
      ],
    },
    {
      programTitle: "Guest Lecture on Artificial Intelligence",
      date: "19.08.2024",
      location: "AASC Conference Hall",
      aboutProgram: [
        "Resource Person: Ms. Janani Srinivasan.",
        "Topics: Introduction of AI perspectives, Machine Learning importance, and Natural Language Processing in day-to-day life.",
        "Attended by 50 participants.",
      ],
      programOutcomes: [
        "Gained clarity on the role of NLP and Machine Learning in modern technology.",
        "Enhanced understanding of AI's daily life applications and future perspectives.",
      ],
    },
  ],
};

// ⭐ 4. Computer Application (BCA)
export const computerApplicationDepartment = {
  name: "Computer Application (BCA)",
  image: bcaBannerImage,
  departmentGallery: placeholderGallery,
  about:
    "Established in 2004, the Department of Computer Applications was founded to meet the growing demand for highly skilled professionals in the field of computing.",
  aboutDepartment: {
    history:
      "Established in 2004, the Department of Computer Applications was founded to meet the growing demand for highly skilled professionals in the field of computing. It has since evolved to offer a four-year Bachelor of Computer Applications (BCA Honors) program under the National Education Policy (NEP-2020).",
    overview:
      "Our department is designed to provide students with a strong foundation in computer science theory alongside practical expertise in software and application development. Our team of dedicated and highly qualified faculty members is committed to guiding students toward academic excellence. To support hands-on training, the department is equipped with a state-of-the-art computer laboratory featuring the latest software tools where students gain extensive practical experience across multiple programming languages.",
    strengths: [
      "Dedicated and highly qualified faculty team committed to professional success.",
      "Curriculum aligned with NEP-2020 Honors standards.",
      "Emphasis on career readiness, lifelong learning, and higher education.",
      "State-of-the-art computer laboratory with extensive practical training across multiple languages.",
    ],
  },
  vision:
    "To be a leading center of excellence in computer applications education, fostering innovation, practical expertise, and global competitiveness. The department envisions producing graduates who are technically proficient, entrepreneurial, and adaptable to the ever-evolving digital landscape.",
  mission: [
    "Deliver quality education in computer science and applications through a balanced blend of theory and practical training.",
    "Empower students with industry-relevant skills in software development, system analysis, and emerging technologies.",
    "Promote innovation and research by encouraging creative problem-solving and lifelong learning.",
    "Prepare graduates for global opportunities by instilling professionalism, ethical values, and adaptability to diverse work environments.",
  ],
  missionImage: bcaMissionImage,
  objectives: [
    "Provide a strong foundation in computing concepts and business practices to effectively manage enterprise software and information systems.",
    "Develop analytical skills for system development, enabling students to assess organizational needs and design efficient solutions.",
    "Equip graduates with software development expertise to pursue careers or entrepreneurial opportunities in both Indian and global markets.",
    "Offer specialization pathways in legacy application software, system software, and mobile application development to meet diverse industry demands.",
  ],
  objectivesImage: bcaObjectivesImage,
  programsOffered: [
    {
      degree: "BCA (Honors)",
      duration: "4 Years",
      description:
        "An NEP-2020 aligned program designed to provide a strong foundation in theory and application development.",
    },
  ],
  certificateCourses: ["Enterprise Software Management", "Legacy Systems"],
  skillPrograms: ["UI/UX Design Process", "Mobile Application Development"],
  faculty: getFacultyByDepartment("Computer Application (BCA)"),
  departmentActivities: [
    {
      programTitle: "Guest Lecture on UI/UX Design Process",
      date: "04.04.2024",
      location: "Tech Lab",
      aboutProgram: [
        "Organized in collaboration with the Institute of Media Arts.",
        "The session aimed to inspire students to think creatively and push traditional design boundaries.",
        "Technical experts shared insights into current trends and challenges in the UI/UX journey.",
      ],
      programOutcomes: [
        "Inspired creative design thinking and navigational skills for design practice.",
        "Students gained a clear understanding of career paths in the UI/UX field.",
      ],
    },
    {
      programTitle: "Upcoming Technical Symposium",
      date: "To be announced",
      location: "Main Auditorium",
      aboutProgram: [
        "A planned gathering for students to showcase software development projects.",
        "Will involve industry experts as jury members for application design contests.",
      ],
      programOutcomes: [
        "Development of competitive spirit and technical presentation skills.",
      ],
    },
  ],
};

// ⭐ 5. English Department
export const englishDepartment = {
  name: "English",
  image: englishMissionImage,
  departmentGallery: placeholderGallery,
  about:
    "The Department of English had its inception in the year 2009 and widened its horizon with a huge strength of students and vibrant faculty members.",
  aboutDepartment: {
    history:
      "The Department of English had its inception in the year 2009 and widened its horizon by having a huge strength of students and faculty members. It is led by a team of vibrant, aspirant, and experienced faculty members who always strive for the student’s community by grooming their thought-process and developing various skills.",
    overview:
      "The B.A. English course is the culmination of both teaching language through literature and appreciating the aesthetics of literature through language. It serves with an aim of motivating students to exhibit and explore a wide range of new ideas in literature from the early and modern to the contemporary period. The department is instrumental in conducting various intra and intercollegiate competitions to evaluate student advancement and foster leadership qualities.",
    strengths: [
      "Vibrant, aspirant, and experienced faculty team.",
      "Unique culmination of language teaching and literary aesthetics.",
      "Annual 'Literary Meet' to accelerate hidden talents.",
      "Strong emphasis on extra-curricular activities to transform students into responsible citizens.",
      "Periodical Guest Lectures, Literary forums, and Industrial/Library visits.",
    ],
  },
  vision:
    "To create morally and intellectually aspiring individuals through language and literature, fostering self-confidence and creativity to face the challenging world.",
  mission: [
    "Inaugurate and maintain active Literary Clubs to foster creative expression.",
    "Provide informative and academically enriching sessions through seminars and workshops.",
    "Improve phonetic and linguistic understanding through comprehensive curriculum delivery.",
    "Encourage language skills and leadership through active participation in intercollegiate events.",
  ],
  missionImage: englishMissionImage,
  objectives: [
    "Conduct Literary Meet competitions every year to accelerate hidden talent.",
    "Train students to be morally and intellectually aspiring individuals.",
    "Provide guidance on Higher Education, career prospects, and archival research.",
    "Nurture storytelling, narrative skills, and digital storytelling abilities.",
  ],
  objectivesImage: englishObjectivesImage,
  programsOffered: [
    {
      degree: "B.A. English",
      duration: "3 Years",
      description:
        "Focus on the culmination of language teaching and literary appreciation across historical periods.",
    },
  ],
  certificateCourses: ["Content Writing Workshop", "Digital Storytelling"],
  skillPrograms: [
    "Chat Your Story (Narrative Skills)",
    "Phonetics training",
    "Archival Practices",
  ],
  faculty: getFacultyByDepartment("English"),
  departmentActivities: [
    {
      programTitle: "National Level Workshop on Content Writing",
      date: "21.11.2024",
      location: "Campus",
      aboutProgram: [
        "Led by Mr. N. Mohandas Ganthi, Project Manager, IGNITE Labs.",
        "60 students from various colleges participated to enhance their writing skills.",
      ],
      programOutcomes: [
        "Enhanced professional writing skills and industry readiness.",
      ],
    },
    {
      programTitle: "Literary Film Week (2024 & 2025)",
      date: "Nov 2024 / Nov 2025",
      location: "AASC Auditorium",
      aboutProgram: [
        "Screening of literary adaptations: Troy, Pride and Prejudice, I Robot (2024) and Harry Potter, Brave (2025).",
        "Aimed at helping students understand literature through cinematic interpretation.",
      ],
      programOutcomes: [
        "Improved visual literacy and appreciation of symbolic narrative development.",
      ],
    },
    {
      programTitle: "Educational Visit to National Archives of India",
      date: "16.09.2024",
      location: "National Archives, Puducherry",
      aboutProgram: [
        "Exposed students to methods of preservation, manuscripts, and official document cataloguing.",
      ],
      programOutcomes: [
        "Valuable insights into archival practices and historical research resources.",
      ],
    },
    {
      programTitle: "Chat Your Story with Smartphones",
      date: "19.12.2024",
      location: "AASC Conference Hall",
      aboutProgram: [
        "Nurtured digital storytelling and communication abilities using modern technology.",
      ],
      programOutcomes: [
        "Enhanced narrative skills and confidence in modern digital formats.",
      ],
    },
    {
      programTitle: "Guest Lecture: Resilience through Literary Texts",
      date: "18.07.2025 / 30.07.2025",
      location: "Seminar Hall",
      aboutProgram: [
        "Resource Person: Dr. G. Ruby Davaseeli. Explored 'Pandora’s Box' and themes of strength in adversity.",
      ],
      programOutcomes: [
        "Encouraged critical thinking on emotional and psychological strength reflected in texts.",
      ],
    },
    {
      programTitle: "Freedom Fest (2k24 & 2K25)",
      date: "August 2024 / 2025",
      location: "Campus",
      aboutProgram: [
        "Elocution, essay writing, and poetry competitions to commemorate independence.",
      ],
      programOutcomes: [
        "Inculcated patriotism and critical expression among students.",
      ],
    },
    {
      programTitle: "Academic Field Visit: 'Lit Knowledge Hunting'",
      date: "12.09.2025",
      location: "Tranquebar, Poombuhar, and Chidambaram",
      aboutProgram: [
        "Exploration of rich cultural and historical heritage to connect classroom knowledge with real-world insights.",
      ],
      programOutcomes: [
        "Academically enriching experience blending education with cultural exploration.",
      ],
    },
    {
      programTitle: "Social Outreach: Old Age Home Visit",
      date: "Oct 2024 / Oct 2025",
      location: "Pushpagandhi Old Age Home, Korkadu",
      aboutProgram: [
        "Diwali celebration with elderly residents to instill compassion and empathy.",
      ],
      programOutcomes: [
        "Emotional connection with the elderly and development of social responsibility.",
      ],
    },
    {
      programTitle: "Constitution Day Elocution",
      date: "26.11.2024",
      location: "Campus",
      aboutProgram: [
        "Topic: 'The Role of the Constitution in Shaping Modern India'.",
      ],
      programOutcomes: [
        "Awareness of constitutional values and democratic principles.",
      ],
    },
  ],
};

// ⭐ 6. Mathematics Department
export const mathematicsDepartment = {
  name: "Mathematics",
  image: mathsObjectivesImage,
  departmentGallery: placeholderGallery,
  about:
    "The Department of Mathematics was established in 2004 as a pivot of academic and professional growth with curriculum aligned to industrial and research trends. Proudly presented 3 Gold Medallions with exemplary pass percentage and 352 centums (Non-CBCS) + 77 'O' Grades (CBCS).",
  aboutDepartment: {
    history:
      "Established in 2004, consistently producing proficient graduates with 3 Gold Medallions, exemplary pass percentage from 2004-2024, 352 centums under Non-CBCS, and 77 'O' Grades under CBCS pattern.",
    overview:
      "The Department of Mathematics was established with a vision to deliver excellence in Mathematics. Our department is a pivot of academic and professional growth since 2004, with a curriculum aligned to industrial and research trends. We aim to prepare future-ready professionals. Our faculty comprises experienced educators and researchers committed to student success. The department of Mathematics proudly presented 3 Gold Medallions so far. Also all the passed out batches from 2004 to 2024 are having exemplary pass percentage. In addition to it number of centum produced by the department is 352 under Non CBCS Pattern and 77 ‘O’ Grades under CBCS (choice based credit system) Pattern.",
    strengths: [
      "3 Gold Medallions and exceptional academic records (352 centums, 77 'O' Grades)",
      "Experienced faculty focused on student success and research",
      "Curriculum aligned with industrial and research trends",
      "Consistent 100% pass percentage across all batches since 2004",
    ],
  },
  vision:
    "To be a vibrant nucleus for mathematical exploration, fostering logical thinking and problem-solving skills essential for a dynamic world. Inspire deep appreciation for mathematics across disciplines and cultivate mathematically literate, critical-thinking graduates contributing to society.",
  visionimg: history,
  mission: [
    "Provide high-quality, student-centered education through innovative teaching and engagement.",
    "Promote supportive, collaborative learning environment encouraging inquiry, creativity, and intellectual growth.",
    "Equip students with strong foundation in mathematical concepts for diverse career paths and further studies.",
  ],
  missionImage: mathsMissionImage,
  objectives: [
    "Implement active learning strategies (think-pair-share, group problem-solving) in core courses like Calculus, Linear Algebra, Discrete Mathematics.",
    "Develop targeted remedial resources (video tutorials, practice sets) for struggling students.",
    "Increase faculty-student interaction through office hours, forums, and Q&A sessions.",
    "Integrate real-world applications and conduct mid-semester feedback for continuous improvement.",
    "Establish Center of Excellence in computational mathematics/data science or mathematical modeling.",
  ],
  objectivesImage: mathsObjectivesImage,
  programsOffered: [
    {
      degree: "B.Sc. Mathematics",
      duration: "3 Years",
      description:
        "Comprehensive program developing analytical skills with industrial/research alignment under CBCS.",
    },
  ],
  certificateCourses: ["SCILAB", "Tally", "DTP"],
  skillPrograms: ["R Programming", "Vedic Mathematics", "SPSS Data Analysis"],
  faculty: getFacultyByDepartment("Mathematics"),
  departmentActivities: [
    {
      programTitle: "Girls Lead Girls - Self Defense Workshop",
      date: "05.11.2024 - 06.11.2024",
      location: "AASC Auditorium",
      aboutProgram: [
        "Two-day intensive workshop for First-year (Day 1) and Second-year (Day 2) girls.",
        "Focused on physical empowerment and safety awareness.",
      ],
      programOutcomes: [
        "Enhanced self-confidence and practical self-defense skills.",
      ],
    },
    {
      programTitle: "Fake Feminism - Women Empowerment Talk",
      date: "24.11.2023",
      location: "AASC Library Conference Hall",
      aboutProgram: [
        "Delivered by Mrs. Vaijainthimala Valarmathi (Advocate, District VP, Mahila Morcha).",
        "Multi-disciplinary event for BBA, B.Com, BCA, CS, IT, Maths, Vis.Com students.",
      ],
      programOutcomes: [
        "Increased awareness of psychological/legal aspects of empowerment.",
      ],
    },
    {
      programTitle: "Vedic Mathematics for Graduates",
      date: "12.05.2023",
      location: "AASC Library Conference Hall",
      aboutProgram: [
        "Resource Person: Dr. K. Thirumurugan.",
        "Rapid calculation techniques for BCA, B.Com, Mathematics students.",
      ],
      programOutcomes: [
        "Improved mental math for competitive exams and daily applications.",
      ],
    },
    {
      programTitle: "Alumni Talk: Human Trafficking & Drug Abuse",
      date: "21.02.2024",
      location: "AASC Library Conference Hall",
      aboutProgram: [
        "Session 1: Mr. Lawrence (Human Trafficking/Drug Abuse).",
        "Session 2: Ms. Jenifar (Students Stress Management). 80+ participants.",
      ],
      programOutcomes: [
        "Social responsibility and stress management awareness.",
      ],
    },
  ],
};

export const languageDepartment = {
  name: "Languages",
  image: history,
  departmentGallery: placeholderGallery,
  about: "Fosters linguistic competence in Tamil, Hindi, and French.",
  aboutDepartment: {
    history: "Long-standing",
    overview: "Multi-language focus",
    strengths: ["Cultural heritage"],
  },
  vision: "Universal communication",
  mission: ["Cultural understanding"],
  missionImage: history,
  objectives: ["Proficiency"],
  objectivesImage: history,
  programsOffered: [
    {
      degree: "Foundation Language",
      duration: "2 Years",
      description: "Core language support.",
    },
  ],
  certificateCourses: [],
  skillPrograms: [],
  faculty: getFacultyByDepartment("Language"),
  departmentActivities: genericActivities,
};

export const bioTechnologyDepartment = {
  name: "Bio-Technology",
  image: bioimg1,
  departmentGallery: placeholderGallery,
  about:
    "The Department of Biotechnology was established in the year 2005 and offers a three-year B.Sc. degree programme. Biotechnology has wide-ranging applications in medical, industrial, agricultural, and environmental sectors with well-equipped laboratories and experienced faculty.",
  aboutDepartment: {
    history:
      "The Department of Biotechnology was established in the year 2005 and offers a three-year B.Sc. degree programme in Biotechnology. Biotechnology is one of the fastest-growing disciplines with significant implications in health and medicine, and it has wide-ranging applications in medical, industrial, agricultural, and environmental sectors.",
    overview:
      "The department is supported by well-equipped laboratories, qualified and experienced faculty members, and enriched departmental activities, which empower students to compete successfully in the global arena. The department has organized more than 20 guest lectures, seminars, conferences, workshops and national and international webinars etc. Faculty members and students have actively participated in over 100 seminars, conferences, and workshops, securing awards at both national and international levels.",
    strengths: [
      "Excellent academic record with 10 Gold Medallists from Pondicherry University.",
      "60% graduates pursue postgraduate studies and research, 40% placed in reputed organizations.",
      "Faculty consistently publish research papers (2018-2025) and filed Indian patents.",
      "Value-added and skill development courses through SEED enhance employability.",
      "Mushroom Cultivation Project promotes experiential, sustainable learning.",
      "Students clear competitive exams (JNU, GATE, TOEFL, GRE, GAT-B) and pursue higher studies abroad.",
    ],
  },
  vision:
    "To be a centre of excellence in Biotechnology education and research by developing scientifically competent, ethically responsible, and globally competitive graduates who contribute to advancements in health, industry, agriculture, and environmental sustainability.",
  mission: [
    "M1 - Quality Education: To provide quality undergraduate education in Biotechnology through a strong curriculum supported by modern laboratories and experienced faculty.",
    "M2 - Research Culture: To promote research, innovation, publications, and patent filing, fostering a strong research culture among students.",
    "M3 - Skill Development: To enhance employability, entrepreneurial, and life skills through value-added and skill development programmes.",
    "M4 - Academic Excellence: To encourage academic excellence and competitive success through participation in seminars, conferences, workshops, and national-level examinations.",
    // "M5 - Experiential Learning: To promote experiential, sustainable, and society-oriented learning through student-led projects and departmental activities.",
    // "M6 - Global Opportunities: To prepare students for higher education, research careers, and global opportunities in the field of Biotechnology.",
  ],
  missionImage: bioimg2,
  objectives: [
    "To promote experiential, sustainable, and society-oriented learning through student-led projects and departmental activities.",
    "To prepare students for higher education, research careers, and global opportunities in Biotechnology.",
    "To inspire research and innovation through faculty publications and patents.",
    "To enhance employability through SEED value-added and skill development courses.",
  ],
  objectivesImage: bioimg3,
  programsOffered: [
    {
      degree: "B.Sc. Biotechnology",
      duration: "3 Years",
      description:
        "Comprehensive curriculum covering medical, industrial, agricultural, and environmental biotechnology applications with modern laboratory training.",
    },
  ],
  certificateCourses: [
    "Value-added courses through SEED",
    "Skill development programs through SEED",
  ],
  skillPrograms: [
    "Mushroom Cultivation Project",
    "Biocosmos 2020 Departmental Club Activities",
  ],
  faculty: getFacultyByDepartment("Bio-Technology"),
  departmentActivities: [
    {
      programTitle: "Guest Lectures & Seminars Series",
      date: "Ongoing (2005-2025)",
      location: "AASC Campus",
      aboutProgram: [
        "Organized more than 20 guest lectures, seminars, conferences, workshops, and national/international webinars.",
        "Faculty and students actively participated in over 100 seminars, conferences, and workshops.",
        "Secured awards at national and international levels.",
      ],
      programOutcomes: [
        "Enhanced research skills and global competitiveness.",
        "Students inspired for research and innovation.",
      ],
    },
    {
      programTitle: "Mushroom Cultivation Project",
      date: "Ongoing",
      location: "Department Labs",
      aboutProgram: [
        "Student-led sustainable learning project actively managed by students and faculty.",
        "Promotes experiential and society-oriented learning.",
      ],
      programOutcomes: [
        "Practical biotechnology application experience.",
        "Sustainable entrepreneurship skills development.",
      ],
    },
    {
      programTitle: "Biocosmos 2020",
      date: "2020",
      location: "Department Club",
      aboutProgram: [
        "Departmental club activities demonstrating students' academic and creative potential.",
      ],
      programOutcomes: ["Enhanced student creativity and leadership skills."],
    },
  ],
};

export const commerceAndManagementDepartment = {
  name: "Commerce",
  image: commerceMissionImage,
  departmentGallery: placeholderGallery,
  about:
    "The Department of Commerce is a vital academic unit dedicated to providing high-quality education in business, finance, and economics. Master of Commerce is the only PG department in Achariya Arts & Science College, started in 2009 with 17 batches passed out.",
  aboutDepartment: {
    history:
      "M.Com PG program started in 2009 (17 batches passed). Students undergo Industrial Visits, Guest lectures, Seminars, Educational tours, and intra-departmental competitions like Paper Presentation, Best Manager & Best Logo creator.",
    overview:
      "Equips students with in-depth knowledge for Banks & Financial Institutions. Students present/publish research papers in National/International conferences and journals. Offers CMA/CS foundation courses and SEBI regulations training.",
    strengths: [
      "Only PG department (M.Com) with excellent placement scope",
      "Regular industrial visits, seminars, and educational tours",
      "Research paper presentations in national/international forums",
      "Intra-departmental competitions fostering practical skills",
      "Professional courses: CMA, CS foundation, SEBI regulations",
    ],
  },
  vision:
    "To be a center of academic excellence dedicated to providing quality education in commerce and related fields, fostering innovative and competent individuals equipped for global challenges in industry, business, and the service sector, while promoting holistic development for a better life, environment, and society.",
  mission: [
    "Empower students with knowledge, skills, and values to excel as professionals in accounting, finance, research, consultancy, and entrepreneurship.",
    "Promote holistic and value-based education that enhances employability and fosters social responsibility.",
    "Cultivate a nurturing environment encouraging innovation, lifelong learning, and global competencies.",
    "Offer CMA and CS foundation courses led by professionals with SEBI regulations training for global opportunities.",
  ],
  missionImage: commerceMissionImage,
  objectives: [
    "Achieve strong grades in core subjects like accounting, economics, finance, and business law.",
    "Build practical skills such as Excel, Tally, data analysis, and communication.",
    "Gain real-world exposure through internships in finance, accounting, or business-related fields.",
    "Connect with professors, alumni, and industry professionals to broaden career opportunities.",
  ],
  objectivesImage: commerceObjectivesImage,
  programsOffered: [
    {
      degree: "M.Com (Master of Commerce)",
      duration: "2 Years",
      description:
        "Postgraduate program providing in-depth knowledge in commerce with scope in banking, finance, research, and higher studies.",
    },
    {
      degree: "B.Com",
      duration: "3 Years",
      description:
        "Undergraduate program building foundation in accounting, finance, business law, and practical commerce skills.",
    },
  ],
  certificateCourses: ["CMA Foundation", "CS Foundation", "SEBI Regulations"],
  skillPrograms: ["Excel Mastery", "Tally ERP", "Data Analysis for Commerce"],
  faculty: getFacultyByDepartment("Commerce (UG/PG)"),
  departmentActivities: [
    {
      programTitle: "Industrial Visits & Educational Tours",
      date: "Ongoing",
      location: "Various",
      aboutProgram: [
        "Regular industrial visits and educational tours for practical exposure.",
        "Students visit Banks, Financial Institutions, and business organizations.",
      ],
      programOutcomes: [
        "Real-world business environment exposure.",
        "Enhanced industry readiness and networking.",
      ],
    },
    {
      programTitle: "National & International Seminars/Conferences",
      date: "Ongoing",
      location: "Various Institutions",
      aboutProgram: [
        "Students participate, present, and publish research papers.",
        "Ample opportunities in national and international forums.",
      ],
      programOutcomes: [
        "Research publication experience.",
        "Global academic networking.",
      ],
    },
    {
      programTitle: "Intra-Departmental Competitions",
      date: "Regular",
      location: "Campus",
      aboutProgram: [
        "Paper Presentation, Best Manager, Best Logo Creator competitions.",
        "Fosters competitive spirit and practical skills.",
      ],
      programOutcomes: [
        "Enhanced presentation and management skills.",
        "Creative problem-solving abilities.",
      ],
    },
    {
      programTitle: "Guest Lectures & Seminars",
      date: "Ongoing",
      location: "Campus",
      aboutProgram: [
        "Expert sessions on commerce, finance, and professional courses.",
        "Guidance on CMA, CS foundation, and SEBI regulations.",
      ],
      programOutcomes: [
        "Professional course preparation.",
        "Industry trend awareness.",
      ],
    },
  ],
};

export const managementDepartment = {
  name: "Management",
  image: managementMissionImage,
  departmentGallery: placeholderGallery,
  about:
    "The Department of Management focuses on developing quality managers and entrepreneurs capable of meeting the dynamic challenges of the corporate sector through academic learning and experiential exposure.",
  aboutDepartment: {
    history:
      "The Department of Management was established with a clear vision to nurture future managers and entrepreneurs through structured business education and practical exposure.",
    overview:
      "The department offers undergraduate programs in Business Administration designed to enhance managerial competence, leadership qualities, and entrepreneurial skills aligned with industry needs.",
    strengths: [
      "Strong focus on leadership and entrepreneurship",
      "Active student participation in academic, cultural, and management events",
      "Industry interaction through conclaves, meets, and alumni sessions",
      "Experiential learning through real-time business exposure",
    ],
  },
  vision:
    "To develop competent managers and responsible entrepreneurs who contribute to organizational growth and societal development.",
  mission: [
    "To impart quality management education aligned with industry expectations.",
    "To develop leadership, decision-making, and entrepreneurial skills.",
    "To encourage experiential learning through events, conclaves, and competitions.",
    "To foster ethical values, teamwork, and social responsibility.",
  ],
  missionImage: managementMissionImage,
  objectives: [
    "Enhance managerial and entrepreneurial competencies",
    "Provide exposure to real-world business environments",
    "Encourage innovation, leadership, and teamwork",
  ],
  objectivesImage: managementObjectivesImage,
  programsOffered: [
    {
      degree: "BBA (Bachelor of Business Administration)",
      duration: "3 Years",
      description:
        "An undergraduate program designed to develop managerial, leadership, and entrepreneurial skills with strong industry relevance.",
    },
  ],
  certificateCourses: [],
  skillPrograms: [],
  faculty: getFacultyByDepartment("Management"),
  departmentActivities: [
    {
      programTitle: "Orientation Programme for I Year BBA",
      date: "2024–2025",
      location: "College Campus",
      aboutProgram: [
        "I Year BBA students attended a 10-day orientation programme organized by the college.",
      ],
      programOutcomes: [
        "Enhanced understanding of academic expectations and college culture.",
      ],
    },
    {
      programTitle: "Inter-College Competition – Elocution & Essay",
      date: "2024–2025",
      location: "College Campus",
      aboutProgram: [
        "Mohan Prakash won I Prize in Elocution and Padmasudha won I Prize in Essay Competition.",
      ],
      programOutcomes: ["Recognized communication and writing excellence."],
    },
    {
      programTitle: "Onam Celebration",
      date: "2024–2025",
      location: "College Campus",
      aboutProgram: [
        "Students celebrated the harvest festival of Kerala with floral decorations, traditional lamp lighting, and cultural activities.",
      ],
      programOutcomes: ["Fostered cultural unity and celebration spirit."],
    },
    {
      programTitle: "ACETRONIX 2K24",
      date: "2024",
      location: "Achariya College of Engineering Technology, Puducherry",
      aboutProgram: [
        "I Year BBA students participated in ACETRONIX 2K24 inter-collegiate event.",
      ],
      programOutcomes: ["Gained inter-college competition experience."],
    },
    {
      programTitle: "COMM EDGE–2K24",
      date: "2024",
      location: "Marudhar Kesari Jain College for Women, Vaniyambadi",
      aboutProgram: [
        "II Year BBA students won II Prize in the AD-VENTURE event.",
      ],
      programOutcomes: [
        "Achieved competitive success in advertising challenge.",
      ],
    },
    {
      programTitle: "INSIGHTX'24 – International Symposium",
      date: "2024",
      location: "EGS Pillay Engineering College, Nagapattinam",
      aboutProgram: [
        "Students won II Prize in Stock War, III Prize in Ad-Zap, and Best Manager events.",
      ],
      programOutcomes: [
        "Multiple awards in international management competitions.",
      ],
    },
    {
      programTitle: "GYAN KUMBH – Academic Conclave",
      date: "2024",
      location: "Pondicherry University",
      aboutProgram: [
        "II Year BBA students attended a national-level academic conclave.",
      ],
      programOutcomes: ["Exposed to national-level academic discourse."],
    },
    {
      programTitle: "SHAZAAM – Sports & Cultural Fest",
      date: "2024",
      location: "CK Group of Educational Institutions, Cuddalore",
      aboutProgram: [
        "Ms. Harini won II Prize in Grahan Thandav Solo Classical Dance.",
      ],
      programOutcomes: ["Recognized talent in cultural performances."],
    },
    {
      programTitle: "LE CIEL – National Level Cultural Fest",
      date: "2024",
      location: "NIT Puducherry, Karaikal",
      aboutProgram: [
        "Ms. S. Akshya won I Prize in Perfect Pitch and II Prize in Classical Singing.",
        "Ms. Harini won II Prize in Classical Dance.",
      ],
      programOutcomes: [
        "Multiple awards in prestigious national cultural fest.",
      ],
    },
    {
      programTitle: "DAKSHA'24 – Inter Collegiate Management Fest",
      date: "2024",
      location: "SSN School of Management, Chennai",
      aboutProgram: [
        "II Year BBA students participated in management competitions.",
      ],
      programOutcomes: [
        "Gained exposure to premier management institution events.",
      ],
    },
    {
      programTitle: "Entrepreneurial Extension Counter Activity",
      date: "2024–2025",
      location: "College Campus",
      aboutProgram: [
        "II Year students managed a canteen extension counter to enhance entrepreneurial skills.",
      ],
      programOutcomes: ["Practical business management experience."],
    },
    {
      programTitle: "Christmas Celebration",
      date: "2024–2025",
      location: "College Campus",
      aboutProgram: [
        "Staff and students celebrated Christmas fostering joy and togetherness.",
      ],
      programOutcomes: ["Built community spirit among students and faculty."],
    },
    {
      programTitle: "Pongal Celebration",
      date: "2024–2025",
      location: "College Campus",
      aboutProgram: [
        "Harvest festival celebrated in collaboration with the Department of Tamil.",
      ],
      programOutcomes: ["Promoted cultural integration across departments."],
    },
    {
      programTitle: "National Youth Day – Mime Competition",
      date: "2024–2025",
      location: "College Campus",
      aboutProgram: [
        "Affrin, Hanitha, Swathi, and Kanimozhi won I Prize in Mime competition.",
      ],
      programOutcomes: ["Team achievement in national youth day celebrations."],
    },
    {
      programTitle: "COIN 2K25 – MSME Conclave",
      date: "2025",
      location: "College Campus",
      aboutProgram: [
        "II Year BBA students organized a 2-day MSME Conclave with parent stakeholders as guest speakers.",
      ],
      programOutcomes: [
        "Leadership experience in event organization and industry interaction.",
      ],
    },
  ],
};

export const corporateSecretaryshipDepartment = {
  name: "Corporate Secretaryship",
  image: commerceMissionImage,
  departmentGallery: placeholderGallery,
  about:
    "The Department of Corporate Secretaryship, founded in 2004, aims to address the evolving needs of businesses and industries in the fields of Management, Accountancy, Costing, Finance, and Company Secretaryship. While professional courses such as ICAI and ICWA cater to these domains, there is a growing demand for skilled professionals to support companies on a daily basis.",
  aboutDepartment: {
    history:
      "Founded in 2004 with a legal focus on addressing evolving business needs in management, accountancy, costing, finance, and company secretaryship.",
    overview:
      "The Department of Corporate Secretaryship, founded in 2004, aims toaddress the evolving needs of businesses and industries in the fields ofManagement, Accountancy, Costing, Finance, and CompanySecretaryship. While professional courses such as ICAI and ICWA caterto these domains, there is a growing demand for skilled professionals tosupport companies on a daily basis. This necessitates not onlyincreasing the number of qualified professionals but also developing anew cadre of experts to assist in these critical areas.",
    strengths: [
      "Secretarial roles",
      "Corporate governance expertise",
      "Industry-relevant training",
    ],
  },
  vision:
    "To be a center of excellence in Corporate Secretaryship education, empowering students to become competent professionals in corporate governance, company law, and secretarial practices. Nurture ethical leaders and dynamic entrepreneurs who drive organizational growth and societal transformation.",
  mission: [
    "Provide high-quality, accessible education in Corporate Secretaryship, aligned with global academic standards and industry needs.",
    "Establish a solid foundation in company law, corporate governance, secretarial practices, and compliance.",
    "Foster critical thinking, analytical abilities, and sound decision-making skills relevant to corporate governance and business operations.",
    "Promote professional ethics, integrity, and accountability.",
    "Develop entrepreneurial spirit and leadership qualities through value-based education and practical exposure.",
    "Engage students in research, internships, and industry interactions for diverse career opportunities.",
    "Equip students with skills for action-oriented research in the corporate sector.",
  ],
  missionImage: commerceMissionImage,
  objectives: [
    "Secretarial skills",
    "Develop skilled professionals equipped with knowledge, values, and practical experience for success in corporate and legal sectors.",
    "Increase qualified professionals to meet daily company support needs.",
  ],
  objectivesImage: commerceObjectivesImage,
  programsOffered: [
    {
      degree: "B.Com CS",
      duration: "3 Years",
      description:
        "Corporate law and secretarial practice with focus on governance and compliance.",
    },
  ],
  certificateCourses: [],
  skillPrograms: [],
  faculty: getFacultyByDepartment("Corporate Secretaryship"),
  departmentActivities: [
    {
      programTitle: "Guest Lecture: The Role of Marketing in Business Strategy",
      date: "18.7.2025",
      location: "Campus",
      aboutProgram: [
        "Delivered by Mr. S. J. Vigneshwaran, Assistant Professor from Ayya Nadar Janaki Ammal College, Sivakasi.",
        "Emphasized strategic importance of marketing with real-time examples.",
      ],
      programOutcomes: [
        "Enhanced understanding of marketing's role in business success.",
      ],
    },
    {
      programTitle: "Orientation Program: Entrepreneurship Outreach Program",
      date: "19.8.2025",
      location: "Campus",
      aboutProgram: [
        "Delivered by Mr. Andrew Surjith Ronald, Project Head, SPARC.",
        "Focused on entrepreneurial challenges and incubation hubs.",
      ],
      programOutcomes: [
        "Students gained insights into entrepreneurial ecosystem.",
      ],
    },
    {
      programTitle: "Industrial Visit",
      date: "12.9.2025",
      location: "Historical and cultural sites in Tamil Nadu",
      aboutProgram: [
        "Academic field visit for experiential learning beyond classroom.",
      ],
      programOutcomes: [
        "Enhanced understanding of history, culture, and heritage.",
      ],
    },
    {
      programTitle: "Orientation Program: ACS",
      date: "11.9.2025",
      location: "Campus",
      aboutProgram: [
        "ACS Orientation on registration process, benefits, subjects, and success tips.",
        "Chief Guest: Mrs. Chitra, ACS from Institute of Company Secretaries of India.",
      ],
      programOutcomes: [
        "Students gained clear roadmap for ACS professional course.",
      ],
    },
    {
      programTitle: "Club Inauguration: Achariya Bulls and Bears Club (ABBC)",
      date: "16.9.2025",
      location: "Campus",
      aboutProgram: [
        "Special session on Finance and Trade by Dr. T. Vigneshwaran, CMA.",
      ],
      programOutcomes: [
        "Students enriched with market dynamics and trading knowledge.",
      ],
    },
    {
      programTitle: "Guest Lecture: College to Corporate – Business Models",
      date: "29.9.2025",
      location: "Campus",
      aboutProgram: [
        "Guest lecture bridging academic learning with corporate world.",
      ],
      programOutcomes: ["Students prepared for corporate transition."],
    },
    {
      programTitle: "Marathon: VASCO PONDY RUN 5K 3.0 – Say No to Drugs",
      date: "23.11.2025",
      location: "Beach Road, Puducherry",
      aboutProgram: ["R. Mukesh from I B.Com (CS) secured 5th place overall."],
      programOutcomes: ["Received cash award, medal, and certificate."],
    },
    {
      programTitle: "Munchville-2K25",
      date: "25.11.2025",
      location: "Achariya Arts and Science College",
      aboutProgram: [
        "Students managed entrepreneurial stalls: SR Accessories, Bakery Payaluga, Bites and Blast, Heist Thattuvadai.",
      ],
      programOutcomes: ["Showcased entrepreneurial spirit and creativity."],
    },
    {
      programTitle: "Indian Art Contest: Drawing Competition",
      date: "12.11.2025",
      location: "External",
      aboutProgram: ["Subiksha from II B.Com (CS) participated."],
      programOutcomes: ["Enhanced artistic skills and participation."],
    },
    {
      programTitle: "Edutainment: Poster Presentation",
      date: "11.11.2025",
      location: "Achariya Arts and Science College",
      aboutProgram: [
        "I Year: Logo Creation; II Year: Pen Theory; III Year: E-Commerce.",
        "Coordinated by Mrs. Razia Sultana A.",
      ],
      programOutcomes: [
        "Practical exposure to innovative presentation skills.",
      ],
    },
    {
      programTitle: "G-Talk: TALLY PRIME 2.0 Seminar",
      date: "11.11.2025",
      location: "Campus",
      aboutProgram: [
        "Collaboration with GTech Computer Education.",
        "Session by Mrs. Saraswathi on Tally Prime 2.0 and GST integration.",
      ],
      programOutcomes: ["Hands-on Tally software training."],
    },
    {
      programTitle: "Sports Activity: Indian Hockey Centenary Celebration",
      date: "7.11.2025",
      location: "ACET Campus, Villianur",
      aboutProgram: ["Runner-Up position in Men's Category."],
      programOutcomes: [
        "Team achievement with students from III & II B.Com CS.",
      ],
    },
    {
      programTitle: "Academic Review Meeting",
      date: "26.11.2025",
      location: "Auditorium",
      aboutProgram: [
        "Alumni invitee: Mr. Jayasurya Janakiraman, Proprietor of Rajagopal Iyer & Son.",
      ],
      programOutcomes: ["Strategic academic planning and alumni engagement."],
    },
    {
      programTitle: "Guest Lecture: Women Empowerment",
      date: "13.2.2025",
      location: "Campus",
      aboutProgram: [
        "Delivered by M. Shanmugam (Advocate) and T. Lavanya (Advocate).",
      ],
      programOutcomes: [
        "Insights into legal procedures and socio-legal challenges.",
      ],
    },
    {
      programTitle: "All India Tally Exam",
      date: "18.2.2025",
      location: "Campus",
      aboutProgram: [
        "State-Level Tally Competitive Exam with 36 students.",
        "Collaboration with G-Tech Computer Education.",
      ],
      programOutcomes: ["Assessed Tally proficiency and practical skills."],
    },
    {
      programTitle: "Pondicherry University - Globizz 2K25",
      date: "19-21.2.2025",
      location: "Pondicherry University",
      aboutProgram: [
        "C. Krishna Prakash from I B.Com CS won 1st Prize in Wings of Lens.",
      ],
      programOutcomes: ["Inter-university competition success."],
    },
  ],
};

export const libraryDepartment = {
  name: "Library",
  image: history,
  departmentGallery: placeholderGallery,
  about: "Repository of knowledge with over 11,000 books.",
  aboutDepartment: {
    history: "Established",
    overview: "Resource hub",
    strengths: ["Large collection"],
  },
  vision: "Knowledge for all",
  mission: ["Academic support"],
  missionImage: history,
  objectives: ["E-resources access"],
  objectivesImage: history,
  programsOffered: [
    {
      degree: "Info Literacy",
      duration: "Continuous",
      description: "Database training.",
    },
  ],
  certificateCourses: [],
  skillPrograms: [],
  faculty: getFacultyByDepartment("Library"),
  departmentActivities: genericActivities,
};

// =====================================================
// ========  SLUG TO DATA MAPPER (KEY!)  ==============
// =====================================================
export const departmentDataMapper = {
  english: englishDepartment,
  language: languageDepartment,
  mathematics: mathematicsDepartment,
  "computer-science": computerScienceDepartment,
  "computer-application": computerApplicationDepartment,
  "information-technology": informationTechnologyDepartment,
  "bio-technology": bioTechnologyDepartment,
  "commerce-and-management": commerceAndManagementDepartment,
  "corporate-secretaryship": corporateSecretaryshipDepartment,
  "visual-communication": visualCommunicationDepartment,
  library: libraryDepartment,
  management: managementDepartment,
};

export default Object.entries(departmentDataMapper).map(([slug, data]) => ({
  slug,
  ...data,
}));

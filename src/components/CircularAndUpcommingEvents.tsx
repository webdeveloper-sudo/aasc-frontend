import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Camera,
  ChevronRight,
  GraduationCap,
  MoveRight,
} from "lucide-react";
import HeadingUnderline from "./reusable/HeadingUnderline";
import Heading from "./reusable/Heading";

interface CircularAndUpcomingEventsProps {
  data: {
    title: string;
    description: string;
    circulars: { title: string; items: any[] };
    upcomingEvents: { title: string; items: any[] };
    admissionsOpen: { title: string; items: any[] };
  };
}

const CircularAndUpcomingEvents: React.FC<CircularAndUpcomingEventsProps> = ({
  data,
}) => {
  const navigate = useNavigate();
  const circularsAnim = useAnimation();
  const eventsAnim = useAnimation();
  const admissionsAnim = useAnimation();

  // 🔁 Seamless continuous vertical looping animation
  useEffect(() => {
    const createSeamlessLoop = async (controller) => {
      await controller.start({
        y: "-50%", // Move by half (since we duplicate the content)
        transition: {
          duration: 15, // Same speed for all
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    };

    createSeamlessLoop(circularsAnim);
    createSeamlessLoop(eventsAnim);
    createSeamlessLoop(admissionsAnim);
  }, [circularsAnim, eventsAnim, admissionsAnim]);

  return (
    <section className="bg-background text-foreground">
      <div>
        <Heading title={data.title} size="lg" align="center" />
        <HeadingUnderline width={200} align="center" />
        <p className="text-center max-w-5xl mb-4 mx-auto">{data.description}</p>
      </div>
      <div className="mx-auto items-center grid grid-cols-1 md:grid-cols-3">
        {/* 🔔 Circulars Section */}
        <div className="bg-card rounded-lg border-r border-gray-200 p-6">
          <div>
            <Heading
              title={data.circulars.title}
              size="md"
              align="left"
              className="mb-5 text-left"
            />
          </div>

          <div className="relative h-40 overflow-hidden">
            <motion.div animate={circularsAnim} className="flex flex-col gap-3">
              {/* Duplicate content for seamless loop */}
              {[...data.circulars.items, ...data.circulars.items].map(
                (item, index) => (
                  <div
                    key={index}
                    onClick={() => navigate("/circulars")}
                    className="flex items-center gap-2 cursor-pointer text-black hover:text-blue-600 transition-all duration-200 hover:underline"
                  >
                    <Bell className="w-4 h-4" />
                    <span>{item.title}</span>
                    <MoveRight className="w-4 h-4" />
                  </div>
                )
              )}
            </motion.div>
          </div>
        </div>

        {/* 🎥 Upcoming Events Section */}
        <div className="bg-card rounded-lg p-6 border-r border-gray-200">
          <div>
            <Heading
              title={data.upcomingEvents.title}
              size="md"
              align="left"
              className="mb-5 text-left"
            />
          </div>

          <div className="relative h-40 overflow-hidden">
            <motion.div animate={eventsAnim} className="flex flex-col gap-3">
              {/* Duplicate content for seamless loop */}
              {[...data.upcomingEvents.items, ...data.upcomingEvents.items].map(
                (item, index) => (
                  <div
                    key={index}
                    onClick={() => navigate("/upcomming-events")}
                    className="flex items-center gap-2 cursor-pointer text-black hover:text-blue-600 transition-all duration-200 hover:underline"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{item.title}</span>
                    <MoveRight className="w-4 h-4" />
                  </div>
                )
              )}
            </motion.div>
          </div>
        </div>

        {/* Admissions Open */}
        <div className="bg-card rounded-lg p-6">
          <div>
            <Heading
              title={data.admissionsOpen.title}
              size="md"
              align="left"
              className="mb-5 text-left"
            />
          </div>

          <div className="relative h-40 overflow-hidden">
            <motion.div
              animate={admissionsAnim}
              className="flex flex-col gap-3"
            >
              {/* Duplicate content for seamless loop */}
              {[...data.admissionsOpen.items, ...data.admissionsOpen.items].map(
                (item, index) => (
                  <div
                    key={index}
                    onClick={() => navigate("/academics/ug-programs/existing")}
                    className="flex items-center gap-2 cursor-pointer text-black hover:text-blue-600 transition-all duration-200 hover:underline"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>
                      {item.degree} – {item.stream}
                    </span>
                  </div>
                )
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CircularAndUpcomingEvents;

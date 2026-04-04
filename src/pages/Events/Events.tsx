import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import campus from "@/assets/images/aasc_building.webp";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import eventsData from "@/data/events/eventsdata.js";
import EventsSidebar from "./EventsSidebar";
import EventsSection from "./EventsSection";

interface EventData {
  _id?: string;
  data: {
    id: string;
    title: string;
    description: string;
    images: string[];
  };
}

interface EventsProps {
  overrideData?: EventData[];
}

const Events: React.FC<EventsProps> = ({ overrideData }) => {
  const { eventId: urlEventId } = useParams();

  // Determine data source: override (preview) or static
  const sourceData = overrideData || eventsData;

  // Transform to flat array if needed
  const eventsList = overrideData
    ? overrideData.map((item) => ({
        id: item.data.id || item._id,
        title: item.data.title,
        description: item.data.description,
        images: item.data.images,
      }))
    : eventsData;

  const isPreview = Boolean(overrideData);

  // Public mode: use URL eventId, fallback to first event
  // Preview mode: use local state
  const [activeEventId, setActiveEventId] = useState(() => {
    if (isPreview) return eventsList[0]?.id;
    return urlEventId || eventsList[0]?.id;
  });

  // Sync with URL changes (public mode only)
  useEffect(() => {
    if (!isPreview && urlEventId) {
      setActiveEventId(urlEventId);
    }
  }, [urlEventId, isPreview]);

  const activeEvent =
    eventsList.find((e) => e.id === activeEventId) || eventsList[0];

  return (
    <>
      <div className="md:mt-0 mt-14">
        <BannerAndBreadCrumb img={campus} title="Events" />
      </div>
      <div className=" min-h-screen 2xl:container flex flex-col md:flex-row bg-gray-50">
        <EventsSidebar
          events={eventsList}
          activeEventId={isPreview ? activeEventId : urlEventId}
          onEventChange={isPreview ? setActiveEventId : undefined}
        />
        <EventsSection event={activeEvent} overrideData={overrideData} />
      </div>
    </>
  );
};

export default Events;

import React from "react";
import { useParams } from "react-router-dom";
import GlobalSidebar from "@/components/sidebar/GlobalSidebar";

interface Event {
  id: string;
  title: string;
  description?: string;
  images?: string[];
}

interface EventsSidebarProps {
  events: Event[];
  activeEventId?: string;
  onEventChange?: (eventId: string) => void;
}

const EventsSidebar: React.FC<EventsSidebarProps> = ({
  events,
  activeEventId,
  onEventChange,
}) => {
  const { eventId: urlEventId } = useParams();

  // If handling event change manually (Preview Mode), transform items to have onClick
  // Otherwise use URL navigation for public display
  const menuItems = onEventChange
    ? events.map((event) => ({
        id: event.id,
        label: event.title,
        onClick: () => onEventChange(event.id),
        isActive: activeEventId === event.id,
        url: undefined, // Remove URL to prevent navigation in preview
      }))
    : events.map((event) => ({
        id: event.id,
        label: event.title,
        url: `/campus-life/events/${event.id}`,
        isActive:
          urlEventId === event.id ||
          (!urlEventId && event.id === events[0]?.id),
      }));

  return <GlobalSidebar title="Events" type="none" menu={menuItems} />;
};

export default EventsSidebar;

import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import eventsData from "../data/events/eventsdata.js";

export const useEventsData = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["events", page, limit],
    queryFn: async () => {
      try {
        const response = await api.get<any>(
          `/events?page=${page}&limit=${limit}`
        );
        return response.data;
      } catch (error) {
        console.error("API Error, falling back to static data:", error);
        // Simulate pagination for static data
        const start = (page - 1) * limit;
        const end = start + limit;
        return {
          events: eventsData.slice(start, end),
          totalPages: Math.ceil(eventsData.length / limit),
          currentPage: page,
          totalEvents: eventsData.length,
        };
      }
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useEventById = (id: string) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      try {
        const response = await api.get<any>(`/events/${id}`);
        return response.data;
      } catch (error) {
        console.error("API Error, falling back to static data:", error);
        return eventsData.find((e: any) => e.id === id);
      }
    },
    enabled: !!id,
  });
};

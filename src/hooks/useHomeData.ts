import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { homeData as staticHomeData } from "../data/home/allhomedata";

// Define types for Home Data
// (In a real app, these should be in a separate types file)
interface HomeDataResponse {
  success: boolean;
  fallback: boolean;
  data: any; // Replace with specific type
}

export const useHomeData = () => {
  return useQuery({
    queryKey: ["homeData"],
    queryFn: async () => {
      try {
        const response = await api.get<HomeDataResponse>("/home");

        // Merge API data over static data
        // This ensures that if the API only returns partial data (e.g. only welcome section),
        // the rest of the app still works using static data.
        return {
          ...staticHomeData,
          ...response.data,
          // Deep merge specific sections if needed
          welcome: response.data.welcome || staticHomeData.welcome,
          events: response.data.events || staticHomeData.events,
        };
      } catch (error) {
        console.error("API Error, falling back to static data:", error);
        // Fallback to static data on error
        return staticHomeData;
      }
    },
    // Initial data from static file to prevent flicker
    initialData: staticHomeData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useWelcomeData = () => {
  return useQuery({
    queryKey: ["welcomeData"],
    queryFn: async () => {
      const response = await api.get<any>("/home/welcome");
      return response.data;
    },
  });
};

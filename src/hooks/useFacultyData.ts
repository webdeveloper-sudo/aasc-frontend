import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import ourTeamData from "../data/about/OurTeamData.js";

export const useFacultyData = (category?: string, department?: string) => {
  return useQuery({
    queryKey: ["faculty", category, department],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (category) params.append("category", category);
        if (department) params.append("department", department);

        const response = await api.get<any>(
          `/about/faculty?${params.toString()}`
        );
        return response.data;
      } catch (error) {
        console.error("API Error, falling back to static data:", error);

        let data: any[] = [];

        // Handle category mapping if needed.
        // Assuming category param matches keys in ourTeamData (e.g., 'teachingFaculty')
        if (category && (ourTeamData as any)[category]) {
          data = (ourTeamData as any)[category];
        } else {
          // If no category or invalid, flatten all
          Object.values(ourTeamData).forEach((group: any) => {
            if (Array.isArray(group)) {
              data = [...data, ...group];
            }
          });
        }

        // Filter by department
        if (department) {
          data = data.filter((f: any) => f.department === department);
        }

        return data;
      }
    },
  });
};

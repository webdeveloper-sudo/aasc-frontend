import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";

export const useAdminData = (entity: string, params?: any) => {
  return useQuery({
    queryKey: ["admin", entity, params],
    queryFn: () => api.admin.getAll(entity, params),
  });
};

export const useAdminItem = (entity: string, id: string) => {
  return useQuery({
    queryKey: ["admin", entity, id],
    queryFn: () => api.admin.getOne(entity, id),
    enabled: !!id && id !== "new",
  });
};

export const useAdminMutation = (entity: string) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: any) => api.admin.create(entity, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", entity] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.admin.update(entity, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", entity] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.admin.delete(entity, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", entity] });
    },
  });

  return { createMutation, updateMutation, deleteMutation };
};

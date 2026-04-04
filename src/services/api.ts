const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface FetchOptions extends RequestInit {
  token?: string;
}

class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

/**
 * Base API client
 */
export const api = {
  /**
   * Generic fetch wrapper
   */
  request: async <T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> => {
    const { token, headers, ...customConfig } = options;

    // Fallback: if no token provided, try to get from localStorage
    const authToken = token || localStorage.getItem("token");

    const config: RequestInit = {
      ...customConfig,
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        ...headers,
      },
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          response.status,
          data.message || "Something went wrong",
          data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, (error as Error).message);
    }
  },

  get: <T>(endpoint: string, options?: FetchOptions) =>
    api.request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body: any, options?: FetchOptions) =>
    api.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: any, options?: FetchOptions) =>
    api.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    api.request<T>(endpoint, { ...options, method: "DELETE" }),

  // Admin Methods
  login: async (credentials: any) => {
    return api.post<any>("/auth/login", credentials);
  },

  // Generic Admin CRUD
  admin: {
    getAll: <T>(entity: string, params?: any) => {
      const queryString = params
        ? "?" + new URLSearchParams(params).toString()
        : "";
      return api.get<T>(`/admin/${entity}${queryString}`);
    },
    getOne: <T>(entity: string, id: string) =>
      api.get<T>(`/admin/${entity}/${id}`),
    create: <T>(entity: string, data: any) =>
      api.post<T>(`/admin/${entity}`, data),
    update: <T>(entity: string, id: string, data: any) =>
      api.put<T>(`/admin/${entity}/${id}`, data),
    delete: <T>(entity: string, id: string) =>
      api.delete<T>(`/admin/${entity}/${id}`),
  },
};

export default api;

import { fetchApi } from "@/services/api/fetchApi"
import { useQuery } from "@tanstack/react-query"

export interface SubCategory {
  id: number;
  name: string;
  description: string; // HTML content as string
  image_url: string | null;
  category_id: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export function useArtForm() {
  return useQuery({
    queryKey: ['artForms'], // meaningful query key
    queryFn: () =>
      fetchApi<SubCategory[]>({
        path: 'courses/subcategories/all', // updated endpoint if applicable
      }),
    select: (res) => res.map((v) => ({ name: v.name, value: v.id })) // optional: directly return array of SubCategory
  });
}

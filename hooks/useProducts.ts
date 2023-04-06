import useSWR, { SWRConfiguration } from "swr";
import { IProduct } from "@/interfaces";

// const fetcher = (...args: [key: string]) => fetch(...args).then((res) => res.json());

export const useProducts = (url: string, config: SWRConfiguration = {}) => {
  
  // const { data, error } = useSWR<IProduct[]>(`/api${url}`, fetcher, config);

  //El fetcher se puede omitir, ya que por defecto SWR usa el fetch declarado en el provider en _app.tsx
  const { data, error } = useSWR<IProduct[]>(`/api${url}`, config);

  return {
    products: data || [],
    isLoading: !error && !data,
    isError: error,
  };
};

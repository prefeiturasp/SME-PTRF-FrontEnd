import { useQuery } from "@tanstack/react-query";
import { getDres, getTiposUnidades } from "../../../../services/sme/Parametrizacoes.service";

export const useGetUnidadesNaoVinculadas = (apiService=()=>{}, uuid, params) => {
  const _key = `unidades-nao-vinculadas`
  const { isFetching, isError, data, error, refetch } = useQuery({
    queryKey: [_key, uuid, params],
    queryFn: () => apiService(uuid, params),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    maxPages: 5,
    enabled: !!uuid,
  });

  return { isLoading: isFetching, isError, data, error, refetch };
};

export const useGetUnidadesVinculadas = (apiService=()=>{}, uuid, params) => {
  const _key = `unidades-vinculadas`
  const { isFetching, isError, data, error, refetch } = useQuery({
    queryKey: [_key, uuid, params],
    queryFn: () => apiService(uuid, params),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    maxPages: 5,
    enabled: !!uuid,
  });

  return { isLoading: isFetching, isError, data, error, refetch };
};

export const useGetDres = () => {
  const key = `vinculo-unidades-dres`
  const { isFetching, isError, data, error, refetch } = useQuery({
    queryKey: [key],
    queryFn: () => getDres(),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutos antes de ser considerado "stale"
    // cacheTime: 10 * 60 * 1000, // 10 minutos antes de ser removido do cache
    refetchOnWindowFocus: false, // Evita refazer a requisição ao trocar de aba
  });

  return { isLoading: isFetching, isError, data, error, refetch };
};

export const useGetTiposUnidades = () => {
  const key = `vinculo-unidades-tipos-unidades`
  const { isFetching, isError, data, error, refetch } = useQuery({
    queryKey: [key],
    queryFn: () => getTiposUnidades(),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutos antes de ser considerado "stale"
    // cacheTime: 10 * 60 * 1000, // 10 minutos antes de ser removido do cache
    refetchOnWindowFocus: false, // Evita refazer a requisição ao trocar de aba
  });

  return { isLoading: isFetching, isError, data, error, refetch };
};

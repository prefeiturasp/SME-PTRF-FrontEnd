import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getUnidadesEmSuporte } from "../../../../../../services/auth.service";

export const useUnidadesEmSuporte = (usuario, page=1) => {

    async function fetchUnidades(usuario, page)  {
        try {
          return await getUnidadesEmSuporte(usuario, page);
        } catch (error) {
            return Promise.reject(error)
        }
      }

    const { status, isError, data = {count: 0, results: []}, error, refetch } = useQuery({
        queryKey: ['unidades-em-suporte-list', page],
        queryFn: () => fetchUnidades(usuario, page),
        keepPreviousData: true,
        staleTime: 0,
        enabled: !!usuario,
        retry: false
    });
    
    const count = useMemo(() => data.count, [data]);
    return {isLoading: status === 'loading', isError, data, error, count, refetch};
}
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

    const { isLoading, isError, data = {count: 0, results: []}, error, refetch } = useQuery(
        ['unidades-em-suporte-list', page],
        () => fetchUnidades(usuario, page),
        {
            keepPreviousData: true,
            staleTime: 0,
            enabled: !!usuario,
            retry: false
        }
    );
    
    const count = useMemo(() => data.count, [data]);
    return {isLoading, isError, data, error, count, refetch};
}